			var cube = document.getElementById('inner_cube'),
				childArray = cube.childNodes,
			 	len = childArray.length;
			
			for( len > 0; len-=1; ) {
				if (childArray[len].nodeType != 1) { continue; } 
				var x = Math.floor( Math.random() * 200 ) + 1,
				 	y = Math.floor( Math.random() * 200 ) + 1,
					z = Math.floor( Math.random() * 200 ) + 1,
					rotX = Math.floor( Math.random() * 360 ) + 1,
					rotY = Math.floor( Math.random() * 360 ) + 1,
					rotZ = Math.floor( Math.random() * 360 ) + 1;
					
					thisObj = childArray[len];
					thisObj.style.webkitTransform = 'translate3d('+x+'px,'+y+'px,'+z+'px) rotateX('+rotX+'deg) rotateY('+rotY+'deg) rotateZ('+rotZ+'deg)';
			}
