'use strict';

// Paleta de cores
const palletColors = [
  [  0,   0,   0], 
  [153, 153, 153], 
  [255, 255, 255], 
  [235, 223, 163], 
  [240, 220,  35], 
  [247, 149,  26],
  [162, 100,  27],
  [102,  59,  16],
  [161,  22,  25],
  [223, 131, 178],
  [76,   81, 145],
  [57,  116, 148],
  [72,  122,  84]
];

function renderColors(from = 'pallet', pallet = palletColors) {
  let parent = document.querySelector('.similar-color__pallet--from-' + from);
  
  // Limpa o parent
  parent.innerHTML = ''; 
  
  console.log('render: ', pallet);

  for (let color of pallet) { 
    let el = document.createElement('li');
        el.setAttribute('class', 'similar-color__pallet-item');
        el.style.backgroundColor = 'rgb(' + convertArrayToRGB(color) + ')';

    parent.appendChild(el);
  }
}

renderColors();

const colorInput = document.querySelector('.similar-color__input');

colorInput.addEventListener('keyup', function(event) { 
  if (this.value.length > 0){
    let dominant = getDominant(this.value);
  }
});

// Pega as cores dominantes
function getDominant(url) {
  let img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.setAttribute('src', 'https://cors-anywhere.herokuapp.com/' + url);

  img.addEventListener('load', function() {    
    let parent = document.querySelector('.similar-color__image');
    parent.appendChild(img);
    
    var dominantColors = new ColorThief().getPalette(img, 3);
    
    renderColors('image', dominantColors);
    
    console.log('color thief:', dominantColors);

    let dominantColorsOnPallet = [];
    for (let dominantColor of dominantColors) {
      
      let similarity = [];
      for (let palletColor of palletColors) {
        similarity.push(YUVSimilarity(dominantColor, palletColor));
      }
      
      let mostSimilarColor = palletColors[indexOfMax(similarity)];
      
      dominantColorsOnPallet.push(mostSimilarColor);
    }
    
    dominantColorsOnPallet = removeDuplicates(dominantColorsOnPallet);
    
    renderColors('pallet', dominantColorsOnPallet);
  });
}

// Pega o maior indice do array
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        } 
    }

    return maxIndex;
}

// converte o rgb para array
function convertArrayToRGB(color) {
    return color.join();
}

function removeDuplicates(array) {
   return Array.from(new Set(array));
}