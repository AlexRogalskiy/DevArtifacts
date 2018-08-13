'use strict';

var checkbox = document.querySelector('#checkbox'),
    checkboxInput = checkbox.querySelector('#inputID');

checkboxInput.addEventListener('change', function (e) {
  checkbox.classList.toggle('checkbox--unchecked', !e.target.checked);
  checkbox.classList.toggle('checkbox--checked', e.target.checked);
});