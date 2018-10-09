var h1 = document.querySelector("h1");

h1.addEventListener("input", function() {
  this.setAttribute("data-text", this.innerText);
});