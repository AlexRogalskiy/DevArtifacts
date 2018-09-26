var Customer = require('../models/customer');
var router = require('express').Router();
var rb = require('../lib/responseBuilder');


router.post('/customers', function (req, res) {
  var customer = new Customer({
    name: req.body.name
  })

  customer.save()
    .then(rb.buildCreateResponse.bind(res))
    .catch(rb.buildErrorResponse.bind(res))
})

router.get('/customers', function (req, res) {
  var query = Customer.find({});

  query
    .then(rb.buildGetResponse.bind(res))
    .catch(rb.buildErrorResponse.bind(res));

})

module.exports = router;