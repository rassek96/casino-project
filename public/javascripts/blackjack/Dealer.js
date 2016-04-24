"use strict";

var dealerCardBox = document.querySelector("#dealerCardBox");
var dealerScore = document.querySelector("#dealerScore");
var hitBtn = document.querySelector("#hitBtn");
var stayBtn = document.querySelector("#stayBtn");
var buttonsDiv = document.querySelector("#buttons");
var startGameDiv = document.querySelector("#startGame");
var startBtn = document.querySelector("#startBtn");

function Dealer(shuffledDeck, cardCount, playerTotal) {
  this.shuffledDeck = shuffledDeck;
  this.cardCount = cardCount;
  this.playerTotal = playerTotal;
  this.total = 0;
};

Dealer.prototype.hit = function() {
  var shuffledDeck = this.shuffledDeck;
  var cardCount = this.cardCount;
  var playerTotal = this.playerTotal;
  var total = this.total;
  var hitInterval = setInterval(function() {
    var card = shuffledDeck[cardCount];
    //Add cardvalue to total sum
    var cardValue = card.replace(/\D/g,"");
    cardValue = parseInt(cardValue);
    if(cardValue === 11 || cardValue === 12 || cardValue === 13) {
      cardValue = 10;
    }
    if(total !== 0) {
      var cardImg = dealerCardBox.querySelector("img");
      dealerCardBox.removeChild(cardImg);
    }
    total += cardValue;
    dealerScore.textContent = total;
    cardImg = document.createElement("img");
    cardImg.setAttribute("src", "/images/carddeck/" + card + ".png");
    dealerCardBox.appendChild(cardImg);
    if (total > 21) {
      clearInterval(hitInterval);
      stay();
      startGameDiv.querySelector("p").textContent = "Winner";

    } else if(total > playerTotal) {
      clearInterval(hitInterval);
      stay();
      startGameDiv.querySelector("p").textContent = "Loser";
    }
    cardCount += 1;
  }, 1000);
};

function stay() {
  startGameDiv.style.display = "inline";
  buttonsDiv.style.display = "none";
  buttonsDiv.querySelector("#btn").style.display = "none";
}

module.exports = Dealer;
