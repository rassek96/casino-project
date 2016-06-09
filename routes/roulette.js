"use strict";

var router  = require("express").Router();

router.route("/games/roulette")
    .get(function(request, response) {
        response.render("roulette");
    });

module.exports = router;
