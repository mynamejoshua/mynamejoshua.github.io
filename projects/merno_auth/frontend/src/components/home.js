import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router";


export default function Home() {
const navigate = useNavigate();
const [name, setName] = useState('');
const [role, setRole] = useState('');

useEffect(() => {
    const fetchData = async () => {
        const response = await fetch("http://localhost:5000/prev", { method: 'GET', credentials: 'include'});
        const data = await response.json();
        if (data) {
            const userInfoFetch = await fetch("http://localhost:5000/personalData", { method: 'GET', credentials: 'include'});
            const userdata = await userInfoFetch.json();
            console.log(userdata);
            setName(userdata.userName);
            setRole(userdata.role);
        } else {
            console.log("no session");
        }
    };
    fetchData();
}, []);


const handleclick = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/logout", { method: 'GET', credentials: 'include'})
    alert("logged out");
    navigate("/");
}

return (
    <>
    <h1>YOU LOGGED IN</h1>
    <p>Username: {name}</p>
    <p>Role: {role}</p>
    <button onClick={handleclick}>Logout</button>
    </>
)
}