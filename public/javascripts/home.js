var checkoutDiv = document.querySelector("#checkoutDiv");
var checkoutBox = document.querySelector("#checkoutBox");

var aboutBox = document.querySelector("#aboutBox");
var contactBox = document.querySelector("#contactBox");
var creditBox = document.querySelector("#creditBox");

var coverDiv = document.querySelector("#coverDiv");
var content = document.querySelector("#content");
var footer = document.querySelector("footer");
var header = document.querySelector(".linkHome");
var coverDivLink = document.getElementsByClassName("coverDivLink");
var nameText = checkoutBox.querySelector("#nameText");
var footerLink = footer.getElementsByTagName("p");

checkoutDiv.addEventListener("click", function() {
  cover();
  checkoutBox.style.display = "block";
  coverDivLink[1].addEventListener("click", coverHide);
  nameText.value = "";
  coverDivLink[0].style.backgroundColor = "gray";
  coverDivLink[0].style.pointerEvents = "none";
});

nameText.addEventListener("keyup", function() {
  if(nameText.value.length < 3 || nameText.value.length > 20 || isValid(nameText.value) === false) {
    coverDivLink[0].style.backgroundColor = "gray";
    coverDivLink[0].style.pointerEvents = "none";

  } else {
    coverDivLink[0].style.backgroundColor = "seagreen";
    coverDivLink[0].style.pointerEvents = "auto";
  }
});

function isValid(string) {
  return /^\w+$/.test(string);
}


footerLink[0].addEventListener("click", function() {
  cover();
  aboutBox.style.display = "block";
  coverDivLink[2].addEventListener("click", coverHide);
});
footerLink[1].addEventListener("click", function() {
  cover();
  contactBox.style.display = "block";
  coverDivLink[3].addEventListener("click", coverHide);
});
footerLink[2].addEventListener("click", function() {
  cover();
  creditBox.style.display = "block";
  coverDivLink[4].addEventListener("click", coverHide);
});

function coverHide() {
  document.getElementsByTagName("body")[0].style.overflow = "auto";
  content.style.opacity = 1;
  footer.style.opacity = 1;
  header.style.opacity = 1;
  coverDiv.style.display = "none";
  checkoutBox.style.display = "none";
  aboutBox.style.display = "none";
  contactBox.style.display = "none";
  creditBox.style.display = "none";
  footer.style.pointerEvents = "auto";
  coverDivLink[1].removeEventListener("click", coverHide);
}
function cover() {
  window.scrollTo(0, 0);
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
  content.style.opacity = 0.3;
  footer.style.opacity = 0.3;
  header.style.opacity = 0.3;
  coverDiv.style.display = "block";
  footer.style.pointerEvents = "none";
}
