"use strict";

var lever = document.querySelector("#leverBall");
var slots = document.querySelectorAll(".slot");

lever.addEventListener("click", function() {
    for (var i = 0; i < 3; i+= 1) {
        var img = document.createElement("img");
        var number = getRandomNumber();
        img.setAttribute("class", "slotIcon");
        img.setAttribute("value", number);
        img.setAttribute("src", "/images/SlotIcons/" + number + ".jpg");
        slots[i].textContent = "";
        slots[i].appendChild(img);
    }

    var values = [
        slots[0].querySelector("img"),
        slots[1].querySelector("img"),
        slots[2].querySelector("img"),
    ];
    console.log(values[0].getAttribute("value"));
    console.log(values[1].getAttribute("value"));
    console.log(values[2].getAttribute("value"));
    if (values[0].getAttribute("value") === values[1].getAttribute("value") && values[0].getAttribute("value") === values[2].getAttribute("value")) {
        alert("winner");
    }
});

function getRandomNumber() {
    var randomNumber = Math.floor(Math.random() * 5);
    return randomNumber;
}