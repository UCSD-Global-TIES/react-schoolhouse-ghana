const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 3001;
// Track the number of connections to the server
let connections = 0;
let users = 0;

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
  http.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
  });
}

startServer();

// BINDING LISTENER FUNCTIONS
// On connection of a user
io.on('connection', function (client) {
  // The socket is attached to the user that 
  console.log(`A device has connected to the server: ${++connections} connection(s)`);

  // Emit on the channel 'chat message' the payload msg
  client.on('authentication', function (msg) {
    console.log(msg);
    console.log(`A user has logged in: ${++users} user(s)`);

  })

  client.on('disconnect', function () {
    console.log(`A user has disconnected from the server: ${--connections} connection(s)`);
  });


});
