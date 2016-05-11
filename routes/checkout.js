"use strict";

var router  = require("express").Router();
var session = require("express-session");
var Highscore = require("../config/db/Highscore");

router.route("/checkout")
    .get(function(request, response) {
        if(request.session.username) {
          var highscore = new Highscore({
            username: request.session.username,
            score: request.session.chips
          });
          highscore.save(function(error) {
            if(error) {
              console.log(error);
              return;
            }
            response.redirect("/");
          });
        }
        else {
          response.redirect("/");
        }
    });

module.exports = router;
