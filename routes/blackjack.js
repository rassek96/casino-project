"use strict";

var router  = require("express").Router();

router.route("/games/blackjack")
    .get(function(request, response) {
      response.render("blackjack");
      /*
        if(request.session.username) {

        }
        else {
            response.redirect("/");
        }*/
    });

module.exports = router;
