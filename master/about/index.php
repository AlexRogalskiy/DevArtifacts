<?php

require 'includes/config.php';
require 'includes/aboutPage.class.php';
require 'includes/vcard.class.php';

$profile = new AboutPage($info);

if(array_key_exists('json',$_GET)){
	$profile->generateJSON();
	exit;
}
else if(array_key_exists('vcard',$_GET)){
	$profile->downloadVcard();
	exit;
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="description" content="Online info page of <?php echo $profile->fullName()?>. Learn more about me and download a vCard." />

        <title>Creating a PHP and CSS Powered About Page  | Tutorialzine Demo</title>
        
        <!-- Our CSS stylesheet file -->
        <link rel="stylesheet" href="assets/css/styles.css" />
        
        <!--[if lt IE 9]>
          <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
    </head>
    
    <body>

		<section id="infoPage">
	
    		<img src="<?php echo $profile->photoURL()?>" alt="<?php echo $profile->fullName()?>" width="164" height="164" />

            <header>
                <h1><?php echo $profile->fullName()?></h1>
                <h2><?php echo $profile->tags()?></h2>
            </header>
            
            <p class="description"><?php echo nl2br($profile->description())?></p>
            
            <a href="<?php echo $profile->facebook()?>" class="grayButton facebook">Find me on Facebook</a>
            <a href="<?php echo $profile->twitter()?>" class="grayButton twitter">Follow me on Twitter</a>
            
            <ul class="vcard">
                <li class="fn"><?php echo $profile->fullName()?></li>
                <li class="org"><?php echo $profile->company()?></li>
                <li class="tel"><?php echo $profile->cellphone()?></li>
                <li><a class="url" href="<?php echo $profile->website()?>"><?php echo $profile->website()?></a></li>
            </ul>
            
		</section>
        
        <section id="links">
        	<a href="?vcard" class="vcard">Download as V-Card</a>
            <a href="?json" class="json">Get as a JSON feed</a>
            <p>In this tutorial: <a href="http://www.flickr.com/photos/levycarneiro/4144428707/">Self Portrait</a> by <a href="http://www.flickr.com/photos/levycarneiro/">Levy Carneiro Jr</a></p>
        </section>
        
        <footer>
	        <h2>Creating a PHP &amp; CSS Powered About Page</h2>
            <a class="tzine" href="http://tutorialzine.com/2011/07/about-page-vcard-php-css/">Read &amp; Download on</a>
        </footer>
          
    </body>
</html>
