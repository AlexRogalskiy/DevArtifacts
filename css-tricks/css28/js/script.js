var options = {
  valueNames: [ 'name', 'born' ]
};

var userList = new List('users', options);
userList.on('updated', function(list) {
  if (list.matchingItems.length > 0) {
    $('.no-result').hide()
  } else {
    $('.no-result').show()
  }
})