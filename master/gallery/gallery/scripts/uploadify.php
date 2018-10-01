<?php
include('class.upload.php');
/*
Uploadify v2.1.0
Release Date: August 24, 2009

Copyright (c) 2009 Ronnie Garcia, Travis Nickels

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


//this is part of class.upload:
if (!empty($_FILES)) {
	$tempFile = $_FILES['Filedata']['tmp_name'];
	$targetPath = $_SERVER['DOCUMENT_ROOT'] . $_REQUEST['folder'] . '/';
	$targetFile =  utf8_decode(str_replace('//','/',$targetPath) . $_FILES['Filedata']['name']);

	$file_id = md5($_FILES["Filedata"]["tmp_name"] + rand()*100000 + time());

	$handle = new Upload($_FILES['Filedata']);
		if ($handle->uploaded) {
			$handle->file_src_name_body      = time().$file_id; // hard name
			//$handle->file_overwrite = true;
			//$handle->file_auto_rename = false;
			$handle->image_resize            = true;
			$handle->image_ratio_y           = true;
			$handle->image_x                 = 600; //size of picture
			$handle->file_max_size = '512000'; // max size
			$handle->Process($targetPath.'/');
			// $handle-> Clean();
			
			
			//thumbnail creation:
			$handle->file_src_name_body      = time().$file_id; // hard name
			//$handle->file_overwrite = true;
			//$handle->file_auto_rename = false;
			$handle->image_resize            = true;
			//$handle->image_ratio_y           = true;
			$handle->image_ratio_x           = true;
			$handle->image_y                 = 70; //size of picture
			$handle->file_max_size = '512000'; // max size
			$handle->Process($targetPath.'/'.'thumbs/');
			
			$handle-> Clean();
			echo "1";
		} else {
		}
}	
?>