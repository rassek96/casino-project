"use strict";

function Player(shuffledDeck, cardCount, playerTotal) {
  this.shuffledDeck = shuffledDeck;
  this.cardCount = cardCount;
  this.playerTotal = playerTotal;
};

Player.prototype.hit = function() {

};

Player.prototype.stay = function() {

};

module.exports = Player;
