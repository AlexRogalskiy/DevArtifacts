var createMap = function (id) {
  var aside = document.querySelector('.aside');
  var map = L.map(id).setView([48.85, 2.35], 5);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				 '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				 'Imagery © <a href="https://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiaWFtdmRvIiwiYSI6IkI1NGhfYXMifQ.2FD2Px_Fh2gAZCFTxdrL7g'
  }).addTo(map);
  function handleMove () {
    var center = map.getCenter();
    var ajax = new XMLHttpRequest();
    ajax.open('POST', 'http://api.geonames.org/findNearbyPlaceNameJSON', true);
    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    ajax.addEventListener('readystatechange',  function(e) {
      if(ajax.readyState == 4 && ajax.status == 200) {
        handleResult(ajax.responseText);
      }
    });
    var data = "lat=" + center.lat + "&lng=" + center.lng + "&username=iamvdo";
    ajax.send(data);
  }
  function handleResult (data) {
    data = JSON.parse(data);
    var country = aside.querySelector('.data--map').innerHTML;
    if (data.geonames !== undefined) {
      if (data.geonames.length === 0) {
        country = '-';
      } else if (data.geonames[0].countryName !== undefined) {
        country = data.geonames[0].countryName;
      }
    }
    aside.querySelector('.data--local').innerHTML = 'France';
    aside.querySelector('.data--map').innerHTML = country;
  }
  map.on('moveend', handleMove);
  handleMove();
};

var Accordion = function (nb) {
  var nbElems = nb * 2;
  var result = document.querySelector('.result');
  var wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  result.appendChild(wrapper);
  wrapper = document.querySelector('.wrapper');
  var aside = document.querySelector('.aside');
  var asideInner = document.querySelector('.aside-inner');
  var range = document.getElementById('range');
  var min = range.getAttribute('min');
  var max = range.getAttribute('max');
  var delta = max - min;
  var widthInit = wrapper.clientWidth;
  var widthFace = widthInit / nbElems;
  var widthFaceInit = widthFace;

  for( var i = 0; i < nbElems; i++){
    var el = document.createElement('div');
    el.className = 'face';
    if (i%2 === 0) {
      el.className += ' face--odd';
    } else {
      el.className += ' face--even';
    }
    el.innerHTML = '<div><span></span></div>'; 
    var bgPos = i * widthFace + 'px';
    el.style.width = 100 / nbElems + '%';
    el.querySelector('div').style.width = widthFace + 'px';
    el.querySelector('div').style.backgroundImage = '-moz-element(#css-element)';
    el.querySelector('div').style.backgroundPosition = '-' + bgPos + ' 0';
    wrapper.appendChild(el);
  }

  var faces = {
    odd: document.querySelectorAll('.face--odd'),
    even: document.querySelectorAll('.face--even'),
    all: function () {
      return [].slice.call(this.odd).concat([].slice.call(this.even));
    }
  };

  function handleInput (e) {
    var value = range.value;
    wrapper.style.width = value + 'px';
    aside.style.width = result.clientWidth - wrapper.clientWidth + 'px';
    widthFace = value / nbElems;
    var angle = Math.acos(widthFace / widthFaceInit) * 180 / Math.PI;
    [].forEach.call(faces.odd, function (el) {
      el.querySelector('div').style.transform = 'rotateY(-' + angle + 'deg)';
    });
    [].forEach.call(faces.even, function (el) {
      el.querySelector('div').style.transform = 'rotateY(' + angle + 'deg)';
    });
  
    var width = value - min;
    var opacity = (width / 1000) / (delta / 1000);
    opacity = 1 - opacity;
    [].forEach.call(faces.all(), function (el) {
      el.querySelector('span').style.opacity = opacity;
    });
  }

  range.addEventListener('input', handleInput);
  handleInput();
};

createMap('css-element');
Accordion(4);