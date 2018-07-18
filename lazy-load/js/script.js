const images = document.querySelectorAll('img');

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0
}


const fetchImage = url => {
  areturn new Promise((resolve, reject) =>{
    const newImage = new Image()
    newImage.src = url;
    newImage.onload = resolve;
    newImage.onerror = reject;
  })
}

const updateImage = image => {
  let src = image.dataset.src;
  fetchImage(src).then(()=>{
    image.src = src
  })
}

const callbackFunction = (entries, observer) =>{
  entries.forEach(entry =>{
    if(entry.intersectionRatio > 0){
      updateImage(entry.target)
    }
  })
}

const observer = new IntersectionObserver(callbackFunction, options)

images.forEach(img => {
  observer.observe(img)
})