"use strict";

var router  = require("express").Router();
var session = require("express-session");

router.route("/games/slotmachine")
    .get(function(request, response) {
        if(request.session.username) {
            response.render("slotmachine", {data: request.session.chips});
        }
        else {
            response.redirect("/");
        }
    });

module.exports = router;
