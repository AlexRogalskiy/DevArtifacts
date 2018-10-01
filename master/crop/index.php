<?php
require_once('class.upload.php');
?>
<html>
    <head>
        <title>Uploader</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> 
        
        
        <link href="uploadify/default.css" rel="stylesheet" type="text/css" />
  		<link href="uploadify/uploadify.css" rel="stylesheet" type="text/css" />
  		<link rel="stylesheet" href="jcrop/jquery.Jcrop.css" type="text/css" />
		<link rel="stylesheet" href="jcrop/demos.css" type="text/css" />
		<script type="text/javascript" language="javascript" src="jquery-1.3.2.js"></script>
  		<script type="text/javascript" src="uploadify/swfobject.js"></script>		
		<style>
			body{
				background-color:#f0f0f0;
			}
			.content{
				background-color:#fff;
				width:80%;
				height:600px;
				margin:20px auto;
				padding:20px;
			}
			.preview_container{
				width:100px;
				height:100px;
				overflow:hidden;
				margin-bottom:5px;
			}
			.left{
				width:250px;
				float:left;
			}
			.right{
			
				float:right;
			}
		</style>
    </head>
    <body>
			<div class="content">
				<div class="left">
					<div id="preview_container" class="preview_container">
						<img id="preview" src="<?php echo 'photos/picture.jpg'.'?'.time();?>"></img>
					</div>					
					<input type="file" name="uploadify" id="uploadify" />
					<div>
						<div id="fileQueue"></div>
					</div>
				</div>	
				<div class="right">
					<div id="image_container">
					</div>	
				<form id="cropattrform" action="crop.php" method="post" onsubmit="return checkCoords();">
					<input type="hidden" id="x" name="x" />
					<input type="hidden" id="y" name="y" />
					<input type="hidden" id="w" name="w" />
					<input type="hidden" id="h" name="h" />
					<input type="hidden" id="tempfile" name="tempfile" />
					<input type="hidden" class="jq_step" id="step" name="step" value="process" />
				</form>
				</div>
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
					'queueID'        : 'fileQueue',
					'auto'           : true,
					'buttonText'     : 'upload',
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