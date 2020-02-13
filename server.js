const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({
  extended: true
}));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'secretpassword',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

// middleware function to check for logged-in users
// var sessionChecker = (req, res, next) => {
//   if (req.session.user && req.cookies.user_sid) {
//     // If user logged in...
//     // res.redirect('/dashboard');

//   } else {
//     next();
//   }
// };

// Set session user cookie (in login)
// req.session.user = user.dataValues;

// Clear session cookie (in logout)
// res.clearCookie('user_sid');

// https: //www.codementor.io/@mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/schoolhouse-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const startServer = () => {
  // Start the API server
  app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
  });
}

startServer();
