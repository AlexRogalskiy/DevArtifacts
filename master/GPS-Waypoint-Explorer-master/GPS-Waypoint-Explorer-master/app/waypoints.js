var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');

var waypointFile = fs.readFileSync('data/data.csv'),
    lines = waypointFile.toString().split('\n'),
    waypoints = [];

for (var i = 0; i < lines.length; i++) {
  var line = lines[i].toString().split(',');
  if (line.length > 1) {
    var name = line[1],
        lat = line[2],
        long = line[3],
        tortoise = line[1].split('T')[0],
        date = line[1].split('T')[1],
        m = moment(date, 'YYYYMMDD'),
        year = date.substring(0,4),
        month = parseInt(date.substring(4,6), 10) - 1,
        day = parseInt(date.substring(6,8), 10) + 1,
        dateString = m.format('D MMM YYYY'),
        age = moment('20160814', 'YYYYMMDD').diff(m, 'months');

    if (tortoise) {
      waypoints.push({
        name: name,
        lat: lat,
        long: long,
        tortoise: tortoise,
        dateString: dateString,
        date: m,
        age: age,
        opacity: 1
      });
    }
  }
}

waypoints = _.sortBy(waypoints, function(w) { return w.date; })
module.exports = waypoints;
