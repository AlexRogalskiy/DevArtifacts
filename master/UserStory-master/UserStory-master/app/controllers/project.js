var ProjectModel = require('../models/project');

var Project = function(message) {
  this.message = message;
}

Project.prototype.getProjects = function (req, res) {
  var query = ProjectModel.find({});

  return query
    .populate({path:'_creator', select:'username'})
}

module.exports = Project;