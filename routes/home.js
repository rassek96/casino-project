"use strict";

var router  = require("express").Router();
var session = require("express-session");

router.route("/")
    .get(function(request, response) {
        response.render("firstPage");
    });

router.route("/home")
    .get(function(request, response) {
        if(request.session.username) {
            response.render("home");
        }
        else {
            response.redirect("/");
        }
    })
    .post(function(request, response) {
        request.session.username = request.body.nameText;
        request.session.chips = 20;
        response.redirect("/home");
    });

module.exports = router;
