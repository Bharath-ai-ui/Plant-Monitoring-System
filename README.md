# 🌿 AgriSense — Smart Agriculture Dashboard

AI-powered plant health monitoring system using **ESP32-CAM** live stream, **MobileNetV2** disease detection, soil moisture tracking, and fertilizer recommendations.

---

## 📂 Project Structure

```
Plant health monitoring/
├── backend/
│   ├── main.py                 # FastAPI server (CORS, /predict, /moisture, /capture)
│   ├── fertilizer_map.py       # Disease → fertilizer recommendation mapping
│   ├── requirements.txt        # Python dependencies
│   └── model/
│       ├── __init__.py
│       └── predictor.py        # MobileNetV2 inference (simulation fallback)
├── frontend/
│   ├── index.html              # HTML entry with Inter font & SEO meta
│   ├── package.json            # Vite + React 19
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx            # React root
│       ├── index.css           # Design system (colors, spacing, animations)
│       ├── App.jsx             # Main dashboard layout & state management
│       ├── App.css             # Layout grid styles
│       └── components/
│           ├── Sidebar.jsx / .css         # Navigation sidebar
│           ├── LiveCamera.jsx / .css      # ESP32-CAM stream + frame capture
│           ├── DetectionResult.jsx / .css  # Disease prediction display
│           ├── FertilizerCard.jsx / .css   # Fertilizer recommendation card
│           ├── SoilMoistureCard.jsx / .css # Soil moisture gauge
│           └── StatusIndicator.jsx / .css  # System status panel
└── README.md
```

---

## 🚀 How to Run

### 1. Backend (FastAPI)

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at **http://localhost:8000**

### 2. Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The dashboard will open at **http://localhost:5173**

---

## 📡 ESP32-CAM Setup

- Stream URL: `http://10.219.67.199:81/stream`
- Capture URL: `http://10.219.67.199/capture`

Make sure your ESP32-CAM is:
1. Powered on and connected to the same network
2. Running the CameraWebServer example sketch
3. Streaming at the URL configured above

---

## 🔄 How It Works

1. **Live Stream** — The ESP32-CAM MJPEG stream is displayed in the browser via `<img>` tag
2. **Frame Capture** — Every 3 seconds, a frame is captured via `<canvas>` and converted to base64
3. **Disease Detection** — The base64 frame is POSTed to `/predict` on the FastAPI backend
4. **Prediction** — The backend preprocesses the image (resize to 224×224, normalize) and runs inference
5. **Recommendation** — The detected disease is mapped to a fertilizer recommendation
6. **Soil Moisture** — The frontend polls `/moisture` every 5 seconds for live sensor data

### Fallback Mechanism
- If the canvas frame capture fails (e.g. CORS), the frontend falls back to the backend `/capture` endpoint which fetches the frame server-side
- If the ESP32-CAM is unreachable, the backend generates a placeholder image for demo purposes
- If no model `.h5` file is present, the predictor uses a weighted random simulation

---

## 🛠️ API Endpoints

| Method | Endpoint    | Description                                    |
|--------|-------------|------------------------------------------------|
| GET    | `/`         | Health check                                   |
| POST   | `/predict`  | Accept base64 image, return disease prediction |
| GET    | `/moisture` | Return current soil moisture reading           |
| GET    | `/capture`  | Fetch frame from ESP32, run prediction         |

### POST /predict — Request Body
```json
{
  "image": "<base64-encoded JPEG/PNG>"
}
```

### POST /predict — Response
```json
{
  "disease": "Leaf Spot",
  "confidence": 0.87,
  "status": "Infected",
  "fertilizer": "Copper Fungicide",
  "advice": "Spray copper fungicide once every 7 days..."
}
```

---

## 🌱 Supported Diseases & Recommendations

| Disease    | Fertilizer          | Advice                                             |
|------------|---------------------|----------------------------------------------------|
| Healthy    | No fertilizer needed| Continue regular watering and sunlight exposure     |
| Leaf Spot  | Copper Fungicide    | Spray every 7 days; remove affected leaves          |
| Blight     | Mancozeb            | Foliar spray every 10–14 days; ensure drainage      |
| Rust       | Sulfur Fungicide    | Dust every 7–10 days; improve air circulation       |

---

## 🧪 Testing

1. Start the backend: `uvicorn main:app --reload --port 8000`
2. Start the frontend: `npm run dev`
3. Open `http://localhost:5173` in your browser
4. Click **Start Detection** to begin AI analysis
5. Watch the disease detection results update every 3 seconds
6. Observe the soil moisture gauge auto-refreshing every 5 seconds

### Without ESP32-CAM
The system works even without a physical ESP32-CAM:
- The stream display will show "Stream Unavailable" with a retry button
- The backend `/capture` fallback generates a green placeholder image
- Predictions will still run using the simulated model
