
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

            loadjscssfile("Transition_text_resources/WA.js", "js");
            loadjscssfile("Transition_text_resources/modernizr.custom.43133.js", "js");
            loadjscssfile("Transition_text_resources/spin.min.js", "js");

            loadjscssfile("Transition_text_resources/JQ_Textualizer.js", "js");
            loadjscssfile("Transition_text_resources/WA.css", "css");            
       }
	   
	   loadjscssfile("Transition_text_resources/ani.css", "css");                          
}
	// Global variables




function Transition_textstart() {    

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

    var Transition_text = new WA();
Transition_text.custom = {
}

Transition_text.stage = [{            

            // SCENE 1
            'Oid': '_3100c09b_def5_4aa8_91dd_4d92024f2f3f',
            'Name': 'SCENE_1',
            'Autostart': 'true',
            'BackgroundColor': '#ffffff',
            'SceneEnd': 16200,
            'Position': 'absolute',
            'Perspective': '800px',
            'Top': '0px',
            'Left': '0px',
  'NextSceneTransition': 'instant',                 // instant, slide, fade
                                'NextSceneTransitionDirection': '',   // only active with slide transition => left, right, up, down
                                'NextSceneTransitionSpeed': '0','OnAnimationFinished': 2,
                              'OnAnimationFinishedParam': '_3100c09b_def5_4aa8_91dd_4d92024f2f3f',





                            'Timelines': [
            {
                'Oid': 'MAIN_TIMELINE',
                'Name': 'Main timeline',
                'Objects': [
                
                    
                    
                {
                    'Oid': '_e71b6c57_0ac5_4ba9_a927_9fe6312ef8e0',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '0px',
                    'Left': '-468px',
                    'Height': '60px',
                    'Width': '468px',
                    'ZIndex': '1','BackgroundImage': 'Transition_text_resources/3de99ff2-685a-4b45-825e-17e8d0d181b1','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_9836c779_19cc_4f63_9bc3_3d16f93047f5',                
                    'Type': 'box',
                    'InnerHTML': '  <div style=\"width:100%; text-align:center; display: table; height: 100%; #position: relative; overflow: hidden;\">      <div style=\"#position: absolute; #top: 50%; display: table-cell; vertical-align: middle;\">        <div style=\"#position: relative; #top: -50%;\">            Transition & Text          </div>      </div>    </div>'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '12px',
                    'Left': '-203px',
                    'Height': '33px',
                    'Width': '203px',
                    'ZIndex': '2','BackgroundColor': '#FA7801','Display': 'block','TextAlign': 'center',

                'TextColor': '#ffffff',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '25px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_724770e6_5810_4623_9764_edff1d4a66da',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '0px',
                    'Left': '-468px',
                    'Height': '60px',
                    'Width': '468px',
                    'ZIndex': '3','BackgroundImage': 'Transition_text_resources/2d03b9e1-428d-45f6-8d29-2895c10c1cd1','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_6794a2f0_6d2e_43d7_9093_9b042bc958b4',                
                    'Type': 'box',
                    'InnerHTML': '  <div style=\"width:100%; text-align:center; display: table; height: 100%; #position: relative; overflow: hidden;\">      <div style=\"#position: absolute; #top: 50%; display: table-cell; vertical-align: middle;\">        <div style=\"#position: relative; #top: -50%;\">            Collection 1          </div>      </div>    </div>'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '12px',
                    'Left': '-147px',
                    'Height': '33px',
                    'Width': '147px',
                    'ZIndex': '4','BackgroundColor': '#05B3D4','Display': 'block','TextAlign': 'center',

                'TextColor': '#ffffff',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '25px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_d6c05448_6e89_470e_b2d6_f4630a4165a5',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '0px',
                    'Left': '-468px',
                    'Height': '60px',
                    'Width': '468px',
                    'ZIndex': '5','BackgroundImage': 'Transition_text_resources/510ada94-a4bd-4482-9858-88172a7b54db','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_cd8edc96_6a33_40c8_aa74_63f237567427',                
                    'Type': 'box',
                    'InnerHTML': '  <div style=\"width:100%; text-align:center; display: table; height: 100%; #position: relative; overflow: hidden;\">      <div style=\"#position: absolute; #top: 50%; display: table-cell; vertical-align: middle;\">        <div style=\"#position: relative; #top: -50%;\">            Buy Now          </div>      </div>    </div>'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '12px',
                    'Left': '-123px',
                    'Height': '33px',
                    'Width': '123px',
                    'ZIndex': '6','BackgroundColor': '#1CCC25','Display': 'block','TextAlign': 'center',

                'TextColor': '#ffffff',
                'Opacity': '1',
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
			
                    {
                            'ObjectId':'_e71b6c57_0ac5_4ba9_a927_9fe6312ef8e0',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_9836c779_19cc_4f63_9bc3_3d16f93047f5',
                            'StartTime':400,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'1s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '132px'
                        }]
},
{
                            'ObjectId':'_724770e6_5810_4623_9764_edff1d4a66da',
                            'StartTime':5400,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_6794a2f0_6d2e_43d7_9093_9b042bc958b4',
                            'StartTime':5800,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'1s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '160px'
                        }]
},
{
                            'ObjectId':'_d6c05448_6e89_470e_b2d6_f4630a4165a5',
                            'StartTime':10800,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_cd8edc96_6a33_40c8_aa74_63f237567427',
                            'StartTime':11200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'1s',
                            'Delay':'0s',
                            'TimingFunc':'ease-in-out',
                            'EndValue': '172px'
                        }]
},


			    ],
                'Changes': [
			
                    

			    ],
                'Events': [
			
                    

			    ]
            }]
}];

            Transition_text.init();
            Transition_text.stageHeight = 60;
            Transition_text.stageWidth  = 468;
            Transition_text.t  = '493006111261911259927688761069469349972';
            Transition_text.stageInitialTransition = 'instant';
            Transition_text.stageInitialTransitionDirection = 'left';
            Transition_text.stageInitialTransitionSpeed = 1000;
            Transition_text.showBrowserCompatibilityCheck = false;
                Transition_text.loaderType = 1;
                Transition_text.loaderBackgroundColor = '#000';
                Transition_text.loaderForegroundColor = '#fff';
            Transition_text.stageInitialScene = '_3100c09b_def5_4aa8_91dd_4d92024f2f3f';
            Transition_text.debug = false;
            Transition_text.preloadImages = true;
Transition_text.imagesToPreload = [
'Transition_text_resources/3de99ff2-685a-4b45-825e-17e8d0d181b1',
'Transition_text_resources/2d03b9e1-428d-45f6-8d29-2895c10c1cd1',
'Transition_text_resources/510ada94-a4bd-4482-9858-88172a7b54db'
];Transition_text.createWorkspace('Transition_textStage');

                }

                catch (e) 
                {
	                
                }
            }

loadResources('Transition_textStage');
addLoadEvent(Transition_textstart);

