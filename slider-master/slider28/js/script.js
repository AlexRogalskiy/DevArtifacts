let current = 1;
let remove = 3;
let svg = document.querySelector("svg");
let images = document.querySelectorAll(".image");
let clips = document.querySelectorAll(".clipPath");

function progress() {
  let nextNode = svg.removeChild(images[current]);
  svg.appendChild(nextNode);
  setTimeout(() => {
    images[remove].classList.remove("shown");
    clips[remove].classList.remove("scale");
    images[current].classList.add("shown");
    clips[current].classList.add("scale");
    remove = (remove + 1) % images.length;
    current = (current + 1) % images.length;
  });
}

function schedule() {
  progress();
  setTimeout(schedule, 4000);
}
setTimeout(schedule, 500);
