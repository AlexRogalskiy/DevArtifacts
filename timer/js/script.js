$(document).ready(function() {
  var workLength = 25 * 60;
  var shortBreakLength = 5 * 60;
  var longBreakLength = 15 * 60;

  var seconds = workLength;
  var initialSeconds = workLength;

  var checks = 0;
  var phaseType = 0; // 0 = work phase, 1 = break phase (both short and long)

  var countDownInterval; // interval id

  function countDown() {
    if (seconds <= 0) {
      phaseType = (phaseType + 1) % 2; // toggle between phase 0 and 1
      if (phaseType === 0) {
        $("#phase").html("Phase: Work");
        setTime(workLength);
      } else {
        $("#phase").html("Phase: Break");
        if (checks < 4) {
          //determine short or long break
          addCheck();
          setTime(shortBreakLength);
        } else {
          clearChecks();
          setTime(longBreakLength);
        }
      }
    }
    seconds--;
    displayTime();
  }

  function startTimer() {
    if (countDownInterval) {
      return false;
    }
    countDownInterval = setInterval(countDown, 1000);
  }

  function stopTimer() {
    clearInterval(countDownInterval);
    countDownInterval = null;
  }

  function resetTimer() {
    stopTimer();
    setTime(workLength);
    clearChecks();
    displayTime();
  }

  // timer controls
  $(".start-timer").click(startTimer);
  $(".stop-timer").click(stopTimer);
  $(".reset-timer").click(resetTimer);

  // + and - buttons
  $(".length-setter").click(function() {
    var input = $(this).siblings("input");
    if ($(this).html() === "-") {
      input.val(parseInt(input.val()) - 1);
    } else if ($(this).html() === "+") {
      input.val(parseInt(input.val()) + 1);
    } else {
      // should be unreachable
    }
    validifyInput(input);
  });

  // option input events
  $("#options input[type=text]").on("input", function() {
    // prevent non-number input
    if (this.value) {
      var number = this.value.replace(/[^0-9]/g, "");
      $(this).val(number);
      validifyInput($(this));
    } else {
      $(this).val("1");
    }
  });

  function validifyInput(element) {
    // force input to be between 1 to 999
    var newValue = Math.max(1, Math.min(parseInt(element.val()), 999)) || 1;
    element.val(newValue);
    updateOptions();
  }

  function updateOptions() {
    workLength = $("input[name=work-length]").val() * 60;
    shortBreakLength = $("input[name=short-break-length]").val() * 60;
    longBreakLength = $("input[name=long-break-length]").val() * 60;
    resetTimer();
  }

  // canvas clock
  function draw() {
    var ctx = document.getElementById("timer-canvas").getContext("2d");
    // clear canvas
    ctx.clearRect(0, 0, 300, 300);
    // draw circle
    ctx.beginPath();
    ctx.moveTo(120, 120);
    ctx.arc(
      120,
      120,
      120,
      -0.5 * Math.PI,
      -0.5 * Math.PI +
      (initialSeconds - seconds) / initialSeconds * (2 * Math.PI)
    );
    ctx.lineTo(120, 120);
    ctx.fillStyle = "#e74c3c";
    ctx.fill();
  }

  function formatSeconds(s) {
    var minutes = Math.floor(s / 60);
    var seconds = ("00" + s % 60).slice(-2);
    return minutes + ":" + seconds;
  }

  function displayTime() {
    $("#timer").html(formatSeconds(seconds));
    draw();
  }

  function addCheck() {
    $(".check").eq(checks).css("opacity", "1.0");
    checks++;
  }

  function clearChecks() {
    $(".check").css("opacity", "");
    checks = 0;
  }

  function setTime(time) {
    seconds = time;
    initialSeconds = time;
  }
});
