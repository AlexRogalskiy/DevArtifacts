<?php
require_once('class.upload.php');
?>
<html>
    <head>
        <title>Uploader</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> 
        <script type="text/javascript" language="javascript" src="jquery-1.3.2.js"></script>
  		<script type="text/javascript" src="uploadify/swfobject.js"></script>		
		<link href="uploadify/default.css" rel="stylesheet" type="text/css" />
  		<link href="uploadify/uploadify.css" rel="stylesheet" type="text/css" />
  		<link rel="stylesheet" href="jcrop/jquery.Jcrop.css" type="text/css" />
		<link rel="stylesheet" href="jcrop/demos.css" type="text/css" />
		<style>
			body{
				background-color:#f0f0f0;
				font-family:Arial;
				text-align:center;
			}
			.header{
				width:1000px;
				height:30px;
				margin:0px auto 20px auto;
				text-align:left;
			}
			h1{
				padding:0px;
				margin:0px;				
				color:#999;				
			}
			.content{
				text-align:left;
				background-color:#fff;
				width:1000px;
				margin:5px auto;
				padding:20px 20px 3px 20px;
				-moz-border-radius:20px;
				-webkit-border-radius:20px;
				-khtml-border-radius:20px;
				-moz-box-shadow: 0 1px 3px rgba(0,0,0,0.5);
				-webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.5);				
			}
			.preview_container{
				width:100px;
				height:100px;
				overflow:hidden;
				margin-bottom:5px;
			}
			a.preview_overlay{
				background:#fff url(img/edit.gif) no-repeat center center;
				width:19px;
				height:19px;
				position:absolute;
				filter:progid:DXImageTransform.Microsoft.Alpha(opacity=80);
				opacity: 0.8;
				-moz-opacity: 0.8;
				margin-left:81px;
				cursor:pointer;
			}
			a.preview_overlay:hover{
				filter:progid:DXImageTransform.Microsoft.Alpha(opacity=90);
				opacity: 0.9;
				-moz-opacity: 0.9;
			}
			.left{
				width:250px;
				height:400px;
				float:left;
			}
			.right{			
				float:left;
			}
			.footer{
				width:100%;
				text-align:center;
				height:30px;		
				margin-top:50px;
				clear:both;
			}
			a img{
				border:none;
			}
			object{
				filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);
			}
			ul.imgmenu{
				float:left;
				margin-top:100px;
				padding:0px;
				margin:0px;
				border:2px solid #f0f0f0;
				list-style-type:none;
			}
			ul.imgmenu li{
				display:inline;
				float:left;	
				width:24px;
				height:24px;	
				cursor:pointer;				
			}
			li.rotate{
				background: transparent url(img/rotate.png) no-repeat top left;
			}
			li.bw{
				background: transparent url(img/bw.png) no-repeat top left;
			}
			li.negative{
				background: transparent url(img/negative.png) no-repeat top left;
			}
			li.sepia{
				background: transparent url(img/sepia.png) no-repeat top left;
			}
			.queue{
				float:left;
				clear:both;
			}
			.ajaxload{
				background:#fff url(img/ajax-loader.gif) no-repeat center center;
				width:16px;
				height:26px;
				float:left;
				clear:right;
				margin:0px 0px 0px 5px;
			}
			.crop_control{
				margin-top:10px;
			}
		</style>
    </head>
    <body>
			<div class="header">
				<h1>Image Cropper with Uploader</h1>
			</div>
			<div class="content">
				<div class="left">
					<div id="preview_container" class="preview_container">
						<input type="file" name="uploadify" id="uploadify" style="display:none;"/>
						<a id="overlay" class="preview_overlay" style="display:none;"></a>
						<img id="preview" src="<?php echo 'photos/picture.jpg'.'?'.time();?>"></img>
					</div>					
					<ul id="options" class="imgmenu">
							<li id="rotate" class="rotate _change"></li>
							<li id="bw" class="bw _change"></li>
							<li id="negative" class="negative _change"></li>		
							<li id="sepia" class="sepia _change"></li>								
					</ul>
					<div id="ajaxload" class="ajaxload" style="display:none;"></div>
					<div class="queue">
						<div id="fileQueue"></div>
					</div>
				</div>	
				<div class="right">
					<div id="image_container">
					</div>	
					<form id="cropattrform" action="crop.php" method="post" onsubmit="return checkCoords();" class="crop_control">
						<input type="hidden" id="x" name="x" />
						<input type="hidden" id="y" name="y" />
						<input type="hidden" id="w" name="w" />
						<input type="hidden" id="h" name="h" />
						<input type="hidden" id="tempfile" name="tempfile" />
						<input type="hidden" class="jq_step" id="step" name="step" value="process" />
					</form>
				</div>
				<div class="footer"><a href="http://www.tympanus.net/codrops/"><img src="back.png" alt="Back to Codrops"/></a></div>
            </div>
			
        
    	<script type="text/javascript" src="uploadify/jquery.uploadify.v2.1.0.min.js"></script>
  		<script src="jcrop/jquery.Jcrop.min.js"></script>
  		<script type="text/javascript">
	  		$(function() {
				$("#uploadify").uploadify({
					'uploader'       : 'uploadify/uploadify.swf',
					'script'         : 'upload.php',
					'cancelImg'      : 'uploadify/cancel.png',
					'folder'         : 'photos',
					'width'			 : '19',
					'height'		 : '19',
					'queueID'        : 'fileQueue',
					'auto'           : true,
					'queueSizeLimit' : 1,
					'multi'          : false,
					'fileDesc'		 : 'jpg',
					'fileExt'		 : '*.jpg',
					'sizeLimit'      : '819200',//max size bytes - 800kb
					'onComplete'  	 : function(event,queueID,fileObj,response,data) {
											
											$('#uploadifyUploader').remove();
											var dataresponse = eval('(' + response + ')');
											
											if(dataresponse.result == '1'){
												var filenametmp = (dataresponse.file).substring(0,(dataresponse.file).lastIndexOf("?"));		
												$('#tempfile').val(filenametmp);
												
												var img = new Image();
									        	$(img).load(function () {
										        	$imgpos.width  = dataresponse.imagewidth;
										            $imgpos.height = dataresponse.imageheight;
													$("#cropbox").remove();
										        	$(".jcrop-holder").remove();
										        	$(this).attr('id','cropbox');
										            $(this).hide();
										            $('#image_container').append(this);
										            
										            $(this).fadeIn().Jcrop({
														onChange: showPreview,
														onSelect: showPreview,
														aspectRatio: 1,
														onSelect: updateCoords,
														setSelect: [ 0, 0, 150, 150 ]
													});
	
										            $("#preview").remove();
													$("#options").hide();
													
										            var _imgprev = $(document.createElement('img')).attr('id','preview').attr('src',dataresponse.file);
										            $('#preview_container').append(_imgprev);

													if(!$('#_crop_bttn').length){		
										            	var _crop_bttn = $(document.createElement('input')).attr('id','_crop_bttn').attr('type','submit').val('save');
										            	var _crop_cancel_bttn = $(document.createElement('input')).attr('id','_crop_cancel_bttn').attr('type','submit').val('cancel');
										            	_crop_cancel_bttn.click(function(){$('#cropattrform input.jq_step').val('cancel');});	
														_crop_bttn.click(function(){$('#cropattrform input.jq_step').val('process');});	
										            	$('#cropattrform').append(_crop_bttn).append(_crop_cancel_bttn);
													}
									        	}).attr('src', dataresponse.file);
											}	
											else
												alert('error');
										},				
					'onError'		 : function(){
											alert('error');
									   }
				});
				$('#preview_container').hover(
					function () {
						$('#overlay').show();
					  }, 
					function () {
						$('#overlay').hide();
					}
				);
				$('._change').click(function(){
					$('#ajaxload').show();		
					var url = 'change.php?ts='+new Date().getTime();
					var data = 'op='+$(this).attr('id');
					$.ajax({
						   type: "POST",
						   url: url,
						   timeout : 30000,
						   dataType: "json",
						   data : data,
						   success: function(data,textStatus){
										if(data.result == 1){
											$('#preview').attr('src',"photos/picture.jpg?"+Math.floor(Math.random()*1001));
										}	
										$('#ajaxload').hide();				
									},
						   error  : function(){
										$('#ajaxload').hide();				
									}
					});
				})
	  		});   
			function updateCoords(c)
			{
				$('#x').val(c.x);
				$('#y').val(c.y);
				$('#w').val(c.w);
				$('#h').val(c.h);
			};
			function checkCoords()
			{
				if (parseInt($('#w').val())){
					return true;
				}	
				$('#x').val(0);
				$('#y').val(0);
				$('#w').val(150);
				$('#h').val(150);
				return true;
			};
			function showPreview(coords)
			{
				if (parseInt(coords.w) > 0)
				{
					var rx = 100 / coords.w;
					var ry = 100 / coords.h;
					$('#preview').css({
						width: Math.round(rx * $imgpos.width) + 'px',
						height: Math.round(ry * $imgpos.height) + 'px',
						marginLeft: '-' + Math.round(rx * coords.x) + 'px',
						marginTop: '-' + Math.round(ry * coords.y) + 'px'
					});
				}
			};	
			$imgpos = {
				    width	: '100',
				    height	: '100'
			};
  		</script>	
	</body>
</html>