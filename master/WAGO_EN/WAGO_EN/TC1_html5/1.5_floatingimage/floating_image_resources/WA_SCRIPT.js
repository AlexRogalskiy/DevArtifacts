
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

            loadjscssfile("floating_image_resources/WA.js", "js");
            loadjscssfile("floating_image_resources/modernizr.custom.43133.js", "js");
            loadjscssfile("floating_image_resources/spin.min.js", "js");

            loadjscssfile("floating_image_resources/JQ_Textualizer.js", "js");
            loadjscssfile("floating_image_resources/WA.css", "css");            
       }
	   
	   loadjscssfile("floating_image_resources/ani.css", "css");                          
}
	// Global variables




function floating_imagestart() {    

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

    var floating_image = new WA();
floating_image.custom = {
}

floating_image.stage = [{            

            // SCENE 1
            'Oid': '_fd44f497_8cf1_463c_98a2_45bcaafbcfb8',
            'Name': 'SCENE_1',
            'Autostart': 'true',
            'BackgroundColor': '#ffffff',
            'SceneEnd': 6600,
            'Position': 'absolute',
            'Perspective': '800px',
            'Top': '0px',
            'Left': '0px',
  'NextSceneTransition': 'instant',                 // instant, slide, fade
                                'NextSceneTransitionDirection': '',   // only active with slide transition => left, right, up, down
                                'NextSceneTransitionSpeed': '0','OnAnimationFinished': 2,
                              'OnAnimationFinishedParam': '_fd44f497_8cf1_463c_98a2_45bcaafbcfb8',





                            'Timelines': [
            {
                'Oid': 'MAIN_TIMELINE',
                'Name': 'Main timeline',
                'Objects': [
                
                    
                    
                {
                    'Oid': '_08a2eeba_0800_4e14_b959_a9957f270ab4',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '0px',
                    'Left': '0px',
                    'Height': '280px',
                    'Width': '336px',
                    'ZIndex': '1','BackgroundImage': 'floating_image_resources/box_bkg_340.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_7c6aa33d_6b2c_4e1d_b220_b183c5e99476',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '135px',
                    'Left': '163px',
                    'Height': '10px',
                    'Width': '10px',
                    'ZIndex': '2','BackgroundImage': 'floating_image_resources/wa_icon156.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_e36e94f4_8855_4283_b3f3_96d16ba16137',                
                    'Type': 'box',
                    'InnerHTML': '  <div style=\"width:100%; text-align:center; display: table; height: 100%; #position: relative; overflow: hidden;\">      <div style=\"#position: absolute; #top: 50%; display: table-cell; vertical-align: middle;\">        <div style=\"#position: relative; #top: -50%;\">          Floating Image        </div>      </div>    </div>'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '343px',
                    'Left': '-4px',
                    'Height': '63px',
                    'Width': '345px',
                    'ZIndex': '4','BackgroundColor': '#FF6600','Display': 'block','TextAlign': 'center',
'BorderRadiusTopLeft': '5px',
'BorderRadiusTopRight': '5px',
'BorderRadiusBottomLeft': '5px',
'BorderRadiusBottomRight': '5px',

                'TextColor': '#FFFFFF',
                'Opacity': '1',
                'FontFamily': 'Impact',
                'FontSize': '45px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_e8904607_f1dc_4a6a_b644_45a9a565d63e',                
                    'Type': 'box',
                    'InnerHTML': '  <div style=\"width:100%; text-align:center; display: table; height: 100%; #position: relative; overflow: hidden;\">      <div style=\"#position: absolute; #top: 50%; display: table-cell; vertical-align: middle;\">        <div style=\"#position: relative; #top: -50%;\">          Collection 1        </div>      </div>    </div>'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '343px',
                    'Left': '24px',
                    'Height': '63px',
                    'Width': '289px',
                    'ZIndex': '5','BackgroundColor': '#737373','Display': 'block','TextAlign': 'center',
'BorderRadiusTopLeft': '5px',
'BorderRadiusTopRight': '5px',
'BorderRadiusBottomLeft': '5px',
'BorderRadiusBottomRight': '5px',

                'TextColor': '#0EA6FF',
                'Opacity': '1',
                'FontFamily': 'Impact',
                'FontSize': '45px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_25b77e1e_35ec_467d_9d32_cfbe226786e1',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '0px',
                    'Left': '0px',
                    'Height': '280px',
                    'Width': '336px',
                    'ZIndex': '3','BackgroundColor': '#ffffff','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '0',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []}

                ],
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_7c6aa33d_6b2c_4e1d_b220_b183c5e99476',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '90px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '61px'
                        }]
},
{
                            'ObjectId':'_7c6aa33d_6b2c_4e1d_b220_b183c5e99476',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Width',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '156px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Height',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '158px'
                        }]
},
{
                            'ObjectId':'_e36e94f4_8855_4283_b3f3_96d16ba16137',
                            'StartTime':200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '190px'
                        }]
},
{
                            'ObjectId':'_7c6aa33d_6b2c_4e1d_b220_b183c5e99476',
                            'StartTime':300,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-65px'
                        }]
},
{
                            'ObjectId':'_7c6aa33d_6b2c_4e1d_b220_b183c5e99476',
                            'StartTime':400,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-2px'
                        }]
},
{
                            'ObjectId':'_7c6aa33d_6b2c_4e1d_b220_b183c5e99476',
                            'StartTime':500,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'1.7s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '76px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'1.7s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-16px'
                        }]
},
{
                            'ObjectId':'_e36e94f4_8855_4283_b3f3_96d16ba16137',
                            'StartTime':800,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-22px'
                        }]
},
{
                            'ObjectId':'_e36e94f4_8855_4283_b3f3_96d16ba16137',
                            'StartTime':800,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '187px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Width',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '379px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Height',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '97px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'FontSize',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '56px'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':800,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0.5'
                        }]
},
{
                            'ObjectId':'_e36e94f4_8855_4283_b3f3_96d16ba16137',
                            'StartTime':900,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-4px'
                        }]
},
{
                            'ObjectId':'_e36e94f4_8855_4283_b3f3_96d16ba16137',
                            'StartTime':900,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '190px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Width',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '345px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Height',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '63px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'FontSize',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '45px'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':900,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0'
                        }]
},
{
                            'ObjectId':'_e36e94f4_8855_4283_b3f3_96d16ba16137',
                            'StartTime':1000,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-22px'
                        }]
},
{
                            'ObjectId':'_e36e94f4_8855_4283_b3f3_96d16ba16137',
                            'StartTime':1000,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '187px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Width',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '379px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Height',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '97px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'FontSize',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '56px'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':1000,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0.5'
                        }]
},
{
                            'ObjectId':'_e36e94f4_8855_4283_b3f3_96d16ba16137',
                            'StartTime':1100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-4px'
                        }]
},
{
                            'ObjectId':'_e36e94f4_8855_4283_b3f3_96d16ba16137',
                            'StartTime':1100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '190px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Width',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '345px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Height',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '63px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'FontSize',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '45px'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':1100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0'
                        }]
},
{
                            'ObjectId':'_7c6aa33d_6b2c_4e1d_b220_b183c5e99476',
                            'StartTime':2200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'1.7s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '102px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'1.7s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-10px'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':3000,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0.5'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':3100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':3200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0.5'
                        }]
},
{
                            'ObjectId':'_e36e94f4_8855_4283_b3f3_96d16ba16137',
                            'StartTime':3300,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '386px'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':3300,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0'
                        }]
},
{
                            'ObjectId':'_e8904607_f1dc_4a6a_b644_45a9a565d63e',
                            'StartTime':3400,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '190px'
                        }]
},
{
                            'ObjectId':'_7c6aa33d_6b2c_4e1d_b220_b183c5e99476',
                            'StartTime':3900,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'2.3s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '90px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'2.3s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-2px'
                        }]
},
{
                            'ObjectId':'_e8904607_f1dc_4a6a_b644_45a9a565d63e',
                            'StartTime':4000,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '10px'
                        }]
},
{
                            'ObjectId':'_e8904607_f1dc_4a6a_b644_45a9a565d63e',
                            'StartTime':4000,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '187px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Width',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '317px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Height',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '91px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'FontSize',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '56px'
                        }]
},
{
                            'ObjectId':'_e8904607_f1dc_4a6a_b644_45a9a565d63e',
                            'StartTime':4100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '24px'
                        }]
},
{
                            'ObjectId':'_e8904607_f1dc_4a6a_b644_45a9a565d63e',
                            'StartTime':4100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '190px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Width',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '289px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Height',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '63px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'FontSize',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '45px'
                        }]
},
{
                            'ObjectId':'_e8904607_f1dc_4a6a_b644_45a9a565d63e',
                            'StartTime':4200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '10px'
                        }]
},
{
                            'ObjectId':'_e8904607_f1dc_4a6a_b644_45a9a565d63e',
                            'StartTime':4200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '187px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Width',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '317px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Height',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '91px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'FontSize',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '56px'
                        }]
},
{
                            'ObjectId':'_e8904607_f1dc_4a6a_b644_45a9a565d63e',
                            'StartTime':4300,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '24px'
                        }]
},
{
                            'ObjectId':'_e8904607_f1dc_4a6a_b644_45a9a565d63e',
                            'StartTime':4300,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '190px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Width',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '289px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Height',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '63px'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'FontSize',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '45px'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':5200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0.5'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':5300,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':5400,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0.5'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':5500,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0'
                        }]
},
{
                            'ObjectId':'_25b77e1e_35ec_467d_9d32_cfbe226786e1',
                            'StartTime':6000,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '1'
                        }]
},
{
                            'ObjectId':'_e8904607_f1dc_4a6a_b644_45a9a565d63e',
                            'StartTime':6500,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '386px'
                        }]
},


			    ],
                'Changes': [
			
                    

			    ],
                'Events': [
			
                    

			    ]
            }]
}];

            floating_image.init();
            floating_image.stageHeight = 280;
            floating_image.stageWidth  = 336;
            floating_image.t  = '493006111261911259927688761069469349972';
            floating_image.stageInitialTransition = 'instant';
            floating_image.stageInitialTransitionDirection = 'left';
            floating_image.stageInitialTransitionSpeed = 1000;
            floating_image.showBrowserCompatibilityCheck = false;
                floating_image.loaderType = 1;
                floating_image.loaderBackgroundColor = '#000';
                floating_image.loaderForegroundColor = '#fff';
            floating_image.stageInitialScene = '_fd44f497_8cf1_463c_98a2_45bcaafbcfb8';
            floating_image.debug = false;
            floating_image.preloadImages = true;
floating_image.imagesToPreload = [
'floating_image_resources/box_bkg_340.png',
'floating_image_resources/wa_icon156.png'
];floating_image.createWorkspace('floating_imageStage');

                }

                catch (e) 
                {
	                
                }
            }

loadResources('floating_imageStage');
addLoadEvent(floating_imagestart);

