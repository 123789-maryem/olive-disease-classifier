import { useState } from "react";
import Login from "./components/Login";
import Classifier from "./components/Classifier";
import Gallery from "./components/Gallery";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("analyser");

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button
          onClick={() => setActiveTab("analyser")}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            fontWeight: activeTab === "analyser" ? "bold" : "normal",
            backgroundColor: activeTab === "analyser" ? "#4a7c3f" : "#eee",
            color: activeTab === "analyser" ? "white" : "black",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Analyser
        </button>
        <button
          onClick={() => setActiveTab("galerie")}
          style={{
            padding: "10px 20px",
            fontWeight: activeTab === "galerie" ? "bold" : "normal",
            backgroundColor: activeTab === "galerie" ? "#4a7c3f" : "#eee",
            color: activeTab === "galerie" ? "white" : "black",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Galerie
        </button>
      </div>

      {activeTab === "analyser" ? (
        <Classifier onLogout={() => setLoggedIn(false)} />
      ) : (
        <Gallery onLogout={() => setLoggedIn(false)} />
      )}
    </div>
  );
}

export default App;