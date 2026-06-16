# === train_ml_model.py ===
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, classification_report
)
from sklearn.preprocessing import label_binarize
import json
import time
import os

# Set seed for reproducibility
np.random.seed(42)

def generate_realistic_dataset(n_samples=100000):
    """
    Generates a large-scale dataset with NOISE and OVERLAP for realism.
    """
    print(f"[*] Initializing REALISTIC Dataset Generation: {n_samples} samples...")
    
    X = np.random.rand(n_samples, 7)
    y = np.zeros(n_samples)
    
    for i in range(n_samples):
        # Base distributions
        if i < n_samples * 0.5:
            # Normal
            X[i] = [np.random.uniform(1, 4), np.random.uniform(1, 4), np.random.uniform(0, 0.1), 
                    np.random.uniform(3600, 86400), np.random.uniform(0.1, 5), np.random.uniform(5, 15), 
                    np.random.uniform(0.1, 0.4)]
            y[i] = 0
        elif i < n_samples * 0.6:
            # Suspicious
            X[i] = [np.random.uniform(5, 12), np.random.uniform(5, 12), np.random.uniform(0.1, 0.4), 
                    np.random.uniform(600, 7200), np.random.uniform(5, 50), np.random.uniform(100, 600), 
                    np.random.uniform(0.3, 0.6)]
            y[i] = 1
        elif i < n_samples * 0.7:
            # Laundering
            X[i] = [np.random.uniform(1, 5), np.random.uniform(15, 60), np.random.uniform(0.05, 0.3), 
                    np.random.uniform(30, 900), np.random.uniform(1, 10), np.random.uniform(10, 50), 
                    np.random.uniform(0.7, 1.0)]
            y[i] = 2
        elif i < n_samples * 0.8:
            # Mixer
            X[i] = [np.random.uniform(50, 150), np.random.uniform(50, 150), np.random.uniform(0.5, 0.9), 
                    np.random.uniform(1, 120), np.random.uniform(10, 50), np.random.uniform(50, 200), 
                    np.random.uniform(0.1, 0.4)]
            y[i] = 3
        elif i < n_samples * 0.9:
            # Exchange
            X[i] = [np.random.uniform(100, 1000), np.random.uniform(100, 1000), np.random.uniform(0.7, 1.0), 
                    np.random.uniform(5, 600), np.random.uniform(50, 1000), np.random.uniform(1000, 5000), 
                    np.random.uniform(0.4, 0.9)]
            y[i] = 4
        else:
            # Dark Web
            X[i] = [np.random.uniform(2, 10), np.random.uniform(2, 10), np.random.uniform(0.1, 0.6), 
                    np.random.uniform(600, 3600), np.random.uniform(0.01, 1), np.random.uniform(1, 5), 
                    np.random.uniform(0.2, 0.8)]
            y[i] = 5

    # INJECT NOISE
    # 1. Feature Noise (Gaussian)
    noise = np.random.normal(0, 0.05, X.shape)
    X = X + np.abs(noise) 
    
    # 2. Label Noise (Randomly swap 3% of labels)
    mask = np.random.rand(n_samples) < 0.03
    random_labels = np.random.randint(0, 6, size=np.sum(mask))
    y[mask] = random_labels

    print("[+] Realistic dataset generation complete (Noise Injected).")
    return X, y

def train_realistic_model():
    X, y = generate_realistic_dataset()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = xgb.XGBClassifier(
        n_estimators=1000,
        max_depth=5,
        learning_rate=0.01,
        objective='multi:softprob',
        num_class=6,
        tree_method='hist',
        random_state=42
    )
    
    print("[*] Training with realistic parameters...")
    start_time = time.time()
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=200)
    end_time = time.time()
    
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)

    # --- Real Performance Metrics ---
    acc = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

    # AUC-ROC: multi-class requires one-vs-rest binarization
    classes = list(range(6))
    y_test_bin = label_binarize(y_test, classes=classes)
    auc_roc = roc_auc_score(y_test_bin, y_proba, multi_class='ovr', average='weighted')

    print(f"\n[!] REAL PERFORMANCE METRICS:")
    print(f"    Accuracy  : {acc * 100:.2f}%")
    print(f"    Precision : {precision * 100:.2f}%")
    print(f"    Recall    : {recall * 100:.2f}%")
    print(f"    F1 Score  : {f1 * 100:.2f}%")
    print(f"    AUC-ROC   : {auc_roc * 100:.2f}%")

    model.save_model("forensic_model.json")

    metadata = {
        "accuracy": round(float(acc), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "auc_roc": round(float(auc_roc), 4),
        "trained_at": time.ctime(),
        "n_samples": X.shape[0],
        "features": ["in_degree", "out_degree", "centrality", "velocity", "avg_vol", "max_vol", "dispersion"],
        "training_time": round(end_time - start_time, 2)
    }
    with open("model_metadata.json", "w") as f:
        json.dump(metadata, f, indent=4)

    print("[+] Model and ALL real metrics saved to model_metadata.json.")

if __name__ == "__main__":
    train_realistic_model()
