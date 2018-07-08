function PrimeNumber(n) {
  this.n = n;

  this.setNext = function(n) {
    return (this.p = new PrimeNumber(n))
  }
}

var firstPrime = new PrimeNumber(2);
var lastPrime = firstPrime.setNext(3).setNext(5).setNext(7);

function isPrime(n) {
  if ((n & 1) == 0 || (n > 5 && n % 5 == 0)) return false;

  var max = Math.sqrt(n);
  if (max == Math.floor(max)) return false;

  var p = firstPrime;
  var pn;
  while (p != null) {
    if ((pn = p.n) > max) return true;
    if (n % pn == 0) return false;
    p = p.p;
  }

  var divisor = lastPrime.n;
  while ((divisor += 2) <= max) {
    if (!isPrime(divisor)) continue;
    lastPrime = lastPrime.setNext(divisor);
    if (divisor > max) return true;
    if (n % divisor == 0) return false;
  }

  return true;
}

function nextPrime(n) {
  n += ((n & 1) == 0 ? 1 : 2);

  if (lastPrime.n > n) {
    var p = firstPrime;
    while (true) {
      if (p.n >= n) return p.n;
      p = p.p;
    }
  } else {
    while (!isPrime(n)) n += 2;
  }
  return n;
}

function getPrimeFactors(n) {
  var result = []
  var factor = 2;
  while (n > 1) {
    if (n % factor == 0) {
      result.push(factor);
      n /= factor;
    } else {
      factor = nextPrime(factor);
    }
  }
  return result;
}

function multArray(a) {
  var f = 1;
  for (var v in a) f *= a[v]
  return f
}

function factorial(n) {
  var r = 1;
  do {
    r *= n;
  } while (--n > 1)
  return r;
}

function getNthPermutation(symbols, n) {
  return permutation(symbols, n_to_factoradic(n));
}

function n_to_factoradic(n, p) {
  if (p == undefined) p = 2
  if (n < p) return [n];
  var ret = n_to_factoradic((n / p) | 0, p + 1);
  ret.push(n % p);
  return ret;
}

function permutation(symbols, factoradic) {
  factoradic.push(0);
  while (factoradic.length < symbols.length) factoradic.unshift(0);
  var ret = [];
  var s = symbols.concat();
  while (factoradic.length) {
    var f = factoradic.shift();
    ret.push(s[f]);
    s.splice(f, 1);
  }
  return ret;
}

function getPermutations(symbols) {
  var n = factorial(symbols.length);
  var perm = [];
  for (var i = 0; i < n; i++) {
    perm.push(getNthPermutation(symbols, i));
  }
  return perm;
}

function isTriangular(n) {
  var t = Math.sqrt(8 * n + 1);
  return t == Math.floor(t);
}

function Set(data) {
  this.keys = {}
  this.data = []

  this.add = function(element) {
    var hash = element.toString();

    if (!this.keys[hash]) {
      this.keys[hash] = true;
      this.data.push(element)
    }
  }

  for (var v in data)
    this.add(data[v])
}

function getRectArrangements(n) {
  var f = getPrimeFactors(n)
  var f_count = f.length
  var ma = multArray(f)
  var arrangements = new Set([
    [1, ma]
  ])

  if (f_count > 1) {
    perms = new Set(getPermutations(f))
    for (var v in perms.data) {
      var perm = perms.data[v]
      for (var i = 1; i < f_count; i++) {
        var v1 = multArray(perm.slice(0, i))
        var v2 = multArray(perm.slice(i))
        arrangements.add([Math.min(v1, v2), Math.max(v1, v2)])
      }
    }
  }

  arrangements.data.sort(function(a, b) {
    return a[0] - b[0]
  })

  return arrangements.data;
}

function getShiftedRectArrangements(n) {
  var arrangements = new Set([]);
  for (var x = 1; x < (n >> 1); x++) {
    var v = 2 * x + 1;
    if (n % v == x) {
      arrangements.add([x, x + 1, ((n / v) | 0) * 2 + 1])
    }
  }

  for (var x = 2; x <= (n >> 1); x++) {
    var v = 2 * x - 1;
    if (n % v == x) {
      arrangements.add([x, x - 1, ((n / v) | 0) * 2 + 1])
    }
  }

  return arrangements.data;
}

function getShiftedSymmetricArrangements(n) {
  var hits = []
  for (var i = 1; i < (n >> 1); i++) {
    var count = n;
    var row = i;
    while (true) {
      count -= row * 2
      if (count == row + 1) {
        if (i != row)
          hits.push([i, row + 1]);
        break;
      } else if (count <= 0)
        break;
      row++;
    }
  }
  return hits;

}

function getCircleData(arrangement, radius, ox, oy) {
  var data = [];
  var cols = arrangement[0];
  var rows = arrangement[1];
  for (var r = 0; r < cols; r++)
    for (var c = 0; c < rows; c++)
      data.push({
        x: radius + radius * c * 2.1 + ox,
        y: radius + radius * r * 2.1 + oy,
        r: radius
      })

  return {
    data: data,
    width: rows * radius * 2.1,
    height: cols * radius * 2.1
  }
}

function getShiftedCircleData(arrangement, radius, ox, oy) {
  var data = [];
  var v = arrangement.slice(0, 2);
  var shiftedIndex = (v[0] == Math.min(v[0], v[1]) ? 0 : 1)
  var rows = arrangement[2];

  if (rows < Math.max(v[0], v[1])) {
    for (var r = 0; r < rows; r++)
      for (var c = 0; c < v[r & 1]; c++)
        data.push({
          x: radius + radius * c * 2.1 + ox + ((r & 1) == shiftedIndex) * radius,
          y: radius + radius * r * 2.1 + oy,
          r: radius
        })

    return {
      data: data,
      height: rows * radius * 2.1,
      width: Math.max(v[0], v[1]) * radius * 2.1
    }
  } else {
    for (var r = 0; r < rows; r++)
      for (var c = 0; c < v[r & 1]; c++)
        data.push({
          y: radius + radius * c * 2.1 + oy + ((r & 1) == shiftedIndex) * radius,
          x: radius + radius * r * 2.1 + ox,
          r: radius
        })

    return {
      data: data,
      width: rows * radius * 2.1,
      height: Math.max(v[0], v[1]) * radius * 2.1
    }

  }
}

function getTriangularCircleData(count, radius, ox, oy) {
  var rowCount = 1;
  var dx = 0;
  var dy = radius;
  var data = [];
  while (count > 0) {
    for (var c = 0; c < rowCount; c++)
      data.push({
        x: radius * c * 2.1 + ox + dx,
        y: dy + oy,
        r: radius
      })
    dx -= radius
    dy += radius * 2
    count -= rowCount
    rowCount++;
  }

  for (var i = 0; i < data.length; i++) {
    data[i].x += rowCount * radius
  }

  return {
    data: data,
    width: rowCount * radius * 2.1,
    height: rowCount * radius * 2.1
  }
}

function getSymmetricCircleData(arrangement, radius, ox, oy) {
  var dx = 0;
  var dy = radius;
  var data = [];
  for (var r = arrangement[0]; r <= arrangement[1]; r++) {
    for (var c = 0; c < r; c++) {
      data.push({
        x: radius * c * 2.1 + ox + dx,
        y: dy + oy,
        r: radius
      })
    }
    dx -= radius
    dy += radius * 2
  }
  var correct = dx;
  dx += radius * 2
  for (var r = arrangement[1] - 1; r >= arrangement[0]; r--) {
    for (var c = 0; c < r; c++) {
      data.push({
        x: radius * c * 2.1 + ox + dx,
        y: dy + oy,
        r: radius
      })
    }
    dx += radius
    dy += radius * 2
  }

  for (var i = 0; i < data.length; i++) {
    data[i].x += -correct + radius;
  }

  return {
    data: data,
    width: arrangement[1] * radius * 2.1,
    height: dy + radius
  }
}

var svgContainer = d3.select("body").append("svg").attr("width", 2200).attr("height", 2200);
updateView(80);

function updateView(elementCount) {
  console.log(elementCount,"elements");
  svgContainer.selectAll("*").remove();
  
  var ox = 0;
  var oy = 32;
  var radius = 5;
  var allCircles = []

  var arrangements = getRectArrangements(elementCount)
  for (var i = 0; i < arrangements.length; i++) {
    var circleData = getCircleData(arrangements[i], radius, ox, oy);
    allCircles = allCircles.concat(circleData.data)
    
    
    oy += circleData.height + radius * 3;
    svgContainer.append("text")     
        .attr("x", 1)
        .attr("y", oy-5 )
        .style("text-anchor", "left")
        .style("font-size", "10px")
        .style("font-family", "Verdana")
        .text(arrangements[i][0]+"x"+arrangements[i][1]);
  }

  var arrangements = getShiftedRectArrangements(elementCount)
  for (var i = 0; i < arrangements.length; i++) {
    var circleData = getShiftedCircleData(arrangements[i], radius, ox, oy);

    allCircles = allCircles.concat(circleData.data)
    oy += circleData.height + radius * 3;
    svgContainer.append("text")     
        .attr("x", 1)
        .attr("y", oy-5 )
        .style("text-anchor", "left")
        .style("font-size", "10px")
        .style("font-family", "Verdana")
        .text("["+arrangements[i][0]+"/"+arrangements[i][1]+"]x"+(arrangements[i][2]>>1)+"+["+arrangements[i][0]+"]");
  }

  if (isTriangular(elementCount)) {
    var circleData = getTriangularCircleData(elementCount, radius, ox, oy);
    allCircles = allCircles.concat(circleData.data)
    oy += circleData.height + radius * 3;
  }

  var arrangements = getShiftedSymmetricArrangements(elementCount);
  for (var i = 0; i < arrangements.length; i++) {
    console.log(arrangements[i]);
    var circleData = getSymmetricCircleData(arrangements[i], radius, ox, oy);

    allCircles = allCircles.concat(circleData.data)
    oy += circleData.height + radius * 3;
  }

  var circles = svgContainer.selectAll("circle").data(allCircles).enter().append("circle")
  var circleAttributes = circles.attr("cx", function(d) {
    return d.x;
  }).attr("cy", function(d) {
    return d.y;
  }).attr("r", function(d) {
    return d.r;
  }).style("fill", "grey");
}