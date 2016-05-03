"use strict";

module.exports = function () {
  var shuffleDeck = getDeck();
  var currentIndex = shuffleDeck.length;
  var temporaryValue;
  var randomIndex;

  shuffleAnimation();

  while(currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = shuffleDeck[currentIndex];
    shuffleDeck[currentIndex] = shuffleDeck[randomIndex];
    shuffleDeck[randomIndex] = temporaryValue;
  }
  return shuffleDeck;
}
var deckCardImg = document.querySelectorAll(".deckCard");
var i = 0;
function shuffleAnimation() {
  move(deckCardImg[0]).y(150).end();
  move(deckCardImg[1]).y(150).end();
  move(deckCardImg[2]).y(150).end();
  move(deckCardImg[3]).y(150).end();
  move(deckCardImg[4]).y(150).end();
  move(deckCardImg[5]).y(150).end(function() {
    move(deckCardImg[0]).y(300).end();
    move(deckCardImg[1]).y(300).delay("0.3s").end();
    move(deckCardImg[2]).y(300).delay("0.6s").end();
    move(deckCardImg[3]).y(300).delay("0.9s").end();
    move(deckCardImg[4]).y(300).delay("1.2s").end();
    move(deckCardImg[5]).y(300).delay("1.5s").end();

    setTimeout(function() {
      move(deckCardImg[0]).y(150).end();
      move(deckCardImg[1]).y(150).delay("0.2s").end();
      move(deckCardImg[2]).y(150).delay("0.4s").end();
      move(deckCardImg[3]).y(150).delay("0.6s").end();
      move(deckCardImg[4]).y(150).delay("0.8s").end();
      move(deckCardImg[5]).y(150).delay("1s").end(function() {
        move(deckCardImg[0]).y(0).end();
        move(deckCardImg[1]).y(0).end();
        move(deckCardImg[2]).y(0).end();
        move(deckCardImg[3]).y(0).end();
        move(deckCardImg[4]).y(0).end();
        move(deckCardImg[5]).y(0).end();
      });
    }, 1501);
  });
}

function getDeck() {
  var emptyDeck = [];
  var suits = ["_of_spades", "_of_hearts", "_of_diamonds", "_of_clubs"];
  var counter = 0;
  for (var i = 0; i < 4; i += 1) {
    for (var i2 = 0; i2 < 13; i2 += 1, counter += 1) {
      emptyDeck[counter] = (i2 + 1) + suits[i];
    }
  }
  return emptyDeck;
}
