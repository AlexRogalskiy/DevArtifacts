
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

            loadjscssfile("Unknown_project_6_resources/WA.js", "js");
            loadjscssfile("Unknown_project_6_resources/modernizr.custom.43133.js", "js");
            loadjscssfile("Unknown_project_6_resources/spin.min.js", "js");

            loadjscssfile("Unknown_project_6_resources/JQ_Textualizer.js", "js");
            loadjscssfile("Unknown_project_6_resources/WA.css", "css");            
       }
	   
	   loadjscssfile("Unknown_project_6_resources/ani.css", "css");                          
}
	currentTimeLine90760 = 1;




function Unknown_project_6start() {    

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

    var Unknown_project_6 = new WA();
Unknown_project_6.custom = {
GotoNextTimeline : function() {
		if (Unknown_project_6.sceneTimer >= 8000)
		{
			Unknown_project_6.switchScenes('_d14041b5_00eb_43a6_8df8_7ec8cd0dbaaa', 'instant', '', 0);
			currentTimeLine90760 = 1;
			return;
		}
		if (currentTimeLine90760 == 1)
		{
			Unknown_project_6.switchTimelines('_a5f4f95d_5df1_42c0_9f1a_94982e50c004');
			currentTimeLine90760 = 2;
		}
		else if (currentTimeLine90760 == 2)
		{
			Unknown_project_6.switchTimelines('_8eb7261a_fa36_4e08_9fcd_4f536cd52376');
			currentTimeLine90760 = 3;
		}
	}
,

GotoTimeline_1 : function() {
		Unknown_project_6.switchTimelines('MAIN_TIMELINE');
		currentTimeLine90760 = 1;
	}
,

GotoTimeline_2 : function() {
		Unknown_project_6.switchTimelines('_a5f4f95d_5df1_42c0_9f1a_94982e50c004');
		currentTimeLine90760 = 2;
	}}

Unknown_project_6.stage = [{            

            // SCENE 1
            'Oid': '_d14041b5_00eb_43a6_8df8_7ec8cd0dbaaa',
            'Name': 'SCENE_1',
            'Autostart': 'true',
            'BackgroundColor': '#ffffff',
            'SceneEnd': 800,
            'Position': 'absolute',
            'Perspective': '800px',
            'Top': '0px',
            'Left': '0px',






                            'Timelines': [
            {
                'Oid': 'MAIN_TIMELINE',
                'Name': 'Main timeline',
                'Objects': [
                
                    
                    
                {
                    'Oid': '_6597cf97_4a00_4fe1_b97a_23be7721b824',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '32px',
                    'Left': '502px',
                    'Height': '75px',
                    'Width': '182px',
                    'ZIndex': '101','BackgroundImage': 'Unknown_project_6_resources/view_on.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',
                
                        'BorderLeftColor': '#ffffff',
                        'BorderLeftWidth': '5px',
                        'BorderLeftStyle': 'solid', 
                        'BorderRightColor': '#ffffff',
                        'BorderRightWidth': '5px',
                        'BorderRightStyle': 'solid', 
                        'BorderTopColor': '#ffffff',
                        'BorderTopWidth': '5px',
                        'BorderTopStyle': 'solid', 
                        'BorderBottomColor': '#ffffff',
                        'BorderBottomWidth': '5px',
                        'BorderBottomStyle': 'solid',
                'TextColor': '#000000',
                'Opacity': '0',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_69062eac_36c2_416b_b793_a953f2b457de',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Cursor': 'Pointer',
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '12px',
                    'Left': '684px',
                    'Height': '12px',
                    'Width': '12px',
                    'ZIndex': '102','BackgroundImage': 'Unknown_project_6_resources/view_off.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',

'OnMouseClick' : 1,
'OnMouseClickParam' : 'GotoTimeline_1',

'OnMouseOver' : 3,
'OnMouseOverParam' : '_0ae37e38_1d5e_4ff2_88c2_54eb3c0f13de',

'OnMouseOut' : 3,
'OnMouseOutParam' : '_8eb7261a_fa36_4e08_9fcd_4f536cd52376',

'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_45043fd5_d4e1_48e4_b619_c184aa650d5f',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Cursor': 'Pointer',
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '12px',
                    'Left': '684px',
                    'Height': '12px',
                    'Width': '12px',
                    'ZIndex': '103','BackgroundImage': 'Unknown_project_6_resources/view_on.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'false',

'OnMouseClick' : 1,
'OnMouseClickParam' : 'GotoTimeline_1',

'OnMouseOver' : 3,
'OnMouseOverParam' : '_0ae37e38_1d5e_4ff2_88c2_54eb3c0f13de',

'OnMouseOut' : 3,
'OnMouseOutParam' : '_8eb7261a_fa36_4e08_9fcd_4f536cd52376',

'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_cd18d587_c12c_4cd8_8a2a_d2683cdc582f',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-300px',
                    'Left': '0px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '4','BackgroundImage': 'Unknown_project_6_resources/10835bb5-644d-48e5-8fe7-b7a3b35cdb83.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_5cee61fc_c9d7_4e2b_b565_afee66ec71df',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '340px',
                    'Left': '72px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '5','BackgroundImage': 'Unknown_project_6_resources/07de1d38-c1c7-4b6d-bd59-7313ee2e0ac3.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_0cde0fe6_6d5b_447f_bc68_b9101b30a0c8',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-380px',
                    'Left': '144px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '6','BackgroundImage': 'Unknown_project_6_resources/056e8317-6bd6-4d07-9090-ab7c828d32f9.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_9ac6d82e_bef0_4f50_af6a_52203aadb504',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '420px',
                    'Left': '216px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '7','BackgroundImage': 'Unknown_project_6_resources/9426295a-cae6-4f29-8bc9-33239d76608e.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_30dd0f53_d3b3_4873_a879_767445e699c0',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-460px',
                    'Left': '288px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '8','BackgroundImage': 'Unknown_project_6_resources/faa4e298-2f1e-456c-8599-2f8027acdf2c.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_95efe1d8_c9a5_4e23_8ecb_568dad13887d',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '500px',
                    'Left': '360px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '9','BackgroundImage': 'Unknown_project_6_resources/b8eec786-9752-47aa-b8ff-524a420ed581.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_9273cd69_9353_4d2a_9565_60883e18b48e',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-540px',
                    'Left': '432px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '10','BackgroundImage': 'Unknown_project_6_resources/277c495b-2f90-48f4-b978-fa4e71f996bd.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_e7821f1a_7078_4ab8_b336_fd4cbfe8a483',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '580px',
                    'Left': '504px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '11','BackgroundImage': 'Unknown_project_6_resources/c1709855-737e-404c-9fc2-88bbff87dd35.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_0567194f_01a6_4d15_a6d2_7729c84806fb',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-620px',
                    'Left': '576px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '12','BackgroundImage': 'Unknown_project_6_resources/a4c1d4c8-5a18-4615-af6c-55ecf5481f07.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_d4d411cc_dcd9_443d_985f_20a20821e106',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '660px',
                    'Left': '648px',
                    'Height': '300px',
                    'Width': '80px',
                    'ZIndex': '13','BackgroundImage': 'Unknown_project_6_resources/f3b00f18-d269-4481-b2d8-032d30d99190.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_4757cb29_e1dd_4149_b98c_d77cf9202ed4',                
                    'Type': 'box',
                    'InnerHTML': '  <div style=\"width:100%; text-align:center; display: table; height: 100%; #position: relative; overflow: hidden;\">      <div style=\"#position: absolute; #top: 50%; display: table-cell; vertical-align: middle;\">        <div style=\"#position: relative; #top: -50%;\">          SLIDER        </div>      </div>    </div>'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-94px',
                    'Left': '10px',
                    'Height': '94px',
                    'Width': '315px',
                    'ZIndex': '14','BackgroundColor': '#000000','Display': 'block','TextAlign': 'center',
'BorderRadiusTopLeft': '5px',
'BorderRadiusTopRight': '5px',
'BorderRadiusBottomLeft': '5px',
'BorderRadiusBottomRight': '5px',

                'TextColor': '#FC7B05',
                'Opacity': '0',
                'FontFamily': 'Lucida Console',
                'FontSize': '70px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_40a5fbf3_87c7_4523_8368_f116982893a7',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Cursor': 'Pointer',
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '12px',
                    'Left': '700px',
                    'Height': '12px',
                    'Width': '12px',
                    'ZIndex': '115','BackgroundImage': 'Unknown_project_6_resources/view_off.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',

'OnMouseClick' : 1,
'OnMouseClickParam' : 'GotoTimeline_2',

'OnMouseOver' : 3,
'OnMouseOverParam' : '_3caa88cc_fe5b_45a9_98b7_f1afda6d8ee3',

'OnMouseOut' : 3,
'OnMouseOutParam' : '_8eb7261a_fa36_4e08_9fcd_4f536cd52376',

'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_f8056297_fd45_4ccd_8d02_8ae9a8aee128',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Cursor': 'Pointer',
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '12px',
                    'Left': '700px',
                    'Height': '12px',
                    'Width': '12px',
                    'ZIndex': '116','BackgroundImage': 'Unknown_project_6_resources/view_on.png','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'false',

'OnMouseClick' : 1,
'OnMouseClickParam' : 'GotoTimeline_2',

'OnMouseOver' : 3,
'OnMouseOverParam' : '_3caa88cc_fe5b_45a9_98b7_f1afda6d8ee3',

'OnMouseOut' : 3,
'OnMouseOutParam' : '_8eb7261a_fa36_4e08_9fcd_4f536cd52376',

'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_a5fee92a_63de_4a60_a55b_ebca75d462f0',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-300px',
                    'Left': '0px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '17','BackgroundImage': 'Unknown_project_6_resources/7b6fe48d-753c-4b0c-b33a-7bba7288296b.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_485f9f80_2149_428e_80b2_96aabf79ecde',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '340px',
                    'Left': '72px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '18','BackgroundImage': 'Unknown_project_6_resources/5fded7af-592c-4ad6-86eb-add8b877326a.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_00674769_1a0b_4bc6_b577_e39f365c5b4e',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-380px',
                    'Left': '144px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '19','BackgroundImage': 'Unknown_project_6_resources/29f3d2ea-f3f8-4b33-a75d-b4516a14be80.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_251d28e4_6fd9_46d3_9fbe_a9e3a32976fb',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '420px',
                    'Left': '216px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '20','BackgroundImage': 'Unknown_project_6_resources/a650ab1b-f98c-4b9c-951e-65e2fa22d6b9.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_a117d06f_972f_4c62_ad83_6776bbd81bab',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-460px',
                    'Left': '288px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '21','BackgroundImage': 'Unknown_project_6_resources/fb80cef1-f9cb-483c-9d28-82353afdb56a.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_2608fd3c_6fe8_4504_a1de_fbc0ca4a916d',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '500px',
                    'Left': '360px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '22','BackgroundImage': 'Unknown_project_6_resources/de2344cd-5010-4548-ba22-d9a7297d210f.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_8b66ce07_f568_4e24_924e_8d4688de2366',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-540px',
                    'Left': '432px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '23','BackgroundImage': 'Unknown_project_6_resources/9dcc8fc2-1037-446f-9948-616d75199966.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_1b797d5c_acd3_4d35_8c5d_2a985394dde0',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '580px',
                    'Left': '504px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '24','BackgroundImage': 'Unknown_project_6_resources/b0576c60-1750-4618-9451-8556f37495fe.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_5a8c538e_d7b0_4dab_94d8_9a4bc7c226e8',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-620px',
                    'Left': '576px',
                    'Height': '300px',
                    'Width': '72px',
                    'ZIndex': '25','BackgroundImage': 'Unknown_project_6_resources/409643a1-7ff4-4e07-8e4f-b8a5b2878c78.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_a8761a40_c0bd_46c9_af12_3081edd9dbc5',                
                    'Type': 'box',
                    'InnerHTML': ''
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '660px',
                    'Left': '648px',
                    'Height': '300px',
                    'Width': '80px',
                    'ZIndex': '26','BackgroundImage': 'Unknown_project_6_resources/bfa9f1ce-ff60-4dce-aacc-04e2d957e051.jpg','BackgroundSize': '100% 100%','Display': 'block','TextAlign': 'left',

                'TextColor': '#000000',
                'Opacity': '1',
                'FontFamily': 'Arial',
                'FontSize': '14px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_170b10c2_4a49_4e3a_af26_a742e12cec77',                
                    'Type': 'box',
                    'InnerHTML': '  <div style=\"width:100%; text-align:center; display: table; height: 100%; #position: relative; overflow: hidden;\">      <div style=\"#position: absolute; #top: 50%; display: table-cell; vertical-align: middle;\">        <div style=\"#position: relative; #top: -50%;\">          COLLECTION 1        </div>      </div>    </div>'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-46px',
                    'Left': '10px',
                    'Height': '46px',
                    'Width': '242px',
                    'ZIndex': '27','BackgroundColor': '#000000','Display': 'block','TextAlign': 'center',
'BorderRadiusTopLeft': '5px',
'BorderRadiusTopRight': '5px',
'BorderRadiusBottomLeft': '5px',
'BorderRadiusBottomRight': '5px',

                'TextColor': '#00C8FF',
                'Opacity': '0',
                'FontFamily': 'Lucida Console',
                'FontSize': '30px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []},
                {
                    'Oid': '_63655a09_68ed_4a73_8bd4_7201bc2865ff',                
                    'Type': 'box',
                    'InnerHTML': '  <div style=\"width:100%; text-align:center; display: table; height: 100%; #position: relative; overflow: hidden;\">      <div style=\"#position: absolute; #top: 50%; display: table-cell; vertical-align: middle;\">        <div style=\"#position: relative; #top: -50%;\">          TEMPLATE        </div>      </div>    </div>'
                    ,
                    'Tag': 'div',
                    'Position': 'absolute',
                    'Top': '-46px',
                    'Left': '10px',
                    'Height': '46px',
                    'Width': '188px',
                    'ZIndex': '28','BackgroundColor': '#000000','Display': 'block','TextAlign': 'center',
'BorderRadiusTopLeft': '5px',
'BorderRadiusTopRight': '5px',
'BorderRadiusBottomLeft': '5px',
'BorderRadiusBottomRight': '5px',

                'TextColor': '#00C8FF',
                'Opacity': '0',
                'FontFamily': 'Lucida Console',
                'FontSize': '30px',
                'LineHeight': '1em',

                

                'Visible': 'true',




'Pressed': [],
                    
                    'Hover': []}

                ],
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_cd18d587_c12c_4cd8_8a2a_d2683cdc582f',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_5cee61fc_c9d7_4e2b_b565_afee66ec71df',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_0cde0fe6_6d5b_447f_bc68_b9101b30a0c8',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_9ac6d82e_bef0_4f50_af6a_52203aadb504',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_30dd0f53_d3b3_4873_a879_767445e699c0',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_95efe1d8_c9a5_4e23_8ecb_568dad13887d',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_9273cd69_9353_4d2a_9565_60883e18b48e',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_e7821f1a_7078_4ab8_b336_fd4cbfe8a483',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_0567194f_01a6_4d15_a6d2_7729c84806fb',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_d4d411cc_dcd9_443d_985f_20a20821e106',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_a5fee92a_63de_4a60_a55b_ebca75d462f0',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-300px'
                        }]
},
{
                            'ObjectId':'_485f9f80_2149_428e_80b2_96aabf79ecde',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '340px'
                        }]
},
{
                            'ObjectId':'_00674769_1a0b_4bc6_b577_e39f365c5b4e',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-380px'
                        }]
},
{
                            'ObjectId':'_251d28e4_6fd9_46d3_9fbe_a9e3a32976fb',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '420px'
                        }]
},
{
                            'ObjectId':'_a117d06f_972f_4c62_ad83_6776bbd81bab',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-460px'
                        }]
},
{
                            'ObjectId':'_2608fd3c_6fe8_4504_a1de_fbc0ca4a916d',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '500px'
                        }]
},
{
                            'ObjectId':'_8b66ce07_f568_4e24_924e_8d4688de2366',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-540px'
                        }]
},
{
                            'ObjectId':'_1b797d5c_acd3_4d35_8c5d_2a985394dde0',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '580px'
                        }]
},
{
                            'ObjectId':'_5a8c538e_d7b0_4dab_94d8_9a4bc7c226e8',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-620px'
                        }]
},
{
                            'ObjectId':'_a8761a40_c0bd_46c9_af12_3081edd9dbc5',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '660px'
                        }]
},
{
                            'ObjectId':'_170b10c2_4a49_4e3a_af26_a742e12cec77',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-46px'
                        },
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
                            'ObjectId':'_63655a09_68ed_4a73_8bd4_7201bc2865ff',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-46px'
                        },
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
                            'ObjectId':'_4757cb29_e1dd_4149_b98c_d77cf9202ed4',
                            'StartTime':200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '206px'
                        }]
},
{
                            'ObjectId':'_4757cb29_e1dd_4149_b98c_d77cf9202ed4',
                            'StartTime':200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0.7'
                        }]
},
{
                            'ObjectId':'_4757cb29_e1dd_4149_b98c_d77cf9202ed4',
                            'StartTime':600,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.2s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '196px'
                        }]
},


			    ],
                'Changes': [
			
                    {
                            'ObjectId':'_45043fd5_d4e1_48e4_b619_c184aa650d5f',
                            'StartTime':100,
                            'ChangeElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Visible',
                            'Duration':'0s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': 'true'
                        }]
},
{
                            'ObjectId':'_f8056297_fd45_4ccd_8d02_8ae9a8aee128',
                            'StartTime':100,
                            'ChangeElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Visible',
                            'Duration':'0s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': 'false'
                        }]
},


			    ],
                'Events': [
			
                    
                    {
                            'FunctionId':'GotoNextTimeline',
                            'StartTime':4000
                    },
                    {
                            'FunctionId':'GotoNextTimeline',
                            'StartTime':8000
                    }

			    ]
            },
            {
                'Oid': '_a5f4f95d_5df1_42c0_9f1a_94982e50c004',
                'Name': 'Timeline 2',
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_cd18d587_c12c_4cd8_8a2a_d2683cdc582f',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-300px'
                        }]
},
{
                            'ObjectId':'_5cee61fc_c9d7_4e2b_b565_afee66ec71df',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '340px'
                        }]
},
{
                            'ObjectId':'_0cde0fe6_6d5b_447f_bc68_b9101b30a0c8',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-380px'
                        }]
},
{
                            'ObjectId':'_9ac6d82e_bef0_4f50_af6a_52203aadb504',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '420px'
                        }]
},
{
                            'ObjectId':'_30dd0f53_d3b3_4873_a879_767445e699c0',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-460px'
                        }]
},
{
                            'ObjectId':'_95efe1d8_c9a5_4e23_8ecb_568dad13887d',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '500px'
                        }]
},
{
                            'ObjectId':'_9273cd69_9353_4d2a_9565_60883e18b48e',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-540px'
                        }]
},
{
                            'ObjectId':'_e7821f1a_7078_4ab8_b336_fd4cbfe8a483',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '580px'
                        }]
},
{
                            'ObjectId':'_0567194f_01a6_4d15_a6d2_7729c84806fb',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-620px'
                        }]
},
{
                            'ObjectId':'_d4d411cc_dcd9_443d_985f_20a20821e106',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '660px'
                        }]
},
{
                            'ObjectId':'_4757cb29_e1dd_4149_b98c_d77cf9202ed4',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.1s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '-94px'
                        },
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
                            'ObjectId':'_a5fee92a_63de_4a60_a55b_ebca75d462f0',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_485f9f80_2149_428e_80b2_96aabf79ecde',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_00674769_1a0b_4bc6_b577_e39f365c5b4e',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_251d28e4_6fd9_46d3_9fbe_a9e3a32976fb',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_a117d06f_972f_4c62_ad83_6776bbd81bab',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_2608fd3c_6fe8_4504_a1de_fbc0ca4a916d',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_8b66ce07_f568_4e24_924e_8d4688de2366',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_1b797d5c_acd3_4d35_8c5d_2a985394dde0',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_5a8c538e_d7b0_4dab_94d8_9a4bc7c226e8',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_a8761a40_c0bd_46c9_af12_3081edd9dbc5',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0px'
                        }]
},
{
                            'ObjectId':'_170b10c2_4a49_4e3a_af26_a742e12cec77',
                            'StartTime':200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '254px'
                        }]
},
{
                            'ObjectId':'_170b10c2_4a49_4e3a_af26_a742e12cec77',
                            'StartTime':200,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0.7'
                        }]
},
{
                            'ObjectId':'_63655a09_68ed_4a73_8bd4_7201bc2865ff',
                            'StartTime':500,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '203px'
                        }]
},
{
                            'ObjectId':'_63655a09_68ed_4a73_8bd4_7201bc2865ff',
                            'StartTime':500,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.4s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '0.7'
                        }]
},
{
                            'ObjectId':'_170b10c2_4a49_4e3a_af26_a742e12cec77',
                            'StartTime':600,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.2s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '244px'
                        }]
},
{
                            'ObjectId':'_63655a09_68ed_4a73_8bd4_7201bc2865ff',
                            'StartTime':900,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Top',
                            'Duration':'0.2s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '193px'
                        }]
},


			    ],
                'Changes': [
			
                    {
                            'ObjectId':'_45043fd5_d4e1_48e4_b619_c184aa650d5f',
                            'StartTime':100,
                            'ChangeElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Visible',
                            'Duration':'0s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': 'false'
                        }]
},
{
                            'ObjectId':'_f8056297_fd45_4ccd_8d02_8ae9a8aee128',
                            'StartTime':100,
                            'ChangeElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Visible',
                            'Duration':'0s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': 'true'
                        }]
},


			    ],
                'Events': [
			
                    
                    {
                            'FunctionId':'GotoNextTimeline',
                            'StartTime':4000
                    },
                    {
                            'FunctionId':'GotoNextTimeline',
                            'StartTime':8000
                    }

			    ]
            },
            {
                'Oid': '_8eb7261a_fa36_4e08_9fcd_4f536cd52376',
                'Name': 'Hide preview',
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_6597cf97_4a00_4fe1_b97a_23be7721b824',
                            'StartTime':100,
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


			    ],
                'Changes': [
			
                    

			    ],
                'Events': [
			
                    
                    {
                            'FunctionId':'GotoNextTimeline',
                            'StartTime':4000
                    },
                    {
                            'FunctionId':'GotoNextTimeline',
                            'StartTime':8000
                    }

			    ]
            },
            {
                'Oid': '_0ae37e38_1d5e_4ff2_88c2_54eb3c0f13de',
                'Name': 'Show preview 1',
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_6597cf97_4a00_4fe1_b97a_23be7721b824',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.2s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '1'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.2s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '502px'
                        }]
},


			    ],
                'Changes': [
			
                    {
                            'ObjectId':'_6597cf97_4a00_4fe1_b97a_23be7721b824',
                            'StartTime':100,
                            'ChangeElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'BackgroundImage',
                            'Duration':'0s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': 'Unknown_project_6_resources/starry-night-1149815_1920.jpg'
                        }]
},


			    ],
                'Events': [
			
                    
                    {
                            'FunctionId':'GotoNextTimeline',
                            'StartTime':4000
                    },
                    {
                            'FunctionId':'GotoNextTimeline',
                            'StartTime':8000
                    }

			    ]
            },
            {
                'Oid': '_3caa88cc_fe5b_45a9_98b7_f1afda6d8ee3',
                'Name': 'Show preview 2',
                'Transforms': [
			
                    

			    ],
                'Transitions': [
			
                    {
                            'ObjectId':'_6597cf97_4a00_4fe1_b97a_23be7721b824',
                            'StartTime':100,
                            'TransitionElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Opacity',
                            'Duration':'0.2s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '1'
                        },
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'Left',
                            'Duration':'0.2s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': '518px'
                        }]
},


			    ],
                'Changes': [
			
                    {
                            'ObjectId':'_6597cf97_4a00_4fe1_b97a_23be7721b824',
                            'StartTime':100,
                            'ChangeElements':[
                        {
                            'Oid':'TRANSITION_BLOCK_1',
                            'Property':'BackgroundImage',
                            'Duration':'0s',
                            'Delay':'0s',
                            'TimingFunc':'linear',
                            'EndValue': 'Unknown_project_6_resources/6401.jpg'
                        }]
},


			    ],
                'Events': [
			
                    
                    {
                            'FunctionId':'GotoNextTimeline',
                            'StartTime':4000
                    },
                    {
                            'FunctionId':'GotoNextTimeline',
                            'StartTime':8000
                    }

			    ]
            }]
}];

            Unknown_project_6.init();
            Unknown_project_6.stageHeight = 300;
            Unknown_project_6.stageWidth  = 728;
            Unknown_project_6.t  = '493006111261911259927688761069469349972';
            Unknown_project_6.stageInitialTransition = 'instant';
            Unknown_project_6.stageInitialTransitionDirection = 'left';
            Unknown_project_6.stageInitialTransitionSpeed = 1000;
            Unknown_project_6.showBrowserCompatibilityCheck = false;
                Unknown_project_6.loaderType = 1;
                Unknown_project_6.loaderBackgroundColor = '#000';
                Unknown_project_6.loaderForegroundColor = '#fff';
            Unknown_project_6.stageInitialScene = '_d14041b5_00eb_43a6_8df8_7ec8cd0dbaaa';
            Unknown_project_6.debug = false;
            Unknown_project_6.preloadImages = true;
Unknown_project_6.imagesToPreload = [
'Unknown_project_6_resources/view_on.png',
'Unknown_project_6_resources/view_off.png',
'Unknown_project_6_resources/view_on.png',
'Unknown_project_6_resources/10835bb5-644d-48e5-8fe7-b7a3b35cdb83.jpg',
'Unknown_project_6_resources/07de1d38-c1c7-4b6d-bd59-7313ee2e0ac3.jpg',
'Unknown_project_6_resources/056e8317-6bd6-4d07-9090-ab7c828d32f9.jpg',
'Unknown_project_6_resources/9426295a-cae6-4f29-8bc9-33239d76608e.jpg',
'Unknown_project_6_resources/faa4e298-2f1e-456c-8599-2f8027acdf2c.jpg',
'Unknown_project_6_resources/b8eec786-9752-47aa-b8ff-524a420ed581.jpg',
'Unknown_project_6_resources/277c495b-2f90-48f4-b978-fa4e71f996bd.jpg',
'Unknown_project_6_resources/c1709855-737e-404c-9fc2-88bbff87dd35.jpg',
'Unknown_project_6_resources/a4c1d4c8-5a18-4615-af6c-55ecf5481f07.jpg',
'Unknown_project_6_resources/f3b00f18-d269-4481-b2d8-032d30d99190.jpg',
'Unknown_project_6_resources/view_off.png',
'Unknown_project_6_resources/view_on.png',
'Unknown_project_6_resources/7b6fe48d-753c-4b0c-b33a-7bba7288296b.jpg',
'Unknown_project_6_resources/5fded7af-592c-4ad6-86eb-add8b877326a.jpg',
'Unknown_project_6_resources/29f3d2ea-f3f8-4b33-a75d-b4516a14be80.jpg',
'Unknown_project_6_resources/a650ab1b-f98c-4b9c-951e-65e2fa22d6b9.jpg',
'Unknown_project_6_resources/fb80cef1-f9cb-483c-9d28-82353afdb56a.jpg',
'Unknown_project_6_resources/de2344cd-5010-4548-ba22-d9a7297d210f.jpg',
'Unknown_project_6_resources/9dcc8fc2-1037-446f-9948-616d75199966.jpg',
'Unknown_project_6_resources/b0576c60-1750-4618-9451-8556f37495fe.jpg',
'Unknown_project_6_resources/409643a1-7ff4-4e07-8e4f-b8a5b2878c78.jpg',
'Unknown_project_6_resources/bfa9f1ce-ff60-4dce-aacc-04e2d957e051.jpg',
'Unknown_project_6_resources/starry-night-1149815_1920.jpg',
'Unknown_project_6_resources/6401.jpg'
];Unknown_project_6.createWorkspace('Unknown_project_6Stage');

                }

                catch (e) 
                {
	                
                }
            }

loadResources('Unknown_project_6Stage');
addLoadEvent(Unknown_project_6start);

