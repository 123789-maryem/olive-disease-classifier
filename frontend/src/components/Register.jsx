import { useState } from "react";
import axios from "axios";

function Register({ onRegisterSuccess, onBackToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "https://olive-disease-classifier.onrender.com/api/register",
        { username, password }
      );
      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Erreur lors de l'inscription");
      }
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
        <h1>Inscription reussie !</h1>
        <p>Vous pouvez maintenant vous connecter.</p>
        <button onClick={onBackToLogin} style={{ padding: "10px 30px" }}>
          Aller a la connexion
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "90%", padding: 10, margin: 8 }}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "90%", padding: 10, margin: 8 }}
          required
        />
        <br />
        <button type="submit" style={{ padding: "10px 30px" }}>
          S'inscrire
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ marginTop: 15 }}>
        Deja un compte ?{" "}
        <span
          onClick={onBackToLogin}
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
        >
          Se connecter
        </span>
      </p>
    </div>
  );
}

export default Register;