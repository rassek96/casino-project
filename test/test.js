"use strict";

var chai = require("chai");
var chaiHttp = require("chai-http");
var supertest = require("supertest");
var expect = chai.expect;
var should = chai.should();

var checkWin = require("../public/javascripts/blackjack/checkWin");
var shuffleDeck = require("../public/javascripts/blackjack/shuffleDeck");
var express = require("../config/express")
var api = supertest("http://localhost:8000");
chai.use(chaiHttp);

describe("blackjack", function() {
  describe("shuffleDeck function", function() {
    it("should be an array", function() {
      expect(shuffleDeck()).to.be.a("array");
    });
    it("should contain certain cards", function() {
      expect(shuffleDeck()).to.include("1_of_diamonds");
      expect(shuffleDeck()).to.include("6_of_hearts");
      expect(shuffleDeck()).to.include("13_of_clubs");
      expect(shuffleDeck()).to.include("11_of_spades");
    });
    it("should be 52 long", function() {
      expect(shuffleDeck().length).to.equal(52);
    });
  });

  describe("checkWin function", function() {
    it("score of 21 should return true", function() {
      expect(checkWin(21)).to.be.true;
    });
    it("score of over 21 should return false", function() {
      expect(checkWin(22)).to.be.false;
    });
  });
});

describe("API", function() {
  describe("GET pages", function() {
    it("Home", function(done) {
      api.get("/")
      .expect(200)
      .end(function(error, response) {
        expect(response).to.have.status(200);
        expect(error).to.be.null;
        done();
      });
    });

    it("Slotmachine", function(done) {
      api.get("/games/slotmachine")
      .expect(200)
      .end(function(error, response) {
        expect(response).to.have.status(200);
        expect(error).to.be.null;
        done();
      });
    });

    it("Blackjack", function(done) {
      api.get("/games/blackjack")
      .expect(200)
      .end(function(error, response) {
        expect(response).to.have.status(200);
        expect(error).to.be.null;
        done();
      });
    });

    it("Invalid path redirect", function(done) {
      api.get("/invalidpath")
      .expect(404)
      .end(function(error, response) {
        expect(response).to.have.status(302);
        expect(response).to.redirect;
        done();
      });
    });
  });

  describe("POST page", function() {
    it("Checkout", function(done) {
      api.post("/checkout")
      .expect(403)
      .end(function(error, response) {
        expect(response).to.have.status(403);
        done();
      });
    })
  });
});
