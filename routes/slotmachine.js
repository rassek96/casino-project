"use strict";

var router  = require("express").Router();
var session = require("express-session");

router.route("/games/slotmachine")
    .get(function(request, response) {
        response.render("slotmachine", {data: request.session.chips});
    });

module.exports = router;
