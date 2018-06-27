/* 
* Hi and Welcome to Codepen!
*
* 
* @igcorreia | https://twitter.com/igcorreia
*
* I will keep publishing examples to help push the web foward.
* PLEASE Like, Heart or Share if you like, and don't forget to follow. 
* Thanks.
*
* Now let's animate it :)
*/

var  url    = 'http://featuredwall.ignaciocorreia.com/api.php'
    ,prdcs  = $('#products')
    ,tl
    ,next  = $('#next')
    ,prev  = $('#prev')
    ,total
;
$(document).ready(function(){  
 
//Get Chars
var name = new SplitText("#featured", {type:"chars"})
   ,numTitleChars = name.chars.length;

   TweenMax.set('#featured', {visibility:"visible"});
   TweenMax.staggerFromTo(name.chars, 0.8,
                 {autoAlpha:1,scaleX:0,scaleY:0,x:0,y:100},
                 {autoAlpha:1,scaleX:1,scaleY:1,x:0,y:0,ease:Back.easeOut},
                 0.03, "+=1");  
  
   goAgain();
  
});

function goAgain(){
 //RESET STAGE
  prdcs.html('');
  tl = new TimelineMax({repeat:-1,delay:2,yoyo:true,onComplete:goAgain,onUpdate:updateSlider});
  $.getJSON(url,function(data) {
    
    //console.log(data);
    total = data.posts.length;
    
    $.each(data.posts, function(index, obj) {

      var  name  = obj.name
          ,thumb = obj.screenshot_url['300px']
          ,votes = obj.votes_count
          ,link  = obj.discussion_url + '?ref=igcorreia'
          ,avatar= obj.user.image_url['100px']
          ,tag   = obj.tagline

      ;

      product ='<a href="'+link+'" target="_blank" data-position="'+index+'" class="product product'+index+'">'
                +'<div class="circle"><img src="'+avatar+'" alt="" /></div>'
                +'<div class="thumb"><img src="'+thumb+'" alt="" /></div>'
                +'<div class="name">'+name+'</div>'
                +'<div class="tag">'+tag+'</div>'
                +'<div class="votes"><span>'+votes+'</span></div>'
              +'</a>';

      prdcs.append(product);
      
      var animationLabel = 'product'+index;
      
      tl.set('.product'+index,{scale:0})
      tl.to('.product'+index , 1,{scale:1,autoAlpha:1, ease:Elastic.easeInOut, className:"+=activeslide"},animationLabel);
      tl.to('.product'+index , 8,{autoAlpha:1});
      tl.to('.product'+index , 1,{scale:0,autoAlpha:0, ease:Elastic.easeInOut, className:"-=activeslide"});
    });
  });
  tl.play();  
}

function updateSlider(){
 // console.log('update');
  var activeSlide = $('.activeslide').data('position');
  
  
  if(activeSlide != undefined){
    //console.log(activeSlide);
    next.click(function(event) {
      /* Act on the event */
      //console.log('Play Next:' + (activeSlide + 1));
      if( activeSlide < total ){
        tl.play('product'+(activeSlide + 1));  
      }
    });

    $("body").keydown(function(e) {
      if(e.keyCode == 39) { // right
        if( activeSlide < total ){
          tl.play('product'+(activeSlide + 1));  
        }
      }
      if(e.keyCode == 37) { // left
        if( activeSlide > 0 ){
            tl.play('product'+(activeSlide - 1));
        }
      }
    });
    
    prev.click(function(event) {
      /* Act on the event */
      //console.log('Play Next:' + (activeSlide - 1));
      if( activeSlide > 0 ){
        tl.play('product'+(activeSlide - 1));
      }
    });
  }
}
