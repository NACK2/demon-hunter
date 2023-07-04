const mainMenu = document.querySelector("#main-menu");
const playBtn = document.querySelector("#play-btn");
const socialMediaBtns = document.querySelector("#social-menu");
playBtn.onclick = socialMedia;

function socialMedia() {
    mainMenu.style.display = "none";
    socialMediaBtns.style.display = "none";
}