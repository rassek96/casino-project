"use strict";

var router  = require("express").Router();

router.route("/games/slotmachine")
    .get(function(request, response) {
        response.render("slotmachine");
    });

module.exports = router;
