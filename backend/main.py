import base64
import random
import time
import httpx
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model.predictor import predict
from fertilizer_map import get_recommendation

app = FastAPI(title="Smart Agriculture API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Simulated moisture state ───────────────────────────────────
_moisture_value = 50.0
_last_moisture_update = 0.0

# ─── Schemas ─────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    stream_url: str

class PredictResponse(BaseModel):
    disease: str
    confidence: float
    status: str
    fertilizer: str
    advice: str

class MoistureResponse(BaseModel):
    moisture: float
    status: str

class StreamStatusResponse(BaseModel):
    status: str

# ─── Helpers ─────────────────────────────────────────────────────
def _moisture_status(value: float) -> str:
    if value < 30: return "Dry"
    elif value <= 70: return "Optimal"
    return "Wet"

def _update_moisture() -> float:
    global _moisture_value, _last_moisture_update
    now = time.time()
    if now - _last_moisture_update > 2:
        drift = random.uniform(-3, 3)
        _moisture_value = max(5, min(95, _moisture_value + drift))
        _last_moisture_update = now
    return round(_moisture_value, 1)

async def _fetch_mjpeg_frame(stream_url: str, timeout: float = 5.0) -> bytes:
    """Fetch a single frame from an MJPEG stream."""
    try:
        async with httpx.AsyncClient() as client:
            # We use stream to read chunks instead of loading an infinite request
            async with client.stream("GET", stream_url, timeout=timeout) as response:
                response.raise_for_status()
                bytes_buffer = b''
                
                # Fetch chunks until we hit JPEG start (\xff\xd8) and end (\xff\xd9) markers
                async for chunk in response.aiter_bytes():
                    bytes_buffer += chunk
                    a = bytes_buffer.find(b'\xff\xd8')
                    b = bytes_buffer.find(b'\xff\xd9')
                    if a != -1 and b != -1 and a < b:
                        jpg = bytes_buffer[a:b+2]
                        return jpg
    except httpx.ConnectError:
        raise HTTPException(status_code=502, detail="Stream unreachable (Connection Error)")
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Stream connection timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch frame: {str(e)}")
        
    raise HTTPException(status_code=500, detail="MJPEG Parsing failed: No valid frame found")


# ─── Routes ──────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"message": "Smart Agriculture API is running"}

@app.get("/stream-status", response_model=StreamStatusResponse)
async def check_stream_status():
    """Verify ESP32 connectivity"""
    try:
        # We try to grab one frame to prove it's connected
        await _fetch_mjpeg_frame("http://10.219.67.199:81/stream", timeout=3.0)
        return StreamStatusResponse(status="connected")
    except Exception:
        return StreamStatusResponse(status="failed")

@app.post("/predict", response_model=PredictResponse)
async def predict_disease(req: PredictRequest):
    """Fetch frame from the ESP32 stream and return prediction."""
    
    # 1. Fetch live frame, avoiding browser CORS
    image_bytes = await _fetch_mjpeg_frame(req.stream_url)

    # 2. Run model
    try:
        result = predict(image_bytes)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    # 3. Lookup fertilizer recommendation
    rec = get_recommendation(result["disease"])
    
    return PredictResponse(
        disease=result["disease"],
        confidence=result["confidence"],
        status=result["status"],
        fertilizer=rec["fertilizer"],
        advice=rec["advice"],
    )

@app.get("/moisture", response_model=MoistureResponse)
async def get_moisture():
    """Return current soil moisture reading."""
    value = _update_moisture()
    return MoistureResponse(moisture=value, status=_moisture_status(value))
