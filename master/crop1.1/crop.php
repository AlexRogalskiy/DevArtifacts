<?php
require_once('class.upload.php');
	if((isset($_POST['step']))&&($_POST['step']=='process')){
			$pic = 'picture';
			
			$handle = new Upload($_SERVER['DOCUMENT_ROOT'].$_POST['tempfile']);
			
			if ($handle->uploaded) {
				$handle->file_src_name_body      = $pic; // hard name
				$handle->file_overwrite 		 = true;
				$handle->file_auto_rename 		 = false;
				$handle->image_resize            = true;
				$handle->image_x                 = 100; //size of final picture
				$handle->image_y                 = 100; //size of final picture
				
				$handle->jcrop                   = true;
				$handle->rect_w                  = $_POST['w']; 
				$handle->rect_h                  = $_POST['h']; 
				$handle->posX                    = $_POST['x']; 
				$handle->posY                    = $_POST['y'];
				$handle->jpeg_quality 		 	 = 100;
				$handle->Process($_SERVER['DOCUMENT_ROOT'].'/crop1.1/photos/');
				
				//thumb-50
				$handle->file_src_name_body      = $pic; // hard name
				$handle->file_overwrite 		 = true;
				$handle->file_auto_rename 		 = false;
				$handle->image_resize            = true;
				$handle->image_x                 = 50;
				$handle->image_y                 = 50; //size of picture
				
				$handle->jcrop                   = true;
				$handle->rect_w                  = $_POST['w']; 
				$handle->rect_h                  = $_POST['h']; 
				$handle->posX                    = $_POST['x']; 
				$handle->posY                    = $_POST['y'];
				$handle->jpeg_quality 		 	 = 100;
				$handle->Process($_SERVER['DOCUMENT_ROOT'].'/crop1.1/photos/50/');
				
				$handle->clean(); 
				
			} 
			else {
				//error
			}
	
	}
	header("Location: .");
?>