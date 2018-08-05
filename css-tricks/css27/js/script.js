var options = {
  valueNames: [ 'name', 'born' ]
};

var userList = new List('users', options);
$('.filter-1').on('click', function() {
  userList.filter();
});

$('.filter-2').on('click', function() {
  userList.filter(function(item) {
    var born = parseInt(item.values().born);
    console.log(born);
    if (born < 1986) {
      return true;
    } else {
      return false;
    }
  });
});