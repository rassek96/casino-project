"use strict";

var router  = require("express").Router();

router.route("/games/blackjack")
    .get(function(request, response) {
        if(request.session.username) {
            response.render("blackjack");
        }
        else {
            response.redirect("/");
        }
    });

module.exports = router;