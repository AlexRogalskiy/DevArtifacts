const stage = document.getElementById('stage');

document.body.addEventListener('mousemove', _.debounce(e => {
    const xOrigin = stage.offsetWidth / 2;
    const yOrigin = stage.offsetHeight / 2;
    const xRot = (e.clientY - yOrigin) / yOrigin * -15 + 10;
    const yRot = (e.clientX - xOrigin) / xOrigin * 20;
    stage.style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg)`;
}), 500);
