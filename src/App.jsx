import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import "./App.css";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import WriteConfession from "./pages/WriteConfession";
import RandomConfession from "./pages/RandomConfession";


export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored === "true";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("darkMode", isDark.toString());
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  return (
    <Router>
      <div className="app">
        <Nav isDark={isDark} toggleDark={toggleDark} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/write" element={<WriteConfession />} />
          <Route path="/random" element={<RandomConfession />} />
        </Routes>
        <footer className="footer">
          If you're in distress or thinking of self-harm, please contact local emergency services or a suicide prevention hotline.
        </footer>
      </div>
    </Router>
  );
}
