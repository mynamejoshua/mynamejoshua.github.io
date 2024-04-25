const express = require("express");
const hangRoutes = express.Router();
const dbo = require("../db/conn");
let rando;
let word; 
let count; 
let guessLetter;
let userWord = []; 
let correctSpaces; 
let guesses; 
let dead; 
correct = false;

hangRoutes.get("/getHighScores/:numLetters", async(req, res) => {
    const db_connect = await dbo.getDb();
    const numLetters = parseInt(req.params.numLetters);

    let highScores = await db_connect.collection("highScores").find({numOfLetters: numLetters}).toArray();
    console.log("HighScores" + highScores);
    highScores = highScores.sort((a, b) => (a.numOfGuesses - b.numOfGuesses));
    let newHighScores = new Array();

    if (highScores.length < 10) {
        res.json(highScores);
    }
    else {
        for (i = 0; i < 10; i++) {
            newHighScores[newHighScores.length = highScores[i]];
        }
        res.json(newHighScores);
    }

    
});

hangRoutes.post("/setHighScore", async(req, res) => {
    const db_connect = await dbo.getDb();

    const highScores = req.body;
    console.log(highScores);
    try{
        const result = await db_connect.collection("highScores").insertOne({
        name: req.body.name,
        numOfGuesses: guesses,
        numOfLetters: count
    })
    res.status(200).send("Success");
    } catch(err) {
        res.status(401).send("Not Found");
    }
});




hangRoutes.post("/guess", async(req, res) => {
    guessLetter = req.body.guessLetter;
    guesses++;
    console.log(guessLetter);
    let bad = 0; 
    for (let i = 0; i < count; i++)
    {
        if (word[i] === guessLetter)
        {
            userWord[i] = guessLetter;
            correctSpaces++; 
        }
        else 
        {
            ++bad;
            if (userWord[i] != "_")
            {
                continue; 
            }
            userWord[i] = "_";
        }
    }
    if (bad === count)
    {
        dead++;
    }
    if (correctSpaces === count)
    {
        correct = true;
        console.log("got here broo");
        res.json({userWord: userWord, dead: dead, correct: correct})
    }
    else 
    {
        console.log(userWord);
        res.json({userWord: userWord, dead: dead, correct: correct});
    }
});


hangRoutes.get("/sendWord", async(req, res) => {
    console.log(word);
    res.json({word: word});
});




hangRoutes.get("/getWord", async(req, res) => {
    correctSpaces = 0; 
    guesses = 0; 
    dead = 0;
    correct = false;
    userWord = [];
    rando = Math.floor(Math.random() * (14 - 0 + 1)) + 0;

    const db_connect = dbo.getDb();
    const result = await db_connect.collection("randomWords").findOne({words: "jazz"});
    console.log(result.words[rando]);
    word = result.words[rando];
    count = word.length;
    console.log(count);

    for (let i = 0; i < count; i++)
    {
        userWord[i] = "_"
    }
    console.log(userWord);
    res.json({userWord: userWord});
    userWord = [];
});







module.exports = hangRoutes;