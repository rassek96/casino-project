"use strict";

var router  = require("express").Router();

router.route("/games/yahtzee")
    .get(function(request, response) {
        response.render("yahtzee");
    });

module.exports = router;
