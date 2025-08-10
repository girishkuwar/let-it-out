import React, { useState, useEffect } from "react";
import { db } from "../../firebase.config";
import { collection, getDocs } from "firebase/firestore";

export default function RandomConfession() {
  const [confessions, setConfessions] = useState([]);
  const [currentConfession, setCurrentConfession] = useState(null);

  // Fetch all confessions once on mount
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "confessions"));
      const data = snapshot.docs.map(doc => doc.data().text); // Assuming field is "text"
      setConfessions(data);

      if (data.length > 0) {
        setCurrentConfession(data[Math.floor(Math.random() * data.length)]);
      }
    };

    fetchData();
  }, []);

  // Change confession on button click
  const getRandomConfession = () => {
    if (confessions.length > 0) {
      let newConfession;
      do {
        newConfession = confessions[Math.floor(Math.random() * confessions.length)];
      } while (newConfession === currentConfession && confessions.length > 1);
      setCurrentConfession(newConfession);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "auto",
      padding: "20px",
      background: "#1e1e1e",
      borderRadius: "10px",
      color: "white",
      textAlign: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
    }}>
      <h2>Random Confession</h2>
      {currentConfession ? (
        <p style={{ marginTop: "20px", fontSize: "1.2rem", transition: "opacity 0.5s ease" }}>
          {currentConfession}
        </p>
      ) : (
        <p>Loading...</p>
      )}
      <button
        onClick={getRandomConfession}
        style={{
          marginTop: "50px",
          padding: "10px 20px",
          background: "#4bc6ffff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          color: "white",
          fontSize: "1rem"
        }}
      >
        New Confession
      </button>
    </div>
  );
}
