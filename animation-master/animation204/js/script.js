const block = document.querySelector('.block');
const coin = document.querySelector('.coin');
const oneup = document.querySelector('.oneup');
const audio = document.querySelector('audio#coin');
const scoreBoard = document.querySelector('.score');
let score = 0;

function playSound() {
  if (!audio) return;
  audio.currentTime = 0;
  audio.play();
  coin.classList.add('active');
  block.classList.add('bounce');
}

function removeBounce(e) {
  if(e.animationName !== 'blockbounce') return;
  this.classList.remove('bounce');
}

function removeActive(e) {
  if(e.animationName !== 'coinmove') return;
  this.classList.remove('active');
}

function removeOneUpActive(e) {
  if(e.animationName !== 'oneupmove') return;
  this.classList.remove('oneup-active');
}

function hit(e) {
  if(!e.isTrusted) return;
  score++;
  scoreBoard.textContent = score;
}

function playSoundOneUp() {
  if(score == 100) {
    const audioOneUp = document.querySelector('audio#oneup');
    audio.pause();
    audioOneUp.currentTime = 0;
    audioOneUp.play();
    coin.classList.remove('active');
    block.classList.add('bounce');
    oneup.classList.add('oneup-active');
    score = 0;
    scoreBoard.textContent = 0;
  }
}

block.addEventListener('webkitAnimationEnd', removeBounce);
block.addEventListener('animationend', removeBounce);

coin.addEventListener('webkitAnimationEnd', removeActive);
coin.addEventListener('animationend', removeActive);
oneup.addEventListener('webkitAnimationEnd', removeOneUpActive);
oneup.addEventListener('animationend', removeOneUpActive);

block.addEventListener('click', hit);
block.addEventListener('click', playSound);
block.addEventListener('click', playSoundOneUp);