import { useState, useEffect } from "react";
import axios from "axios";

function Gallery({ onLogout }) {
  const [healthy, setHealthy] = useState([]);
  const [healthyInfo, setHealthyInfo] = useState({});
  const [diseases, setDiseases] = useState({});
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showHealthy, setShowHealthy] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/dataset")
      .then((res) => setHealthy(res.data.healthy || []));

    axios
      .get("http://127.0.0.1:5000/api/dataset/healthy/info")
      .then((res) => setHealthyInfo(res.data));

    axios
      .get("http://127.0.0.1:5000/api/dataset/diseases")
      .then((res) => setDiseases(res.data));
  }, []);

  const renderGrid = (images, urlBuilder) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: 10,
        marginTop: 10,
      }}
    >
      {images.map((filename, i) => (
        <img
          key={i}
          src={urlBuilder(filename)}
          alt=""
          style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 5 }}
        />
      ))}
    </div>
  );

  // Page dyal détail Healthy
  if (showHealthy) {
    return (
      <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
        <button onClick={() => setShowHealthy(false)} style={{ marginBottom: 20 }}>
          ← Retour à la galerie
        </button>
        <h1 style={{ color: "#155724" }}>{healthyInfo.name}</h1>

        <div style={{ backgroundColor: "#d4edda", padding: 15, borderRadius: 8, marginBottom: 15 }}>
          <p><strong>Description :</strong></p>
          <p>{healthyInfo.description}</p>
        </div>

        <h3>Images ({healthy.length})</h3>
        {renderGrid(healthy, (f) => `http://127.0.0.1:5000/api/dataset/healthy/${f}`)}
      </div>
    );
  }

  // Page dyal détail maladie
  if (selectedDisease) {
    const disease = diseases[selectedDisease];
    return (
      <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
        <button onClick={() => setSelectedDisease(null)} style={{ marginBottom: 20 }}>
          ← Retour à la galerie
        </button>
        <h1 style={{ color: "#721c24" }}>{disease.name}</h1>

        <div style={{ backgroundColor: "#fff5f5", padding: 15, borderRadius: 8, marginBottom: 15 }}>
          <p><strong>Description :</strong></p>
          <p>{disease.description || "Aucune description pour le moment."}</p>
        </div>

        <div style={{ backgroundColor: "#f0f8ff", padding: 15, borderRadius: 8, marginBottom: 15 }}>
          <p><strong>Traitement :</strong></p>
          <p>{disease.treatment || "Aucun traitement renseigné pour le moment."}</p>
        </div>

        <h3>Images ({disease.images.length})</h3>
        {renderGrid(disease.images, (f) => `http://127.0.0.1:5000/api/dataset/malade/${selectedDisease}/${f}`)}
      </div>
    );
  }

  // Page principale dyal galerie
  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
      <button onClick={onLogout} style={{ float: "right" }}>
        Déconnexion
      </button>
      <h1>📋 Galerie</h1>

      <div
        onClick={() => setShowHealthy(true)}
        style={{
          padding: 15,
          backgroundColor: "#d4edda",
          borderRadius: 8,
          cursor: "pointer",
          border: "1px solid #c3e6cb",
          marginTop: 10,
        }}
      >
        <h3 style={{ margin: 0, color: "#155724" }}>
          🟢 Healthy ({healthy.length}) →
        </h3>
      </div>

      <h2 style={{ color: "#721c24", marginTop: 30 }}>🔴 Malade</h2>
      {Object.entries(diseases).map(([key, disease]) => (
        <div
          key={key}
          onClick={() => setSelectedDisease(key)}
          style={{
            padding: 15,
            backgroundColor: "#fff5f5",
            borderRadius: 8,
            cursor: "pointer",
            border: "1px solid #f5c6cb",
            marginTop: 10,
          }}
        >
          <h3 style={{ margin: 0 }}>
            {disease.name} ({disease.images.length}) →
          </h3>
        </div>
      ))}
    </div>
  );
}

export default Gallery;