"use strict";

var chai = require("chai");
var expect = chai.expect;

var shuffleDeck = require("../public/javascripts/blackjack/shuffleDeck");
var checkWin = require("../public/javascripts/blackjack/checkWin");

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
