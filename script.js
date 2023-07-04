const mainMenu = document.querySelector("#main-menu");
const gameMenu = document.querySelector("#game-menu");
const playBtn = document.querySelector("#play-btn");
const socialMediaBtns = document.querySelector("#social-menu");
playBtn.onclick = play;

function play() {
    mainMenu.style.display = "none";
    socialMediaBtns.style.display = "none";
    gameMenu.style.display = "block";
}