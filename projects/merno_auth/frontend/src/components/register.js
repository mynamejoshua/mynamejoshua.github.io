import React, { useState } from 'react';
import { useNavigate } from "react-router";


export default function Register() {
    // 0-9 one number, and a letter, 6 = 6length
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6}$/;

    const [name, setName] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [res, setRes] = useState('');
    // Initialize state to store selected radio button value
    const [role, setRole] = useState('');

    // Function to update state based on which radio button is selected
    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };


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
        if (!role) {
            alert("select a role");
            return;
        }

        const response = await fetch("http://localhost:5000/register", {
            credentials: 'include',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: name,
                password: password1,
                role: role,
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
                    <div>
                    <input type="radio" id="customer" name="fav_language" value="customer" onChange={handleRoleChange} />
                    <label htmlFor="customer">Customer</label>
                    <input type="radio" id="employee" name="fav_language" value="employee" onChange={handleRoleChange} />
                    <label htmlFor="employee">Employee</label>
                    <input type="radio" id="admin" name="fav_language" value="admin" onChange={handleRoleChange} />
                    <label htmlFor="admin">Admin</label>
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