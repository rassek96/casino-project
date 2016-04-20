var textContent = document.querySelector("#textContent");
var hitBtn = document.querySelector("#hitBtn");
var stayBtn = document.querySelector("#stayBtn");
var playerCardBox = document.querySelector("#playerCardBox");
var playerScore = document.querySelector("#playerScore");
var buttonsDiv = document.querySelector("#buttons");
var startGameDiv = document.querySelector("#startGame");
var startBtn = document.querySelector("#startBtn");
var aceButtons = document.querySelector("#aceButtons");

var total;
var dealerTotal;
var deck = getDeck();
var shuffledDeck;
var cardCount;
var gamesPlayed = 0;

startBtn.addEventListener("click", startTheGame);

function startTheGame() {
  startBtn.removeEventListener("click", startTheGame);
  startGameDiv.style.display = "none";
  buttonsDiv.style.display = "inline";
  buttonsDiv.querySelector("#btn").style.display = "inline";
  cardCount = 0;
  total = 0;
  gamesPlayed += 1;
  shuffledDeck = shuffleDeck(deck);
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

  if(cardCount !== 0 || gamesPlayed > 1) {
    var cardImg = playerCardBox.querySelector("img");
    playerCardBox.removeChild(cardImg);
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
  buttonsDiv.querySelector("#btn").style.display = "none";
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

function checkWin() {
  if(total === 21) {
    hitBtn.removeEventListener("click", hit);
    startGameDiv.style.display = "inline";
    startGameDiv.querySelector("p").textContent = "Winner";
    buttonsDiv.style.display = "none";
    buttonsDiv.querySelector("#btn").style.display = "none";
    startBtn.addEventListener("click", startTheGame);
    return;
  } else if(total > 21) {
    hitBtn.removeEventListener("click", hit);
    startGameDiv.style.display = "inline";
    startGameDiv.querySelector("p").textContent = "Busted";
    buttonsDiv.style.display = "none";
    buttonsDiv.querySelector("#btn").style.display = "none";
    startBtn.addEventListener("click", startTheGame);
    return;
  }
}
