const app = document.querySelector('#app');
const forEach = (array, fn) => Array.from(array).forEach(fn);
const isFunction = (value) => typeof value === 'function';
const bindParallax = (list) => forEach(list, card => card.card ? Card.applyParallax(card, '.banner-image') : null);
const random = (min = 3, max = 20) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomAvatar = () => `https://api.adorable.io/avatars/${random(1, 1000)}`;
const arrayFromInt = (n) => Array.from(Array(n), (u, i) => i);

const ProfilePicture = (imageUrl) => (
  `<div class="profile-picture" style="background-image: url(${imageUrl})"></div>`
);

const BannerImage = (imageUrl, {child}) => (
  `<div class="banner-image" style="background-image: url(${imageUrl})">${child}</div>`
);

class ViewCard {
  static create(options) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="view-card">
      ${BannerImage(options.image, {
      child: `
          ${ProfilePicture(options.logo)}
          <div class="view-card__close"></div>
          <div class="view-card__presentation">
          <div class="view-card__title">${options.title}</div>
          <div class="view-card__subtitle">${options.subtitle}</div>
          </div>
        `
    })}
      <div class="view-card__body">
        ${Card.create({
          image: options.image,
          title: 'Project X',
          subtitle: '32 screens'
        }).outerHTML}
      </div>
    </div>
    `;
    let _el = wrapper.children[0];
    _el.connectedCard = options.connectedCard;
    return _el;
  }

  static close(viewCard, callback) {
    viewCard.classList.add('view-card--out');
    isFunction(callback) ? viewCard.addEventListener('animationend', callback.bind(null, viewCard)) : null;
  }
}

class Card {
  static create(options) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="card">
      ${BannerImage(options.image, {
      child: options.logo ? ProfilePicture(options.logo) : ''
    })}
      <div class="card__body">
        <div class="card__info">
          <span class="card__info-title">${options.title}</span>
          <div class="card__info-subtitle">${options.subtitle}</div>
        </div>
        <div class="card__specials">
          ${options.specials ? options.specials.map((specialImg, i) => {
            if (i <= 2) {
              let attr = i === 2 ? `more-specials="+${options.specials.length - (i + 1)}"` : '';
              return `<div class="card__special" style="background-image: url(${specialImg})" ${attr}></div>`;
            }
          }).join('') : ''}
        </div>
      </div>
    </div>
    `;
    let _el = wrapper.children[0];
    _el.card = Object.assign({}, options);
    return _el;
  }

  static applyParallax(element, section) {
    let leftPosition = element.parentElement.scrollLeft - element.offsetLeft;
    let marginSize = (app.clientWidth - element.clientWidth) * 1.5;
    let position = 50 / (app.clientWidth / (leftPosition + marginSize + element.clientWidth));
    element.querySelector(section).style.backgroundPosition = `${position}% center`;
  }

  static clone(element, {addClass}) {
    let {scrollTop} = document.body;
    let _elClientRect = element.getBoundingClientRect();
    let _elClone = element.cloneNode(true);
    _elClone.card = Object.assign({}, element.card);
    addClass ? _elClone.classList.add(addClass) : null;
    _elClone.style.top = `${_elClientRect.top + scrollTop - app.offsetTop}px`;
    _elClone.style.left = `${_elClientRect.left - app.offsetLeft}px`;
    _elClone.style.height = `${_elClientRect.height}px`;
    _elClone.style.width = `${_elClientRect.width}px`;
    return _elClone;
  }

  static startAnimation(card, onTransitionEnd) {
    let _clone = Card.clone(card, {addClass: 'card--clone'});
    _clone.reverseAnimation = Card.reverseAnimation.bind(null, _clone);
    isFunction(onTransitionEnd) ? _clone.addEventListener('transitionend', onTransitionEnd) : null;
    app.appendChild(_clone);
    setTimeout(() => _clone.classList.add('card--animating'), 50);
  }

  static reverseAnimation(card, onTransitionEnd) {
    card.classList.remove('card--animating');
    isFunction(onTransitionEnd) ? card.addEventListener('transitionend', onTransitionEnd) : null;
  }
}

const onCardTransitionEnd = (counter) => (e) => {
  if(!counter && e.target.className.includes('card--clone')) {
    ++counter;
    renderViewCard(e.target);
  }
};

const onCardViewAnimationOutEnd = (counter) => (viewCard) => {
  if (counter) return;
  ++counter;
  removeViewCard(viewCard);
};

const renderViewCard = (connectedCard) => {
  let options = Object.assign({connectedCard}, connectedCard.card);
  let viewCard = ViewCard.create(options);
  app.appendChild(viewCard);
  document.querySelector('.view-card__close')
    .addEventListener('click', () => ViewCard.close(viewCard, onCardViewAnimationOutEnd(0)));
};

const removeViewCard = (viewCard) => {
  let {connectedCard} = viewCard;
  viewCard.remove();
  connectedCard.reverseAnimation(() => connectedCard.remove());
};

const render = () => {
  const cardsDOM = document.createElement('div');
  const cards = [
    Card.create({
      image: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2059749/route-66.png',
      title: 'InVision Craft',
      subtitle: `${random()} PROJECTS`,
      logo: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2059749/route-66.png',
      specials: arrayFromInt(random()).map(randomAvatar)
    }),
    Card.create({
      image: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2053253/seattle.png',
      title: 'Nike Running',
      subtitle: `${random()} PROJECTS`,
      logo: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2053253/seattle.png',
      specials: arrayFromInt(random()).map(randomAvatar)
    }),
    Card.create({
      image: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2236968/anduin.png',
      title: 'Relate UI Kit',
      subtitle: `${random()} PROJECTS`,
      logo: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2236968/anduin.png',
      specials: arrayFromInt(random()).map(randomAvatar)
    }),
    Card.create({
      image: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2109505/sunset.png',
      title: 'Serum Design',
      subtitle: `${random()} PROJECTS`,
      logo: 'https://d13yacurqjgara.cloudfront.net/users/31752/screenshots/2109505/sunset.png',
      specials: arrayFromInt(random()).map(randomAvatar)
    })
  ];

  cardsDOM.classList.add('cards');
  cardsDOM.addEventListener('scroll', () => bindParallax(cardsDOM.children));

  forEach(cards, (card) => {
    cardsDOM.appendChild(card);
    card.addEventListener('click', () => Card.startAnimation(card, onCardTransitionEnd(0)));
  });

  cardsDOM.insertAdjacentHTML('beforeEnd', '<div class="card--ghost"></div>');
  app.appendChild(cardsDOM);
  document.addEventListener('DOMContentLoaded', () => bindParallax(cardsDOM.children));
};

render();