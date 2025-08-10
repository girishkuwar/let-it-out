import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';

const HomePage = () => {
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
};

export default HomePage;