"use strict";

var socket = io();

var wheel = document.querySelector("#wheel");
var btn = document.querySelector("#spinWheelBtn");
var selectBet = document.querySelector("#wheelSelectBet");
var selectColour = document.querySelector("#wheelSelectColour");
var wheelChips = document.querySelector("#wheelChips span");
var startWheelGameDiv = document.querySelector("#startWheelGame");
var wheelVisible = document.querySelector("#wheelVisible");
var betAndColour = document.querySelector("#betAndColour");

var playerChips;
var colourBet;
var bet;
var colourWin;

btn.addEventListener("click", spin);
function spin() {
    btn.removeEventListener("click", spin);
    wheelVisible.style.visibility = "hidden";
    betAndColour.style.display = "block";
    betFoo();
    betAndColour.innerText = bet + " chips bet on " + colourBet;
    colourWin = Math.floor(Math.random()* ((8-1) +1) + 1);
    var rotationDegrees = getRotationDegrees(colourWin);
    move(wheel)
        .rotate(0)
        .duration("0s")
        .end(function() {
            move(wheel)
                .rotate(rotationDegrees)
                .duration("12s")
                .end(function() {
                    var win = checkWin();
                    if(win === true) {
                        playerChips += (bet*2);
                        socket.emit("changeChips", {chips: playerChips});
                        wheelChips.textContent = playerChips;
                        betAndColour.innerText = "You Win!";
                    } else {
                        betAndColour.innerText = "You lose!";
                    }
                    wheelVisible.style.visibility = "visible";
                    btn.addEventListener("click", spin);
                });
        });
}

function getRotationDegrees(colorWin) {
    if(colorWin === 1) {
        return Math.floor(Math.random()* ((5062-5018) +1) + 5018);
    } else if(colorWin === 2) {
        return Math.floor(Math.random()* ((5106-5063) +1) + 5063);
    } else if(colorWin === 3) {
        return Math.floor(Math.random()* ((5251-5108) +1) + 5108);
    } else if(colorWin === 4) {
        return Math.floor(Math.random()* ((5197-5153) +1) + 5153);
    } else if(colorWin === 5) {
        return Math.floor(Math.random()* ((5242-5199) +1) + 5199);
    } else if(colorWin === 6) {
        return Math.floor(Math.random()* ((5287-5244) +1) + 5244);
    } else if(colorWin === 7) {
        return Math.floor(Math.random()* ((5332-5289) +1) + 5289);
    } else if(colorWin === 8) {
        return Math.floor(Math.random()* ((5376-5333) +1) + 5333);
    }
}

function checkWin() {
    if(colourBet === "yellow") {
        if(colourWin === 1 || colourWin === 5) {
            return true;
        } else {
            return false;
        }
    } else if(colourBet === "blue") {
        if(colourWin === 2 || colourWin === 6) {
            return true;
        } else {
            return false;
        }
    } else if(colourBet === "red") {
        if(colourWin === 3 || colourWin === 7) {
            return true;
        } else {
            return false;
        }
    } else if(colourBet === "green") {
        if(colourWin === 4 || colourWin === 8) {
            return true;
        } else {
            return false;
        }
    }
}

function betFoo() {
    playerChips = wheelChips.innerText;
    var betOption = selectBet.options[selectBet.selectedIndex].value;
    colourBet = selectColour.options[selectColour.selectedIndex].value;
    if(Number(betOption) >= Number(playerChips)) {
        bet = Number(playerChips);
    } else {
        bet = Number(betOption);
    }
    playerChips -= Number(bet);
    socket.emit("changeChips", {chips: playerChips});
    wheelChips.textContent = playerChips;
}

//First 5018 - 5062
//Second 5063 - 5106
//Third 5108 - 5151
//Fourth 5153 - 5197
//Fifth 5199 - 5242
//Sixth 5244 - 5287
//Seventh 5289 - 5332
//Eighth 5333 - 5376



//Math.floor(Math.random()* ((6000-4000)+1) + 4000)