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
  }, 6500);
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

  var cardImg = document.createElement("img");
  cardImg.setAttribute("src", "/images/carddeck/" + card + ".png");
  cardImg.setAttribute("class", "cardImg");
  document.querySelector("#dealerDeckBox").appendChild(cardImg);
  var pixels = playerCardBox.offsetTop;
  var moveCard = document.querySelectorAll(".cardImg");
  move(moveCard[cardCount])
    .add("top", (pixels-36))
    .add("left", 2)
    .rotate(180)
    .end();

  if(aceCheck === true) {
    if(cardCount === 1) {

    } else if((total + 11) < 11 && (total + 11) > 7) {
      total += 11;
    } else {
      total += 1;
    }
  }
  if(cardValue === 1) {
    aceCheck = true;
    cardValue = 0;
  } else {
    aceCheck = false;
  }

  total += cardValue;
  playerScore.textContent = total;
  checkWin();
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
