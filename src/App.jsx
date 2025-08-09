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

const BAD_WORDS = ["suicide", "kill myself", "hate you"];
const containsBadWords = (text) => {
  const t = text.toLowerCase();
  return BAD_WORDS.some((w) => t.includes(w));
};

function Nav({ isDark, toggleDark }) {
  return (
    <nav className="nav">
      <div className="container nav-container">
        <Link to="/" className="logo">LetItOut</Link>
        <div className="nav-links">
          <Link to="/write" className="btn-link">Write</Link>
          <Link to="/random" className="btn-link">Random</Link>
          <button onClick={toggleDark} className="btn-toggle">
            {isDark ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "confessions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setConfessions(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <main className="container">
      <h1>Latest Confessions</h1>
      {loading && <p>Loading...</p>}
      {confessions.length === 0 && !loading && (
        <p className="empty-msg">Be the first to share something.</p>
      )}
      <div>
        {confessions.map((c) => (
          <article key={c.id} className="card">
            <div className="tag-date">{c.tag || "General"} •{" "}
              {c.createdAt?.toDate ? new Date(c.createdAt.toDate()).toLocaleString() : ""}
            </div>
            <p className="confession-text">{c.text}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

function WriteConfession() {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (containsBadWords(text)) {
      alert("Your post contains words that are not allowed. If you're having thoughts of self-harm, please seek help — see the footer links.");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "confessions"), {
        text: text.trim(),
        tag: tag.trim(),
        createdAt: serverTimestamp(),
      });
      setText("");
      setTag("");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container">
      <h1>Write a Confession</h1>
      <form onSubmit={handleSubmit} className="form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="What's on your mind? Be honest."
          className="textarea"
          disabled={submitting}
        />
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Tag (love, regret, crush...)"
          className="input"
          disabled={submitting}
        />
        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn">
            {submitting ? "Sending..." : "Let it out"}
          </button>
          <button
            type="button"
            onClick={() => setText("")}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Clear
          </button>
        </div>
      </form>
      <p className="note">
        Note: Posts are public and anonymous. No replies or comments.
      </p>
    </main>
  );
}

function RandomConfession() {
  const [confession, setConfession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRandom() {
      const q = query(collection(db, "confessions"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (docs.length === 0) {
        setConfession(null);
      } else {
        const r = Math.floor(Math.random() * docs.length);
        setConfession(docs[r]);
      }
      setLoading(false);
    }
    fetchRandom();
  }, []);

  return (
    <main className="container">
      <h1>Random Confession</h1>
      {loading && <p>Loading...</p>}
      {!loading && !confession && <p className="empty-msg">No confessions yet.</p>}
      {confession && (
        <article className="card">
          <div className="tag-date">{confession.tag || "General"}</div>
          <p className="confession-text">{confession.text}</p>
        </article>
      )}
    </main>
  );
}

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
