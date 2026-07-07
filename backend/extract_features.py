import os
import cv2
import numpy as np
import pandas as pd

DATASET_DIR = "../dataset"
OUTPUT_CSV = "features.csv"


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


def collect_images(label_dir):
    """Parcourt recursivement le dossier et ses sous-dossiers pour trouver toutes les images."""
    image_paths = []
    for root, dirs, files in os.walk(label_dir):
        for filename in files:
            if filename.lower().endswith((".jpg", ".jpeg", ".png")):
                image_paths.append(os.path.join(root, filename))
    return image_paths


def main():
    data = []

    for label in ["healthy", "malade"]:
        folder = os.path.join(DATASET_DIR, label)
        if not os.path.exists(folder):
            print(f"Dossier introuvable: {folder}")
            continue

        image_paths = collect_images(folder)
        print(f"{label}: {len(image_paths)} images trouvees")

        for path in image_paths:
            features = extract_features(path)
            if features is not None:
                row = list(features) + [label]
                data.append(row)
            else:
                print(f"Erreur lecture: {path}")

    n_features = len(data[0]) - 1
    columns = [f"f{i}" for i in range(n_features)] + ["label"]
    df = pd.DataFrame(data, columns=columns)
    df.to_csv(OUTPUT_CSV, index=False)
    print(f"\nTermine ! {len(df)} images traitees. Fichier sauvegarde: {OUTPUT_CSV}")


if __name__ == "__main__":
    main()