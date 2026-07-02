from flask import Flask, request, render_template, redirect, session, url_for
import joblib
import cv2
import numpy as np
import os
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = "olive-secret-key-2026"  # khassk tبدلها b chi haja plus sécurisé mnbe3d

model = joblib.load("model.pkl")

UPLOAD_FOLDER = "uploads"
HISTORY_FILE = "history.json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Login simple (mektoub f code)
USERNAME = "admin"
PASSWORD = "olive2026"


def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return []


def save_history(entry):
    history = load_history()
    history.insert(0, entry)  # jdid f lawel
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


def login_required(f):
    def wrapper(*args, **kwargs):
        if not session.get("logged_in"):
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper


@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        if username == USERNAME and password == PASSWORD:
            session["logged_in"] = True
            return redirect(url_for("index"))
        else:
            error = "Identifiants incorrects"
    return render_template("login.html", error=error)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    prediction = None
    if request.method == "POST":
        file = request.files.get("image")
        if file and file.filename != "":
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{timestamp}_{file.filename}"
            path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(path)

            features = extract_features(path)
            if features is not None:
                prediction = model.predict([features])[0]

                save_history({
                    "filename": filename,
                    "prediction": prediction,
                    "date": datetime.now().strftime("%d/%m/%Y %H:%M")
                })

    history = load_history()
    return render_template("index.html", prediction=prediction, history=history)


if __name__ == "__main__":
    app.run(debug=True)