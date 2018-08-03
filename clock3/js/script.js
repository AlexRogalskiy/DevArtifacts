(function($) {
    
  var initial_animation = {
    delay: 500,
    effect: 'linear'
  };
  var gear_animation = {
    delay: 500,
    effect: 'ease-out'
  };
  
  var positions = {
    hour: 1,
    minute_tens: 0,
    minute: 1,
    second_tens: 0,
    second: 0
  };
  
  // Hour Solar Gear
  var hour_sg = {
    $object: $('.hours .solar-gear'),
    degree: 0
  };
  var hour_pgs_container = {
    $object: $('.hours .gears'),
    degree: 0
  };
  // Hour Planet Gears
  var hour_pgs = [
    {
      $object: $('.hours .gear.one'),
      degree: 0
    },
    {
      $object: $('.hours .gear.two'),
      degree: 0
    },
    {
      $object: $('.hours .gear.three'),
      degree: 0
    },
    {
      $object: $('.hours .gear.four'),
      degree: 0
    }
  ];
 
  // Minute Solar Gear
  var minute_sg = {
    $object: $('.minute-gearbox .central-gear'),
    degree: 0
  };
  var minute_pgs_container = {
    $object: $('.minute-gearbox .gears'),
    degree: 0
  };
  var minute_pgs = [
    {
      $object: $('.minute-gearbox .gear.one'),
      degree: 0
    },
    {
      $object: $('.minute-gearbox .gear.two'),
      degree: 0
    },
    {
      $object: $('.minute-gearbox .gear.three'),
      degree: 0
    },
    {
      $object: $('.minute-gearbox .gear.four'),
      degree: 0
    },
    {
      $object: $('.minute-gearbox .gear.five'),
      degree: 0
    }
  ];
  
  var $second_tens = $('.second-tens');
  var $second = $('.second');
  
  var tens_disk = {
    $object: $('.tens-disk'),
    degree: 0
  };
  
  var zipper = {
    $object: $('.zipper'),
    pixels: 0
  };
  var zipperGear = {
    $object: $('.pulsating-colon .gear'),
    degree: 0
  };
  
  var colon_height = $('.horizontal-bars > .bar').first().height();
  var zipper_limit = colon_height;
  
  function setTime() {
    var now = new Date();
    
    var hours = now.getHours();
    var hour = 0;
    if (hours > 12) {
      hour = hours - 12;
    } else if (hours == 0){
      hour = 12;
    } else {
      hour = hours;
    }
    
    var minutes = now.getMinutes();
    var minute_tens = Math.floor(minutes * 0.1);
    var minute = minutes % 10;
    
    var seconds = now.getSeconds();
    var second_tens = Math.floor(seconds * 0.1);
    var second = seconds % 10;
    
    setHour(hour, initial_animation.delay);
    setMinuteTens(minute_tens, initial_animation.delay);
    setMinute(minute, initial_animation.delay);
    setSecondTens(second_tens, initial_animation.delay);
    setSecond(second, initial_animation.delay);
    
    var initialInterval = window.setInterval((function() {
      window.clearInterval(initialInterval);
      increaseSecond();
      window.setInterval(increaseSecond, 1000);
    }), 1000 - now.getMilliseconds());
  }
  
  function increaseSecond() {
    if (positions.second >= 9) {
      increaseSecondTens();
      setSecond(0, gear_animation.delay);
    } else {
      setSecond(positions.second + 1, gear_animation.delay);
    }
  }
  
  function increaseSecondTens() {
    if (positions.second_tens >= 5) {
      increaseMinute();
      setSecondTens(0, gear_animation.delay);
    } else {
      setSecondTens(positions.second_tens + 1, gear_animation.delay);
    }
  }
  
  function increaseMinute() {
    if(positions.minute >= 9) {
      increaseMinuteTens();
      setMinute(0, gear_animation.delay);
    } else {
      setMinute(positions.minute + 1, gear_animation.delay);
    }
  }
  
  function increaseMinuteTens() {
    if(positions.minute_tens >= 5) {
      increaseHour();
      setMinuteTens(0, gear_animation.delay);
    } else {
      setMinuteTens(positions.minute_tens + 1, gear_animation.delay);
    }
  }
  
  function increaseHour() {
    if(positions.hour >= 12) {
      setHour(0, 1000);
    } else {
      setHour(positions.hour + 1, 1000);
    }
  }
  
  function setHour(hour, delay) {
    var difference = 0;
    if(hour == positions.hour) {
      return;
    } else if(positions.hour > hour) {
      difference = 13 - positions.hour;
      difference += hour;
    } else if(positions.hour < hour) {
      difference = hour - positions.hour;
    }
    
    positions.hour = hour;
    
    rotateHPGears(difference, delay);
    translateHPGears(difference, delay);
  }
  
  function setMinuteTens(tens, delay) {
    var difference = 0;
    if(tens == positions.minute_tens) {
      return;
    } else if(positions.minute_tens > tens) {
      difference = 6 - positions.minute_tens;
      difference += tens;
    } else if(positions.minute_tens < tens) {
      difference = tens - positions.minute_tens;
    }
    
    positions.minute_tens = tens;
    
    rotateTensDisk(difference, delay);
  }
  
  function setMinute(minute, delay) {
    var difference = 0;
    if(minute == positions.minute) {
      return;
    } else if(positions.minute > minute) {
      difference = 10 - positions.minute;
      difference += minute;
    } else if(positions.minute < minute) {
      difference = minute - positions.minute;
    }
    
    positions.minute = minute;
    
    rotateMPGears(difference, delay);
    translateMPGears(difference, delay);
  }
  
  function setSecondTens(tens, delay) {
    $second_tens.html(tens);
    positions.second_tens = tens;
  }
  function setSecond(second, delay) {
    $second.html(second);
    positions.second = second;
  }
  
  // Rotate Hour Planet Gears
  function rotateHPGears(times, delay) {
    var degrees = - (120 * times);
    rotateGear(hour_pgs[0], degrees, delay * times);
    rotateGear(hour_pgs[1], degrees, delay * times);
    rotateGear(hour_pgs[2], degrees, delay * times);
    rotateGear(hour_pgs[3], degrees, delay * times);
  }
  
  // Rotate Minute Planet Gears
  function rotateMPGears(times, delay) {
    var degrees = 180 * times;
    rotateGear(minute_pgs[0], degrees, delay * times);
    rotateGear(minute_pgs[1], degrees, delay * times);
    rotateGear(minute_pgs[2], degrees, delay * times);
    rotateGear(minute_pgs[3], degrees, delay * times);
    rotateGear(minute_pgs[4], degrees, delay * times);
  }
  
  function rotateGear(gear, degrees, delay) {
    gear.degree += degrees;
    rotate(gear, delay, gear_animation.effect);
  }
  
  // Translate Hour Planet Gears
  function translateHPGears(times, delay) {
    hour_pgs_container.degree -= (360 / 4) * times;
    rotate(hour_pgs_container, delay * times, gear_animation.effect);
  }
  
  // Translate Minute Planet Gears
  function translateMPGears(times, delay) {
    minute_pgs_container.degree += (360 / 5) * times;
    rotate(minute_pgs_container, delay * times, gear_animation.effect);
  }
  
  function rotateTensDisk(times, delay) {
    tens_disk.degree -= (360 / 6) * times
    rotate(tens_disk, delay * times, gear_animation.effect);
  }
  
  function translateZipper() {
    if ( zipper.pixels > 0 ) {
      zipper.pixels = -zipper_limit;
    } else {
      zipper.pixels = zipper_limit;
    }
    translateY(zipper, 100);
  }
  
  function rotateZipperGear() {
    if (zipperGear.degree < 0) {
      zipperGear.degree = (360/9);
    } else {
      zipperGear.degree = - (360/9);
    }
    rotate(zipperGear, 100, 'linear');
  }
  
  function translateY(object, duration) {
    object.$object.transition({
      y: object.pixels
    }, duration, 'linear');
  }
  
  function rotate(object, duration, effect) {
    object.$object.transition({ 
      rotate: object.degree 
    }, duration, effect);
  }
  
  setTime();
  window.setInterval(translateZipper, 500);
  window.setInterval(rotateZipperGear, 500);
  
}($))