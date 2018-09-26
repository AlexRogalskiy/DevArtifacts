var jwt = require('jsonwebtoken');
var config = require('../config/app');

// middleware interceptor for token
function tokenAuth(req, res, next) {

  var token = req.body.token || req.params.token || req.headers['x-access-token'];

  // check if token exist
  if (token) {
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err) return res.status(403).json({success: false, message:'Failed to authenticate user', err: err});

      req.decoded = decoded;
      req.myValue = 'test value';
      next();
    });

  } else {
    res.status(401).json({ success: false, message:'No Token Provided' });
  }

}

module.exports = tokenAuth;