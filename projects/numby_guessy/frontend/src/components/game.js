import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";

async function FetchRange() {
    let response = await fetch("http://localhost:5000/range");
    if (response.ok) {
        const data = await response.json();
        console.log(data.range)
        return data.range;
    } else {
        return [0, 25];
    }
}

async function PostScore(stats) {
    const newScore = { ...stats };
    await fetch("http://localhost:5000/scores/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newScore),
    })
        .catch(error => {
            window.alert(error);
            return;
        });
}

function GameStats({ name, guesses, timeTaken, range }) {
    return (
        <div>
            <h2>Game Stats</h2>
            <p>Name: {name}</p>
            <p>Number of Guesses: {guesses}</p>
            <p>Time Taken: {timeTaken} seconds</p>
            <p>Range: {range[0]} - {range[1]}</p>
        </div>
    );
}

function MessageStack({ messages }) {
    return (
        <div className="message-stack">
            {messages.map((msg, index) => (
                <div key={index}>{msg}</div>
            ))}
        </div>
    );
}

export default function Game() {
    const navigate = useNavigate();
    const userName = useLocation().state?.userName || null;

    // set up state
    const [guess, setGuess] = useState('');
    const [messages, setMessages] = useState([""]);
    const [targetNum, setTargetNum] = useState(0);
    const [stats, setStats] = useState({ guessRange: [0, 50], guesses: 0, initialTime: 0, timeTaken: -1, gameOver: false });

    const handleReset = async () => {
        let range = await FetchRange();
        let targ = Math.floor(Math.random() * parseInt(range[1]));

        setStats({ guessRange: range, guesses: 0, initialTime: null, timeTaken: -1, gameOver: false });
        setTargetNum(targ);
        setMessages(["".concat("Guess a number between ", range[0], " and ", range[1])]);
        setGuess('');
    };

    // https://devtrium.com/posts/async-functions-useeffect
    useEffect(() => { // cant use async here so i make a new function and call it imideately
        if (!userName) { navigate("/"); } // make sure that a user name has been entered
        handleReset().catch(console.error);
    }, []);

    const handleGuessChange = (event) => {
        setGuess(event.target.value);
    };

    const handleSubmit = (event) => { // might need async here
        event.preventDefault();
        if (stats.gameOver === true) return;
        if (!stats.initialTime) stats.initialTime = new Date(); // on first guess set inital time

        let updatedStats = { ...stats };
        let message = "";
        updatedStats.guesses += 1;

        console.log("guess:", guess);
        console.log("targ:", targetNum);

        if (guess > targetNum) {
            message = "lower than " + guess;
        } else if (guess < targetNum) {
            message = "higher than " + guess;
        } else if (parseInt(guess) === targetNum) {
            message = "correct";
            const endTime = new Date();
            updatedStats.timeTaken = (endTime - stats.initialTime) / 1000;
            updatedStats.gameOver = true;
            updatedStats.name = userName;
            PostScore(updatedStats);
        } else {
            return;
        }

        // update gamestate
        setStats(updatedStats);
        setMessages([...messages, message]);
        setGuess('');
    };

    const renderGameOver = () => (
        <>
            <NavLink to="/score">LeaderBoard</NavLink>
            <GameStats name={userName} guesses={stats.guesses} timeTaken={stats.timeTaken} range={stats.guessRange} />
            <details><summary>message log</summary>
                <MessageStack messages={messages} />
            </details>
            <button type="button" onClick={handleReset}>Play Again</button>
        </>
    );

    const renderGamePlay = () => (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={guess}
                    onChange={handleGuessChange}
                    placeholder="Enter your guess"
                />
                <button type="submit">Guess</button>
                <button type="button" onClick={handleReset}>Reset</button>
            </form>
            <MessageStack messages={messages} />
        </>
    );

    return (
        <>
            <h2>Numby-Guessy Game</h2>
            {stats.gameOver ? renderGameOver() : renderGamePlay()}
        </>
    );
}
