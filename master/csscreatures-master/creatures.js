function prettyDate(e){var t=new Date((e||"").replace(/-/g,"/").replace(/[TZ]/g," ")),a=((new Date).getTime()-t.getTime())/1e3,o=Math.floor(a/86400);if(!(isNaN(o)||o<0||o>=31))return 0==o&&(a<60&&"Just now"||a<120&&"1 minute ago"||a<3600&&Math.floor(a/60)+" minutes ago"||a<7200&&"1 hour ago"||a<86400&&Math.floor(a/3600)+" hours ago")||1==o&&"1 day ago"||o<7&&o+" days ago"||7==o&&"1 week ago"||o<31&&Math.ceil(o/7)+" weeks ago"}function randomAnimationTiming(e){return"animation-duration: "+Math.floor(100*(e/2+Math.random()*e))/100+"s; animation-delay: -"+Math.floor(100*(e/2+Math.random()*e))/100+"s"}function getColor(e){var t=e.match(/(#?([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?)/gm),a=["aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|transparent|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen"],o=e.match(RegExp("\\b"+a+"\\b"));if(t)i=t[0];if(o)var i=o[0];return console.log(i),void 0==i?(console.log("undefined!! ^^ "),""):"background-color: "+i+"; "}function getTweets(){var e=Math.random().toString(36).substring(7),t=new XMLHttpRequest;t.open("GET","search.php?"+e,!0),t.onload=function(){var e=this.status;if(200==e){var t=JSON.parse(this.response);console.log(t.errors),console.log("b"),void 0!==t.errors?defaultTweets("Too busy!","We're really sorry, there's a lot of people visiting right now and we can't keep up. Please come back another time."):t.statuses.length>0?parseTweets(t):defaultTweets("Where is everyone?","Be the first to have your creature here! Send a tweet to @csscreatures!")}420!=e&&429!=e||defaultTweets("Too busy!","We're sorry, there's a lot of people visiting right now and we can't keep up. Please come back another time."),500!=e&&502!=e||defaultTweets("Twitter is down!","It looks like Twitter isn't working right now. You'll have to come back another time.")},t.onerror=function(){defaultTweets("Oh no!","Something isn't working. Please com eback another time.")},t.send()}function parseTweets(e){if(e.statuses.length>0)for(i=0,len=e.statuses.length;i<len;++i){var t=e.statuses[i];e.statuses.length>3?2==i&&(document.querySelector(".creatures").innerHTML+=carbon_ad):1==i&&(document.querySelector(".creatures").innerHTML+=carbon_ad),1==e.statuses.length?(buildCreature(t,i),document.querySelector(".creatures").innerHTML+=carbon_ad):buildCreature(t,i)}else defaultTweets()}function defaultTweets(e,t){var a='<div class="item default-box creature-box mod-tooth mod-sad"><div class="creature" style="background-color: tomato; animation-duration: 5.33s; animation-delay: -6.11s"><div class="face" style="animation-duration: 6s; animation-delay: -7s"><div class="eyes"><div class="eye" style="animation-duration: 6s; animation-delay: -5s"></div><div class="eye" style="animation-duration: 6s; animation-delay: -5s"></div></div><div class="mouth"><div class="tooth"></div></div></div></div><div class="info"><h2>'+e+"</h2><h3>"+t+"</h3></div></div>";document.querySelector(".creatures").innerHTML+=a,document.querySelector(".creatures").innerHTML+=carbon_ad}function buildCreature(e,t){for(var a=e.text.replace("@csscreatures ","").toLowerCase(),o=[],i=[{mod:"angry",syn:"furious|mad|shake|shaking"},{mod:"camouflage",syn:"camo|ghillie|hidden|military|soldier|troop"},{mod:"cyclops",syn:"one-eye|one-eyed|monster|wazowski"},{mod:"dark",syn:"black|#000|#000000"},{mod:"ghost",syn:"casper|scary|spooky"},{mod:"hungry",syn:"eating|fat|plump|talk|talking"},{mod:"hyper",syn:"animated|excited|happy|pumped|super"},{mod:"jack-o-lantern",syn:"halloween|pumpkin"},{mod:"moustache",syn:"mustache|hairy"},{mod:"nervous",syn:"anxious|scared"},{mod:"sad",syn:"crying|depressed|upset"},{mod:"sleepy",syn:"asleep|sleep|sleeping|sleepy|tired|rest|resting|quiet"},{mod:"square",syn:"box|boxy|minecraft|robot|robotic"},{mod:"tall",syn:"big|giant|gigantic|huge|skinny|thin"},{mod:"tiny",syn:"baby|dwarf|little|mini|miniature|petite|short|small"},{mod:"teeth",syn:"smile|smiling"},{mod:"transparent",syn:"checker|checkerboard|checkered|invisible|see-through|translucent"},{mod:"tooth",syn:"hillbilly"},{mod:"upside-down",syn:"backwards|upsidedown|rollover"},{mod:"wink",syn:"winking"}],n=0;n<i.length;n++){var r=RegExp("\\b"+i[n].mod+"|"+i[n].syn+"\\b");a.match(r)&&o.push("mod-"+i[n].mod)}var s='<div class="eye" style="'+randomAnimationTiming(5)+'"></div>',l='<div class="eyes">'+s+s+"</div>";if(o.indexOf("mod-cyclops")>-1)l='<div class="eyes">'+s+"</div>";d="";if(o.indexOf("mod-moustache")>-1)var d='<svg class="moustache" xmlns="http://www.w3.org/2000/svg" viewBox="83 299 443 121" preserveAspectRatio="none" width="220" height="60"><path d="M407 338C402 336 398 332 395 330 382 318 364 300 338 300 325 300 313 305 305 313 296 305 284 300 271 300 245 300 227 318 215 330 211 332 207 336 202 338 126 377 84 345 84 345 151 462 265 411 295 390 299 388 302 386 305 383 307 386 311 388 314 390 344 411 459 462 526 345Z" fill="#3F1F13"/></svg>';var c='<div class="tooth"></div>',u='<div class="mouth"></div>';if(o.indexOf("mod-tooth")>-1)u='<div class="mouth">'+c+"</div>";if(o.indexOf("mod-teeth")>-1||o.indexOf("mod-jack-o-lantern")>-1)u='<div class="mouth">'+c+c+"</div>";var m='<div id="'+("creature_"+t)+'" class="item creature-box '+o.join(" ")+'"><div class="creature" style="'+getColor(a)+randomAnimationTiming(5)+'"><div class="face" style="'+randomAnimationTiming(5)+'">'+l+d+u+'</div></div><div class="info"><h3><a href="https://twitter.com/'+e.user.screen_name+"/status/"+e.id_str+'">@'+e.user.screen_name+"</a></h3><h3>"+prettyDate(e.created_at)+"</h3></div></div>";document.querySelector(".creatures").innerHTML+=m}function handleDirectionsToggle(){for(var e=document.querySelectorAll(".directions-toggle"),t=(document.querySelector(".directions-box"),document.querySelector(".creatures")),a=0;a<e.length;a++)e[a].addEventListener("click",function(){document.querySelector("html").classList.toggle("showing-directions"),window.scrollTo(0,0)});t.addEventListener("click",function(){document.querySelector("html").classList.contains("showing-directions")&&(document.querySelector("html").classList.remove("showing-directions"),window.scrollTo(0,0))})}function autoPause(){var e=document.createElement("style");document.querySelector("body").appendChild(e),document.addEventListener("visibilitychange",function(){document.hidden?e.innerHTML="* { animation-play-state: paused !important; }":setTimeout(function(){e.innerHTML=""},300)})}function init(){getTweets(),handleDirectionsToggle(),autoPause()}var carbon_ad='<div class="item ad-box"><script type="text/javascript" src="//cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=bennettfeelycom" id="_carbonads_js"><\/script></div>',carbon_ad="";init();