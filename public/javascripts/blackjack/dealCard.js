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
