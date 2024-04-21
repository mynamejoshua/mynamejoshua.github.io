const express = require("express");
const session = require('express-session');  // new
const MongoStore = require('connect-mongo'); // new
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5001;
app.use(cors({origin: 'http://localhost:3000', credentials: true, }));

app.use(express.json());
// get driver connection
const dbo = require("./db/conn");

const uri = process.env.ATLAS_URI;

// Advanced usage
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  store: MongoStore.create({
    mongoUrl: uri
  })
}));

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
   });
  console.log(`Server is running on port: ${port}`);
});

app.use(require("./routes/auth"));
app.use(require("./routes/bank"));