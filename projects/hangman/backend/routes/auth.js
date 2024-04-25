const express = require("express");
const { sha256, sha224 } = require("js-sha256");
const authRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
module.exports = authRoutes;

// gets the user based off of usernam and password
async function get_user(username, password) {
  const db_connect = dbo.getDb();
  const userRecord = await db_connect
    .collection("users")
    .findOne({ userName: username });

  if (!userRecord) {
    return null;
  }

  // password correct
  if (sha256(password + userRecord.salt) === userRecord.passwordHash) {
    return userRecord;
  }

  return null;
}

// gets user based on username and hash. used when auto logging in with session
async function get_user_by_hash(username, hash) {
  const db_connect = dbo.getDb();
  const userRecord = await db_connect
    .collection("users")
    .findOne({ userName: username, passwordHash: hash });

  if (!userRecord) {
    return null;
  }

  return userRecord;
}

// Log user in with password and username
authRoutes.route("/auth").post(async function (req, res) {
  const password = req.body.password;
  const userName = req.body.userName;
  const userRecord = await get_user(userName, password);

  console.log("Got username and password " + userName + " " + password);

  if (userRecord) {
    console.log("user found by username and password");
    // console.log(userRecord);
    const user = userRecord.userName;
    const hash = userRecord.passwordHash;

    req.session.userName = user;
    req.session.passwordHash = hash;

    console.log("in /auth session id: ", req.sessionID);
    // console.log("user record: ", userRecord);
    console.log("req.session.userName: ", req.session.userName);
    console.log("req.session.passwordHash: ", req.session.passwordHash);
    console.log("Logged in");

    res.json({ msg: "correct", auth: 1 });
  } else {
    res.json({ msg: "credentials failed " + req.session.loginFailures });
  }
});

// create a new user
authRoutes.route("/register").post(async function (req, response) {
  const salt = Math.floor(Math.random() * 999999);

  const myobj = {
    passwordHash: sha256(req.body.password + salt),
    userName: req.body.userName,
    role: req.body.role,
    salt: salt,
    account1: 0.0,
    account2: 0.0,
    account3: 0.0,
  };

  let db_connect = dbo.getDb();
  const result = await db_connect.collection("users").insertOne(myobj);

  req.session.userName = myobj.userName;
  req.session.passwordHash = myobj.passwordHash;

  response.json(result);
  console.log("added record: ", myobj);
});

// check if user previously logged in
authRoutes.route("/prev").get(async function (req, res) {
  console.log("In /prev, session id: ", req.sessionID);

  if (req.session.userName) {
    console.log("session id: ", req.sessionID);
    console.log("userName: ", req.session.userName);
    console.log("passwordHash: ", req.session.passwordHash);

    const userRecord = await get_user_by_hash(
      req.session.userName,
      req.session.passwordHash
    );

    if (userRecord) {
      console.log("user found");
      res.json({ message: "logged in", auth: 1 });
    } else {
      // User not found
      res.json({ message: "user not found" });
    }
  } else {
    console.log("not logged int");
    // No valid session
    //res.status(200).send("not logged in");
    res.json({ message: "not logged in" });
  }
});

authRoutes.route("/personalData").get(async function (req, res) {
  try {
    const userRecord = await get_user_by_hash(
      req.session.userName,
      req.session.passwordHash
    );
    res.json({ userName: userRecord.userName, role: userRecord.role });
  } catch {
    res.status(401).send("not found");
  }
});

authRoutes.route("/logout").get(async function (req, res) {
  req.session.destroy();
  // console.log("/logout route");
  res.json(null);
});



module.exports = authRoutes;
