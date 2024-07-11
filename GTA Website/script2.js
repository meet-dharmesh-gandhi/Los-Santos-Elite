let colors = ["red","gold","crimson","yellow","white","orange"];
let index = 0;

function colorChange() {
    let colorsIndex = Math.floor(Math.random() * colors.length);
    var color = colors[colorsIndex];
    document.querySelector(".welcome").style.color = color;
}

setInterval(() => {
    colorChange();
},1000);

let emailLogin = document.querySelector(".signEmail");
emailLogin.addEventListener("click", () => {
    window.location.href = "http://127.0.0.1:5500/email.html";
})