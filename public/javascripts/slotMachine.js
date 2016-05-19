"use strict";

var socket = io();
var spinBtn = document.querySelector("#spinBtn");
var slots = document.querySelectorAll(".slot");
var score = 0;
var chips = document.querySelector("#scoreChips").querySelector("span").innerText;
var marginTopAttr = [-160, -360, -560, -760, -960, -1160];
var slotReel = document.querySelectorAll(".slotReel");

spinBtn.addEventListener("click", rollSlots);
function rollSlots() {
  var spinSound = new Audio("../sounds/slotmachine_spin2.mp3");
  spinSound.play();
  if(chips > 0) {
    spinBtn.removeEventListener("click", rollSlots);
    spinBtn.style.backgroundColor = "#317134";
    chips -= 1;
    socket.emit("changeChips", {chips: chips});
    document.querySelector("#scoreChips").querySelector("span").textContent = chips.toString();
    reelAnimation(0, getRandomNumber());

    setTimeout(function() {
        reelAnimation(1, getRandomNumber());
    }, 500);

    setTimeout(function() {
        reelAnimation(2, getRandomNumber());
    }, 1000);
  } else {
    document.querySelector("#scoreChips").querySelector("span").textContent = "Out of chips";
  }
}

function reelAnimation(i, numberStop) {
    var pos = -160;
    var spins = 0;
    slotReel[i].style.webkitFilter = "blur(1px)";
    var slotInterval = setInterval(function() {
        //Stop reel
        if (pos === marginTopAttr[numberStop] && ((i === 0 && spins > 2) || (i === 1 && spins > 3) || (i === 2 && spins > 4))) {
            clearInterval(slotInterval);
            slotReel[i].style.webkitFilter = "blur(0px)";
            slotReel[i].setAttribute("value", numberStop);
            if (i === 2) {
                checkWin();
                setTimeout(function() {
                  spinBtn.addEventListener("click", rollSlots);
                  spinBtn.style.backgroundColor = "#3e8e41";
                }, 500);
            }
        } else {
            if (pos === -1220) {
                slotReel[i].style.marginTop = -160 + "px";
                pos = -0;
                spins += 1;
            }
            pos -= 20;
            slotReel[i].style.marginTop = pos + "px";
        }
    }, 16);
}

function checkWin() {
    // Check if 3 in a row. Odds are around 1/30.
    var values = [slotReel[0].getAttribute("value"), slotReel[1].getAttribute("value"), slotReel[2].getAttribute("value")];
    if (values[0] === values[1] && values[0] === values[2]) {
      var winSound = new Audio("../sounds/slotmachine_win.wav");
      winSound.play();
        if (values[0] === "0") {
          // 50
          chips += 100;
          score += 10000;
        } else if (values[0] === "1") {
          // 10
          chips += 20;
          score += 2000;
        } else if (values[0] === "2") {
          // 20
          chips += 50;
          score += 5000;
        } else if (values[0] === "3") {
          // 7
          chips += 7;
          score += 700;
        } else if (values[0] === "4") {
          // 5
          chips += 10;
          score += 200;
        } else if (values[0] === "5") {
          // 5
          chips += 5;
          score += 200;
        }
        socket.emit("changeChips", {chips: chips});
        document.querySelector("#scoreChips").querySelector("span").textContent = chips.toString();
        document.querySelector("#scoreScore").querySelector("span").textContent = score.toString();
    }
}

function getRandomNumber() {
    return Math.floor(Math.random() * 5);
}
