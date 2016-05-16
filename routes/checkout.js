"use strict";

var router  = require("express").Router();
var session = require("express-session");
var Highscore = require("../config/db/Highscore");

router.route("/checkout")
    .post(function(request, response) {
        if(request.body.csrfToken === request.session.csrfToken) {
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
        } else {
          response.status(403);
          response.send("Error 403 - Forbidden");
        }
    });

module.exports = router;
