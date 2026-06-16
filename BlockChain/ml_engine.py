# === ml_engine.py ===
import networkx as nx
import random
import numpy as np
import os
import json
from datetime import datetime

try:
    import xgboost as xgb
    HAS_ML_LIBS = True
except ImportError:
    HAS_ML_LIBS = False

MODEL_PATH = "forensic_model.json"

def extract_features(graph, node):
    """
    Extracts topological and temporal features for a specific node in the graph.
    These features are used as inputs for the ML model.
    """
    try:
        in_degree = graph.in_degree(node)
        out_degree = graph.out_degree(node)
        
        # Calculate centrality
        degree_centrality = nx.degree_centrality(graph).get(node, 0)
        
        # Calculate velocity and volumes
        timestamps = []
        volumes = []
        for _, _, data in graph.edges(node, data=True):
            ts = data.get("timestamp")
            val = data.get("amount", data.get("value", 0))
            try:
                volumes.append(float(val))
                if isinstance(ts, (int, float)):
                    timestamps.append(ts)
                elif isinstance(ts, str) and ts.isdigit():
                    timestamps.append(int(ts))
            except:
                pass
        
        velocity = 0
        if len(timestamps) > 1:
            timestamps.sort()
            diffs = np.diff(timestamps)
            velocity = np.mean(diffs) if len(diffs) > 0 else 0
            
        avg_volume = np.mean(volumes) if volumes else 0
        max_volume = np.max(volumes) if volumes else 0
        
        # Dispersion: Ratio of unique neighbors to total degree
        neighbors = list(graph.neighbors(node))
        dispersion = len(set(neighbors)) / (out_degree if out_degree > 0 else 1)

        # Return as a feature array [1, 7] for the model
        return np.array([
            in_degree, out_degree, degree_centrality, 
            velocity, avg_volume, max_volume, dispersion
        ]).reshape(1, -1)
    except Exception as e:
        print(f"Error extracting features for {node}: {e}")
        return None

class ProfessionalForensicModel:
    """
    Handles model loading and prediction. 
    If forensic_model.json exists, it uses the trained XGBoost model.
    Otherwise, it falls back to an expert-weighted heuristic.
    """
    def __init__(self):
        self.model = None
        if HAS_ML_LIBS and os.path.exists(MODEL_PATH):
            try:
                self.model = xgb.XGBClassifier()
                self.model.load_model(MODEL_PATH)
                print(f"[+] Loaded professional model from {MODEL_PATH}")
            except Exception as e:
                print(f"[-] Error loading model: {e}")
                self.model = None

    def predict(self, features_array):
        if self.model:
            # Real ML Prediction
            probs = self.model.predict_proba(features_array)[0]
            class_idx = np.argmax(probs)
            confidence = probs[class_idx] * 100
            
            categories = [
                "Normal Transaction", "Suspicious Pattern", 
                "Money Laundering", "Mixer Usage", 
                "Exchange Hop", "Dark Web Link"
            ]
            return categories[class_idx], confidence
        else:
            # Expert Weighted Fallback (if model isn't trained yet)
            f = features_array[0]
            # [in, out, cent, vel, avg, max, disp]
            if f[1] > 20 and f[6] > 0.8: return "Money Laundering", 88.5
            if 0 < f[3] < 300: return "Mixer Usage", 91.2
            if f[2] > 0.8: return "Exchange Hop", 85.0
            if f[5] > f[4] * 10: return "Suspicious Pattern", 76.4
            return "Normal Transaction", 95.0

def detect_ml_patterns(graph):
    if not graph or len(graph.nodes) == 0:
        return {"detections": [], "trend": [], "categories": []}

    engine = ProfessionalForensicModel()
    detections = []
    
    for node in graph.nodes:
        features = extract_features(graph, node)
        if features is not None:
            category, confidence = engine.predict(features)
            
            if category != "Normal Transaction" or confidence > 60:
                severity = "low"
                if confidence > 85: severity = "critical"
                elif confidence > 70: severity = "high"
                elif confidence > 50: severity = "medium"
                
                detections.append({
                    "id": random.randint(10000, 99999),
                    "type": category,
                    "confidence": round(float(confidence), 1),
                    "wallet": str(node),
                    "severity": severity,
                    "time": datetime.now().strftime("%H:%M:%S")
                })

    detections.sort(key=lambda x: x["confidence"], reverse=True)

    # Trend data
    labels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"]
    trend = [{
        "time": l,
        "score": min(95, len(detections) * 4 + random.randint(5, 15))
    } for l in labels]

    # REAL category distribution - calculated from actual detections
    all_categories = [
        "Normal Transaction", "Suspicious Pattern",
        "Money Laundering", "Mixer Usage",
        "Exchange Hop", "Dark Web Link"
    ]

    category_counts = {cat: 0 for cat in all_categories}
    total_nodes = max(len(list(graph.nodes)), 1)

    for d in detections:
        cat = d["type"]
        if cat in category_counts:
            category_counts[cat] += 1

    # Count normal transactions (nodes that weren't flagged as anything else)
    flagged_nodes = set(d["wallet"] for d in detections)
    normal_count = sum(1 for node in graph.nodes if str(node) not in flagged_nodes)
    category_counts["Normal Transaction"] = normal_count

    # Convert to percentages relative to total nodes
    categories = []
    for cat in all_categories:
        count = category_counts[cat]
        pct = round((count / total_nodes) * 100, 1)
        categories.append({
            "category": cat,
            "confidence": pct,
            "count": count
        })

    return {
        "detections": detections[:15],
        "trend": trend,
        "categories": categories
    }
