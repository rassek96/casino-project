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
var dealSound = new Audio("../sounds/blackjack_deal.wav");

function startTheGame() {
  var staySound = new Audio("../sounds/blackjack_select.wav");
  staySound.play();
  startBtn.removeEventListener("click", startTheGame);
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
    var hitSound = new Audio("../sounds/blackjack_hit.wav");
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
  if(aceCheck === true && total === cardValue) {
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

  removeBtnEventListeners();
  dealCard(card, cardImg, cardCount, splitCheck, total, function() {
    checkWin();
    addBtnEventListeners();
  });

  //Check if cards dealt were pairs (possible to split)
  if(cardCount === 1 && cardValue === (total-cardValue)) {
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
  var staySound = new Audio("../sounds/blackjack_select.wav");
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
  var staySound = new Audio("../sounds/blackjack_select.wav");
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
  var staySound = new Audio("../sounds/blackjack_select.wav");
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
