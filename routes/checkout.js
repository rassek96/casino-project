"use strict";

var router  = require("express").Router();
var session = require("express-session");
var Highscore = require("../config/db/Highscore");

router.route("/checkout")
    .post(function(request, response) {
        if(request.body.csrfToken === request.session.csrfToken) {
          if(request.body.nameText.length < 3 || request.body.nameText.length > 20 || isValid(request.body.nameText) === false) {
            response.redirect("/");
          } else {
            var highscore = new Highscore({
              username: request.body.nameText,
              score: request.session.chips
            });
            highscore.save(function(error) {
              if(error) {
                return;
              }
              request.session.destroy();
              response.redirect("/");
            });
          }
        } else {
          response.status(403);
          response.send("Error 403 - Forbidden");
        }
    });

module.exports = router;

function isValid(string) {
  return /^\w+$/.test(string);
}
