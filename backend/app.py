from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import cv2
import numpy as np
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # bach React (port mختلف) يقدر يتكلم مع Flask

model = joblib.load("model.pkl")

UPLOAD_FOLDER = "uploads"
HISTORY_FILE = "history.json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

USERNAME = "admin"
PASSWORD = "olive2026"


def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return []


def save_history(entry):
    history = load_history()
    history.insert(0, entry)
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)


def extract_features(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None
    img = cv2.resize(img, (128, 128))

    hist_b = cv2.calcHist([img], [0], None, [32], [0, 256]).flatten()
    hist_g = cv2.calcHist([img], [1], None, [32], [0, 256]).flatten()
    hist_r = cv2.calcHist([img], [2], None, [32], [0, 256]).flatten()

    hist_b = hist_b / hist_b.sum()
    hist_g = hist_g / hist_g.sum()
    hist_r = hist_r / hist_r.sum()

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    texture_mean = np.mean(gray)
    texture_std = np.std(gray)

    features = np.concatenate([hist_b, hist_g, hist_r, [texture_mean, texture_std]])
    return features


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if username == USERNAME and password == PASSWORD:
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Identifiants incorrects"}), 401


@app.route("/api/predict", methods=["POST"])
def predict():
    file = request.files.get("image")
    if not file or file.filename == "":
        return jsonify({"error": "Aucune image"}), 400

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    features = extract_features(path)
    if features is None:
        return jsonify({"error": "Image invalide"}), 400

    prediction = model.predict([features])[0]

    entry = {
        "filename": filename,
        "prediction": prediction,
        "date": datetime.now().strftime("%d/%m/%Y %H:%M")
    }
    save_history(entry)

    return jsonify(entry)


@app.route("/api/history", methods=["GET"])
def history():
    return jsonify(load_history())


@app.route("/uploads/<filename>")
def get_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
@app.route("/api/history/by-class", methods=["GET"])
def history_by_class():
    history = load_history()
    grouped = {"healthy": [], "malade": []}
    for item in history:
        pred = item.get("prediction")
        if pred in grouped:
            grouped[pred].append(item)
    return jsonify(grouped)
DATASET_DIR = os.path.join("..", "dataset")

@app.route("/api/dataset", methods=["GET"])
def get_dataset():
    result = {"healthy": [], "malade": []}
    for label in ["healthy", "malade"]:
        folder = os.path.join(DATASET_DIR, label)
        if os.path.exists(folder):
            for filename in os.listdir(folder):
                if filename.lower().endswith((".jpg", ".jpeg", ".png")):
                    result[label].append(filename)
    return jsonify(result)


@app.route("/api/dataset/<label>/<filename>")
def get_dataset_image(label, filename):
    folder = os.path.join(DATASET_DIR, label)
    return send_from_directory(folder, filename)
DATASET_DIR = os.path.join("..", "dataset")

def load_disease_info():
    with open("disease_info.json", "r", encoding="utf-8") as f:
        return json.load(f)

DISEASE_INFO = load_disease_info()

@app.route("/api/dataset/diseases", methods=["GET"])
def get_dataset_diseases():
    disease_info = load_disease_info()
    malade_dir = os.path.join(DATASET_DIR, "malade")
    result = {}
    if os.path.exists(malade_dir):
        for disease_key in os.listdir(malade_dir):
            disease_folder = os.path.join(malade_dir, disease_key)
            if os.path.isdir(disease_folder):
                images = [
                    f for f in os.listdir(disease_folder)
                    if f.lower().endswith((".jpg", ".jpeg", ".png"))
                ]
                info = disease_info.get(disease_key, {"name": disease_key, "description": "", "treatment": ""})
                result[disease_key] = {
                    "name": info["name"],
                    "description": info["description"],
                    "treatment": info.get("treatment", ""),
                    "images": images
                }
    return jsonify(result)

@app.route("/api/dataset/malade/<disease>/<filename>")
def get_disease_image(disease, filename):
    folder = os.path.join(DATASET_DIR, "malade", disease)
    return send_from_directory(folder, filename)
HEALTHY_INFO = {
    "name": "Oliviers en bonne santé",
    "description": "Un olivier sain présente des feuilles vert argenté, sans taches, sans déformation ni décoloration. Le feuillage est dense, les branches sont vigoureuses et les fruits se développent normalement sans traces de parasites ou de maladies."
}


@app.route("/api/dataset/healthy/info", methods=["GET"])
def get_healthy_info():
    return jsonify(HEALTHY_INFO)
@app.route("/api/dataset/add", methods=["POST"])
def add_to_dataset():
    file = request.files.get("image")
    category = request.form.get("category")  # "healthy" ولا اسم المرض

    if not file or not category:
        return jsonify({"error": "Image ou catégorie manquante"}), 400

    if category == "healthy":
        target_dir = os.path.join(DATASET_DIR, "healthy")
    else:
        target_dir = os.path.join(DATASET_DIR, "malade", category)

    os.makedirs(target_dir, exist_ok=True)

    filename = file.filename
    path = os.path.join(target_dir, filename)
    file.save(path)

    return jsonify({"success": True, "filename": filename, "category": category})


@app.route("/api/categories", methods=["GET"])
def get_categories():
    disease_info = load_disease_info()
    categories = ["healthy"] + list(disease_info.keys())
    return jsonify(categories)   
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)