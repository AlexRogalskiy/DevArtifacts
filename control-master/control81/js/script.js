const wrapper = document.querySelector('.wrapper');

const input = wrapper.querySelector('input');

input.addEventListener('change', function(e) {
  let bgColor = e.target.value;
  wrapper.style.setProperty('--bg-color', bgColor);
})