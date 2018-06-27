/* 
* Hi and Welcome to Codepen!
*
* My name is Ignacio and I am looking for a Dribble invitation.
* Please contact me via twitter if you have 1, 
* I would like to have 1 hehe :)
* 
* I will keep publishing examples to help push the web foward.
* PLEASE Like, Heart or Share if you like, and don't forget to follow. 
* Thanks.
*
* Now let's animate it :)
*/

$(document).ready(function(){
  var  $v01  = $('.vertical0')
  		,$v02  = $('.vertical1')
  		,$v03  = $('.vertical2')
  		,$v04  = $('.vertical3')
  		,$v05  = $('.vertical4')
      ,$v06  = $('.vertical5')
      ,$v07  = $('.vertical6')
      ,$v08  = $('.vertical7')
      ,$v09  = $('.vertical8')
      ,$v10  = $('.vertical9')
  		,$login= $('.modal')
  		,speed = 60
  		,tl = new TimelineLite({onComplete:restart});
  
  		tl.fromTo($v01,speed*0.70,{y:-250} ,{y:-750} ,'sync')
  			.fromTo($v02,speed*0.75,{y:-950} ,{y:-1250},'sync')
  			.fromTo($v03,speed*0.95,{y:-1000},{y:-1850},'sync')
  			.fromTo($v04,speed*0.75,{y:-1250},{y:-1750},'sync')
  			.fromTo($v05,speed*0.85,{y:-1100},{y:-2000},'sync')
      	.fromTo($v06,speed*0.65,{y:-900},{y:-1950},'sync')
      	.fromTo($v07,speed*0.70,{y:-1300},{y:-2100},'sync')
      	.fromTo($v08,speed*0.95,{y:-850},{y:-1460},'sync')
        .fromTo($v09,speed*0.55,{y:-1000},{y:-1750},'sync')
        .fromTo($v10,speed*0.80,{y:-1200},{y:-1600},'sync')
  			.fromTo($login,1,{scale:0,autoAlpha:0},{scale:1,autoAlpha:1, ease:Elastic.easeInOut},'sync');
  		
  		tl.play();
  
      function restart(){
        tl.stop();
        tl.restart();
      }
});

 