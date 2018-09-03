
function loadjscssfile(filename, filetype) {
    
    if (filetype=="js") { 

        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype=="css") { 

        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }

    if (typeof fileref!="undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}



function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
       window.onload = func
    } else {
       window.onload = function() {
           if (oldonload) {
                  oldonload()
          }
          func()
       }
   }
} 


function loadResources(thisId) {

   var firstWaDiv = $('.wascript:first');
       
       var firstId = $(firstWaDiv).attr('id');
       
       if(firstId == thisId) {

            loadjscssfile("bkgeffect_resources/WA.js", "js");
            loadjscssfile("bkgeffect_resources/modernizr.custom.43133.js", "js");
            loadjscssfile("bkgeffect_resources/spin.min.js", "js");

            loadjscssfile("bkgeffect_resources/JQ_Textualizer.js", "js");
            loadjscssfile("bkgeffect_resources/WA.css", "css");            
       }
	   
	   loadjscssfile("bkgeffect_resources/ani.css", "css");                          
}
	currentTimeline = 4;
	runCount = 0;




function bkgeffectstart() {    

    try
    {   
        if($.browser.msie) 
		{
			if(parseInt($.browser.version.slice(0,2)) == 10) {  
            }
            else if(parseInt($.browser.version.slice(0,1)) <= 9) 
			{
                
				return;
            }
		}

    var bkgeffect = new WA();
bkgeffect.custom = {
StartTimer : function() {
		setInterval(function(){ bkgeffect.custom.Ticker() }, 100);
	}
,

Ticker : function() {
		time = bkgeffect.sceneTimer - (runCount * 8000);
		if (currentTimeline == 4 && time >= 0)
		{
			currentTimeline = 1;
			bkgeffect.switchTimelines('_6ea094c6_0332_4ea0_922a_82817c0b0c06');
		}
		else if (currentTimeline == 1 && time >= 4000)
		{
			currentTimeline = 2;
			bkgeffect.switchTimelines('_d69035d1_1cf5_4bd4_bb38_805ab6871f8f');
		}
		else if (currentTimeline == 2 && time >= 5000)
		{
			currentTimeline = 3;
			bkgeffect.switchTimelines('_6231ac2c_d6ea_4cc4_9389_cfa03391b4df');
		}
		else if (currentTimeline == 3 && time >= 8000)
		{
			currentTimeline = 4;
			runCount++;
			bkgeffect.switchTimelines('_17c15dd2_15f0_424c_acdf_e506df0232d7');
		}
	}
,
FUNC_FALLING__4ac959fc_1176_4a1b_8190_91cd38fd5458_On : function() {
$('#fallingLeafes__4ac959fc_1176_4a1b_8190_91cd38fd5458').addClass('fallingLeafes__4ac959fc_1176_4a1b_8190_91cd38fd5458_On');}
,
FUNC_FALLING__4ac959fc_1176_4a1b_8190_91cd38fd5458_Off : function() {
$('#fallingLeafes__4ac959fc_1176_4a1b_8190_91cd38fd5458').removeClass('fallingLeafes__4ac959fc_1176_4a1b_8190_91cd38fd5458_On').addClass('fallingLeafes__4ac959fc_1176_4a1b_8190_91cd38fd5458_Off');}}

bkgeffect.stage = [{            

            // SCENE 1
            'Oid': '_841f6599_32d1_4c33_b182_6469edb88acc',
            'Name': 'SCENE_1',
            'Autostart': 'true',
            'BackgroundColor': '#ffffff',
            'SceneEnd': 240000,
            'Position': 'absolute',
            'Perspective': '800px',
            'Top': '0px',
            'Left': '0px',
  'NextSceneTransition': 'instant',                 // instant, slide, fade
                                'NextSceneTransitionDirection': '',   // only active with slide transition => left, right, up, down
                                'NextSceneTransitionSpeed': '0','OnAnimationFinished': 2,
                              'OnAnimationFinishedParam': '_841f6599_32d1_4c33_b182_6469edb88acc',





                            'Timelines': [
            {
                'Oid': 'MAIN_TIMELINE',
                'Name': 'Main timeline',
                'Objects': [
                
                    
                    {
                        'Oid': '_4ac959fc_1176_4a1b_8190_91cd38fd5458',                
                        'Type': 'plugin',
                        'InnerHTML': '<div id="fallingLeafes__4ac959fc_1176_4a1b_8190_91cd38fd5458" class="fallingLeafes__4ac959fc_1176_4a1b_8190_91cd38fd5458_On"><leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_0></leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_0><leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_1></leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_1><leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_2></leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_2><leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_3></leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_3><leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_4></leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_4><leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_5></leaf__4ac959fc_1176_4a1b_8190_91cd38fd5458_5></div>'
                    },
                    
                {
                    'Oid': '_015570ac_77bc_461e_8732_e9b6b018579b',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '0px',
                    'Left': '0px',
                    'Height': '90px',
                    'Width': '728px',
                    'ZIndex': '1','BackgroundImage': 'bkgeffect_resources/box_bkg_340.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_c7897d6f_30b1_4faf_a4f6_36782fd24c90',                
                    'Type': 'box',
                    'InnerHTML': '  <div style=\"width:100%; text-align:center; display: table; height: 100%; #position: relative; overflow: hidden;\">      <div style=\"#position: absolute; #top: 50%; display: table-cell; vertical-align: middle;\">        <div style=\"#position: relative; #top: -50%;\">          Background effect        </div>      </div>    </div>'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '26px',
                    'Left': '248px',
                    'Height': '38px',
                    'Width': '231px',
                    'ZIndex': '2002','BackgroundColor': '#595757','Display': 'block','TextAlign': 'center',
'BorderRadiusTopLeft': '5px',
'BorderRadiusTopRight': '5px',
'BorderRadiusBottomLeft': '5px',
'BorderRadiusBottomRight': '5px',

                'TextColor': '#ED8A05',
                'Opacity': '0',
                'FontFamily': 'Arial',
                'FontSize': '21px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_651f3da8_6dd8_407e_b788_92d235e50b3f',                
                    'Type': 'box',
                    'InnerHTML': '  <div style=\"width:100%; text-align:center; display: table; height: 100%; #position: relative; overflow: hidden;\">      <div style=\"#position: absolute; #top: 50%; display: table-cell; vertical-align: middle;\">        <div style=\"#position: relative; #top: -50%;\">          Collection 1        </div>      </div>    </div>'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '22px',
                    'Left': '272px',
                    'Height': '46px',
                    'Width': '183px',
                    'ZIndex': '2003','BackgroundColor': '#04B9F7','Display': 'block','TextAlign': 'center',
'BorderRadiusTopLeft': '5px',
'BorderRadiusTopRight': '5px',
'BorderRadiusBottomLeft': '5px',
'BorderRadiusBottomRight': '5px',

                'TextColor': '#ffffff',
                'Opacity': '0',
                'FontFamily': 'Arial',
                'FontSize': '25px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []}

                ],
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    

			    ],
                'Changes': [
			
                    

			    ],
                'Events': [
			
                    
                    {
                            'FunctionId':'StartTimer',
                            'StartTime':300
                    }
,

                        {
                            'FunctionId':'FUNC_FALLING__4ac959fc_1176_4a1b_8190_91cd38fd5458_On',
                            'StartTime':100
                        }

			    ]
            },
            {
                'Oid': '_6ea094c6_0332_4ea0_922a_82817c0b0c06',
                'Name': 'Background effect on',
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_c7897d6f_30b1_4faf_a4f6_36782fd24c90',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.3s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '1'
                        }]
},


			    ],
                'Changes': [
			
                    

			    ],
                'Events': [
			
                    
                    {
                            'FunctionId':'StartTimer',
                            'StartTime':300
                    }

			    ]
            },
            {
                'Oid': '_d69035d1_1cf5_4bd4_bb38_805ab6871f8f',
                'Name': 'Background effect off',
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_c7897d6f_30b1_4faf_a4f6_36782fd24c90',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.3s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0'
                        }]
},


			    ],
                'Changes': [
			
                    

			    ],
                'Events': [
			
                    
                    {
                            'FunctionId':'StartTimer',
                            'StartTime':300
                    }

			    ]
            },
            {
                'Oid': '_6231ac2c_d6ea_4cc4_9389_cfa03391b4df',
                'Name': 'Collection 1 on',
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_651f3da8_6dd8_407e_b788_92d235e50b3f',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.3s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '1'
                        }]
},


			    ],
                'Changes': [
			
                    

			    ],
                'Events': [
			
                    
                    {
                            'FunctionId':'StartTimer',
                            'StartTime':300
                    }

			    ]
            },
            {
                'Oid': '_17c15dd2_15f0_424c_acdf_e506df0232d7',
                'Name': 'Collection 1 off',
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_651f3da8_6dd8_407e_b788_92d235e50b3f',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.3s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0'
                        }]
},


			    ],
                'Changes': [
			
                    

			    ],
                'Events': [
			
                    
                    {
                            'FunctionId':'StartTimer',
                            'StartTime':300
                    }

			    ]
            }]
}];

            bkgeffect.init();
            bkgeffect.stageHeight = 90;
            bkgeffect.stageWidth  = 728;
            bkgeffect.t  = '493006111261911259927688761069469349972';
            bkgeffect.stageInitialTransition = 'instant';
            bkgeffect.stageInitialTransitionDirection = 'left';
            bkgeffect.stageInitialTransitionSpeed = 1000;
            bkgeffect.showBrowserCompatibilityCheck = false;
                bkgeffect.loaderType = 1;
                bkgeffect.loaderBackgroundColor = '#000';
                bkgeffect.loaderForegroundColor = '#fff';
            bkgeffect.stageInitialScene = '_841f6599_32d1_4c33_b182_6469edb88acc';
            bkgeffect.debug = false;
            bkgeffect.preloadImages = true;
bkgeffect.imagesToPreload = [
'bkgeffect_resources/box_bkg_340.png'
];bkgeffect.createWorkspace('bkgeffectStage');

                }

                catch (e) 
                {
	                
                }
            }

loadResources('bkgeffectStage');
addLoadEvent(bkgeffectstart);

