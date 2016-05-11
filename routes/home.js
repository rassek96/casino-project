"use strict";

var router  = require("express").Router();
var session = require("express-session");
var Highscore = require("../config/db/Highscore");

router.route("/")
    .get(function(request, response) {
        response.render("firstPage");
    });

router.route("/home")
    .get(function(request, response) {
      Highscore.find(function(error, highscores) {
        if(error) {
          return;
        }
        var data = [];
        //TODO htmlescape
        for (var i = 0; i < 5; i += 1) {
          data.push({id: i, username: highscores[i].username, score: highscores[i].score});
        }
        data = sortByKey(data, "score");
        for (var i = 0; i < 5; i += 1) {
          data[i].id = i+1;
        }
        response.render("home", {data: data});
      });
        /*if(request.session.username) {

        }
        else {
            response.redirect("/");
        }*/
    })
    .post(function(request, response) {
        if(request.body.csrfToken === request.session.csrfToken) {
          request.session.username = request.body.nameText;
          request.session.chips = 50;
          response.redirect("/home");
        } else {
          response.status(403);
          response.send("Error 403 - Forbidden");
        }
    });

function sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}

module.exports = router;
