const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require("mongoose");
const siofu = require("socketio-file-upload")
const routes = require("./routes");
const config = require("./nasConfig");

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
require("./socket")(io);
const PORT = process.env.PORT || 3001;
// Track the number of connections to the server
let connections = 0;
let users = 0;

// Define middleware here
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Use socketio-file-upload
app.use(siofu.router)

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
} else {
  // Set up location of NAS storage path
  app.use('/static', express.static(config.path));

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

// LINUX ONLY (POTENTIAL TO CONNECT TO LINUX SERVER)
// https://www.clamav.net/documents/installing-clamav-on-windows
// const NodeClam = require('clamscan');

// const scanFile = async function (path) {
//   try {
//     // Get instance by resolving ClamScan promise object
//     const clamscan = await new NodeClam().init();
//     const { is_infected, file, viruses } = await clamscan.is_infected("/client/public");


//   } catch (err) {
//     // Handle any errors raised by the code in the try block
//     console.log(err)
//   }
// }

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

  client.on('documents-changed', function (type) {
    io.emit(`refresh-${type}`)
  })

  // File Upload with Socket.io
  const uploader = new siofu()
  uploader.dir = config.path;
  uploader.listen(client);

  // Do something when a file starts saving:
  uploader.on("start", function (event) {
    const { name, mtime, size, bytesLoaded, success, pathName } = event.file;
    console.log(name, "has started downloading!");
  });

  // Do something when a file is saved:
  uploader.on("progress", function (event) {
    var percent = (event.file.bytesLoaded / event.file.size) * 100;
    console.log(event.file.name, "is", percent.toFixed(2), "% loaded");
  });

  // Do something when a file is saved:
  uploader.on("saved", function (event) {
    const { name, mtime, size, bytesLoaded, success, pathName } = event.file;
    console.log(name, mtime, size, bytesLoaded, success, pathName)


  });

  // Error handler:
  uploader.on("error", function (event) {
    console.log("Error from uploader", event);
  });


});
