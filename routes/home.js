"use strict";

var router  = require("express").Router();
var session = require("express-session");
var Highscore = require("../config/db/Highscore");

var htmlEscape = require("../public/javascripts/htmlEscape");

router.route("/")
    .get(function(request, response) {
      Highscore.find(function(error, highscores) {
        if(error) {
          return;
        }
        var data = [];
        //TODO htmlescape
        for (var i = 0; i < highscores.length; i += 1) {
          if(highscores[i]) {
            var escapedUsername = htmlEscape.htmlEscape(highscores[i].username);
            data.push({id: i, username: escapedUsername, score: highscores[i].score});
          }
        }
        data = sortByKey(data, "score");
        var highscoreData = [];
        for (var i = 0; i < 5; i += 1) {

          if(data[i]) {
            data[i].id = i+1;
            highscoreData[i] = data[i];
          }
        }
        response.render("home", {data: highscoreData});
      });
    });

function sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}

module.exports = router;
