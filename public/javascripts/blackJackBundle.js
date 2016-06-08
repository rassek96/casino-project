(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var socket = io();
var dealerHit = require("./blackjack/dealer");
var checkWinjs = require("./blackjack/checkWin");
var shuffleDeck = require("./blackjack/shuffleDeck");
var shuffleAnimation = require("./blackjack/shuffleAnimation");
var dealCard = require("./blackjack/dealCard");

var textContent = document.querySelector("#textContent");
var hitBtn = document.querySelector("#hitBtn");
var stayBtn = document.querySelector("#stayBtn");
var doubleDownBtn = document.querySelector("#doubleDownBtn");
var surrenderBtn = document.querySelector("#surrenderBtn");
var splitBtn = document.querySelector("#splitBtn");
var splitCardBox = document.querySelector("#splitCardBox");
var splitScore = document.querySelector("#splitScore");
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
var splitValue;
var shuffledDeck;
var cardCount;
var gamesPlayed = 0;
var playerChips;
var bet;
var aceCheck;
var splitCheck = false;
var cardImg;
var cardValue;
startBtn.addEventListener("click", startTheGame);
var dealSound = new Audio("../sounds/blackjack_deal.mp3");
var staySound = new Audio("../sounds/blackjack_select.mp3");

function startTheGame() {
  staySound.play();
  startBtn.removeEventListener("click", startTheGame);
  removeBtnEventListeners();
  startGameDiv.style.display = "none";
  buttonsDiv.style.display = "inline";
  buttonsDiv.querySelector("#btn").style.display = "inline";
  doubleDownBtn.style.visibility = "visible";
  surrenderBtn.style.visibility = "visible";
  splitCardBox.style.visibility = "hidden";
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
  splitCheck = false;
  splitValue = 0;
  shuffledDeck = shuffleDeck();
  shuffleAnimation();
  setTimeout(function() {
    hit();
  }, 3200);
}

function hit() {
  splitBtn.style.visibility = "hidden";
  //doubleDownBtn.style.visibility = "hidden";
  if(cardCount > 1) {
    doubleDownBtn.style.visibility = "hidden";
    surrenderBtn.style.visibility = "hidden";
    var hitSound = new Audio("../sounds/blackjack_hit.mp3");
    hitSound.play();
  }
  var card = shuffledDeck[cardCount];
  //Add cardvalue to total sum
  cardValue = card.replace(/\D/g,"");
  cardValue = parseInt(cardValue);
  //Jack, Queen, and King all worth 10
  if(cardValue === 11 || cardValue === 12 || cardValue === 13) {
    cardValue = 10;
  }
  //Check if card was ace
  if(aceCheck === true) {
    if(cardCount === 1 && cardValue > 6) {
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

  removeBtnEventListeners();
  dealCard(card, cardImg, cardCount, splitCheck, total, aceCheck, function() {
    checkWin();
    addBtnEventListeners();
  });

  //Check if cards dealt were pairs (possible to split)
  if(cardCount === 1 && cardValue === (total-cardValue) || (cardCount === 1 && total === 12 && aceCheck === true)) {
    splitBtn.style.visibility = "visible";
    if(cardValue === 0 || cardValue === 11) {
      cardValue = 11;
    }
    splitValue = cardValue;
  }

  dealSound.play();
  cardCount += 1;
  if(cardCount === 1) {
    setTimeout(function() {
      hit();
      addBtnEventListeners();
    }, 1000);
  }
}

function split() {
  splitCheck = true;
  removeBtnEventListeners();
  dealSound.play();
  splitBtn.style.visibility = "hidden";
  splitCardBox.style.visibility = "visible";
  total = cardValue;
  playerScore.textContent = total;
  playerChips -= bet;
  playerChipsDiv.textContent = playerChips;
  socket.emit("changeChips", {chips: playerChips});
  move(document.getElementsByClassName("cardImg")[1])
    .add("left", Math.floor(Math.random()* (-147-(-149)) + (-149)))
    .rotate(Math.floor(Math.random()* ((181-179)+1) + 179))
    .end(function() {
      document.querySelector("#splitScore").textContent = cardValue
    });

  setTimeout(function() {
    hit();
    addBtnEventListeners();
  }, 1000);
}

function stay() {
  staySound.play();
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
  dealerHit.dealerHit(shuffledDeck, cardCount, total, playerChips, bet, splitCheck, function(splitDealer, newCardCount) {
    cardCount = newCardCount;
    if(splitDealer === true) {
      removeBtnEventListeners();
      splitCheck = false;
      total = splitValue;
      setTimeout(function() {
        hit();
        buttonsDiv.style.display = "inline";
        buttonsDiv.querySelector("#btn").style.display = "inline";
        addBtnEventListeners();
      }, 1000);
    }
  });
}

function doubleDown() {
  staySound.play();
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
  staySound.play();
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
    if(cardCount === 2) {
      playerChips += (Math.floor(bet*2.5));
      startGameDiv.querySelector("p").textContent = "Winner - Blackjack!";
    } else {
      playerChips += (bet * 2);
      startGameDiv.querySelector("p").textContent = "Winner";
    }
    playerChipsDiv.textContent = playerChips;
    socket.emit("changeChips", {chips: playerChips});
    if(splitCheck === true) {
      removeBtnEventListeners();
      splitCheck = false;
      total = splitValue;
      setTimeout(function() {
        hit();
        addBtnEventListeners();
      }, 1000);
    } else {
      resetGame();
    }
  } else if(checkWinjs(total) === false){
    startGameDiv.querySelector("p").textContent = "Busted";
    if(splitCheck === true) {
      removeBtnEventListeners();
      splitCheck = false;
      total = splitValue;
      setTimeout(function() {
        hit();
        addBtnEventListeners();
      }, 1000);
    } else {
      resetGame();
    }
  }
}

function addBtnEventListeners() {
  hitBtn.addEventListener("click", hit);
  stayBtn.addEventListener("click", stay);
  doubleDownBtn.addEventListener("click", doubleDown);
  surrenderBtn.addEventListener("click", surrender);
  splitBtn.addEventListener("click", split);
}
function removeBtnEventListeners() {
  hitBtn.removeEventListener("click", hit);
  stayBtn.removeEventListener("click", stay);
  doubleDownBtn.removeEventListener("click", doubleDown);
  surrenderBtn.removeEventListener("click", surrender);
  splitBtn.removeEventListener("click", split);
}
// browserify ./public/javascripts/blackJack.js > ./public/javascripts/blackJackBundle.js

},{"./blackjack/checkWin":2,"./blackjack/dealCard":3,"./blackjack/dealer":4,"./blackjack/shuffleAnimation":5,"./blackjack/shuffleDeck":6}],2:[function(require,module,exports){
"use strict";

module.exports = function(total) {
  if(total === 21) {
    return true;
  } else if(total > 21) {
    return false;
  }
}

},{}],3:[function(require,module,exports){
var playerCardBox = document.querySelector("#playerCardBox");
var playerScore = document.querySelector("#playerScore");
var splitScore = document.querySelector("#splitScore");

module.exports = function(card, cardImg, cardCount, split, total, aceCheck, callback) {
  cardImg = document.createElement("img");
  cardImg.setAttribute("src", "/images/carddeck/" + card + ".png");
  cardImg.setAttribute("class", "cardImg");
  document.querySelector("#dealerDeckBox").appendChild(cardImg);
  var pixels = playerCardBox.offsetTop;
  var moveCard = document.querySelectorAll(".cardImg");
  if(split === false) {
    move(moveCard[cardCount])
      .add("top", (pixels-Math.floor(Math.random()* ((38-34)+1) + 34)))
      .add("left", Math.floor(Math.random()* ((0-4)+1) + 4))
      .rotate(Math.floor(Math.random()* ((182-178)+1) + 178))
      .end(function() {
        if(aceCheck === true && cardCount != 0) {
          playerScore.textContent = total + " (" + (total+1) + "/" + (total+11) + ")";
        } else {
          playerScore.textContent = total;
        }
        callback();
      });
  } else {
    move(moveCard[cardCount])
      .add("top", (pixels-Math.floor(Math.random()* ((38-34)+1) + 34)))
      .add("left", Math.floor(Math.random()* (-147-(-149)) + (-149)))
      .rotate(Math.floor(Math.random()* ((182-178)+1) + 178))
      .end(function() {
        if(aceCheck === true && cardCount != 0) {
          splitScore.textContent = total + " (" + (total+1) + "/" + (total+11) + ")";
        } else {
          splitScore.textContent = total;
        }
        callback();
      });
  }
}

},{}],4:[function(require,module,exports){
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

    var dealSound = new Audio("../sounds/blackjack_deal.mp3");
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

    } else if(total >= playerTotal) {
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

},{}],5:[function(require,module,exports){
var deckCardImg = document.querySelectorAll(".deckCard");
var shuffleSound = new Audio("../sounds/blackjack_shuffle.mp3");

module.exports = function() {
  setTimeout(function() {
    shuffleSound.play();
  }, 200);
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

},{}],6:[function(require,module,exports){
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
