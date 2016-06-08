"use strict";

var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  score: {
    type: Number
  }
});

var user = mongoose.model("User", userSchema, "User");

module.exports = user;
