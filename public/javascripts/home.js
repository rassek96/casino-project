var checkoutDiv = document.querySelector("#checkoutDiv");
var checkoutBox = document.querySelector("#checkoutBox");
var coverDiv = document.querySelector("#coverDiv");
var content = document.querySelector("#content");
var footer = document.querySelector("footer");
var header = document.querySelector(".linkHome");
var coverDivLink = document.getElementsByClassName("coverDivLink");

checkoutDiv.addEventListener("click", function() {
  cover();
  coverDivLink[1].addEventListener("click", coverHide);
});
function coverHide() {
  content.style.opacity = 1;
  footer.style.opacity = 1;
  header.style.opacity = 1;
  coverDiv.style.display = "none";
  checkoutBox.style.display = "none";
  footer.style.pointerEvents = "auto";
  coverDivLink[1].removeEventListener("click", coverHide);
}
function cover() {
  content.style.opacity = 0.3;
  footer.style.opacity = 0.3;
  header.style.opacity = 0.3;
  coverDiv.style.display = "block";
  checkoutBox.style.display = "block";
  footer.style.pointerEvents = "none";
}
