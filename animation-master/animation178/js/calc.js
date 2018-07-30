class Calc {

  /*
  ------------------------------------------
  | rand:float - returns random float
  |
  | min:number - minimum value
  | max:number - maximum value
  | ease:function - easing function to apply to the random value
  |
  | Get a random float between two values,
  | with the option of easing bias.
  ------------------------------------------ */
  static rand(min, max, ease) {
    if(max === undefined) {
      max = min;
      min = 0;
    }
    let random = Math.random();
    if(ease) {
      random = ease(Math.random(), 0, 1, 1);
    }
    return random * (max - min) + min;
  }

  /*
  ------------------------------------------
  | randInt:integer - returns random integer
  |
  | min:number - minimum value
  | max:number - maximum value
  | ease:function - easing function to apply to the random value
  |
  | Get a random integer between two values,
  | with the option of easing bias.
  ------------------------------------------ */
  static randInt(min, max, ease) {
    if(max === undefined) {
      max = min;
      min = 0;
    }
    let random = Math.random();
    if(ease) {
      random = ease(Math.random(), 0, 1, 1);
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*
  ------------------------------------------
  | randArr:item - returns random iem from array
  |
  | arr:array - the array to randomly pull from
  |
  | Get a random item from an array.
  ------------------------------------------ */
  static randArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /*
  ------------------------------------------
  | map:number - returns a mapped value
  |
  | val:number - input value
  | inputMin:number - minimum of input range
  | inputMax:number - maximum of input range
  | outputMin:number - minimum of output range
  | outputMax:number - maximum of output range
  |
  | Get a mapped value from and input min/max
  | to an output min/max.
  ------------------------------------------ */
  static map(val, inputMin, inputMax, outputMin, outputMax) {
    return ((outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin))) + outputMin;
  }

  /*
  ------------------------------------------
  | clamp:number - returns clamped value
  |
  | val:number - value to be clamped
  | min:number - minimum of clamped range
  | max:number - maximum of clamped range
  |
  | Clamp a value to a min/max range.
  ------------------------------------------ */
  static clamp(val, min, max) {
    return Math.max(Math.min(val, max), min);
  }

  /*
  ------------------------------------------
  | roundToUpperInterval:number - returns rounded up value
  |
  | value:number - value to be rounded
  | interval:number - interval
  |
  | Round up a value to the next highest interval.
  ------------------------------------------ */
  static roundToUpperInterval(value, interval) {
    if(value % interval === 0) {
      value += 0.0001;
    }
    return Math.ceil(value / interval) * interval;
  }

  /*
  ------------------------------------------
  | roundDownToInterval:number - returns rounded down value
  |
  | value:number - value to be rounded
  | interval:number - interval
  |
  | Round down a value to the next lowest interval.
  ------------------------------------------ */
  static roundToLowerInterval(value, interval) {
    if(value % interval === 0) {
      value -= 0.0001;
    }
    return Math.floor(value / interval) * interval;
  }

  /*
  ------------------------------------------
  | roundToNearestInterval:number - returns rounded value
  |
  | value:number - value to be rounded
  | interval:number - interval
  |
  | Round a value to the nearest interval.
  ------------------------------------------ */
  static roundToNearestInterval(value, interval) {
    return Math.round(value / interval) * interval;
  }

  /*
  ------------------------------------------
  | intersectSphere:boolean - returns if intersecting or not
  |
  | a:object - sphere 1 with radius, x, y, and z
  | b:object - sphere 2 with radius, x, y, and z
  |
  | Check if two sphere are intersecting
  | in 3D space.
  ------------------------------------------ */
  static intersectSphere(a, b) {
    let distance = Math.sqrt(
      (a.x - b.x) * (a.x - b.x) +
      (a.y - b.y) * (a.y - b.y) +
      (a.z - b.z) * (a.z - b.z)
    );
    return distance < (a.radius + b.radius);
  }

  /*
  ------------------------------------------
  | getIndexFromCoords:number - returns index
  |
  | x:number - x value (column)
  | y:number - y value (row)
  | w:number - width of grid
  |
  | Convert from grid coords to index.
  ------------------------------------------ */
  static getIndexFromCoords(x, y, w) {
    return x + (y * w);
  }

  /*
  ------------------------------------------
  | getCoordsFromIndex:object - returns coords
  |
  | i:number - index
  | w:number - width of grid
  |
  | Convert from index to grid coords.
  ------------------------------------------ */
  static getCoordsFromIndex(i, w) {
    return {
      x: i % w,
      y: Math.floor(i / w)
    }
  }

}