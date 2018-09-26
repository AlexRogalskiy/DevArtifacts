var React = require('react');
var ThumbnailList = require('./components/thumbnailList');
var dropdown = require('./components/dropdown');

var optionsList = {
  thumbnailData: [
    {
      title: 'Inbox',
      number: 32,
      text: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.',
      imgUrl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQD9-AHQ7L42rMC8kUKd2ugREJzPwR4BOEgqoaX9ZJA4pxUC7FuLiLkspe2',
      label: 'test Card2'
    },
    {
      title: 'Messages',
      number: 5,
      text: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.',
      imgUrl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQD9-AHQ7L42rMC8kUKd2ugREJzPwR4BOEgqoaX9ZJA4pxUC7FuLiLkspe2',
      label: 'Messages'
    },
  ]
};

var dropdownOptions = {
  title: 'Menu',
  items: ['Ruby', 'Python', 'PHP']
}

var dropdownElement =  React.createElement(dropdown, dropdownOptions);
var thumbnailList = React.createElement(ThumbnailList, optionsList);
// Place into body
React.render(thumbnailList, document.querySelector('.container'));
React.render(dropdownElement, document.querySelector('.test'));