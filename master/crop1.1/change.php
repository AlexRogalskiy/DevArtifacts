<?php
require_once('class.upload.php');
	
$pic = 'picture';

$handle = new Upload($_SERVER['DOCUMENT_ROOT'].'/crop1.1/photos/picture.jpg');

if ($handle->uploaded) {
	$handle->file_src_name_body      = $pic; // hard name
	$handle->file_overwrite 		 = true;
	$handle->file_auto_rename 		 = false;
	$handle->image_resize            = true;
	$handle->image_x                 = 100; //size of final picture
	$handle->image_y                 = 100; //size of final picture
	
	
	
	switch($_POST['op']){
		case 'sepia':
			$handle->image_tint_color= '#C68039';
			break;
		case 'negative':
			$handle->image_negative  = true;
			break;	
		case 'bw':
			$handle->image_greyscale = true;
			break;	
		case 'rotate':
			$handle->image_rotate 	 = 90;
			break;		
	}
	
	$handle->jpeg_quality 		 	 = 100;
	$handle->Process($_SERVER['DOCUMENT_ROOT'].'/crop1.1/photos/');
	
	//thumb-50
	$handle->file_src_name_body      = $pic; // hard name
	$handle->file_overwrite 		 = true;
	$handle->file_auto_rename 		 = false;
	$handle->image_resize            = true;
	$handle->image_x                 = 50;
	$handle->image_y                 = 50; //size of picture
	
	$handle->jpeg_quality 		 	 = 100;
	$handle->Process($_SERVER['DOCUMENT_ROOT'].'/crop1.1/photos/50/');
	
	$json = array("result" => 1);
	$encoded = json_encode($json);
	echo $encoded;
	unset($encoded);
	
} 
else {
	$json = array("result" => -1);
	$encoded = json_encode($json);
	echo $encoded;
	unset($encoded);
}
	

?>