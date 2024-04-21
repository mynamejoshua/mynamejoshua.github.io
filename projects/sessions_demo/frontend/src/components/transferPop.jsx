import React, { useState } from "react";
//import "./popUp.css";

const Modal = ({open, onClose}) => {
    let test = false; 

    const [from, setFrom] = useState('');
    const [target, setTarget] = useState('');
    const [amount, setAmmount] = useState('');
    if (!open) return null; 
    const accountChange = async () =>
    {
        console.log(from + " "+ target + " "+ amount)
        const change = await fetch('http://localhost:5001/transfer',
        {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({from: from, target: target, amount: amount}),
            headers:
            {
                'Content-Type': 'application/json'
            },
        });
        const changeMade = await change.json();
    };
    const handleFromChange = (event) =>
    {
        setFrom(event.target.value);
    };

    const handleTargetChange = (event) =>
    {
        setTarget(event.target.value);
    };

    return(
            <div className="popUp">
                <div className="modalContainer">
                    <p onClick={onClose} className="txt">X</p>
                    <br></br>
                    <div className="input">
                        <h2>Transfer From: </h2>
                        <input type="radio" id="checking" name="selected_account" value="checking" onChange={handleFromChange} />
                        <label htmlFor="checking">Checking</label>
                        <input type="radio" id="savings" name="selected_account" value="savings" onChange={handleFromChange} />
                        <label htmlFor="savings">Savings</label>
                        <input type="radio" id="yield" name="selected_account" value="yield" onChange={handleFromChange} />
                        <label htmlFor="yield">High Yield</label>
                    </div>
                    
                    <div className="input">
                        <h2>Transfer To: </h2>
                        <input type="radio" id="checking" name="selected" value="checking" onChange={handleTargetChange} />
                        <label htmlFor="checking">Checking</label>
                        <input type="radio" id="savings" name="selected" value="savings" onChange={handleTargetChange} />
                        <label htmlFor="savings">Savings</label>
                        <input type="radio" id="yield" name="selected" value="yield" onChange={handleTargetChange} />
                        <label htmlFor="yield">High Yield</label>
                        </div>
                  
                    <div className='input'>
                        <h2>Input amount: </h2>
                        <input type='text' value={amount} onChange={(event) => setAmmount(event.target.value)}></input>
                    </div>
                    <br></br>
                    <button type="submit" onClick={accountChange}>Submit</button>
                </div>
            </div>
    );
};
export default Modal; 
