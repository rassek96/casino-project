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
