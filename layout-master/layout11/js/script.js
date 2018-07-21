// ==========================================================
// UTILITIES
// ==========================================================

function select(s) {
  return document.querySelector(s);
}

function selectAll(s) {
  return document.querySelectorAll(s);
}

function hide(el) {
  el.classList.toggle('hide');
}

function show(el) {
  el.classList.toggle('show');
}

function activeToggle(el) {
  el.classList.toggle('active');
}


// ==========================================================
// GLOBALS
// ==========================================================

const users         = select('.users'),
      loader        = select('.loader'),
      modal         = select('.modal'),
      screen        = select('.screen'),
      screen_scroll = select('.screen-scroll'),
      avatar        = select('.avatar'),
      profile       = select('.profile');

const transOriginNames = {
  webkitTransformOrigin : 'webkitTransformOrigin',
  MozTransformOrigin    : 'MozTransformOrigin',
  msTransformOrigin     : 'msTransformOrigin',
  transformOrigin       : 'transformOrigin'
};


// ==========================================================
// AJAX
// ==========================================================

let request = new XMLHttpRequest();

request.open('GET', 'https://randomuser.me/api/?results=30', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    hide(loader);
    show(users);

    let data = JSON.parse(request.responseText),
        l    = data.results.length;

    for(var i = 0; i < l; i++) {
      users.insertAdjacentHTML('beforeend', '<li><img src="'+ 
                               data.results[i].picture.medium +'" data-pic="'+ 
                               data.results[i].picture.large +'" data-name="'+ 
                               data.results[i].name.first + ' ' + 
                               data.results[i].name.last + '" data-email="'+ 
                               data.results[i].email +'"><span class="user-name">'+ 
                               data.results[i].name.first +'</span></li>');
    }

  } else {
    alert('We reached our target server, but there was an error');
  }
};

request.onerror = function() {
  alert('There was a connection error of some sort')
};

request.send();


// ==========================================================
// EVENTS
// ==========================================================

users.addEventListener('click', function(e) {
  let target        = e.target,
      data_src      = target.getAttribute('data-pic'),
      data_name     = target.getAttribute('data-name'),
      data_email    = target.getAttribute('data-email'),
      target_coords = target.getBoundingClientRect();

  if(target.nodeName === 'IMG') {
    activeToggle(screen);

    avatar.innerHTML   = '<img src="' + data_src + '" alt="">';
    profile.innerHTML  = '<h3 class="profile__name">'+ data_name +'</h3>';
    profile.innerHTML += '<a href="#" class="profile__email">'+ data_email +'</a>';
    profile.innerHTML += '<button>Follow</button>';
    profile.innerHTML += '<p class="profile__info">Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod.</p>';

    for(let name in transOriginNames) {
      modal.style[name] = (target.offsetLeft + (target_coords.width/2)) +'px ' + ((target.offsetTop + (target_coords.height/2)) - screen_scroll.scrollTop) + 'px';
    }
  }
});


modal.addEventListener('click', function(e) {
  activeToggle(screen);
});