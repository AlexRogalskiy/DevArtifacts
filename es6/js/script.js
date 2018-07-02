"use strict";
var pen = {
  elm: document.querySelector('.log ul'),
  log: function (...msgs) {
    msgs.forEach((msg, ind, all)=>{
      this.elm.insertAdjacentHTML('beforeend', '<li>'+msg+'</li>');
    });
  }
};

pen.log('Use pen.log', 'to push messages to list!');

