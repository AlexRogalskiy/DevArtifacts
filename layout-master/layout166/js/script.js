$('.member').on('click', function(){
  if (!$(this).hasClass('selected')){
    $(this).addClass('selected');
    $('.wrap').addClass('member-selected');
    addCalendar($(this).find('.calendar'));
  }
  e.preventDefault();
  e.stopPropagation();
});

$('.deselect-member, .restart').on('click', function(e){
  $('.member').removeClass('selected');
  $('.wrap').removeClass('member-selected date-selected slot-selected booking-complete');
  e.preventDefault();
  e.stopPropagation();
});

$('.deselect-date').on('click', function(e){
  $('.wrap').removeClass('date-selected slot-selected');
  $('.calendar *').removeClass('selected');
  e.preventDefault();
  e.stopPropagation();
});

$('.deselect-slot').on('click', function(e){
  $('.wrap').removeClass('slot-selected');
  $('.slots *').removeClass('selected');
  e.preventDefault();
  e.stopPropagation();
});

$('.form').on('submit', function(e){
  $('.wrap').toggleClass('booking-complete');
  e.preventDefault();
  e.stopPropagation();
})

function invokeCalendarListener(){
  $('.calendar td:not(.disabled)').on('click', function(e){
    addSlots();
    var date = $(this).html();
    var day = $(this).data('day');
    $('.date').html(day + ',  ' + date);
    $(this).addClass('selected');
    setTimeout(function(){
      $('.wrap').addClass('date-selected');
    },10);
    e.preventDefault();
    e.stopPropagation();
  });
}


function invokeSlotsListener(){
  $('.slots li').on('click', function(e){
    $(this).addClass('selected');
    $('.wrap').addClass('slot-selected');
    setTimeout(function(){
      $('.selected.member input[name="name"]').focus();
    }, 700);
    e.preventDefault();
    e.stopPropagation();
  });
}



function addSlots(container){
  
  var number = Math.ceil(Math.random()*5 + 1);
  var time = 7;
  var endings = [':00', ':15', ':30', ':45'];
  var timeDisplay = '';
  var slots = ''
  for(var i = 0; i < number; i++){
    time += Math.ceil(Math.random()*3);
    timeDisplay = time + endings[Math.floor(Math.random()*4)];
    slots += '<li>'+timeDisplay+'</li>';
  }
  
  $('.selected .slots').html(slots);
  
  invokeSlotsListener();
  
}



function addCalendar(container){
  //get dates
  var today = new Date();
  var day = today.getDay()
  var date = today.getDate();
  var month = today.getMonth();
  var year = today.getFullYear();
  var first = new Date();
  first.setDate(1);
  var startDay = first.getDay();
  var dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var monthLengths = [31,28,31,30,31,30,31,31,30,31,30,31];
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var dayNames = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
  var current = 1 - startDay;
  
  //assemble calendar
  var calendar = '<label class="date"></label><label class="month">'+monthNames[month]+'</label> <label class="year">'+year+'</label>';
  
  calendar += '<table><tr>';
  dayLabels.forEach(function(label){
    calendar += '<th>'+label+'</th>';
  })
  calendar += '</tr><tr>';
  var dayClasses = '';
  while( current <= 30){
    if (current > 0){
      dayClasses = '';
      today.setDate(current);
      if (today.getDay() == 0 || today.getDay() == 6){
        dayClasses += ' disabled';
      }
      if (current < date){
        dayClasses += ' disabled';
      }
      if (current == date){
        dayClasses += ' today';
      }
      calendar += '<td class="'+dayClasses+'" data-day="'+dayNames[(current + startDay)%7]+'">'+current+'</td>';
    } else {
      calendar += '<td></td>';
    }
    
    if ( (current + startDay) % 7 == 0){
      calendar += '</tr><tr>';
    }
    
    current++
  }
  
  calendar += '</tr></table>';
  container.html(calendar);
  
  invokeCalendarListener();
}