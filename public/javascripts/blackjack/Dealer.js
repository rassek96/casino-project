"use strict";

var socket = io();
var dealerCardBox = document.querySelector("#dealerCardBox");
var dealerScore = document.querySelector("#dealerScore");
var hitBtn = document.querySelector("#hitBtn");
var stayBtn = document.querySelector("#stayBtn");
var buttonsDiv = document.querySelector("#buttons");
var startGameDiv = document.querySelector("#startGame");
var startBtn = document.querySelector("#startBtn");

function dealerHit(shuffledDeck, cardCount, playerTotal, playerChips, bet, splitCheck, callback) {

  var shuffledDeck = shuffledDeck;
  var cardCount = cardCount;
  var playerTotal = playerTotal;
  var total = 0;
  var playerChips = playerChips;
  var bet = bet;
  var splitCheck = splitCheck;
  var hitInterval = setInterval(function() {
    var card = shuffledDeck[cardCount];
    //Add cardvalue to total sum
    var cardValue = card.replace(/\D/g,"");
    cardValue = parseInt(cardValue);
    if(cardValue === 11 || cardValue === 12 || cardValue === 13) {
      cardValue = 10;
    }
    if(cardValue === 1) {
      if(total === 10 || !(total + 11 > 21) || ( !(total + 11 > 21) && (total + 11 > playerTotal)) ) {
        cardValue = 11;
      } else {
        cardValue = 1;
      }
    }

    total += cardValue;
    var cardImg = document.createElement("img");
    cardImg.setAttribute("src", "/images/carddeck/" + card + ".png");
    cardImg.setAttribute("class", "cardImg");
    document.querySelector("#dealerDeckBox").appendChild(cardImg);
    var pixels = dealerCardBox.offsetLeft;
    var moveCard = document.querySelectorAll(".cardImg");
    move(moveCard[cardCount])
      .add("left", Math.floor(Math.random()* (-165-(-169)) + (-169)))
      .add("top", Math.floor(Math.random()* ((11-15)+1) + 15))
      .rotate(Math.floor(Math.random()* ((182-178)+1) + 178))
      .end(function() {
        dealerScore.textContent = total;
      });

    var dealSound = new Audio("../sounds/blackjack_deal.wav");
    dealSound.play();
    cardCount += 1;

    if (total > 21) {
      clearInterval(hitInterval);
      if(splitCheck === true) {
        callback(true, cardCount);
      } else {
        stay();
        startGameDiv.querySelector("p").textContent = "Winner";
      }
      playerChips += (bet * 2);
      document.querySelector("#playerChips span").textContent = playerChips;
      socket.emit("changeChips", {chips: playerChips});

    } else if(total > playerTotal) {
      clearInterval(hitInterval);
      if(splitCheck === true) {
        callback(true, cardCount);
      } else {
        stay();
        startGameDiv.querySelector("p").textContent = "Loser";
      }
    }
  }, 1000);
};

function stay() {
  startGameDiv.style.display = "inline";
  buttonsDiv.style.display = "none";
  buttonsDiv.querySelector("#btn").style.display = "none";
}

module.exports.dealerHit = dealerHit;
