<?php
// example of how to use basic selector to retrieve HTML contents
include('simple_html_dom.php');
include('class.upload.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
    <head>
        <title>URL Image Getter/Uploader/Resizer</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <link rel="stylesheet" type="text/css" href="css/style.css" media="screen"/>
    </head>
    <body>
        <a href="http://www.tympanus.net/codrops/2009/12/06/url-image-getteruploaderresizer/">Back to Codrops</a>
        <h1>URL Image Getter/Uploader/Resizer</h1>
        
	<?php 
	// get DOM from URL or file
	$url = 'http://www.tympanus.net';
	$max_pictures = 10;
	$html = file_get_html($url);
	
	// find all image
	$counter = 0;
	foreach($html->find('img') as $e){
		if($counter == $max_pictures) 
			break;
		if (strpos($e->src,'://')!==false)
			$img = $e->src;
		else{	
			if(substr($url, -1) == '/')
				$img = substr($url, 0, -1).$e->src;
			else
				$img = $url.$e->src;
		}	
		
		$from_url = true;
		$handle = new Upload($img,$from_url);
		if ($handle->uploaded) {
			$handle->image_resize            = true;
			$handle->image_ratio_y           = true;
			$handle->image_ratio_crop = true;
			$handle->Process('./images/',$from_url);
			
			if ($handle->processed) {
				echo '<fieldset>';
				echo '  <legend>file uploaded with success</legend>';
				echo '  <img src="images/' . $handle->file_dst_name . '" />';
				$info = getimagesize($handle->file_dst_pathname);
				echo '  <p>' . $info['mime'] . ' &nbsp;-&nbsp; ' . $info[0] . ' x ' . $info[1] .' &nbsp;-&nbsp; ' . round(filesize($handle->file_dst_pathname)/256)/4 . 'KB</p>';
				echo '  link to the file just uploaded: <a href="images/' . $handle->file_dst_name . '">' . $handle->file_dst_name . '</a>';
				echo '</fieldset>';
			} else {
				// one error occured
				echo '<fieldset>';
				echo '  <legend>file not uploaded to the wanted location</legend>';
				echo '  Error: ' . $handle->error . '';
				echo '</fieldset>';
			}
			$handle-> Clean();

		} else {
			// if we're here, the upload file failed for some reasons
			// i.e. the server didn't receive the file
			echo '<fieldset>';
			echo '  <legend>file not uploaded on the server</legend>';
			echo '  Error: ' . $handle->error . '';
			echo '</fieldset>';
		}
		++$counter;
	}
	?>	
	</body>
</html>