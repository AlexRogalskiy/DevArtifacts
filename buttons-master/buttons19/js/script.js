const	body = document.querySelector('body')
const twitter = document.querySelector('.twitter')

twitter.addEventListener("mouseover", function () {
    body.classList.add('linked')
},false)

twitter.addEventListener("mouseout", function () {
    body.classList.remove('linked')
}, false)