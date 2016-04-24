"use strict";

var spinBtn = document.querySelector("#spinBtn");
var slots = document.querySelectorAll(".slot");
var score = 0;
var chips = document.querySelector("#scoreChips").querySelector("span").innerText;
var marginTopAttr = [-160, -360, -560, -760, -960, -1160];
var slotReel = document.querySelectorAll(".slotReel");

spinBtn.addEventListener("click", rollSlots);
function rollSlots() {
    spinBtn.removeEventListener("click", rollSlots);
    spinBtn.style.backgroundColor = "#e6e600";
    chips -= 1;
    document.querySelector("#scoreChips").querySelector("span").textContent = chips.toString();
    reelAnimation(0, getRandomNumber());

    setTimeout(function() {
        reelAnimation(1, getRandomNumber());
    }, 500);

    setTimeout(function() {
        reelAnimation(2, getRandomNumber());
    }, 1000);
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
                spinBtn.style.backgroundColor = "white";
                setTimeout(function() {
                  spinBtn.addEventListener("click", rollSlots);
                }, 1000);
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
        if (values[0] === "0") {
            score += 10000;
        } else if (values[0] === "1") {
            score += 2000;
        } else if (values[0] === "2") {
            score += 5000;
        } else if (values[0] === "3") {
            score += 700;
        } else if (values[0] === "4") {
            score += 200;
        } else if (values[0] === "5") {
            score += 200;
        }
        document.querySelector("#scoreScore").querySelector("span").textContent = score.toString();
    }
}

/* Scrapped lever animation code
function leverAnimation() {
    var leverInterval = setInterval(function() {
        lever.style.top = (lever.offsetTop + 5 + "px");
        lever2.style.height = (lever2.offsetHeight - 5 + "px");
        lever2.style.top = (lever2.offsetTop + 5 + "px");
        if (lever.offsetTop > 220) {
            clearInterval(leverInterval);
            lever.style.top = 100 + "px";
            lever2.style.height = 260 + "px";
            lever2.style.top = 140 + "px";
        }
    }, 20);
}
*/

function getRandomNumber() {
    return Math.floor(Math.random() * 5);
}
