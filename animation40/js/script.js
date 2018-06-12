$(document).ready(function(){
	
  var s = Snap('#drinkingMan');
  var leftHand = s.select('#left-hand');
  var beer = s.select('#beer');
  var leftArm = s.select('#left-arm');
  var rightArm = s.select('#right-arm');
  var body = s.select('#body');
  var head = s.select('#head');
  
 
  
  var myMatrix = new Snap.Matrix();
  myMatrix.rotate(55,0,0);
  //myMatrix.translate(80,-130);
  
drink();

 function drink() {

  leftArm.stop().animate(
    {transform:'r65,70,150'}
    ,800, 
    function(){ 
				leftArm.animate(
          { transform: 'r70,70,150'},
          800, 
       		function(){ 
						leftArm.animate(
              { transform: 'r0,70,150'},
              800
            );					
					}
    );}
  ); 

    leftHand.stop().animate(
    {transform:'r-110,13,185' },
    800, 
    function(){  
				leftHand.animate(
          { transform: 'r-115,13,185'},
          800,
          function() {
          	leftHand.animate(
          { transform: 'r0,13,185'},
          800);
   
        }
          );						
			}              
  );

  body.animate(
    {transform:'r3, 100,240'},
    800,
    function(){ 
     body.animate(
       {transform:'r3, 100,240'},
       800,
  		 function(){ 
     			body.animate(
            {transform:'r0, 100,240'},
            800
          );
   		 } 
     );
    }             
  );
    
	head.animate(
     {transform:'r3, 100,240'},
     800,
     function(){ 
     		head.animate(
          {transform:'r3, 100,240'},
          800,
  				function(){ 
    			 head.animate(
             {transform:'r0, 100,240'},
             800
           );
   				} 
        );
     }             
  );
  
   rightArm.stop().animate(
     {transform: 'r5, 180, 180'},
     800, 
     function() {
    		rightArm.stop().animate(
          {transform: 'r5, 180, 180'},
          800,
          function() {
              rightArm.stop().animate(
                {transform: 'r0, 180, 180'},
                800
              );
           }
        );
  	 }
   );
   
   beer.stop().animate(
     {transform:'r40,80,255' },
     800,
   	 function(){  
					beer.animate(
            { transform: 'r35,80,255'},
            800,
            function(){
            		beer.stop().animate(
                  { transform: 'r0,80,255'},
                  800
                );
            }
          );             			
			}                        
   );
   
   

 }//end drink  
  
 setInterval(function(){ drink() }, 4500);


  
  
  
}); 

