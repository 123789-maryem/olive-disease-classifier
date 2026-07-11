import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Classifier from "./components/Classifier";
import Gallery from "./components/Gallery";
import AddToDataset from "./components/AddToDataset";
import History from "./components/History";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("analyser");

  if (!loggedIn) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={() => setShowRegister(false)}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLogin={() => setLoggedIn(true)}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  const tabStyle = (tab) => ({
    padding: "10px 20px",
    marginRight: 10,
    fontWeight: activeTab === tab ? "bold" : "normal",
    backgroundColor: activeTab === tab ? "#4a7c3f" : "#eee",
    color: activeTab === tab ? "white" : "black",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  });

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button onClick={() => setActiveTab("analyser")} style={tabStyle("analyser")}>
          Analyser
        </button>
        <button onClick={() => setActiveTab("galerie")} style={tabStyle("galerie")}>
          Galerie
        </button>
        <button onClick={() => setActiveTab("ajouter")} style={tabStyle("ajouter")}>
          Ajouter au dataset
        </button>
        <button onClick={() => setActiveTab("historique")} style={tabStyle("historique")}>
          Historique
        </button>
      </div>

      {activeTab === "analyser" && <Classifier onLogout={() => setLoggedIn(false)} />}
      {activeTab === "galerie" && <Gallery onLogout={() => setLoggedIn(false)} />}
      {activeTab === "ajouter" && <AddToDataset onLogout={() => setLoggedIn(false)} />}
      {activeTab === "historique" && <History onLogout={() => setLoggedIn(false)} />}
    </div>
  );
}

export default App;