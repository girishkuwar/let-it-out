import { collection, orderBy, query, limit, startAfter, getDocs } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase.config';
import './fade.css'; // new fade styles

const HomePage = () => {
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 4;

    const loaderRef = useRef(null);

    const loadConfessions = async (isFirstLoad = false) => {
        if (!hasMore) return;

        setLoading(true);

        let q;
        if (isFirstLoad) {
            q = query(
                collection(db, "confessions"),
                orderBy("createdAt", "desc"),
                limit(pageSize)
            );
        } else {
            q = query(
                collection(db, "confessions"),
                orderBy("createdAt", "desc"),
                startAfter(lastDoc),
                limit(pageSize)
            );
        }

        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data(), fade: true }));

        if (isFirstLoad) {
            setConfessions(items);
        } else {
            setConfessions((prev) => [...prev, ...items]);
        }

        if (snap.docs.length < pageSize) {
            setHasMore(false);
        }

        setLastDoc(snap.docs[snap.docs.length - 1]);
        setLoading(false);
    };

    useEffect(() => {
        loadConfessions(true);
    }, []);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    loadConfessions(false);
                }
            },
            { threshold: 1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loading, lastDoc, hasMore]);

    return (
        <main className="container">
            <h1>Latest Confessions</h1>
            {loading && confessions.length === 0 && <p>Loading...</p>}
            {confessions.length === 0 && !loading && (
                <p className="empty-msg">Be the first to share something.</p>
            )}

            <div className="grid grid-cols-2 gap-1">
                {confessions.map((c) => (
                    <article
                        key={c.id}
                        className={`card max-w-sm rounded overflow-hidden shadow-lg flex flex-col justify-between fade-in`}
                    >
                        <p className="confession-text px-1 py-4">{c.text}</p>
                        <div className="px-2 pt-4 pb-2 flex justify-between items-center">
                            <span className="inline-block text-sm text-gray-500">
                                {c.tag || "General"}
                            </span>
                            <span className="date inline-block text-sm text-gray-500">
                                {c.createdAt?.toDate
                                    ? new Date(c.createdAt.toDate()).toLocaleString()
                                    : ""}
                            </span>
                        </div>
                    </article>
                ))}
            </div>

            {/* Loader for infinite scroll trigger */}
            {hasMore && (
                <div ref={loaderRef} className="text-center py-4">
                    {loading && <p>Loading more...</p>}
                </div>
            )}

            {!hasMore && (
                <p className="text-center mt-4 text-gray-500">No more confessions</p>
            )}
        </main>
    );
};

export default HomePage;
