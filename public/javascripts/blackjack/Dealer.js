"use strict";

var socket = io();
var dealerCardBox = document.querySelector("#dealerCardBox");
var dealerScore = document.querySelector("#dealerScore");
var hitBtn = document.querySelector("#hitBtn");
var stayBtn = document.querySelector("#stayBtn");
var buttonsDiv = document.querySelector("#buttons");
var startGameDiv = document.querySelector("#startGame");
var startBtn = document.querySelector("#startBtn");

function Dealer(shuffledDeck, cardCount, playerTotal, playerChips, bet) {
  this.shuffledDeck = shuffledDeck;
  this.cardCount = cardCount;
  this.playerTotal = playerTotal;
  this.total = 0;
  this.playerChips = playerChips;
  this.bet = bet;
};

Dealer.prototype.hit = function() {
  var shuffledDeck = this.shuffledDeck;
  var cardCount = this.cardCount;
  var playerTotal = this.playerTotal;
  var total = this.total;
  var playerChips = this.playerChips;
  var bet = this.bet;
  var hitInterval = setInterval(function() {
    var card = shuffledDeck[cardCount];
    //Add cardvalue to total sum
    var cardValue = card.replace(/\D/g,"");
    cardValue = parseInt(cardValue);
    if(cardValue === 11 || cardValue === 12 || cardValue === 13) {
      cardValue = 10;
    }
    var cardImg = document.createElement("img");
    cardImg.setAttribute("src", "/images/carddeck/" + card + ".png");
    cardImg.setAttribute("class", "cardImg");
    document.querySelector("#dealerDeckBox").appendChild(cardImg);
    var pixels = dealerCardBox.offsetLeft;
    var moveCard = document.querySelectorAll(".cardImg");
    move(moveCard[cardCount])
      .add("left", -167)
      .add("top", 13)
      .rotate(180)
      .end();

    if(cardValue === 1) {
      if(total === 10 || !(total + 11 > 21) || ( !(total + 11 > 21) && (total + 11 > playerTotal)) ) {
        cardValue = 11;
      } else {
        cardValue = 1;
      }
    }
    total += cardValue;
    cardCount += 1;
    dealerScore.textContent = total;
    if (total > 21) {
      clearInterval(hitInterval);
      playerChips += (bet * 2);
      document.querySelector("#playerChips span").textContent = playerChips;
      socket.emit("changeChips", {chips: playerChips});
      stay();
      startGameDiv.querySelector("p").textContent = "Winner";

    } else if(total > playerTotal) {
      clearInterval(hitInterval);
      stay();
      startGameDiv.querySelector("p").textContent = "Loser";
    }
  }, 1000);
};

function stay() {
  startGameDiv.style.display = "inline";
  buttonsDiv.style.display = "none";
  buttonsDiv.querySelector("#btn").style.display = "none";
}

module.exports = Dealer;
