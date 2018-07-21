var hero = document.querySelector(".hero"),
    heading = hero.querySelector("h1"),
    canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");

canvas.width = hero.clientWidth;
canvas.height = hero.clientHeight;

setTimeout(function () {
  ctx.fillStyle = "rgba(0, 0, 0, .8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "80px Lemon";
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillText(heading.innerText, canvas.width / 4, canvas.height / 2);

  hero.appendChild(canvas);

  hero.className = "hero ready";
}, 1000);