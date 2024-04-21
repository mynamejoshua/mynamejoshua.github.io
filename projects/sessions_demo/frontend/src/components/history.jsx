import React, { useState } from "react";
//import "./popUp.css";


const History = (props) => (
    <tr>
      <td>{props.history.account}</td>
    </tr>
   );

const ModalTwo = ({open, onClose}) => {
    const [selectedAccount, setSelectedAccount] = useState('');

    if (!open) return null; 

    const handleAccountChange = (event) =>
    {
        setSelectedAccount(event.target.value);
    };

    const handleShowHistory = async () => {
        const response = await fetch(`http://localhost:5001/history/${selectedAccount}`, {
        credentials: "include",
        method: "GET",
        });
        let data = await response.json();
        let history = data.history;
        setSelectedAccount(history);
        document.getElementById('history').innerHTML = history.map(record => 
            `<div>
              <div>Account Name: ${record.account}</div>
              <div>Transaction Date: ${record.date}</div>
              <div>Transaction Type: ${record.type}</div>
              <div>Transaction Amount: ${record.amount}</div> 
              <div>Transaction Description: ${record.description}</div>
              <br><br>
            </div>`
        ).join('');
    };


    const handleShowEntireHistory = async () => {
        const response = await fetch("http://localhost:5001/history", {
        credentials: "include",
        method: "GET",
        });
        let data = await response.json();
        console.log(data);
        let history = data.history;
        setSelectedAccount(history);
        document.getElementById('history').innerHTML = history.map(record => 
            `<div>
              <div>Account Name: ${record.account}</div>
              <div>Transaction Date: ${record.date}</div>
              <div>Transaction Type: ${record.type}</div>
              <div>Transaction Amount: ${record.amount}</div> 
              <div>Transaction Description: ${record.description}</div>
              <br><br>
            </div>`
        ).join('');
        };


    return(
            <div className="popUp">
                <div className="modalContainer">
                    <p onClick={onClose} className="txt">X</p>
                    <br></br>
                    <h1>History</h1>
                    <div classname="input">
                        <input type="radio" id="checking" name="selected_account" value="checking" onChange={handleAccountChange} />
                        <label htmlFor="checking">Checking</label>
                        <input type="radio" id="savings" name="selected_account" value="savings" onChange={handleAccountChange} />
                        <label htmlFor="savings">Savings</label>
                        <input type="radio" id="yield" name="selected_account" value="yield" onChange={handleAccountChange} />
                        <label htmlFor="yield">High Yield</label>
                    </div>
                    <br></br>
                    
                    <div classname="input">
                        <button onClick={handleShowHistory}>Show History for Specific Account</button>
                        <button onClick={handleShowEntireHistory}>Show History for Entire Account</button>
                        <h3 id="history"></h3>
                    </div>
                </div>
            </div>
    );
};

export default ModalTwo; 