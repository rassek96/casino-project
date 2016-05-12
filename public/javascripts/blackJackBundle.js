(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var socket = io();
var Dealer = require("./blackjack/Dealer");
var checkWinjs = require("./blackjack/checkWin");
var shuffleDeck = require("./blackjack/shuffleDeck");

var textContent = document.querySelector("#textContent");
var hitBtn = document.querySelector("#hitBtn");
var stayBtn = document.querySelector("#stayBtn");
var doubleDownBtn = document.querySelector("#doubleDownBtn");
var surrenderBtn = document.querySelector("#surrenderBtn");
var playerCardBox = document.querySelector("#playerCardBox");
var dealerCardBox = document.querySelector("#dealerCardBox");
var dealerDeckBox = document.querySelector("#dealerDeckBox");
var playerScore = document.querySelector("#playerScore");
var buttonsDiv = document.querySelector("#buttons");
var startGameDiv = document.querySelector("#startGame");
var startBtn = document.querySelector("#startBtn");
var aceButtons = document.querySelector("#aceButtons");
var betSelect = startGameDiv.querySelector("select");
var playerChipsDiv = document.querySelector("#playerChips span");

var total;
var shuffledDeck;
var cardCount;
var gamesPlayed = 0;
var playerChips;
var bet;
var aceCheck;
startBtn.addEventListener("click", startTheGame);

function startTheGame() {
  startBtn.removeEventListener("click", startTheGame);
  startGameDiv.style.display = "none";
  buttonsDiv.style.display = "inline";
  buttonsDiv.querySelector("#btn").style.display = "inline";
  doubleDownBtn.style.visibility = "visible";
  document.querySelector("#dealerScore").textContent = 0;

  if(dealerCardBox.querySelector("img") !== null) {
    dealerCardBox.removeChild(dealerCardBox.querySelector("img"));
  }
  if(dealerDeckBox.querySelector(".cardImg") !== null) {
    while(dealerDeckBox.querySelectorAll(".cardImg").length > 0) {
      dealerDeckBox.removeChild(dealerDeckBox.querySelectorAll(".cardImg")[0]);
    }
  }

  betFoo();
  playerChipsDiv.textContent = playerChips;
  playerScore.textContent = 0;
  socket.emit("changeChips", {chips: playerChips});
  cardCount = 0;
  total = 0;
  gamesPlayed += 1;
  aceCheck = false;
  shuffledDeck = shuffleDeck();
  setTimeout(function() {
    hit();
  }, 3200);
}

function hit() {
  if(cardCount > 1) {
    doubleDownBtn.style.visibility = "hidden";
  }
  var card = shuffledDeck[cardCount];
  //Add cardvalue to total sum
  var cardValue = card.replace(/\D/g,"");
  cardValue = parseInt(cardValue);
  if(cardValue === 11 || cardValue === 12 || cardValue === 13) {
    cardValue = 10;
  }

  if(aceCheck === true) {
    if(cardCount === 1) {
      total += 11;
    } else if((total + 11) < 11 && (total + 11) > 7) {
      total += 11;
    } else {
      total += 1;
    }
  }
  if(cardValue === 1) {
    if(total + 11 === 21) {
      cardValue = 11;
    } else {
      aceCheck = true;
      cardValue = 0;
    }
  } else {
    aceCheck = false;
  }
  total += cardValue;

  var cardImg = document.createElement("img");
  cardImg.setAttribute("src", "/images/carddeck/" + card + ".png");
  cardImg.setAttribute("class", "cardImg");
  document.querySelector("#dealerDeckBox").appendChild(cardImg);
  var pixels = playerCardBox.offsetTop;
  var moveCard = document.querySelectorAll(".cardImg");
  move(moveCard[cardCount])
    .add("top", (pixels-Math.floor(Math.random()* ((38-34)+1) + 34)))
    .add("left", Math.floor(Math.random()* ((0-4)+1) + 4))
    .rotate(Math.floor(Math.random()* ((182-178)+1) + 178))
    .end(function() {
      playerScore.textContent = total;
      checkWin();
    });

  cardCount += 1;
  if(cardCount === 1) {
    setTimeout(function() {
      hit();
      addBtnEventListeners();
    }, 1000);
  }
}

function stay() {
  removeBtnEventListeners();
  if(aceCheck === true) {
    if((total + 11) < 22) {
      total += 11;
    } else {
      total += 1;
    }
    playerScore.textContent = total;
  }
  buttonsDiv.style.display = "none";
  buttonsDiv.querySelector("#btn").style.display = "none";
  startBtn.addEventListener("click", startTheGame);
  var dealer = new Dealer(shuffledDeck, cardCount, total, playerChips, bet);
  dealer.hit();
}

function doubleDown() {
  if((bet*2) < playerChips) {
    removeBtnEventListeners();
    playerChips -= bet;
    bet = bet*2;
    playerChipsDiv.textContent = playerChips;
    socket.emit("changeChips", {chips: playerChips});
    hit();
    if(total < 21) {
      stay();
    }
  }
}

function surrender() {
  playerChips += Math.floor(bet/2);
  playerChipsDiv.textContent = playerChips;
  socket.emit("changeChips", {chips: playerChips});
  resetGame();
  startGameDiv.querySelector("p").textContent = "Surrendered";
}

function resetGame () {
  removeBtnEventListeners();
  startGameDiv.style.display = "inline";
  buttonsDiv.style.display = "none";
  buttonsDiv.querySelector("#btn").style.display = "none";
  startBtn.addEventListener("click", startTheGame);
}

function betFoo() {
  playerChips = playerChipsDiv.innerText;
  var betOption = betSelect.options[betSelect.selectedIndex].value;
  if(betOption === "All" || Number(betOption) >= Number(playerChips)) {
    bet = Number(playerChips);
  } else {
    bet = Number(betOption);
  }
  playerChips -= Number(bet);
}

function checkWin() {
  if(checkWinjs(total) === true) {
    playerChips += (bet * 2);
    playerChipsDiv.textContent = playerChips;
    socket.emit("changeChips", {chips: playerChips});
    resetGame();
    startGameDiv.querySelector("p").textContent = "Winner";
  } else if(checkWinjs(total) === false){
    resetGame();
    startGameDiv.querySelector("p").textContent = "Busted";
  }
}

function addBtnEventListeners() {
  hitBtn.addEventListener("click", hit);
  stayBtn.addEventListener("click", stay);
  doubleDownBtn.addEventListener("click", doubleDown);
  surrenderBtn.addEventListener("click", surrender);
}
function removeBtnEventListeners() {
  hitBtn.removeEventListener("click", hit);
  stayBtn.removeEventListener("click", stay);
  doubleDownBtn.removeEventListener("click", doubleDown);
  surrenderBtn.removeEventListener("click", surrender);
}
// browserify ./public/javascripts/blackJack.js > ./public/javascripts/blackJackBundle.js

},{"./blackjack/Dealer":2,"./blackjack/checkWin":3,"./blackjack/shuffleDeck":4}],2:[function(require,module,exports){
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


    cardCount += 1;

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
  move(deckCardImg[0]).y(150).end(function() {
    move(deckCardImg[0]).y(0).set("z-index", Math.floor(Math.random()*7) + 1).delay("0.6s").end();
  });
  move(deckCardImg[1]).y(150).delay("0.2s").end(function() {
    move(deckCardImg[1]).y(0).set("z-index", Math.floor(Math.random()*7) + 1).delay("0.6s").end();
  });
  move(deckCardImg[2]).y(150).delay("0.4s").end(function() {
    move(deckCardImg[2]).y(0).set("z-index", Math.floor(Math.random()*7) + 1).delay("0.6s").end();
  });
  move(deckCardImg[3]).y(150).delay("0.6s").end(function() {
    move(deckCardImg[3]).y(0).set("z-index", Math.floor(Math.random()*7) + 1).delay("0.6s").end();
  });
  move(deckCardImg[4]).y(150).delay("0.8s").end(function() {
    move(deckCardImg[4]).y(0).set("z-index", Math.floor(Math.random()*7) + 1).delay("0.6s").end();
  });
  move(deckCardImg[5]).y(150).delay("1s").end(function() {
    move(deckCardImg[5]).y(0).set("z-index", Math.floor(Math.random()*7) + 1).delay("0.6s").end();
  });
  move(deckCardImg[6]).y(150).delay("1.2s").end(function() {
    move(deckCardImg[6]).y(0).set("z-index", Math.floor(Math.random()*7) + 1).delay("0.6s").end();
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

},{}]},{},[1]);
