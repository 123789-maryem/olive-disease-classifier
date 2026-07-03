import { useState, useEffect } from "react";
import axios from "axios";

function Classifier({ onLogout }) {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [addedMessage, setAddedMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/categories")
      .then((res) => setCategories(res.data.filter((c) => c !== "healthy")));
  }, []);

  const addToDataset = async (category) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);

    try {
      await axios.post("http://127.0.0.1:5000/api/dataset/add", formData);
      setAddedMessage("Image ajoutee a la galerie avec succes !");
    } catch (err) {
      setAddedMessage("Erreur lors de l ajout a la galerie.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setAddedMessage("");
    setSelectedDisease("");
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/predict", formData);
      setPrediction(res.data.prediction);

      if (res.data.prediction === "healthy") {
        await addToDataset("healthy");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleConfirmDisease = () => {
    if (!selectedDisease) return;
    addToDataset(selectedDisease);
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", textAlign: "center" }}>
      <button onClick={onLogout} style={{ float: "right" }}>
        Deconnexion
      </button>
      <h1>Classificateur de maladies de l olivier</h1>
      <p>Charge une image d une feuille d olivier pour obtenir une prediction</p>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setPrediction(null);
            setAddedMessage("");
          }}
          required
        />
        <br />
        <br />
        <button type="submit">{loading ? "Analyse..." : "Analyser"}</button>
      </form>

      {prediction && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 8,
            fontSize: 20,
            fontWeight: "bold",
            backgroundColor: prediction === "healthy" ? "#d4edda" : "#f8d7da",
            color: prediction === "healthy" ? "#155724" : "#721c24",
          }}
        >
          Resultat : {prediction}
        </div>
      )}

      {prediction === "malade" && !addedMessage && (
        <div style={{ marginTop: 20, padding: 15, backgroundColor: "#fff5f5", borderRadius: 8 }}>
          <p><strong>Quel type de maladie est-ce</strong></p>
          <select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            style={{ padding: 10, width: "80%" }}
          >
            <option value="">-- Choisir la maladie --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <br />
          <br />
          <button onClick={handleConfirmDisease}>Confirmer et ajouter a la galerie</button>
        </div>
      )}

      {addedMessage && <p style={{ marginTop: 15 }}>{addedMessage}</p>}
    </div>
  );
}

export default Classifier;