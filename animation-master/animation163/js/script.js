
const elements = Array.from(document.querySelectorAll('li'));

const callback = entries => {
  console.log(entries);
  entries.
  forEach(entry => entry.
  target.classList.toggle('active', entry.isIntersecting));
};

const options = {
  treshholds: [
  0, 1] };



const observers = elements.map(element => {
  const observer = new IntersectionObserver(callback, options);
  observer.observe(element);
  return observer;
});
