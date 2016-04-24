"use strict";

var mongoose = require("mongoose");

module.exports = function() {
  var db = mongoose.connect("mongodb://localhost/test");

  db.connection.on("connected", function() {
    console.log("connected to database");
  });

  db.connection.on("error", function(error) {
    console.log(error);
  });

  db.connection.on("disconnected", function() {
    console.log("database disconnected");
  });

  process.on("SIGINT", function() {
    db.connection.close(function() {
      console.log("database disconnected due to session ending");
      process.exit(0);
    });
  });
  return db;
};
