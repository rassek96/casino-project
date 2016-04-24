(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Dealer = require("./blackjack/Dealer");
var checkWinjs = require("./blackjack/checkWin");
var shuffleDeck = require("./blackjack/shuffleDeck");

var textContent = document.querySelector("#textContent");
var hitBtn = document.querySelector("#hitBtn");
var stayBtn = document.querySelector("#stayBtn");
var playerCardBox = document.querySelector("#playerCardBox");
var dealerCardBox = document.querySelector("#dealerCardBox");
var playerScore = document.querySelector("#playerScore");
var buttonsDiv = document.querySelector("#buttons");
var startGameDiv = document.querySelector("#startGame");
var startBtn = document.querySelector("#startBtn");
var aceButtons = document.querySelector("#aceButtons");

var total;
var shuffledDeck;
var cardCount;
var gamesPlayed = 0;

startBtn.addEventListener("click", startTheGame);

function startTheGame() {
  startBtn.removeEventListener("click", startTheGame);
  startGameDiv.style.display = "none";
  buttonsDiv.style.display = "inline";
  buttonsDiv.querySelector("#btn").style.display = "inline";
  document.querySelector("#dealerScore").textContent = 0;
  if(dealerCardBox.querySelector("img") !== null) {
    dealerCardBox.removeChild(dealerCardBox.querySelector("img"));
  }

  cardCount = 0;
  total = 0;
  gamesPlayed += 1;
  shuffledDeck = shuffleDeck();
  hit();
}

function hit() {
  var card = shuffledDeck[cardCount];
  //Add cardvalue to total sum
  var cardValue = card.replace(/\D/g,"");
  cardValue = parseInt(cardValue);
  if(cardValue === 11 || cardValue === 12 || cardValue === 13) {
    cardValue = 10;
  }

  if(playerCardBox.querySelector("img") !== null) {
    playerCardBox.removeChild(playerCardBox.querySelector("img"));
  }
  cardImg = document.createElement("img");
  cardImg.setAttribute("src", "/images/carddeck/" + card + ".png");
  playerCardBox.appendChild(cardImg);


  if(cardValue === 1) {
    if(cardCount === 0) {
      cardValue = 11;
      total += cardValue;
      playerScore.textContent = total;
      checkWin();
    } else {
      buttonsDiv.querySelector("#btn").style.display = "none";
      aceButtons.style.display = "inline";
      aceButtons.querySelector("#ace1Btn").addEventListener("click", aceWorth1);
      aceButtons.querySelector("#ace11Btn").addEventListener("click", aceWorth11);
    }
  } else {
    total += cardValue;
    playerScore.textContent = total;
    checkWin();
  }

  cardCount += 1;
  if(cardCount === 1) {
    setTimeout(function() {
      hit();
      hitBtn.addEventListener("click", hit);
      stayBtn.addEventListener("click", stay);
    }, 800);
  }
}

function stay() {
  hitBtn.removeEventListener("click", hit);
  stayBtn.removeEventListener("click", stay);
  buttonsDiv.style.display = "none";
  buttonsDiv.querySelector("#btn").style.display = "none";
  startBtn.addEventListener("click", startTheGame);
  var dealer = new Dealer(shuffledDeck, cardCount, total);
  dealer.hit();
}

function resetGame () {
  hitBtn.removeEventListener("click", hit);
  stayBtn.removeEventListener("click", stay);
  startGameDiv.style.display = "inline";
  buttonsDiv.style.display = "none";
  buttonsDiv.querySelector("#btn").style.display = "none";
  startBtn.addEventListener("click", startTheGame);
}

function checkWin() {
  if(checkWinjs(total) === true) {
    resetGame();
    startGameDiv.querySelector("p").textContent = "Winner";
  } else if(checkWinjs(total) === false){
    resetGame();
    startGameDiv.querySelector("p").textContent = "Busted";
  }
}

function aceWorth1() {
  aceButtons.querySelector("#ace1Btn").removeEventListener("click", aceWorth1);
  aceButtons.querySelector("#ace11Btn").removeEventListener("click", aceWorth11);
  cardValue = 1;
  total += cardValue;
  playerScore.textContent = total;
  buttonsDiv.querySelector("#btn").style.display = "inline";
  aceButtons.style.display = "none";
  checkWin();
}
function aceWorth11() {
  aceButtons.querySelector("#ace1Btn").removeEventListener("click", aceWorth1);
  aceButtons.querySelector("#ace11Btn").removeEventListener("click", aceWorth11);
  cardValue = 11;
  total += cardValue;
  playerScore.textContent = total;
  buttonsDiv.querySelector("#btn").style.display = "inline";
  aceButtons.style.display = "none";
  checkWin();
}

// browserify ./public/javascripts/blackJack.js > ./public/javascripts/blackJackBundle.js

},{"./blackjack/Dealer":2,"./blackjack/checkWin":3,"./blackjack/shuffleDeck":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

module.exports = function(total) {
  if(total === 21) {
    return true;
  } else if(total > 21) {
    return false;
  }
}

},{}],4:[function(require,module,exports){
"use strict";

module.exports = function () {
  var shuffleDeck = getDeck();
  var currentIndex = shuffleDeck.length;
  var temporaryValue;
  var randomIndex;

  while(currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = shuffleDeck[currentIndex];
    shuffleDeck[currentIndex] = shuffleDeck[randomIndex];
    shuffleDeck[randomIndex] = temporaryValue;
  }
  return shuffleDeck;
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

},{}]},{},[1]);
