var options = {
  valueNames: [ 'name', 'born' ]
};

var userList = new List('users', options);
userList.on('updated', function(list) {
  if (list.matchingItems.length == list.items.length) {
    $('.list').hide()
  } else {
    $('.list').show()
  }
})