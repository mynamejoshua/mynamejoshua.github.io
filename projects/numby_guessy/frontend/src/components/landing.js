import React, {useState} from 'react';
import { useNavigate } from "react-router";
import Game from "./game";


export default function Landing() {
const [name, setName] = useState('');

const navigate = useNavigate();

const handleSubmit = (event) => {
    event.preventDefault();
    console.log(name);
    if(!name) return;
    navigate("/game", { state: {userName: name} });
}

const handleGuessChange = (event) => {
    setName(event.target.value);
};

return (
    <form onSubmit={handleSubmit} style={{display: 'flex'}}>
        <input 
        value={name} 
        onChange={handleGuessChange} 
        placeholder="enter your name" 
        />
        <button type="submit">Play!</button>
    </form>
)
}