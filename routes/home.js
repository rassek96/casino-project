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
        if(request.body.csrfToken === request.session.csrfToken) {
          request.session.username = request.body.nameText;
          request.session.chips = 50;
          response.redirect("/home");
        } else {
          response.status(403);
          response.send("Error 403 - Forbidden");
        }
    });

module.exports = router;
