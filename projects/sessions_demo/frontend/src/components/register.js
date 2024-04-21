import React, { useState } from 'react';
import { useNavigate } from "react-router";
import "./popUp.css";

export default function Register() {
    // At least one lowercase alphabet i.e. [a-z]
    // At least one uppercase alphabet i.e. [A-Z]
    // At least one Numeric digit i.e. [0-9]
    // At least one special character i.e. [‘@’, ‘$’, ‘.’, ‘#’, ‘!’, ‘%’, ‘*’, ‘?’, ‘&’, ‘^’]
    // Also, the total length must be in the range [8-15] 
    // https://www.geeksforgeeks.org/javascript-program-to-validate-password-using-regular-expressions/
    // const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@.#$!%*?&]{3,15}$/;

    const [name, setName] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [res, setRes] = useState('');





    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name) return;
        if (!passwordRegex.test(password1)) {
            alert("password needs a letter, a number, and at least 6 characters");
            return;
        }
        if (password1 !== password2) {
            alert("passwords dont match");
            return;
        }

        const response = await fetch("http://localhost:5001/register", {
            credentials: 'include',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: name,
                password: password1,
            }),
        }).catch(error => {
            window.alert(error);
        });

        const data = await response.json()
        setRes(data.msg)

        navigate("/home");
    }

    return (
        <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <p>Username: </p>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="enter your name"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <p>Password: </p>
                        <input
                            value={password1}
                            onChange={(event) => setPassword1(event.target.value)}
                            placeholder="enter your password"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <p>Validate Password: </p>
                        <input
                            value={password2}
                            onChange={(event) => setPassword2(event.target.value)}
                            placeholder="verify password"
                        />
                    </div>
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
            <p>Result: {res}</p>
        </>
    )
}