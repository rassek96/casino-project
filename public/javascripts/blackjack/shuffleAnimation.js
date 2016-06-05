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
