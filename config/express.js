"use strict";

var express    = require("express");
var exphbs     = require("express-handlebars");
var bodyParser = require("body-parser");
var expressSession    = require("express-session");
var sharedSession = require("express-socket.io-session");

var randomString = require("./randomString");

module.exports = function () {
  // Server configurations
  var app = express();
  var port = process.env.PORT || 8000;

  app.engine("hbs", exphbs({
    defaultLayout: "index",
    extname: "hbs"
  }));

  // session config
  var session = expressSession({
    name: "serverSession",
    secret: "LrzLptKvFnMFvoJxyLDIoGJEHKwoEtwK1uwILx",
    resave: true,
    saveUninitialized: true
  });
  app.use(session);

  app.set("view engine", "hbs");

  app.use(function(request, response, next) {
    if(request.session.chips === undefined) {
      request.session.chips = 50;
    }
    next();
  });
  app.use(function(request, response, next) {
    response.locals.chips = request.session.chips;
    next();
  });

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(function(request, response, next) {
    if (!request.session.csrfToken) {
        var string = randomString.randomString(38);
        request.session.csrfToken = string;
    }
    response.locals.csrfToken = request.session.csrfToken;
    next();
});

  var server = app.listen(port, function() {
    console.log("Express server started on http://localhost:" + port);
  });

  //Websocket
  var socket = require("../config/socket");
  var io = require("socket.io")(server);
  io.use(sharedSession(session, {
    autoSave: true
  }));
  socket(io);

  app.use("/", require("../routes/home.js"));
  app.use("/", require("../routes/slotmachine.js"));
  app.use("/", require("../routes/blackjack.js"));
  app.use("/", require("../routes/checkout.js"));

  //app.use(express.static("public"));

  app.use(function(request, response) {
    response.status(404);
    response.redirect("/");
  });

  app.use(function(error, request, response, next) {
    response.status(500).send("Error 500 - Internal Error");
  });
};
