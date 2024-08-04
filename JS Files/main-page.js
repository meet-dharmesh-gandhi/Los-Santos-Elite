import { getUserDetails, setUserDetails } from "../JS Files/utility-functions.js";
import { revealElements, revealNavbar, toggleMusic } from "../JS Files/main-page-functions.js";

const userProfilePicture = document.querySelector("#userProfilePicture");
let userDetails = await getUserDetails();
setUserDetails(userDetails, false, "#userProfilePicture", false, document);

let scrollPos = 0;

window.addEventListener("scroll", revealElements);

window.addEventListener("scroll", () => { scrollPos = revealNavbar(scrollPos) });

let state = "on";

let speaker = document.querySelector(".volume");
speaker.addEventListener("click", () => { state = toggleMusic(state, speaker) });

let image = document.querySelector("#slide5");
image.addEventListener("click", () => {
  let info = document.querySelector(".text2");
  info.style.display = "none";
});

const propertiesButton = document.querySelector("#properties-button");
propertiesButton.addEventListener("click", () => {
  window.location.href = "../HTML Files/ls-real-estate.html";
});

let superCars = document.querySelector(".superCars");
superCars.addEventListener("click", () => {
  window.location.href = "../HTML Files/ls-super-cars.html";
});

let sellButton = document.querySelector(".sell-button");
sellButton.addEventListener("click", () => {
  window.location.href = "../HTML Files/sell-page.html";
});