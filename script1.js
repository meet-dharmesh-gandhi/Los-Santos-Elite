function reveal() {
    var reveals = document.querySelectorAll(".reveal");
  
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 10;
  
    if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
    } else {
        reveals[i].classList.remove("active");
    }
}
}  
window.addEventListener("scroll", reveal);

function revealNavbar() {
    var landingPageHeight = document.getElementById('landingpage').offsetHeight;
    var navbar = document.querySelector(".navbar");
    var box2 = document.getElementById('box2');
    if (window.pageYOffset >= landingPageHeight) {
        navbar.style.visibility = "visible";
    } else {
        navbar.style.visibility = "hidden";
        box2.style.display = "none";
    }
}

window.addEventListener("scroll", revealNavbar);

let state = "on";
let volumeOnOff = () => {
    let speaker = document.querySelector(".volume");
    if(state == "on") {
        speaker.className = "fa-solid fa-volume-xmark volume";
        let backgroundAudio = document.querySelector("#backgroundAudio");
        backgroundAudio.pause();
        console.log("Audio paused");
        state = "off"
    }
    else if (state == "off") {
        speaker.className = "fa-solid fa-volume-high volume"
        let backgroundAudio = document.querySelector("#backgroundAudio");
        backgroundAudio.play();
        console.log("Audio played");
        state = "on";
    }
}

let speaker = document.querySelector(".volume");
speaker.addEventListener("click",volumeOnOff);

function toggleBox2() {
    var box1 = document.getElementById('box1');
    var box2 = document.getElementById('box2');
    var box1Rect = box1.getBoundingClientRect();

    box2.style.left = (box1Rect.left - 120 + window.scrollX) + 'px';

    box2.classList.toggle('visible');

    var landingPageHeight = document.getElementById('landingpage').offsetHeight;
    var navbar = document.querySelector(".navbar");
    if (window.pageYOffset >= landingPageHeight && box2.style.display != "block") {
        box2.style.display = "block";
    } else {
        box2.style.display = "none";
    }
}

let image = document.querySelector("#slide5");
image.addEventListener("click",() => {
    let info = document.querySelector(".text2");
    info.style.display = "none";
});

let button2 = document.querySelector(".getStarted");
button2.addEventListener("click",() => {
    window.location.href = "http://127.0.0.1:5500/email.html";
})