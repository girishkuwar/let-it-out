import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const WriteConfession = () => {
    const [text, setText] = useState("");
    const [tag, setTag] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const BAD_WORDS = ["suicide", "kill myself", "hate you"];
    const containsBadWords = (text) => {
        const t = text.toLowerCase();
        return BAD_WORDS.some((w) => t.includes(w));
    };

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
};

export default WriteConfession;