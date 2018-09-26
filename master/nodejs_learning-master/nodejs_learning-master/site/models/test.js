var User = require('./user').User;

var admin = new User({
    name: "migel",
    password: "123456"
});

admin.save(function (err){
    if (err) throw err;
    console.log('Saved');
});