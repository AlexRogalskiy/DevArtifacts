<?php

error_reporting(E_ALL ^ E_NOTICE);


$info = array(
	'firstName'		=> 'John',
	'middleName'	=> 'S.',
	'lastName'		=> 'Smith',
	'photoURL'		=> 'assets/img/photo.jpg',
	'birthDay'		=> strtotime('22-03-1983'),
	'city'			=> 'MyCity',
	'country'		=> 'United States',
	'street'		=> 'My Street 21',
	'zip'			=> '12345',
	'company'		=> 'Google Inc',
	'website'		=> 'http://tutorialzine.com/',
	'email'			=> 'email@example.com',
	'cellphone'		=> '12345678910',
	'description'	=> "I am a webdeveloper living in California. I enjoy designing and coding web applications, photography, surfing and music.\n\nFollow me on twitter or facebook.",
	'tags'			=> 'Developer, Designer, Photographer',
	'facebook'		=> 'http://www.facebook.com/',
	'twitter'		=> 'http://twitter.com/Tutorialzine'
);


/*

	// Additional properties that can take part of the $info
	// array (will be visible in the generated vcard):

	'educationTitle', 'addon', 'nickname', 'company', 'organisation', 'department', 'jobTitle',
	'telephoneWork1', 'telephoneWork2', 'telephoneHome1', 'telephoneHome2', 'carphone', 'pager',
	'additionalTelephone','faxWork','faxHome','ISDN','preferredTelephone','telex', 'workStreet',
	'workZIP','workCity','workRegion','workCountry','homeStreet','homeZIP', 'homeRegion',
	'postalStreet','postalZIP','postalCity', 'postalRegion', 'postalCountry','role'

*/
?>