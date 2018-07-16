const spinner = "|/-\\";

let spinnerDiv = document.getElementById("spinner");
let verb = document.getElementById("verb");
let mapToRegistry = document.getElementById("mapToRegistry");
let uri = document.getElementById("uri");

// spinner
setInterval(function() {
  let random = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
  spinnerDiv.innerHTML = spinner.charAt(random);
}, 100);

verb.innerHTML = "verb";
mapToRegistry.innerHTML = "mapToRegistry";

// texts
setInterval(function() {
  let vs = ["verb", "sill"];
  let random = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

  verb.innerHTML = vs[random];

  if (verb.innerHTML === "sill") {
    verb.style.background = "#fff";
    verb.style.color = "#000";

    mapToRegistry.innerHTML = "mapToRegistry";
    uri.innerHTML = "C:\\Users\\mburakerman\\AppData\\Roaming";
  } else {
    verb.style.background = "#000";
    verb.style.color = "blue";

    mapToRegistry.innerHTML = "afterAdd";
    uri.innerHTML = "uri https://registry.npmjs.org";
  }
}, 1000);
