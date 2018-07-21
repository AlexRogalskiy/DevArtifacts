$(document).ready(function() {
  /*===========================
      Get Client Location
  ===========================*/
  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy:true,
    timeout:5000
  }); //end of navigator
  
  function success(position) {
    var lat=position.coords.latitude;
    var long=position.coords.longitude;
    var location=lat+','+long;
    var entry='https://api.wunderground.com/api/';
    //my key:680e2138747fd15c spare:d6fadca18738e4ec
    var key='d6fadca18738e4ec';
    var features='/astronomy/conditions/forecast';
    var query='/q/'+location;
    var format='.json';
    var api=entry+key+features+query+format;
    $.ajax({
      url: api,
      dataType: 'jsonp',
      success: function(data) {
        /*===========================
                  Variables
        ===========================*/
        var today=data.current_observation;
        var future=data.forecast.simpleforecast.forecastday;
        var metricUnit=true;
        var $Days=$('.day');
        var prop='weather';
        var Wicons = {
            'wi-cloudy': {
              'WUicon':['cloudy'],
              'icon':'wi-cloudy',
              'css':'cloudy'
            },
            'wi-day-cloudy':{
              'WUicon':['partlysunny','mostlycloudy'],
              'icon':'wi-day-cloudy',
              'css':'mostcloud'
            },
            'wi-day-sunny':{
              'WUicon':['sunny','clear'],
              'icon':'wi-day-sunny',
              'css':'sun'
            },
            'wi-day-sunny-overcast':{
              'WUicon':['partlycloudy','mostlysunny'],
              'icon':'wi-day-sunny-overcast',
              'css':'mostsun'
            },
            'wi-fog':{
              'WUicon':['hazy','fog'], 
              'icon':'wi-fog',
              'css':'fog'
            },
            'wi-rain':{
              'WUicon':['sleet','chancesleet','rain','chancerain'],
              'icon':'wi-rain',
              'css':'rain'
            },
            'wi-snow':{
              'WUicon':['snow','flurries','chancesnow','chanceflurries'],
              'icon':'wi-snow',
              'css':'snow'
            },
            'wi-thunderstorm':{
              'WUicon':['tstorms', 'chancetstorms'],
              'icon':'wi-thunderstorm',
              'css':'storm'
            }
          }
        var keys=Object.keys(Wicons);
        var city=(today.display_location.country_iso3166=='US') ? (today.display_location.city+', '+today.display_location.state) : (today.display_location.city+', '+today.display_location.country_iso3166);
        
        var astro=data.moon_phase;
        var now=astro.current_time;
        var nowtime=parseInt(now.hour+now.minute);
        var sunrise=astro.sunrise;
        var sunrisetime=parseInt(sunrise.hour+sunrise.minute);
        var sunset=astro.sunset;
        var sunsettime=parseInt(sunset.hour+sunset.minute);
        var timeCheck= (sunrisetime<=nowtime && nowtime<sunsettime);
        console.log(sunrisetime+' '+nowtime+' '+sunsettime);
        /*===========================
                  Functions
        ===========================*/
        // loading animation
        // $('#loader').fadeOut(100, function() {
        //   $('#container').removeClass('hidden');
        // });
        
        if (timeCheck) {
          $('body').css({'background-color':'#fcfcfc'});
        } else {
          $('body').css({'background-color':'#111'});
          $('#container').css({'color':'rgba(255,255,255,0.5)'});
          $('#aside i').addClass('night');
        }

        function todayOrFuture(index) {
          return (index==0) ? today : future[index];
        }

        function getValOf(thisDay, prop) {
          if (thisDay==today) {
            if (prop=='weather'||prop=='humid') {
              return {
                'weather':thisDay.weather,
                'humid':future[0].avehumidity+'%'
              }[prop];
            }
            if (metricUnit===true) {
              return {
                'temp':thisDay.temp_c+'°C',
                'wind':thisDay.wind_kph+' kph',
                'rain':thisDay.precip_today_metric+' mm'
              }[prop];
            } else {
              return {
                'temp':thisDay.temp_f+'°F',
                'wind':thisDay.wind_mph+' mph',
                'rain':thisDay.precip_today_in+' in'
              }[prop];
            }
          } else { //future
            if (prop=='weather'||prop=='humid') {
              return {
                'weather':thisDay.conditions,
                'humid':thisDay.avehumidity+'%'
              }[prop];
            }
            if (metricUnit===true) {
              return {
                'temp':(parseInt(thisDay.low.celsius)+parseInt(thisDay.high.celsius))/2+'°C',
                'wind':thisDay.avewind.kph+' kph',
                'rain':thisDay.qpf_allday.mm+' mm'
              }[prop];
            } else {
              return {
                'temp':(parseInt(thisDay.low.fahrenheit)+parseInt(thisDay.high.fahrenheit))/2+'°F',
                'wind':thisDay.avewind.mph+' mph',
                'rain':thisDay.qpf_allday.in+' in'
              }[prop];
            }
          }
        }

        function getVizFor(WUicon) {
          for (i=0;i<keys.length;i++) {
            var key=Wicons[keys[i]];
            if (key.WUicon.indexOf(WUicon)>-1) {
              return key;
            }
          }
        }
        /*===========================
        Fixed Data (Executes 1 time)
        ===========================*/
        $('.city').html(city.toUpperCase());
        
        $Days.each(function(index) {
          var thisDay=todayOrFuture(index);
          var thisDayViz=getVizFor(thisDay.icon);
          if (thisDay==today) {
            $(this).find('.date').html(future[index].date.weekday_short.toUpperCase()+', '+future[index].date.day+' '+future[index].date.monthname_short.toUpperCase());
          } else {
            $(this).find('.date').html(future[index].date.weekday_short.toUpperCase());
          }
          $(this).find('.icon i').attr('class','wi '+thisDayViz.icon);
          if (timeCheck) {
            $(this).addClass(thisDayViz.css);
          } else {
            $(this).addClass('night'+thisDayViz.css);
          }
        });

        /*===========================
        Dynamic Data (Excutes w/ every button click)
        ===========================*/
        function updateData(prop) {
          $Days.each(function(index) {
            var thisDay=todayOrFuture(index);
            $(this).find('.data').html(getValOf(thisDay, prop));
            if (prop=='weather') {$(this).find('.data').html(getValOf(thisDay, 'temp')).append('<span class="extra">'+getValOf(thisDay, prop)+'</span>');
            }
          });
        }
        /*===========================
                Initial Data
        ===========================*/
        updateData(prop);
        /*===========================
               Button Functions
        ===========================*/
        function selectProp(wicon) {
          return {
            'wi-day-sunny':'weather',
            'wi-humidity':'humid',
            'wi-strong-wind':'wind',
            'wi-umbrella':'rain',
          }[wicon];
        }

        $('i').on('click', function() {
          var icon=$(this).attr('class').split(' ');
          icon=icon[1];
          if (icon=='wi-fahrenheit'||icon=='wi-celsius') {
            metricUnit=!metricUnit;
            var unit=(metricUnit==true)?'wi wi-fahrenheit wi-fw':'wi wi-celsius wi-fw';
            $(this).attr('class',unit);
            updateData(prop);
          } else {
            prop=selectProp(icon)
            updateData(prop);
          }
        });
      },//end of success: 
    });//end of ajax()
  } //end of success()
  
  function error(err) {
    alert(err.message);
  }
       
});//end of doc ready