
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

            loadjscssfile("Overlay_resources/WA.js", "js");
            loadjscssfile("Overlay_resources/modernizr.custom.43133.js", "js");
            loadjscssfile("Overlay_resources/spin.min.js", "js");

            loadjscssfile("Overlay_resources/JQ_Textualizer.js", "js");
            loadjscssfile("Overlay_resources/WA.css", "css");            
       }
	   
	   loadjscssfile("Overlay_resources/ani.css", "css");                          
}
	// Global variables




function Overlaystart() {    

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

    var Overlay = new WA();
Overlay.custom = {
}

Overlay.stage = [{            

            // SCENE 1
            'Oid': '_cccba621_be41_453f_a889_698eacfd878e',
            'Name': 'SCENE_1',
            'Autostart': 'true',
            'BackgroundColor': '#ffffff',
            'SceneEnd': 14000,
            'Position': 'absolute',
            'Perspective': '800px',
            'Top': '0px',
            'Left': '0px',
  'NextSceneTransition': 'instant',                 // instant, slide, fade
                                'NextSceneTransitionDirection': '',   // only active with slide transition => left, right, up, down
                                'NextSceneTransitionSpeed': '0','OnAnimationFinished': 2,
                              'OnAnimationFinishedParam': '_cccba621_be41_453f_a889_698eacfd878e',





                            'Timelines': [
            {
                'Oid': 'MAIN_TIMELINE',
                'Name': 'Main timeline',
                'Objects': [
                
                    
                    
                {
                    'Oid': '_40aed992_efc4_4e3c_85e2_aabffd472cf5',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '0px',
                    'Left': '0px',
                    'Height': '280px',
                    'Width': '336px',
                    'ZIndex': '1','BackgroundImage': 'Overlay_resources/box_bkg_340.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_05fdae6f_cdfb_4c17_9bb9_f88e9e07276f',                
                    'Type': 'box',
                    'InnerHTML': 'Overlay'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '116px',
                    'Left': '-159px',
                    'Height': '48px',
                    'Width': '159px',
                    'ZIndex': '2','Display': 'block','TextAlign': 'center',

                'TextColor': '#F76403',
                'Opacity': '1',
                'FontFamily': 'Impact',
                'FontSize': '38px',
                'LineHeight': '1.5em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_a26b4645_3121_49ab_abd6_6156f42a2a31',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-248px',
                    'Left': '3px',
                    'Height': '248px',
                    'Width': '184px',
                    'ZIndex': '3','BackgroundImage': 'Overlay_resources/box_tcsmall01.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'center',

                'TextColor': '#ffffff',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '10px',
                'LineHeight': '1.5em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_dc24da4a_b8ce_489c_bb9c_4cee60c98943',                
                    'Type': 'box',
                    'InnerHTML': 'Collection 1 '
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '125px',
                    'Left': '336px',
                    'Height': '30px',
                    'Width': '136px',
                    'ZIndex': '4','Display': 'block','TextAlign': 'center',

                'TextColor': '#F76404',
                'Opacity': '1',
                'FontFamily': 'Impact',
                'FontSize': '23px',
                'LineHeight': '1.5em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_b7b14b88_f406_42f5_bae2_e8175745f5bd',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '280px',
                    'Left': '60px',
                    'Height': '65px',
                    'Width': '64px',
                    'ZIndex': '5','BackgroundImage': 'Overlay_resources/wa_iconsite.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'center',

                'TextColor': '#ffffff',
                'Opacity': '1',
                'FontFamily': 'Impact',
                'FontSize': '10px',
                'LineHeight': '1.5em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_a19b7820_f43d_49c5_921c_0c02e36c96f4',                
                    'Type': 'box',
                    'InnerHTML': 'EASY!'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '117px',
                    'Left': '-141px',
                    'Height': '46px',
                    'Width': '141px',
                    'ZIndex': '6','Display': 'block','TextAlign': 'center',

                'TextColor': '#F76403',
                'Opacity': '1',
                'FontFamily': 'Impact',
                'FontSize': '36px',
                'LineHeight': '1.5em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []}

                ],
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_05fdae6f_cdfb_4c17_9bb9_f88e9e07276f',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.8s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '88px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.8s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '116px'
                        }]
},
{
                            'ObjectId':'_05fdae6f_cdfb_4c17_9bb9_f88e9e07276f',
                            'StartTime':2800,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.8s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '0'
                        }]
},
{
                            'ObjectId':'_a26b4645_3121_49ab_abd6_6156f42a2a31',
                            'StartTime':3600,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.6s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '3px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.6s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '16px'
                        }]
},
{
                            'ObjectId':'_dc24da4a_b8ce_489c_bb9c_4cee60c98943',
                            'StartTime':4200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'1.2s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '197px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'1.2s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '125px'
                        }]
},
{
                            'ObjectId':'_a26b4645_3121_49ab_abd6_6156f42a2a31',
                            'StartTime':7400,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.6s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '0'
                        }]
},
{
                            'ObjectId':'_dc24da4a_b8ce_489c_bb9c_4cee60c98943',
                            'StartTime':8000,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'1.2s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '0'
                        }]
},
{
                            'ObjectId':'_b7b14b88_f406_42f5_bae2_e8175745f5bd',
                            'StartTime':9200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.2s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '60px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.2s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '108px'
                        }]
},
{
                            'ObjectId':'_a19b7820_f43d_49c5_921c_0c02e36c96f4',
                            'StartTime':9400,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'1.2s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '134px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'1.2s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '117px'
                        }]
},
{
                            'ObjectId':'_b7b14b88_f406_42f5_bae2_e8175745f5bd',
                            'StartTime':12600,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.2s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '0'
                        }]
},
{
                            'ObjectId':'_a19b7820_f43d_49c5_921c_0c02e36c96f4',
                            'StartTime':12800,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'1.2s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '0'
                        }]
},


			    ],
                'Changes': [
			
                    

			    ],
                'Events': [
			
                    

			    ]
            }]
}];

            Overlay.init();
            Overlay.stageHeight = 280;
            Overlay.stageWidth  = 336;
            Overlay.t  = '493006111261911259927688761069469349972';
            Overlay.stageInitialTransition = 'instant';
            Overlay.stageInitialTransitionDirection = 'left';
            Overlay.stageInitialTransitionSpeed = 1000;
            Overlay.showBrowserCompatibilityCheck = false;
                Overlay.loaderType = 1;
                Overlay.loaderBackgroundColor = '#000';
                Overlay.loaderForegroundColor = '#fff';
            Overlay.stageInitialScene = '_cccba621_be41_453f_a889_698eacfd878e';
            Overlay.debug = false;
            Overlay.preloadImages = true;
Overlay.imagesToPreload = [
'Overlay_resources/box_bkg_340.png',
'Overlay_resources/box_tcsmall01.png',
'Overlay_resources/wa_iconsite.png'
];Overlay.createWorkspace('OverlayStage');

                }

                catch (e) 
                {
	                
                }
            }

loadResources('OverlayStage');
addLoadEvent(Overlaystart);

