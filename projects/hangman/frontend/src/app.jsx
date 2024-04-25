import { useState, useEffect } from 'preact/hooks'
import alphabet from './assets/alphabet';
import './app.css'
import React from 'react';


const limbs = ['head','body','r_arm', 'r_leg', 'l_arm', 'l_leg'];


function Stickman() {
  return (
    <svg id="stickman" width="200" height="200" viewBox="0 0 200 200" fill="none">
      <circle id="head" cx="100" cy="25" r="25" fill="black"/>
      <path id="body" d="M100 50V100" stroke="black" stroke-width="10" stroke-linecap="round"/>
      <path id="r_arm" d="M100 51.8977L135.355 87.253" stroke="black" stroke-width="10" stroke-linecap="round"/>
      <path id="r_leg" d="M100 100L135.355 135.355" stroke="black" stroke-width="10" stroke-linecap="round"/>
      <path id="l_arm" d="M65 87.3553L100.355 52" stroke="black" stroke-width="10" stroke-linecap="round"/>
      <path id="l_leg" d="M65 135.355L100.355 100" stroke="black" stroke-width="10" stroke-linecap="round"/>
    </svg>
  )
};

// handles the styling of a letterbox.
function Letterbox({ letter, onClickFunc, status }) {
  const [opacity, setOpacity] = useState(1); 
  const [backgroundColor, setBackgroundColor] = useState('default');

  const statusConfig = {
    "word_to_guess_invisible": {
      className: "letterbox_none",
      onClick: () => onClickFunc(),
    },
    "guessed_letter": {
      className: "letterbox_guessed",
      onClick: () => onClickFunc(),
    },
    "default": {
      className: "letterbox",
      onClick: () => {
  
        if (onClickFunc() == false) {
          setBackgroundColor('red');
        } else {
          setBackgroundColor('green');
        }

        //setOpacity(0);
      },
    },
  };
  
  // if a status is set, then get that func out of the onclick parameter, if it is unset, get the default
  const { className: name, onClick: handleClick } = statusConfig[status] || statusConfig["default"];

  return (
    <div className={name} style={{ opacity, backgroundColor }} onClick={handleClick}>{letter}</div>
  );
};

// renders the game state, specifically, the word to guess, and the selection table
function GameState({ word, guesses, updateGameWithLetter }) {
  console.log("guesses: ", guesses);
  const wordToGuess = word.split('').map((letter, index) => {
    let displayLetter = guesses.includes(letter) ? letter : '';
    let status = guesses.includes(letter) ? "guessed_letter" : "word_to_guess_invisible";
    return <Letterbox key={index} letter={displayLetter} status={status} onClickFunc={()=>{}} />;
  });

  const alphabetSelection = alphabet.map((letter, index) => {
    // pass the onclick func, do it with a () => to stop func call on render. returns true if guess is correct
    return <Letterbox key={index} letter={letter} onClickFunc={() => {return updateGameWithLetter(letter);}} />;
  }); 

  return (
    <div id='game_state'>
      <div id='correct_guesses'>
        {wordToGuess}
      </div>
      <hr />
      <div id='alphabet'>
        {alphabetSelection}
      </div>
    </div>
  );
};

export function App() {
  const [incorrectGuessCount, setIncorrectGuessCount] = useState(0);
  const [currentlyGuessed, setCurrentlyGuessed] = useState([]);
  const [gameOver, setGameOver] = useState();
  const [word, setWord] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [userName, setUserName] = useState('');
  const [highScores, setHighScores] = useState([]);

  const handleGuess2 = async (letter) => {
    if (userName === '')
    {
      return; 
    }
    
    if (currentlyGuessed.includes(letter)) {
      return false;
    }

    let correct = true;

    setCurrentlyGuessed([...currentlyGuessed, letter]);
    
    const response = await fetch('http://localhost:5001/guess', {
        credentials: "include",
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guessLetter: letter })
      });

      const data = await response.json();
      console.log(data.correct);
      console.log(data.dead);
      const newWord = data.userWord.join('');
      console.log("word:", newWord);
      setWord(newWord);
      setIncorrectGuessCount(data.dead);
      if (data.dead === 6)
      {
        const responseTwo = await fetch(`http://localhost:5001/sendWord`, {
          credentials: "include",
          method: "GET",
          });
          const test = await responseTwo.json();
          setGameOver(true);
          setTimeout(() => {
            window.alert("Press Ok to play again and the word is:" + test.word);
            window.location.reload();
          }, 4000);
        
      }
    if (!word.includes(letter)) {
      correct = false;
    }
    if (data.correct === true)
    {
      const response = await fetch('http://localhost:5001/setHighScore', {
        credentials: "include",
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: userName})
      }); 
      setGameOver(true);

        
      setTimeout(() => {
        window.alert("Press Ok to play again.");
        window.location.reload();
      }, 4000);
    }
      
    return correct;
  }

  // handles the animation of the stickfugre
  function updateStickman(incorrectGuesses) {
    // display limbs based on the number of incorrect guesses
    for (let i = 0; i < Math.min(incorrectGuesses, limbs.length); i++) {
      document.getElementById(limbs[i]).style.transform = 'none';
    }
  }

  // updates stick figure on every re-render
  updateStickman(incorrectGuessCount);

  useEffect(() => {
    if (incorrectGuessCount >= limbs.length) {
      console.log("Game Over!");
      setGameOver("Game Over!"); // Set the game over message
    }
  }, [incorrectGuessCount, limbs.length]);

  useEffect(() => {
    let setGameWord = async () => {
      const response1 = await fetch('http://localhost:5001/getWord', {
      credentials: "include",
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      });

      const data = await response1.json();
      console.log(data.userWord + "testing from jeol");
      console.log(data.userWord.join(''));
      setWord(data.userWord.join(''));  
    }

    setGameWord();
  }, []);

  // useEffect(() => {
  //   async function getHighScores() {
  //     const response = await fetch(`http://localhost:5001/getHighScores/5`);
  //      if (!response.ok) {
  //       const message = `An error occurred: ${response.statusText}`;
  //       window.alert(message);
  //       return;
  //     }
  //      const highScores = await response.json();
  //      console.log(highScores);
  //      highScoreList(highScores);
  //     setHighScores(highScores);
  //   }
  //    getHighScores();
  //    return;
  // }, [highScores.length]);

  const handleShowHighScores = async () => {
    const response = await fetch(`http://localhost:5001/getHighScores/${word.length}`, {
    credentials: "include",
    method: "GET",
    });
    let data = await response.json();
    console.log(data[0].name);
    document.getElementById('highScoresTable').innerHTML = data.map(record => 
        `<tr>
          <td>${record.name}</td>
          <td>${record.numOfGuesses}</td>
        </tr>`
    ).join('');
};
   

handleShowHighScores();
  return (
    <div id='app'>
      <h1>Hangman</h1>
      <label>Enter your Name: </label>
      <input type = "text" value={userName} onChange={(event) => setUserName(event.target.value)}/>
      <div>
        <Stickman/>
        <GameState guesses={currentlyGuessed} word={word} updateGameWithLetter={handleGuess2}/>
      </div>
      <br></br>
      <br></br>
      <div>
        <label>{gameOver}</label>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Number of Guesses</th>
            </tr>
            </thead>
            <tbody id="highScoresTable">

            </tbody>
        </table>
        <h2 ></h2>
      </div>
    </div>
  )
};