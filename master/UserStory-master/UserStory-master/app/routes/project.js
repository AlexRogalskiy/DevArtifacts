var Project = require('../models/project');
var router = require('express').Router();
var rb = require('../lib/responseBuilder');


router.get('/projects', function (req, res) {
  var query = Project.find({});

  query
    .populate({path:'_creator', select:'username'})
    .then(rb.buildGetResponse.bind(res))
    .catch(rb.buildErrorResponse.bind(res));
});

router.post('/projects', function (req, res) {
  var project = new Project(req.body);

  project.save()
    .then(rb.buildCreateResponse.bind(res))
    .catch(rb.buildErrorResponse.bind(res))
});

module.exports = router;