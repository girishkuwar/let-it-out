import React from 'react';
import {db} from "../../firebase.config"
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
 
const Sample = () => {
    const startPhrases = [
        "I secretly", "Sometimes I", "I once", "I regret", "I love", "I hate", "I enjoy",
        "I can't believe", "I will never", "I wish I could", "I always", "I never"
    ];

    const actions = [
        "ate the last slice of cake", "lied to my best friend", "sang in the shower",
        "watched Netflix all night", "ignored someone's text", "gave money to a stranger",
        "cheated at a game", "pretended to be sick", "forgot my friend's birthday",
        "posted something anonymously", "skipped school", "daydreamed in class"
    ];

    const feelings = [
        "and it felt great.", "and now I feel guilty.", "but nobody knows.",
        "and I don't regret it.", "and I feel free.", "and I miss those days.",
        "but I won't do it again.", "and it changed my life.", "and I laughed about it.",
        "and I learned a lesson."
    ];

    const tags = ["Funny", "Regret", "Crush", "Kindness", "Random", "Childhood", "Confession"];

    // Function to create a random confession sentence
    function generateConfession() {
        const phrase = startPhrases[Math.floor(Math.random() * startPhrases.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const feeling = feelings[Math.floor(Math.random() * feelings.length)];
        return `${phrase} ${action} ${feeling}`;
    }

    // Seed multiple confessions
    async function seedConfessions(count = 100) {
        try {
            for (let i = 0; i < count; i++) {
                const confession = {
                    text: generateConfession(),
                    tag: tags[Math.floor(Math.random() * tags.length)],
                    createdAt: serverTimestamp(),
                };
                await addDoc(collection(db, "confessions"), confession);
                console.log(`✅ Added: ${confession.text}`);
            }
            console.log(`🎉 Successfully added ${count} random confessions!`);
        } catch (error) {
            console.error("❌ Error adding confessions:", error);
        }
    }

    return (
        <div>
           <button onClick={() => seedConfessions(120)}>Generate Confession</button>
        </div>
    );
};

export default Sample;