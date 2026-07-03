import { useState } from "react";
import Login from "./components/Login";
import Classifier from "./components/Classifier";
import Gallery from "./components/Gallery";
import AddToDataset from "./components/AddToDataset";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("analyser");

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
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
      </div>

      {activeTab === "analyser" && <Classifier onLogout={() => setLoggedIn(false)} />}
      {activeTab === "galerie" && <Gallery onLogout={() => setLoggedIn(false)} />}
      {activeTab === "ajouter" && <AddToDataset onLogout={() => setLoggedIn(false)} />}
    </div>
  );
}

export default App;