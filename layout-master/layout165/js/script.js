let isSupportCssFilter = CSS.supports('-webkit-filter', 'blur(1px)') || CSS.supports('filter', 'blur(1px)');

if (!isSupportCssFilter) {
  let div = document.createElement('div');
  div.innerHTML = `<svg class="sr-only"><filter id="blur"><feGaussianBlur stdDeviation="${document.documentElement.clientWidth * 2.5 / 100}"/></filter></svg>`;
  document.getElementsByTagName('body')[0].appendChild(div.firstElementChild);
};