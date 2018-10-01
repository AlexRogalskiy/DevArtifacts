<?php
$dhandle_ = opendir('../images');
$filesoriginal = array();
$dhandle = opendir('../images/thumbs/');
$filesthumbs = array();

if ($dhandle_) {
   while (false !== ($fname = readdir($dhandle_))) {
	  $ext = pathinfo($fname, PATHINFO_EXTENSION);

      if (($fname != '.') && ($fname != '..') &&
          ($fname != basename($_SERVER['PHP_SELF'])) &&
		  (($ext == 'jpg')||($ext == 'gif'))
		  ) {
          $filesoriginal[] = (is_dir( "./$fname" )) ? "(Dir) {$fname}" : $fname;
      }
   }
   sort($filesoriginal);
   closedir($dhandle_);
}
if ($dhandle) {
   while (false !== ($fname = readdir($dhandle))) {
	  $ext = pathinfo($fname, PATHINFO_EXTENSION);
      if (($fname != '.') && ($fname != '..') &&
          ($fname != basename($_SERVER['PHP_SELF']))&&
		  (($ext == 'jpg')||($ext == 'gif'))
		  ) {
          $filesthumbs[] = (is_dir( "./$fname" )) ? "(Dir) {$fname}" : $fname;
      }
   }
   sort($filesthumbs);
   closedir($dhandle);
}
$_html="";
$i=0;
foreach( $filesoriginal as $fname ){
   $_html .= "<li>";
   $_html .= "<a href='images/".$fname."'>";
   $_html .= "<img title='A title for this' longdesc='This is a nice, and incredibly descriptive, description of the image 10.jpg' src='images/thumbs/".$filesthumbs[$i]."' class='image'>";
   $_html .= "</a>";
   $_html .= "</li>";
   $i++;
}
echo $_html;
?>
  