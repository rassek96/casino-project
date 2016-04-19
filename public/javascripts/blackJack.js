var textContent = document.querySelector("#textContent");
var hitBtn = document.querySelector("#hitBtn");
var playerCardBox = document.querySelector("#playerCardBox");
var playerScore = document.querySelector("#playerScore");
var buttonsDiv = document.querySelector("#buttons");
var startGameDiv = document.querySelector("#startGame");
var startBtn = document.querySelector("#startBtn");

var total;
var deck = getDeck();
var shuffledDeck;
var cardCount;
var gamesPlayed = 0;

startBtn.addEventListener("click", startTheGame);

function startTheGame() {
  startBtn.removeEventListener("click", startTheGame);
  startGameDiv.style.display = "none";
  buttonsDiv.style.visibility = "visible";
  cardCount = 0;
  total = 0;
  gamesPlayed += 1;
  shuffledDeck = shuffleDeck(deck);
  hit();
  hitBtn.addEventListener("click", hit);
}

function hit() {
  var card = shuffledDeck[cardCount];

  var cardValue = card.replace(/\D/g,"");
  total += parseInt(cardValue);
  playerScore.textContent = total;

  if(cardCount !== 0 || gamesPlayed > 1) {
    var cardImg = playerCardBox.querySelector("img");
    playerCardBox.removeChild(cardImg);
  }
  cardImg = document.createElement("img");
  cardImg.setAttribute("src", "/images/carddeck/" + card + ".png");
  playerCardBox.appendChild(cardImg);

  cardCount += 1;

  if(total === 21) {
    alert("winner");
    hitBtn.removeEventListener("click", hit);
    startGameDiv.style.display = "inline";
    buttonsDiv.style.visibility = "hidden";
    startBtn.addEventListener("click", startTheGame);
    return;
  } else if(total > 21) {
    alert("busted");
    hitBtn.removeEventListener("click", hit);
    startGameDiv.style.display = "inline";
    buttonsDiv.style.visibility = "hidden";
    startBtn.addEventListener("click", startTheGame);
    return;
  }
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

function shuffleDeck(deck) {
  var shuffleDeck = deck;
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
