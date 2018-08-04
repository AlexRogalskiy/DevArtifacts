let sliders = document.querySelectorAll(".slider");
for(let i = 0; i < sliders.length; i++){
  let slider = sliders[i];
  slider.addEventListener('click', () => {
    toggleSlider(slider);
  });
}

function toggleSlider(slider){
  let status = slider.getAttribute("slider-status");
  let newStatus = status == "on" ? "off" : "on";
  
  slider.setAttribute("slider-status", newStatus);
  let round = slider.querySelector(".round");
  console.log(round);
  
  if(newStatus == "on"){
    round.style.left = "64px";
    slider.classList.add("active");
  }
  else{
    round.style.left = "0px";
    slider.classList.remove("active");
  }
  
  if(activeSliders() === 3){
    if(slider.classList.contains('good')){
       toggleSlider(document.querySelector('.fast'));
    }
    else if(slider.classList.contains('cheap')){
       toggleSlider(document.querySelector('.good'));
    }
    else if(slider.classList.contains('fast')){
       toggleSlider(document.querySelector('.cheap'));
    }
  }
}

function activeSliders(){
  let activeSliders = document.querySelectorAll(".slider.active");
  return activeSliders.length;
}

function swich(i){
  let sliders = document.querySelectorAll(".slider");
  toggleSlider(sliders[i % 3]);
  
  if(i > 0){
    setTimeout(swich.bind(this, i-1), 500);
  }
}
swich(5);
