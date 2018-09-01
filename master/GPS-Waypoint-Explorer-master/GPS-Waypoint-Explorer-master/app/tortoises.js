var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');
var geolib = require('geolib');

var colors = require('./colors'),
    waypoints = require('./waypoints'),
    tortoiseMetaDataFile = fs.readFileSync('data/tortoises.csv'),
    lines = tortoiseMetaDataFile.toString().split('\n'),
    waypointsByDate = _.groupBy(waypoints, 'dateString');

var tortoises = {},
    colorIndex = 0;

for (var i = 0, l = waypoints.length; i < l; i++) {
  var waypoint = waypoints[i],
      number = waypoint.tortoise;

  if (tortoises[number]) {
    tortoises[number].count = tortoises[number].count + 1;
  } else {
    tortoises[number] = {
      number: number,
      count: 1,
      color: colors[colorIndex],
      points: [],
      distances: []
    };
    colorIndex++;
  }

  tortoises[number].points.push(waypoint);
  setDistances(tortoises[number], number, waypoint);
  waypoint.color = tortoises[number].color;
}

for (var i = 0; i < lines.length; i++) {
  var line = lines[i].toString().split(','),
      tortoise = tortoises[line[0]];

  if (tortoise) {
    tortoise.sex = line[1];
    tortoise.v3ScuteWidth = line[2];
    tortoise.v3ScuteLength = line[3];
    tortoise.carapaceWidth = line[4];
    tortoise.carapaceLength = line[5];
    tortoise.notes = line[6];
    tortoise.name = line[7];
  }
}

function setDistances(tortoise, number, waypoint) {
  var distances = {},
      datePoints = waypointsByDate[waypoint.dateString];

  for (var a = 0, b = datePoints.length; a < b; a++) {
    var datePoint = datePoints[a],
        distance = 0;

    if (datePoint.tortoise !== number) {
      distance = geolib.getDistance(
        {latitude: datePoint.lat, longitude: datePoint.long},
        {latitude: waypoint.lat, longitude: waypoint.long}
      );

      tortoise.distances.push({date: waypoint.date, tortoise: datePoint.tortoise, distance: distance});
    }
  }
}

module.exports = tortoises;
