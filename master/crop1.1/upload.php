<?php
require_once('class.upload.php');
if (!empty($_FILES)) {
		$targetPath = $_SERVER['DOCUMENT_ROOT'] . $_REQUEST['folder'] . '/';
		$pic_temp = 'picture_temp';
		
		$handle = new Upload($_FILES['Filedata']);
			if ($handle->uploaded) {
				$handle->file_src_name_body      = $pic_temp; // hard name
				$handle->file_overwrite 		 = true;
				$handle->file_auto_rename 		 = false;
				$handle->image_resize            = true;
				$handle->image_ratio_y           = true;
				$handle->image_x                 = ($handle->image_src_x < 400)?$handle->image_src_x:400;
				$handle->file_max_size 			 = '819200'; // max size
				$handle->Process($targetPath.'/');
				$handle->clean(); 
				if ($handle->processed)
	           		$json = array("result" 		=> 1, 
	           					  "file" 		=> $_REQUEST['folder'].'/'.$handle->file_dst_name.'?'.time(),
	           					  "imagewidth" 	=> $handle->image_dst_x,
	           					  "imageheight"	=> $handle->image_dst_y
	           					 );
	       		else
	           		$json = array("result" => 0);
	           	
	           	$encoded = json_encode($json);
				echo $encoded;
				unset($encoded);	
			} 
			else { 
				$json = array("result" => 0);
	           	$encoded = json_encode($json);
				echo $encoded;
				unset($encoded);
			}
}
?>