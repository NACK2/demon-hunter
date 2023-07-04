const mainMenu = document.querySelector("#main-menu");
const gameMenu = document.querySelector("#game-menu");
const playBtn = document.querySelector("#play-btn");
const socialMediaBtns = document.querySelector("#social-menu");
const quitBtn = document.querySelector("#quit-btn");

playBtn.onclick = play;
quitBtn.onclick = quit;

function play() {
    mainMenu.style.display = "none";
    socialMediaBtns.style.display = "none";
    gameMenu.style.display = "block";
    quitBtn.style.display = "block";
}

function quit() {
    mainMenu.style.display = "grid";
    socialMediaBtns.style.display = "block";
    gameMenu.style.display = "none";
    quitBtn.style.display = "none";
}