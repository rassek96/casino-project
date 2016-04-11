"use strict";

var lever = document.querySelector("#leverBall");
var slots = document.querySelectorAll(".slot");
var lever2 = document.querySelector("#lever2");
var score = 0;
var chips = document.querySelector("#scoreChips").querySelector("span").innerText;
var marginTopAttr = [-160, -360, -560, -760, -960, -1160];
var slotReel = document.querySelectorAll(".slotReel");

lever.addEventListener("mousedown", rollSlots);
function rollSlots() {
    lever.removeEventListener("mousedown", rollSlots);
    chips -= 1;
    document.querySelector("#scoreChips").querySelector("span").textContent = chips.toString();
    reelAnimation(0, getRandomNumber());

    setTimeout(function() {
        reelAnimation(1, getRandomNumber());
    }, 500);

    setTimeout(function() {
        reelAnimation(2, getRandomNumber());
    }, 1000);

    leverAnimation();
}

function reelAnimation(i, numberStop) {
    var pos = -160;
    var spins = 0;
    console.log(pos);
    slotReel[i].style.webkitFilter = "blur(1px)";
    var slotInterval = setInterval(function() {
        //Stop after 16 "rolls"
        if (pos === marginTopAttr[numberStop] && spins > 3) {
            clearInterval(slotInterval);
            slotReel[i].style.webkitFilter = "blur(0px)";
            slotReel[i].setAttribute("value", numberStop);
            if (i === 2) {
                checkWin();
            }
            lever.addEventListener("mousedown", rollSlots);
        } else {
            if (pos === -1220) {
                slotReel[i].style.marginTop = -160 + "px";
                pos = -0;
                spins += 1;
            }
            pos -= 10;
            slotReel[i].style.marginTop = pos + "px";
        }
    }, 10);
}

function checkWin() {
    // Check if 3 in a row. Odds are around 1/30.
    var values = [slotReel[0].getAttribute("value"), slotReel[1].getAttribute("value"), slotReel[2].getAttribute("value")];
    if (values[0] === values[1] && values[0] === values[2]) {
        if (values[0] === "0") {
            console.log("winner Big Win");
            score += 10000;
        } else if (values[0] === "1") {
            console.log("winner Cherrys");
            score += 2000;
        } else if (values[0] === "2") {
            console.log("winner Bars");
            score += 5000;
        } else if (values[0] === "3") {
            console.log("winner Seven");
            score += 700;
        } else if (values[0] === "4") {
            console.log("winner Orange");
            score += 200;
        } else if (values[0] === "5") {
            console.log("winner Watermelon");
            score += 200;
        }
        document.querySelector("#scoreScore").querySelector("span").textContent = score.toString();
    }
}

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

function getRandomNumber() {
    return Math.floor(Math.random() * 5);
}