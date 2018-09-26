var User = require('../models/user');
var rb = require('../lib/responseBuilder');
var config = require('../config/app');

var router = require('express').Router();


// get all users
router.get('/users', function (req, res) {
  User.find()
    .then(rb.buildGetResponse.bind(res))
    .catch(rb.buildErrorResponse.bind(res))
});


// create user
router.post('/signup', function (req, res) {
  var user = new User(req.body);

  user.save()
    .then(createUser)
    .catch(rb.buildErrorResponse.bind(res))

  function createUser(data) {
    var data = data.toObject();
    delete data.password;
    res.status(201).json(data);
  }
});


// login user
router.post('/signin', function (req, res) {

  User.findOne({
    username: req.body.username
  }).select('password username').exec(function (err, user) {

    if (err) throw err;

    if (!user) {
      res.status(400).json({ message: "User doesn't exist" });

    } else if (user) {
      var validPassword = user.comparePassword(req.body.password);

      if (!validPassword) {
        res.status(400).json({ message: "Invalid Password" });
      } else {

        // create token
        var token = createToken(user);

        res.status(200).json({
          success: true,
          token: token
        });
      }
    }

  });

});


module.exports = router;