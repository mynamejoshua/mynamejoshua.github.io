import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router";


export default function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');


    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:5000/prev", { method: 'GET', credentials: 'include'});
            let data = await response.json();

            console.log("data is: ", data);
            if (data.auth == 1) {
               navigate("/home");
            }
        };

        fetchData();
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch("http://localhost:5000/auth", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: name,
                password: password
            }),
        })
            .catch(error => {
                window.alert(error);
            });
        const data = await response.json();
        console.log("Backend auth response: " + data);
        if (data.auth == 1) {
            navigate("/home");
        } else {
            setStatus("Failed to log in");
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="enter your name"
                />
                <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="enter your password"
                />
                <button type="submit">Log In</button>
            </form>
            <p>Result: {status}</p>
        </>
    )
}

