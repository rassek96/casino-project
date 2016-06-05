"use strict";

var mongoose = require("mongoose");

var highscoreSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  score: {
    type: Number
  }
});

var highscore = mongoose.model("Highscore", highscoreSchema, "Highscore");

module.exports = highscore;
