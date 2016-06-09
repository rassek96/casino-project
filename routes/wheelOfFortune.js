"use strict";

var router  = require("express").Router();

router.route("/games/wheeloffortune")
    .get(function(request, response) {
        response.render("wheelOfFortune");
    });

module.exports = router;
