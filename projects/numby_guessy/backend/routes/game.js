const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const gameRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
// https://www.mongodb.com/community/forums/t/solved-mern-tutorial-issue-cannot-read-properties-of-undefined-reading-collection/212521/2
gameRoutes.route("/range").get(async function (req, response) {
    let topnumber = Math.floor(Math.random() * 101) * 10;
    response.json({range: [0, topnumber]});  
});

// This section will help you create a new record.
gameRoutes.route("/scores/add").post(function (req, response) {

    let db_connect = dbo.getDb();
   
    let myobj = {
        name: req.body.name,
        timeTaken: req.body.timeTaken,
        guesses: req.body.guesses,
        guessRange: req.body.guessRange,
    };

    db_connect.collection("scores").insertOne(myobj, function (err, res) {
    if (err) throw err;
        response.json(res);
        console.log("added record");
    });
});

gameRoutes.route("/scores").get(async function (req, response) {
    let db_connect = dbo.getDb();
    console.log("in beefpack");

    db_connect
        .collection("scores")
        .find({})
        .toArray()
        .then((data) => {
            response.json(data);
        });
  
});

// This section will help you delete a record
gameRoutes.route("/:id").delete(async (req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: new ObjectId(req.params.id) };
  
    db_connect
        .collection("scores")
        .deleteOne(myquery)
        .then((obj, err) => {
            if (err) throw err;
            console.log("1 document deleted");
            response.json(obj);
        });
});

module.exports = gameRoutes;