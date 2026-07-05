import { useState, useEffect } from "react";
import axios from "axios";

function History({ onLogout }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("https://olive-disease-classifier.onrender.com/api/history")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
      <button onClick={onLogout} style={{ float: "right" }}>
        Deconnexion
      </button>
      <h1>Historique des analyses</h1>

      {history.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Image</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Resultat</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr key={i}>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  <img
                    src={`https://olive-disease-classifier.onrender.com/uploads/${item.filename}`}
                    alt=""
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 5 }}
                  />
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    color: item.prediction === "healthy" ? "#155724" : "#721c24",
                    fontWeight: "bold",
                  }}
                >
                  {item.prediction}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.date}</td>
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

export default History;