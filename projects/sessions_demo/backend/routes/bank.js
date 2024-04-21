const express = require("express");
const bankRoutes = express.Router();
const dbo = require("../db/conn");
//                    checking,    savings,     yield
const validAccounts = ['checking', 'savings', 'yield']; 

// directly coppied from auth.js
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

// logs a transaction, needs the user record, and a json object of the details to be logged
async function logTransaction(userRecord, transaction) {
  const db_connect = dbo.getDb();
  const query = { _id: userRecord._id }; // Find the user document by userId
  transaction.date = new Date();
  const defaults = {
    account: null,
    type: null,
    amount: null,
    description: null,
  };
  const standardizedTransaction = { ...defaults, ...transaction }; // unpack the transaction ontop of default values. this should make the history standardized

  const update = {
    $push: {
      history: standardizedTransaction, // append the transaction object
    },
  };

  try {
    const result = await db_connect
      .collection("users")
      .updateOne(query, update);
    if (result.matchedCount === 0) {
      console.log("No user matches the provided record.");
    } else if (result.modifiedCount === 1) {
      console.log("Transaction successfully logged.");
    }
  } catch (err) {
    console.error("Error logging transaction:", err);
  }
}

// gets the account information, Note from Joel use this
bankRoutes.get("/accounts", async (req, res) => {
  if (req.session.userName && req.session.passwordHash) {
    const userRecord = await get_user_by_hash(
      req.session.userName,
      req.session.passwordHash
    );

    if (!userRecord) {
      res.json({ message: "user not found" });
    }

    // user found
    res.json({
      accounts: validAccounts.map(accountName => ({
        name: accountName,
        balance: userRecord[accountName]
      })),
    });

  } else {
    console.log("not logged int");
    res.json({ message: "not logged in" });
  }
});

// returns the users entire history
bankRoutes.get("/history/:accountType", async (req, res) => {
  if (req.session.userName && req.session.passwordHash) {
    const userRecord = await get_user_by_hash(
      req.session.userName,
      req.session.passwordHash
    );

    if (!userRecord) {
      res.json({ message: "user not found" });
    }
        //Grab all user's logs (should be an array of json objects)
        var userLogs = userRecord.history;
        //userLogs = JSON.parse(userLogs);
        //userLogs = JSON.parse(userLogs);
        //var entries = Object.entries(userLogs);
        // change
        console.log(userLogs);
        console.log(req.params.accountType);
        let accountLogs = new Array();

        for (var item in userLogs) {
          if (userLogs.hasOwnProperty(item)){
            if (userLogs[item].account == req.params.accountType){
              accountLogs.push(userLogs[item]);
            }
          }
        }
        console.log(accountLogs);

    // user found
    res.json({
      history: accountLogs,
    });
  } else {
    console.log("not logged int");
    res.json({ message: "not logged in" });
  }
});

bankRoutes.get("/history", async (req, res) => {
  if (req.session.userName && req.session.passwordHash) {
    const userRecord = await get_user_by_hash(
      req.session.userName,
      req.session.passwordHash
    );

    if (!userRecord) {
      res.json({ message: "user not found" });
    }
        //Grab all user's logs (should be an array of json objects)
        const userLogs = userRecord.history;

    // user found
    res.json({
      history: userLogs,
    });
  } else {
    console.log("not logged int");
    res.json({ message: "not logged in" });
  }
});

// have not tested yet, but it is based on the get so it should be close, note from Joel use this 
bankRoutes.post("/deposit", async (req, res) => {
  if (req.session.userName && req.session.passwordHash) {
    
    // get user
    const userRecord = await get_user_by_hash(
      req.session.userName,
      req.session.passwordHash
    );

    // check if user exists
    if (!userRecord) {
      return res.json({ message: "user not found" });
    }

    const accountToUpdate = req.body.account; 
    const amount = parseFloat(req.body.amount);

    const update = { 
      $inc: {
        [accountToUpdate]: amount,
      },
    };

    const db_connect = dbo.getDb();
    const result = await db_connect.collection("users").updateOne({ _id: userRecord._id }, update);

    if (result.modifiedCount === 1) {
      console.log("The document was successfully updated.");
      const transactionRecord = {
        account: accountToUpdate,
        type: "deposit",
        amount: amount,
      };
      logTransaction(userRecord, transactionRecord);
    } else {
      res.json({ message: "Failed to update the account" });
    }
  } else {
    // unable to log in through session
    console.log("not logged int");
    res.json({ message: "not logged in" });
  }
});

bankRoutes.post("/withdraw", async (req, res) => {
  if (req.session.userName && req.session.passwordHash) {
    
    // get user
    const userRecord = await get_user_by_hash(
      req.session.userName,
      req.session.passwordHash
    );

    // check if user exists
    if (!userRecord) {
      return res.json({ message: "user not found" });
    }

    const accountToUpdate = req.body.account; 

    // Check if account is valid
    if (!validAccounts.includes(accountToUpdate)) {
      return res.json({ message: "not a valid account" }); // stop and return a response
    }

    const amount = parseFloat(req.body.amount);

    const update = {
      $inc: {
        [accountToUpdate]: -amount,
      },
    };

    const db_connect = dbo.getDb();
    const result = await db_connect.collection("users").updateOne({ _id: userRecord._id }, update);

    if (result.modifiedCount === 1) {
      console.log("The document was successfully updated.");
      const transactionRecord = {
        account: accountToUpdate,
        type: "withdraw",
        amount: amount,
      };
      logTransaction(userRecord, transactionRecord);
    } else {
      res.json({ message: "Failed to update the account" });
    }
  } else {
    // unable to log in through session
    console.log("not logged int");
    res.json({ message: "not logged in" });
  }
});


bankRoutes.post("/transfer", async (req, res) => {
  if (req.session.userName && req.session.passwordHash) {
    
    // get user
    const userRecord = await get_user_by_hash(
      req.session.userName,
      req.session.passwordHash
    );

    // check if user exists
    if (!userRecord) {
      return res.json({ message: "user not found" });
    }

    const fromAccount = req.body.from; 
    const toAccount = req.body.target; 

    // Check if account is valid
    if (!validAccounts.includes(fromAccount)) {
      return res.json({ message: "not a valid account" }); // stop and return a response
    }
    if (!validAccounts.includes(toAccount)) {
      return res.json({ message: "not a valid account" }); // stop and return a response
    }

    const amount = parseFloat(req.body.amount);

    const update = {
      $inc: {
        [fromAccount]: -amount,
        [toAccount]: amount,
      },
    };

    const db_connect = dbo.getDb();
    const result = await db_connect.collection("users").updateOne({ _id: userRecord._id }, update);

    if (result.modifiedCount === 1) {
      console.log("The document was successfully updated.");
      const transactionRecord = {
        fromAccount: fromAccount,
        toAccount: toAccount,
        type: "transfer",
        amount: amount,
      };
      logTransaction(userRecord, transactionRecord);
    } else {
      res.json({ message: "Failed to update the account" });
    }
  } else {
    // unable to log in through session
    console.log("not logged int");
    res.json({ message: "not logged in" });
  }
});


// helper function for josh. I use it to go to localhost5000/user, to see my changes in the browser.
bankRoutes.get("/user", async (req, res) => {
  if (req.session.userName && req.session.passwordHash) {
    const userRecord = await get_user_by_hash(
      req.session.userName,
      req.session.passwordHash
    );

    if (userRecord) {
      console.log("user found");
      res.json({ user: userRecord });
    } else {
      // User not found
      res.json({ message: "user not found" });
    }
  } else {
    console.log("not logged int");
    res.json({ message: "not logged in" });
  }
});



module.exports = bankRoutes;
