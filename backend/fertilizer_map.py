"""
Fertilizer recommendation mapping based on detected plant disease.
"""

FERTILIZER_MAP = {
    "Healthy": {
        "fertilizer": "No fertilizer needed",
        "advice": "Your plant is healthy! Continue regular watering and sunlight exposure.",
    },
    "Leaf Spot": {
        "fertilizer": "Copper Fungicide",
        "advice": "Spray copper fungicide once every 7 days. Remove and destroy affected leaves to prevent spread.",
    },
    "Blight": {
        "fertilizer": "Mancozeb",
        "advice": "Apply Mancozeb as a foliar spray every 10–14 days. Ensure proper drainage and avoid overhead irrigation.",
    },
    "Rust": {
        "fertilizer": "Sulfur Fungicide",
        "advice": "Dust sulfur fungicide on affected areas every 7–10 days. Improve air circulation around plants.",
    },
}


def get_recommendation(disease: str) -> dict:
    """Return fertilizer name and advice for a given disease."""
    entry = FERTILIZER_MAP.get(disease, FERTILIZER_MAP["Healthy"])
    return {
        "fertilizer": entry["fertilizer"],
        "advice": entry["advice"],
    }
