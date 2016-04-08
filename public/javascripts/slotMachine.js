"use strict";

var lever = document.querySelector("#leverBall");
var slots = document.querySelectorAll(".slot");
var lever2 = document.querySelector("#lever2");
var score = 0;
var chips = document.querySelector("#scoreChips").querySelector("span").innerText;
lever.addEventListener("mousedown", rollSlots);
function rollSlots() {
    lever.removeEventListener("mousedown", rollSlots);
    chips -= 1;
    document.querySelector("#scoreChips").querySelector("span").textContent = chips.toString();
    var i2 = 0;
    leverAnimation();
    var slotInterval = setInterval(function() {
        for (var i = 0; i < 3; i += 1) {
            var img = document.createElement("img");
            var number = getRandomNumber();
            img.setAttribute("class", "slotIcon");
            img.setAttribute("value", number);
            img.setAttribute("src", "/images/SlotIcons/" + number + ".jpg");
            slots[i].textContent = "";
            slots[i].appendChild(img);
        }
        //Stop after 20 "rolls"
        if (i2 === 20) {
            clearInterval(slotInterval);
            checkWin();
            lever.addEventListener("mousedown", rollSlots);
        }
        i2 += 1;
    }, 200);

    function checkWin() {
        // Check if 3 in a row. Odds are around 1/30.
        var values = [
            slots[0].querySelector("img").getAttribute("value"),
            slots[1].querySelector("img").getAttribute("value"),
            slots[2].querySelector("img").getAttribute("value")
        ];
        if (values[0] === values[1] && values[0] === values[2]) {
            if (values[0] === "0") {
                console.log("winner Watermelon");
                score += 50;
            }
            if (values[0] === "1") {
                console.log("winner Cherrys");
                score += 200;
            }
            if (values[0] === "2") {
                console.log("winner Bars");
                score += 500;
            }
            if (values[0] === "3") {
                console.log("winner Seven");
                score += 100;
            }
            if (values[0] === "4") {
                console.log("winner Orange");
                score += 25;
            }
            document.querySelector("#scoreScore").querySelector("span").textContent = score.toString();


        }
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