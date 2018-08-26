var txtDiv = document.querySelector('#text-content'),
    txtCont = txtDiv.innerHTML,
    //txtStyles = window.getComputedStyle(txtDiv, null).cssText;
    txtStyles = window.getComputedStyle(txtDiv, null),
    divWidth = txtDiv.clientWidth,
    divHeight = txtDiv.clientHeight,
    //divWidth = txtDiv.offsetWidth;
    //divWidth = txtDiv.scrollWidth;
    cloneDiv = document.createElement('div');

cloneDiv.innerHTML = txtCont;
cloneDiv.classList.add('htmlEditorPreviewArea');

cloneDiv.style.cssText = "visibility: hidden";
//cloneDiv.setAttribute('style', 'display: none')

document.body.appendChild(cloneDiv); 
    
var cloneH = cloneDiv.clientHeight;

//document.body.removeChild(cloneDiv); 



console.log('div width', divWidth)
console.log('div height', divHeight)

console.log('clone height', cloneH)
//console.log(txtStyles);