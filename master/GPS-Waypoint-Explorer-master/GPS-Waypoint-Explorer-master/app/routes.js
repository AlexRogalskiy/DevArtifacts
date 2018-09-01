var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');

var waypoints = require('./waypoints');
var tortoises = require('./tortoises');

var tortoiseKeys = Object.keys(tortoises).sort();
var sortedTortoises = [];

for (var i = 0, l = tortoiseKeys.length; i < l; i++) {
  var key = tortoiseKeys[i];
  sortedTortoises.push(tortoises[key]);
}

var sampleDates = _.chain(waypoints).map(function(w){ return w.date.format('YYYY-MM-DD'); }).uniq();

router.get('/', function (req, res) {
  res.render('index', {
    tortoises: sortedTortoises
  });
});

router.get('/tortoise/:number', function (req, res) {
  var number = req.params.number,
      tortoise = tortoises[number],
      filteredWaypoints = _.filter(waypoints, function(waypoint){
        return number == waypoint.tortoise;
      });

  var distances = tortoise.distances;
  var distanceByTortoise = _.groupBy(distances, 'tortoise');
  var averageDistanceFromTortoise = _.map(distanceByTortoise, function(d, key) {
    var sum = _.reduce(d, function(memo, e) { return memo + e.distance }, 0),
        average = Math.floor(sum / d.length);

    return {average: average, tortoise: key, count: d.length };
  });

  res.render('tortoise', {
    tortoise: tortoise,
    waypoints: filteredWaypoints,
    averageDistanceFromTortoise: _.sortBy(averageDistanceFromTortoise, 'average')
  });
});

router.get('/map', function (req, res) {
  var tortoise = req.query.tortoise,
      date = req.query.date,
      filteredWaypoints = waypoints;

  if (date) {
    var m = moment(date, 'YYYY-MM-DD');
    filteredWaypoints = _.filter(filteredWaypoints, function(waypoint){
      return waypoint.date.isSame(date, 'day');
    });
  }

  if (tortoise) {
     var tortoiseArray = tortoise.split(',');
    filteredWaypoints = _.filter(filteredWaypoints, function(waypoint){
      return _.contains(tortoiseArray, waypoint.tortoise);
    });
  }

  res.render('map', {
    waypoints: filteredWaypoints,
    tortoises: sortedTortoises
  });
});

// add your routes here
module.exports = router;
