const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const formidable = require("express-formidable");
const ejs = require("ejs");
const path = require("path");
const cookieParser = require('cookie-parser')

const Session = require('./utils/session.util');

const app = express();

// if want to print console logs to file
// require('./utils/logger.util');

// if want to host the app on cpanel
// uncomment the line below and remove the module alias setup from the package.json file
// require('./utils/cpanel.util');

// app config
app.use("/media", express.static("public"));
app.use(cors({
  origin: "http://localhost:5173",
  // origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
}));
app.use(formidable({ multiples: true }));


// view config
app.engine(".html", ejs.renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

//Setup Sessions
app.use(Session);
// cookie parser
app.use(cookieParser());

// error handling
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: false,
    message: "Internal Server ERROR!"
  });
});


const server = http.createServer(app);

const io = new Server(server, {
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

module.exports = {
  server,
  io,
  app,
  express,
};
