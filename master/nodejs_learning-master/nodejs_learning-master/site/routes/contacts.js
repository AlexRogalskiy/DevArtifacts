var express = require('express'),
    path = require('path'),
    router = express.Router();


// Send contact page 
router.get('*', function (req, res) {
  res.sendFile(path.resolve('public/js/contact_app/templates/index.html'));  
});

module.exports = router;