"use strict";

var router  = require("express").Router();

router.route("/")
    .get(function(request, response) {
        response.render("home");
    });

module.exports = router;
