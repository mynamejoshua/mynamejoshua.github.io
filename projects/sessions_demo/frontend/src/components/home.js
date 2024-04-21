import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router";
//import UsePop from "./components/usePopup";
import Modal from './transferPop';
import ModalTwo from './history';



function AccountInfo({ name, balance }) {
    return (
        <div className='AccountInfo'>
            <h2>{name}</h2>
            <p>Balance: ${balance}</p>
        </div>
    );
}

function AccountsList({ accounts }) {
    console.log("in accountslist: ", accounts);

    return (
        <div>
            {accounts.map((account, index) => (
                <AccountInfo key={index} name={account.name} balance={account.balance? account.balance: "0"} />
            ))}
        </div>
    );
}



export default function Home() {
const navigate = useNavigate();
const [loading, setLoading] = useState(true);
const [reload, setReload] = useState(0);
const [accountInfo, setAccountInfo] = useState({});
const [open, setOpen] = useState(false);
const [historyViewable, setHistoryViewable] = useState(false);
const [action, setUse] = useState('');
const [amount, setAmount] = useState('');
const [selectedAccount, setSelectedAccount] = useState('');
const [test, setTest] = useState(false);

/*
useEffect(() => {
    const fetchData = async () => {
        console.log("in home use effect");
        const response = await fetch("http://localhost:5001/prev", { method: 'GET', credentials: 'include'});
        const data = await response.json();
        //if (!data)
        //{
          //  navigate("/");
        //}
    };
    fetchData();
}, []);

useEffect = (() => 
{
    const getInfo = async () => {
        const userInfoFetch = await fetch("http://localhost:5001/accounts", { method: 'GET', credentials: 'include'});
        const userdata = await userInfoFetch.json();
        console.log("got user account data:", userdata);
        setAccountInfo(userdata.accounts);
        console.log("user data:", accountInfo);
    };
    getInfo();
}, [test]);
*/



useEffect(() => {

    const fetchData = async () => {
        
        try {
            console.log("in home use effect");
            const response = await fetch("http://localhost:5001/prev", { method: 'GET', credentials: 'include'});
            const data = await response.json();
            console.log("hello world");
            if (data) {
                const userInfoFetch = await fetch("http://localhost:5001/accounts", { method: 'GET', credentials: 'include'});
                const userdata = await userInfoFetch.json();
                console.log("got user account data:", userdata);
                setAccountInfo(userdata.accounts);
                console.log("user data:", accountInfo);

            } else {
                console.log("no session");
                navigate("/");
            }
        } catch (error) {
            console.error('Failed in use effect:', error);
            
        } finally {
            setLoading(false);
        }


    };
    fetchData();
}, [test]);




const handleWithdrawDeposit = async () => {
    if (test === true)
    {
        setTest(false);
        console.log(test);
    }
    else if (test === false)
    {
        setTest(true);
        console.log(test);
    }
    if (!amount) {
        return;
    }

    const parsedAmount = Math.abs(parseFloat(amount));
    // check if parsing failed
    if (isNaN(parsedAmount)) {
        return;
    }

    if (action === 'w') {
        console.log("withdrawl");
        const response = await fetch("http://localhost:5001/withdraw", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({action: action, amount: parsedAmount, account: selectedAccount}),
        })
        .catch(error => {
            window.alert(error);
        });
        console.log(`Withdraw ${parsedAmount} from ${selectedAccount}`);
        
    } else if (action === 'd') {
        console.log("deposit");
        const response = await fetch("http://localhost:5001/deposit", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({action: action, amount: parsedAmount, account: selectedAccount}),
        })
        .catch(error => {
            window.alert(error);
        });
        console.log(`Deposit ${parsedAmount} to ${selectedAccount}`);
        
    }
};

const handleAccountChange = (event) =>
{
    setSelectedAccount(event.target.value);
};

const handleUseChange = (event) => {
    setUse(event.target.value);
};

const handleHistory = async () =>
{
    setHistoryViewable(true);
}

const handleOpen = async () =>
{
    setOpen(true);
}

const handleClose = async () =>
{
    setOpen(false);
    if (test === true)
    {
        setTest(false);
    }
    else if (test === false)
    {
        setTest(true);
    }
}


const handleclick = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:5001/logout", { method: 'GET', credentials: 'include'})
    alert("logged out");
    navigate("/");
}

if (loading) {
    return <div>Loading...</div>;
}

return (
    <>
    <h1>YOU ARE LOGGED IN</h1>
    <AccountsList accounts={accountInfo}/>
        <input type="radio" id="checking" name="selected_account" value="checking" onChange={handleAccountChange} />
        <label htmlFor="checking">Checking</label>
        <input type="radio" id="savings" name="selected_account" value="savings" onChange={handleAccountChange} />
        <label htmlFor="savings">Savings</label>
        <input type="radio" id="yield" name="selected_account" value="yield" onChange={handleAccountChange} />
        <label htmlFor="yield">High Yield</label>
    <div>
        <input type="radio" id="withdraw" name="withdraw_deposit" value="w" onChange={handleUseChange} />
        <label htmlFor="withdraw">Withdraw</label>
        <input type="radio" id="deposit" name="withdraw_deposit" value="d" onChange={handleUseChange} />
        <label htmlFor="deposit">Deposit</label>
        <div className='input'>
            <h2>Input amount: </h2>
            <input type='number' value={amount} onChange={(event) => setAmount(event.target.value)}></input>
        </div>
        <div className='input'>
            <button onClick={handleWithdrawDeposit}>Submit</button>
            <button onClick={() => setOpen(true)}>Transfer</button>
            <button onClick={() => setHistoryViewable(true)}>History</button>
            <button onClick={handleclick}>Logout</button>
        </div>
            </div>
    <Modal open = {open} onClose={handleClose} />
    <ModalTwo open ={historyViewable} onClose={() => setHistoryViewable(false)} />
    </>
)
}