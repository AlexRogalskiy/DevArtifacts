var options = {
  valueNames: [
    'name',
    'born',
    { data: ['id'] },
    { attr: 'src', name: 'image' },
    { attr: 'href', name: 'link' },
    { attr: 'data-timestamp', name: 'timestamp' }
  ]
};
var userList = new List('users', options);
userList.add({ name: 'Leia', born: '1954', image: 'http://www.listjs.com/images/tests/leia.jpeg', id: 5, timestamp: '67893' });