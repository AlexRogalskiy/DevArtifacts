var interval = null;
			$(document).ready(function(){
			  generate_blocks();
			  interval = setInterval("update_blocks(false)",200);
			});

			var points = 0;
			var y_arr = [];

			function y_count(arr) {
			    var a = [], b = [], prev;
			    
			    arr.sort();
			    for ( var i = 0; i < arr.length; i++ ) {
			        if ( arr[i] !== prev ) {
			            a.push(arr[i]);
			            b.push(1);
			        } else {
			            b[b.length-1]++;
			        }
			        prev = arr[i];
			    }
			    
			    return [a, b];
			}

			function update_blocks(row_removed){
				var move = true;
				var y_const = 215;
				y_arr = [];
				$(".active > .cube").each(function(){
				  	if($(this).attr("data-y") > 41){
				    	move = false;
				  	}
				  	$(this).css("z-index",Math.round($(this).offset().top+((1/$(this).offset().left)*100)));
				  	var active_cube = $(this);
			  	
				  	$(".cube").each(function(){
				  		var classes = $(this).parent().attr("class").split(" ");
				  		var ignore = false;
				  		for(var i = 0; i<classes.length;i++){
				  			if(classes[i] == "active" || classes[i] == "ref"){
				  				ignore = true;
				  			}
				  		}
				  		if(ignore){

				  		}
				  		else{
				  			var x = $(this).offset().left;
				  			var y = $(this).offset().top;

				  			var a_x = active_cube.offset().left+12.7;
				  			var a_y = active_cube.offset().top+9;

				  			if(x >= a_x-6 && x <= a_x+6){
				  				if(y >= a_y-6 && y <= a_y+6){
				  					move = false;
				  				}
				  			}
				  		}
				  	});
				});
				if(move){
					if($(".active").length != 0){
			    		$(".active").css("top",$(".active").offset().top+9+"px");
						$(".active").css("left",$(".active").offset().left+12.7+"px");
					}	
				}	
				else{
					$(".active").removeClass("active");
					points++
					if(row_removed){

					}
					else{
						$.when(generate_blocks()).done(function( x ) {
						  console.log("finished generating block... continue")
						});
					}
				}
				$(".points").html(points);
				$(".cube").each(function(){
					var y = Math.round((($(this).offset().top-50)+(($(this).offset().left-31)/12.7)*9)/9)-58;
			  		var x = 0;
			  		$(this).attr("data-y",y);
			  		if(y < 0){

			  		}else{
			  			y_arr.push(y);
			  		}
				});
				//console.log("X:" + x + ", Y: " + y + " | " + $(this).attr("class"));
			  	var array = y_count(y_arr);
			  	var objects = array[0];
			  	var counts = array[1];
			  	var y_full = 0;
			  	var row_removed=false;
			  	for(var i=0;i<counts.length;i++){
			  		if(counts[i] >= 21){
			  			y_full = objects[i];
			  			$(".cube").each(function(){
					  		if($(this).attr("data-y")==y_full){
					  			$(this).remove();
					  			row_removed = true;
					  			$(".active").removeClass("active");
					  		}
					  	});
			  		}
			  	}
			  	array =[];
			  	$(".cube").each(function(){
			  		if(row_removed){
			  			clearInterval(interval);
			  			var classes = $(this).parent().attr("class").split(" ");
				  		var ignore = false;
				  		for(var i = 0; i<classes.length;i++){
				  			if(classes[i] == "active" || classes[i] == "ref"){
				  				ignore = true;
				  			}
				  		}
				  		if(ignore){

				  		}
				  		else{
			  				$(this).parent().addClass("active");
			  				update_blocks(true);
			  			}
			  		}
			  	});
			  	if(row_removed){
			  		points+=10;
			  		row_removed = false;
			  		interval = setInterval("update_blocks(false)",200);
			  	}
			}

			function sleepFor( sleepDuration ){
			    var now = new Date().getTime();
			    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
			}

			function generate_blocks(){
				$(".lrpiece").addClass("active");
				var r_no = (Math.floor((Math.random() * 0.7)*10))/10;
				var block_generate = null;
				if(r_no == 0){
					block_generate = "tpiece";
				}
				else if(r_no == 0.1){
					block_generate = "lpiece";
				}
				else if(r_no == 0.2){
					block_generate = "lrpiece";
				}
				else if(r_no == 0.3){
					block_generate = "cpiece";
				}
				else if(r_no == 0.4){
					block_generate = "spiece";
				}
				else if(r_no == 0.5){
					block_generate = "srpiece";
				}
				else if(r_no == 0.6){
					block_generate = "ipiece";
				}
				else{
					console.log("/!\\ ERROR: Random Number Generate falls outwith cats");
					var error = true;
					generate_blocks();
				}
				if(!error){
					$(".active").removeClass("active");
					$(document.body).append("<div class='"+block_generate+" deg0 active'>"+$("."+block_generate+"ref").html()+"</div>");
				}
			}

			$(document).keydown(function(e){
			  if (e.keyCode == 65) { 
			    //left (A)
			    if($(".active.deg0").length != 0){
			      $(".active.deg0").addClass("deg270").removeClass("deg0");
			    }
			    else if($(".active.deg270").length != 0){
			      $(".active.deg270").addClass("deg180").removeClass("deg270");
			    }
			    else if($(".active.deg180").length != 0){
			      $(".active.deg180").addClass("deg90").removeClass("deg180");
			    }
			    else if($(".active.deg90").length != 0){
			      $(".active.deg90").addClass("deg0").removeClass("deg90");
			    }
			    return false;
			  }
			  else if (e.keyCode == 83) { 
			    //RIGHT (S)
			    if($(".active.deg0").length != 0){
			      $(".active.deg0").addClass("deg90").removeClass("deg0");
			    }
			    else if($(".active.deg90").length != 0){
			      $(".active.deg90").addClass("deg180").removeClass("deg90");
			    }
			    else if($(".active.deg180").length != 0){
			      $(".active.deg180").addClass("deg270").removeClass("deg180");
			    }
			    else if($(".active.deg270").length != 0){
			      $(".active.deg270").addClass("deg0").removeClass("deg270");
			    }
			    return false;
			  }
			  else if (e.keyCode == 40) { 
			  	update_blocks(false);
			  }
			  else if (e.keyCode == 37) { 
			    //MOVE LEFT (arrow left)
			    console.log("LEFT");
			    var move = true;
				$(".active > .cube").each(function(){
				  	if($(this).offset().left < 32 + (($(this).offset().top-200)/9)*12.7){
				    	move = false;
				  	}
				});
				if(move){
					if(check_left() && $(".active").length != 0){
			    		$(".active").css("top",$(".active").offset().top+9+"px");
			    		$(".active").css("left",$(".active").offset().left-12.7+"px");
			    	}
			    }
			  }
			  else if (e.keyCode == 39) { 
			    //MOVE RIGHT (arrow right)
			    console.log("RIGHT");
			     var move = true;
				$(".active > .cube").each(function(){
				  	if($(this).offset().left > 32 + (($(this).offset().top+138)/9)*12.7){
				    	move = false;
				  	}
				});
				if(move){
					if(check_right() && $(".active").length != 0){
			    		$(".active").css("top",$(".active").offset().top-9+"px");
			   			$(".active").css("left",$(".active").offset().left+12.7+"px");
			   		}
			   	}
			  }	
			});

			function check_left(){
				var move = true;
				$(".active > .cube").each(function(){
					$(this).css("z-index",Math.round($(this).offset().top+((1/$(this).offset().left)*100)));
				  	var active_cube = $(this);
				  	$(".cube").each(function(){
				  		var classes = $(this).parent().attr("class").split(" ");
				  		var ignore = false;
				  		for(var i = 0; i<classes.length;i++){
				  			if(classes[i] == "active" || classes[i] == "ref"){
				  				ignore = true;
				  			}
				  		}
				  		if(ignore){

				  		}
				  		else{
				  			var x = $(this).offset().left;
				  			var y = $(this).offset().top;

				  			var a_x = active_cube.offset().left-12.7;
				  			var a_y = active_cube.offset().top+9;

				  			if(x >= a_x-5 && x <= a_x+5){
				  				if(y >= a_y-5 && y <= a_y+5){
				  					move = false;
				  				}
				  			}
				  		}
				  	});
				});
				return move;
			}

			function check_right(){
				var move = true;
				$(".active > .cube").each(function(){
					$(this).css("z-index",Math.round($(this).offset().top+((1/$(this).offset().left)*100)));
				  	var active_cube = $(this);
				  	$(".cube").each(function(){
				  		var classes = $(this).parent().attr("class").split(" ");
				  		var ignore = false;
				  		for(var i = 0; i<classes.length;i++){
				  			if(classes[i] == "active" || classes[i] == "ref"){
				  				ignore = true;
				  			}
				  		}
				  		if(ignore){

				  		}
				  		else{
				  			var x = $(this).offset().left;
				  			var y = $(this).offset().top;

				  			var a_x = active_cube.offset().left+12.7;
				  			var a_y = active_cube.offset().top-9;

				  			if(x >= a_x-5 && x <= a_x+5){
				  				if(y >= a_y-5 && y <= a_y+5){
				  					move = false;
				  				}
				  			}
				  		}
				  	});
				});
				return move;
			}