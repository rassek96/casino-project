"use strict";

var express    = require("express");
var exphbs     = require("express-handlebars");
var bodyParser = require("body-parser");

// Server configurations
var app = express();
var port = process.env.PORT || 8000;

app.engine("hbs", exphbs({
  defaultLayout: "index",
  extname: "hbs"
}));

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/", require("./routes/home.js"));
app.use("/", require("./routes/slotmachine.js"));
app.use("/", require("./routes/blackjack.js"));

app.use(express.static("public"));

app.use(function(request, response) {
  response.status(404);
  response.send("Sorry, page doesn't exist");
});

app.use(function(error, request, response, next) {
  response.status(500).send("Error 500 - Internal Error");
});

app.listen(port, function() {
  console.log("Express server started on http://localhost:" + port);
});

