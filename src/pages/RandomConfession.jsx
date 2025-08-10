import { collection, getDocs, orderBy, query } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';

const RandomConfession = () => {
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
};

export default RandomConfession;