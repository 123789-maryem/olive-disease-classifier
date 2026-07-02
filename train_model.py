import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Charger les données
df = pd.read_csv("features.csv")

X = df.drop("label", axis=1)
y = df["label"]

# Séparer en train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Entraîner le modèle
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Évaluer
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Précision du modèle: {accuracy:.2%}")
print("\nRapport détaillé:")
print(classification_report(y_test, y_pred))

# Sauvegarder le modèle
joblib.dump(model, "model.pkl")
print("\nModèle sauvegardé: model.pkl")