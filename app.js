"use strict";

var express  = require("./config/express");
var mongoose = require("./config/mongoose");
var socket   = require("./config/socket");

express();
mongoose();
socket();
