import { useState, useEffect } from "react";
import axios from "axios";

function Classifier({ onLogout }) {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/predict", formData);
      setPrediction(res.data.prediction);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", textAlign: "center" }}>
      <button onClick={onLogout} style={{ float: "right" }}>
        Déconnexion
      </button>
      <h1>🫒 Classificateur de maladies de l'olivier</h1>
      <p>Charge une image d'une feuille d'olivier pour obtenir une prédiction</p>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
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
          Résultat : {prediction}
        </div>
      )}

      <h2>📋 Historique</h2>
      {history.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Image</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Résultat</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr key={i}>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  <img
                    src={`http://127.0.0.1:5000/uploads/${item.filename}`}
                    alt=""
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  {item.prediction}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune analyse pour le moment.</p>
      )}
    </div>
  );
}

export default Classifier;