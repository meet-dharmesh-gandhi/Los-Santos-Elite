export function revealElements() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 10;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

export function revealNavbar(scrollPos) {
    var landingPageHeight = document.getElementById("landingpage").offsetHeight;
    var navbar = document.querySelector(".navbar");
    if (window.pageYOffset >= landingPageHeight && (document.body.getBoundingClientRect()).top > scrollPos) {
        navbar.style.visibility = "visible";
    } else {
        navbar.style.visibility = "hidden";
    }
    scrollPos = (document.body.getBoundingClientRect()).top;
    return scrollPos;
}

export function toggleMusic(state, speaker) {
    if (state == "on") {
        speaker.className = "fa-solid fa-volume-xmark volume";
        let backgroundAudio = document.querySelector("#backgroundAudio");
        backgroundAudio.pause();
        state = "off";
    } else if (state == "off") {
        speaker.className = "fa-solid fa-volume-high volume";
        let backgroundAudio = document.querySelector("#backgroundAudio");
        backgroundAudio.play();
        state = "on";
    }
    return state;
};