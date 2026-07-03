import { useState, useEffect } from "react";
import axios from "axios";

function AddToDataset({ onLogout, onDone }) {
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/categories")
      .then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedCategory) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", selectedCategory);

    try {
      await axios.post("http://127.0.0.1:5000/api/dataset/add", formData);
      setMessage("✅ Image ajoutée avec succès !");
      setFile(null);
      setSelectedCategory("");
    } catch (err) {
      setMessage("❌ Erreur lors de l'ajout.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", textAlign: "center" }}>
      <button onClick={onLogout} style={{ float: "right" }}>
        Déconnexion
      </button>
      <h1>➕ Ajouter au dataset</h1>
      <p>Charge une image et choisis sa catégorie.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <br /><br />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
          style={{ padding: 10, width: "80%" }}
        >
          <option value="">-- Choisir une catégorie --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <br /><br />

        <button type="submit">Ajouter</button>
      </form>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
}

export default AddToDataset;