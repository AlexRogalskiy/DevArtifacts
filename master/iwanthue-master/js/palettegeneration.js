var palette = false,
	locks = []

var initVisualPalette = function(noTransition){
	var colorCount = parseInt($('#colorsCount').val());
	var html = "";
	for(i=0; i<colorCount; i++){
		html += '<div id="palette_item_'+i+'" class="palette_item '+(($('#darkBackground').is(':checked'))?('dark'):('light'))+'">'
		+'<div id="palette_color_'+i+'" class="'+((noTransition || locks[i])?('colored '):(''))+'palette_color"><i class="icon-lock icon-white palette_item_lock_icon" id="palette_item_lock_icon_'+i+'" style="opacity:0"></i></div>'
		+'<div class="palette_item_buttons btn-group-vertical" id="palette_item_buttons_'+i+'" style="display:none;">'
		+'<button class="btn btn-mini btn-danger" title="Remove" onclick="paletteItem_remove('+i+')"><i class="icon-remove icon-white"></i></button>'
		+'<button class="btn btn-mini" title="Edit"   onclick="paletteItem_edit('+i+')"><i class="icon-pencil"></i></button>'
		+'<button class="btn btn-mini" title="Lock"   onclick="paletteItem_toggleLock('+i+')"><i class="icon-lock"></i></button>'
		+'</div>'
		+'</div>'

		locks.push(false)
	}
	$('#palette_visual').html(html);
	
	$('#palette_hex_container').hide();
	$('#palette_visual_sort').hide();
}

var sortPalette = function (mode) {
	var colors = palette.map(function(d){
		return chroma.hex(d.hex)
	})
	switch (mode) {
		case 'difference':
			var dType = $('#colorblindFriendly').is(':checked') ? ('Compromise') : ('Default')
			drawPalette(paletteGenerator.diffSort(colors, dType), matchings);
			break;
		case 'hue':
			colors.sort(function(a, b){
				return a.hcl()[0] - b.hcl()[0]
			})
			drawPalette(colors, matchings);
			break;
		case 'chroma':
			colors.sort(function(a, b){
				return a.hcl()[1] - b.hcl()[1]
			})
			drawPalette(colors, matchings);
			break;
		case 'lightness':
			colors.sort(function(a, b){
				return a.hcl()[2] - b.hcl()[2]
			})
			drawPalette(colors, matchings);
			break;
		case 'random':
			drawPalette(shuffle(colors), matchings);
			break;
		default:
			console.log('unknown sort mode')
			break;
	}

	function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}
}

var drawPalette = function(colors, _matchings){
	matchings = _matchings	// Cache needed for palette reordering

	for(var i=0; i<colors.length; i++){
		$('#palette_color_'+i).css('background-color', colors[i].hex());
		$('#palette_color_'+i).attr('title', colors[i].hex());
		$('.palette_color').addClass('colored');
		
		if(locks[i]){
			$('#palette_item_lock_icon_'+i).css("opacity",100)
		} else {
			$('#palette_item_lock_icon_'+i).css("opacity",0)
		}

		$('#palette_item_'+i).unbind();
		$('#palette_item_'+i).mouseover(function(event){
			var muteColor = ($('#darkBackground').is(':checked'))?('#222222'):('#DDDDDD');
			var i = event.currentTarget.id.split("_")[2];
			var m = matchings[''+colors[i].hex()].join("|");
			s.graph.nodes().forEach(function(n){
				if(m.indexOf(n.label)<0){
					n.color = muteColor;
				}
			});

			$('#palette_item_buttons_'+i).show()
			$("#palette_item_buttons_"+i).offset({
				// top:100,
				// left:100
				top:$('#palette_color_'+i).offset().top-10,
				left:$('#palette_color_'+i).offset().left+4
			})

			s.refresh();
			s.render();
		});

		$('#palette_item_'+i).mouseout(function(event){
			var i = event.currentTarget.id.split("_")[2];
			var m = matchings[''+colors[i].hex()].join("|");
			s.graph.nodes().forEach(function(n){
				if(m.indexOf(n.label)<0){
					n.color = ''+n.label;
				}
			});
			$('#palette_item_buttons_'+i).hide()
			s.refresh();
			s.render();
		});
	}
	
	// Showing the result
	$('#resultColors_container').show()
	$('#palette_visual_sort').show();
	$('#resultColors').html('')
	colors.forEach(function(color){
		var darkerColor = chroma.rgb(0.85*color.rgb()[0], 0.85*color.rgb()[1], 0.85*color.rgb()[2])
		$('#resultColors').append(
			$('<div class="colorResult-top"/>')
				.css('background-color', color.hex())
		).append(
			$('<div class="colorResult-bottomBorder"/>')
				.css('background-color', darkerColor.hex())
		).append(
			$('<div class="colorResult-bottom"/>').append(
				$('<table/>').append(
					$('<tr/>').append(
						$('<td class="colorResult-value colorResult-hex"/>').text(color.hex())
					).append(
						$('<td class="colorResult-value colorResult-rgb"/>').text(color.rgb().join(','))
					).append(
						$('<td class="colorResult-filler"/>')
					)
				).append(
					$('<tr/>').append(
						$('<td class="colorResult-label"/>').text('HEX')
					).append(
						$('<td class="colorResult-label"/>').text('RGB')
					).append(
						$('<td/>')
					)
				)
			)
		)
	})

	$('#resultColors_hexjson').html('')
	$('#resultColors_hexjson').append(
		$('<pre/>').html(
			JSON.stringify(
				colors.map( function(color){
					return color.hex()
				} )
			).replace(/,/gi, ',<br/>')
		)
	)

	$('#resultColors_rgbjson').html('')
	$('#resultColors_rgbjson').append(
		$('<pre/>').html(
			JSON.stringify(
				colors.map( function(color){
					return color.rgb()
				} )
			).replace(/\],/gi, '],<br/>')
		)
	)

	$('#resultColors_hcljson').html('')
	$('#resultColors_hcljson').append(
		$('<pre/>').html(
			JSON.stringify(
				colors.map( function(color){
					return color.hcl().map(function(d,i){ if(i==0){return Math.round(d)} else return Math.round( 1000 * d ) / 1000 } )
				} )
			).replace(/\],/gi, '],<br/>')
		)
	)
	
	$('#resultColors_labjson').html('')
	$('#resultColors_labjson').append(
		$('<pre/>').html(
			JSON.stringify(
				colors.map( function(color){
					return color.lab().map(function(d){ return Math.round( 1000 * d ) / 1000 } )
				} )
			).replace(/\],/gi, '],<br/>')
		)
	)

	$('#resultColors_hexlist').html('')
	$('#resultColors_hexlist').append(
		$('<pre/>').html(
			colors.map( function(color){
				return color.hex()+'<br/>'
			} )
		)
	)

	$('#resultColors_rgblist').html('')
	$('#resultColors_rgblist').append(
		$('<pre/>').html(
			colors.map( function(color){
				return 'rgb('+color.rgb()[0]+','+color.rgb()[1]+','+color.rgb()[2]+')<br/>'
			} )
		)
	)

	$('#resultColors_jsGeneration').html('')
	var hmin = $('#hmin').val()
		,hmax = $('#hmax').val()
		,cmin = $('#cmin').val()
		,cmax = $('#cmax').val()
		,lmin = $('#lmin').val()
		,lmax = $('#lmax').val()
		,q = 50	// quality
		,useFV = ($('#algo').val()=="forcevector")	// Force vector or kMeans
		,dType = $('#colorblindFriendly').is(':checked') ? ('Compromise') : ('Default')
		,hcondition
		,ccondition
		,lcondition

	if(hmin<hmax)
		hcondition = "hcl[0]>="+hmin+" && hcl[0]<="+hmax
	else
		hcondition = "(hcl[0]>="+hmin+" || hcl[0]<="+hmax+")"
	ccondition = "hcl[1]>="+cmin+" && hcl[1]<="+cmax
	lcondition = "hcl[2]>="+lmin+" && hcl[2]<="+lmax
	$('#resultColors_jsGeneration').append(
		$('<pre class="prettyprint linenums languague-css"/>').text(
			"// Generate colors (as Chroma.js objects)"
			+"\nvar colors = paletteGenerator.generate(\n  "+parseInt($('#colorsCount').val())+", // Colors\n  function(color){ // This function filters valid colors"
			+"\n    var hcl = color.hcl();"
			+"\n    return "+hcondition+"\n      && "+ccondition+"\n      && "+lcondition+";"
			+"\n  },\n  "+(useFV.toString())+", // Using Force Vector instead of k-Means\n  "+q+", // Steps (quality)\n  false, // Ultra precision\n  '"+(dType.toString())+"' // Color distance type (colorblindness)\n);"
			+"\n// Sort colors by differenciation first"
			+"\ncolors = paletteGenerator.diffSort(colors, '"+(dType.toString())+"');"
		).after(
			$('<div/>').html('<strong>Requirements:</strong> This code snippet needs <a href="https://github.com/gka/chroma.js">Chroma.js</a> and our own <a href="js/libs/chroma.palette-gen.js">Palette-Gen</a> lib.')
		)
	)
	prettyPrint()

	updateAdditionalInfo(colors)
}

var resetPaletteColors = function(){
	for(var i=0; i<palette.length; i++){
		$('#palette_color_'+i).css('background-color', palette[i].hex);
	}
}

var reduceToPalette = function(){
	$('#reduceToPalette').html('<i class="icon-refresh"></i> Reroll palette');
	
	initVisualPalette();
	
	// Variables
	var old_palette = false
		,hmin = +$('#hmin').val()
		,hmax = +$('#hmax').val()
		,cmin = +$('#cmin').val()
		,cmax = +$('#cmax').val()
		,lmin = +$('#lmin').val()
		,lmax = +$('#lmax').val()
		,q = 50	// quality
		,useFV = ($('#algo').val()=="forcevector")	// Force vector or kMeans
		,dType = $('#colorblindFriendly').is(':checked') ? ('Compromise') : ('Default')
	if(palette && palette.length>0)
		old_palette = palette.slice(0)

	// Conditions restraining the color space
	var hcondition
		,hcondition_txt
	if(hmin<hmax){
		hcondition = function(hcl){return hcl[0]>=hmin && hcl[0]<=hmax};
		hcondition_txt = "hcl[0]>="+hmin+" && hcl[0]<="+hmax;
	} else {
		hcondition = function(hcl){return hcl[0]>=hmin || hcl[0]<=hmax};
		hcondition_txt = "(hcl[0]>="+hmin+" || hcl[0]<="+hmax+")";
	}
	var ccondition = function(hcl){return hcl[1]>=cmin && hcl[1]<=cmax};
	var ccondition_txt = "hcl[1]>="+cmin+" && hcl[1]<="+cmax;
	var lcondition = function(hcl){return hcl[2]>=lmin && hcl[2]<=lmax};
	var lcondition_txt = "hcl[2]>="+lmin+" && hcl[2]<="+lmax;
	
	// General condition for selecting the color space
	var colorspaceSelector = function(color){
		var hcl = color.hcl();
		return hcondition(hcl) && ccondition(hcl) && lcondition(hcl);
	}
	
	// Generate colors
	var colors = paletteGenerator.generate(parseInt($('#colorsCount').val()), colorspaceSelector, useFV, q, false, dType)
	colors = paletteGenerator.diffSort(colors)
	palette = colors.map( function( color ){ return { color:color, hex:color.hex(), hcl:color.hcl(), lab:color.lab() } } )
	
	// Case: locked colors
	if(old_palette && locks.some( function( d ){ return d } ) ){
		palette = palette.map( function( colorItem, i ){
			return locks[i] ? old_palette[i] : colorItem
		})
		// Correct palette by taking in account the locked colors
		colors = kMeans( palette, getSubColorSpace(), colorspaceSelector, 50 )
		palette = colors.map( function( color ){ return { color:color, hex:color.hex(), hcl:color.hcl(), lab:color.lab() } } )
	}

	$("#refine").hide()
	
	updateColorSpace( colors, true )
}

var updateAdditionalInfo = function (colors) {
	$('#additionalInfo').html('')
	if (colors.length > 10) {
		$('#additionalInfo').append(
			$('<br><br><h3>Differenciation report only available for 10 colors or less</h3>')
		)
	} else {
		var logMessage = ''
		var pairs = []
		colors.forEach(function(c1, i){
			var c1lab = c1.lab()
			var c1hex = c1.hex()
			colors.forEach(function(c2, j){
				var c2lab = c2.lab()
				var c2hex = c2.hex()
				var pair = {
					c1: c1,
					c2: c2,
					c1id: i,
					c2id: j,
					c1hex: c1hex,
					c2hex: c2hex,
					distance: paletteGenerator.getColorDistance(c1lab, c2lab),
					distanceProtanope: paletteGenerator.getColorDistance(c1lab, c2lab, 'Protanope'),
					distanceDeuteranope: paletteGenerator.getColorDistance(c1lab, c2lab, 'Deuteranope'),
					distanceTritanope: paletteGenerator.getColorDistance(c1lab, c2lab, 'Tritanope')
				}
				pairs.push(pair)
			})
		})

		// Append report title
		$('#additionalInfo').append(
			$('<br><br><h3>Differenciation report and color vision deficiency</h3>')
		)

		var average
		var count

		pairs.sort(function(a,b){
			return b.distance - a.distance
		})
		var pairDistances = $('<div></div>')
		average = 0
		count = 0
		pairs.filter(function(pair){ return pair.c1id < pair.c2id })
		.forEach(function(pair){
			displayPair(pairDistances, pair, 'distance')
			average += pair.distance
			count++
		})
		average = Math.round( 10 * average / count ) / 10
		$('#additionalInfo').append(
			$('<h5>Color pairs by distance (average '+average+')</h5>')
				.after(pairDistances)
		)
		logMessage += average+','

		pairs.sort(function(a,b){
			return b.distanceProtanope - a.distanceProtanope
		})
		var pairDistances = $('<div></div>')
		average = 0
		count = 0
		pairs.filter(function(pair){ return pair.c1id < pair.c2id })
		.forEach(function(pair){
			displayPair(pairDistances, pair, 'distanceProtanope')
			average += pair.distanceProtanope
			count++
		})
		average = Math.round( 10 * average / count ) / 10
		$('#additionalInfo').append(
			$('<h5>Color pairs by <em>Protanope</em> distance (average '+average+')</h5>')
				.after(pairDistances)
		)
		logMessage += average+','
			
		pairs.sort(function(a,b){
			return b.distanceDeuteranope - a.distanceDeuteranope
		})
		var pairDistances = $('<div></div>')
		average = 0
		count = 0
		pairs.filter(function(pair){ return pair.c1id < pair.c2id })
		.forEach(function(pair){
			displayPair(pairDistances, pair, 'distanceDeuteranope')
			average += pair.distanceDeuteranope
			count++
		})
		average = Math.round( 10 * average / count ) / 10
		$('#additionalInfo').append(
			$('<h5>Color pairs by <em>Deuteranope</em> distance (average '+average+')</h5>')
				.after(pairDistances)
		)
		logMessage += average+','
			
		pairs.sort(function(a,b){
			return b.distanceTritanope - a.distanceTritanope
		})
		var pairDistances = $('<div></div>')
		average = 0
		count = 0
		pairs.filter(function(pair){ return pair.c1id < pair.c2id })
		.forEach(function(pair){
			displayPair(pairDistances, pair, 'distanceTritanope')
			average += pair.distanceTritanope
			count++
		})
		average = Math.round( 10 * average / count ) / 10
		$('#additionalInfo').append(
			$('<h5>Color pairs by <em>Tritanope</em> distance (average '+average+')</h5>')
				.after(pairDistances)
		)
		logMessage += average

		console.log('Average distances for different cases\n'+logMessage)
	}
		
	function displayPair(el, pair, distance) {
		var n = Math.round(pair[distance] * 10) / 10
		var note = noteDistance(n)
		el.append(
			$('<div class="row" style="height:20px; margin-bottom: 12px;"></div>')
			.append(
				$('<div class="span1" style="text-align: right;">'+pair.c1hex+'</div>')
				.after(
					$('<div class="span2" style="text-align: center; font-size: 24px; height: 20px; overflow: hidden;"></div>')
					.append(
						$('<span style="padding: 0px 6px 0px 6px; background-color:'+pair.c1hex+'; color:'+pair.c2hex+';">&nbsp;</span>')
						.after($('<span style="padding: 0px 6px 0px 6px; background-color:'+pair.c1hex+'; color:'+pair.c2hex+';">&#8226;&#8226;</span>'))
						.after($('<span style="padding: 0px 6px 0px 6px; background-color:'+pair.c2hex+'; color:'+pair.c1hex+';">&#8226;&#8226;</span>'))
						.after($('<span style="padding: 0px 6px 0px 6px; background-color:'+pair.c2hex+'; color:'+pair.c1hex+';">&nbsp;</span>'))
						.after($('<span>&nbsp;&nbsp;</span>'))
						.after($('<span style="padding: 0px 0px 0px 0px; color:'+pair.c1hex+';">&#8226;&#8226;&#8226;</span>'))
						.after($('<span style="padding: 0px 0px 0px 0px; color:'+pair.c2hex+';">&#8226;&#8226;&#8226;</span>'))
					)
				)
				.after(
					$('<div class="span1">'+pair.c2hex+'</div>')
				)
				.after(
					$('<div class="span1">'+n+'</div>')
				)
				.after(
					$('<div class="span1" style="font-size: 22px;">'+note+'</div>')
				)
			)
		)
	}

	function noteDistance(distance) {
		if (distance < 20) return '&#128556;'
		if (distance < 40) return '&#128577;'
		if (distance < 60) return '&#128528;'
		if (distance < 90) return '&#128578;'
		return '&#128516;'
	}

}



// Palette items buttons 
function paletteItem_toggleLock(i){
	locks[i] = !locks[i]

	initVisualPalette(true)
	drawPalette(palette.map(function(c){return c.color;}), {})
	updateColorSpace(palette.map(function(c){return c.color;}), true)
	initFitting()
}

function paletteItem_remove(i){
	var colorCount = parseInt($('#colorsCount').val())
	$('#colorsCount').val(colorCount- 1)

	$('#palette_item_'+i).remove()

	palette = palette.filter(function(d,index){
		return index != i
	})
	locks = locks.filter(function(d,index){
		return index != i
	})
	
	initVisualPalette(true)
	drawPalette(palette.map(function(c){return c.color;}), {})
	updateColorSpace(palette.map(function(c){return c.color;}), true)
	initFitting()
}

function paletteItem_edit(i){
	colorpicker.pick(palette[i].color)
	$('#colorPicker_modal').modal('show')
	$('#colorPicker_pickButton').unbind()
	$('#colorPicker_pickButton').click(function(){
		var color = colorpicker.pickedColor
		palette[i] = {color:color, hex:color.hex(), hcl:color.hcl(), lab:color.lab()}

		$('#colorPicker_modal').modal('hide')

		initVisualPalette(true)
		drawPalette(palette.map(function(c){return c.color;}), {})
		updateColorSpace(palette.map(function(c){return c.color;}), true)
		initFitting()
	})
}

function setting_toggle(){
	if (palette) {
		updateColorSpace(palette.map(function(c){return c.color;}), true)
		initFitting()
	}
}
