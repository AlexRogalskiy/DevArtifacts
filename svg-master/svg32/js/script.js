var current_year = new Date().getFullYear();
var states = {
	// States =================
	'Alabama' 				: null,
	'Alaska' 					: null,
	'Arizona' 				: 2011,
	'Arkansas' 				: null,
	'California' 			: 2002,
	'Colorado' 				: 2009,
	'Connecticut' 		: 2010,
	'Delaware' 				: 2000,
	'Florida' 				: 2014,
	'Georgia' 				: null,
	'Hawaii' 					: null,
	'Idaho' 					: null,
	'Illinois' 				: 2008,
	'Indiana' 				: 2008,
	'Iowa' 						: null,
	'Kentucky' 				: 1997,
	'Louisiana' 			: null,
	'Maine' 					: null,
	'Massachusetts' 	: 2010,
	'Maryland' 				: 2016,
	'Michigan' 				: 2008,
	'Minnesota' 			: null,
	'Mississippi' 		: null,
	'Missouri' 				: null,
	'Montana' 				: null,
	'Nebraska' 				: 2009,
	'Nevada' 					: 2011,
	'New Hampshire' 	: null,
	'New Jersey' 			: 2014,
	'New Mexico' 			: null,
	'New York' 				: 2016,
	'North Carolina' 	: 2017,
	'North Dakota' 		: null,
	'Ohio' 						: 2017,
	'Oklahoma' 				: null,
	'Oregon' 					: null,
	'Pennsylvania' 		: current_year,
	'Rhode Island' 		: 2010,
	'South Carolina' 	: null,
	'South Dakota' 		: null,
	'Tennessee' 			: 2017,
	'Texas' 					: null,
	'Utah' 						: null,
	'Vermont' 				: null,
	'Virginia' 				: 2017,
	'Washington' 			: null,
	'West Virginia' 	: 2017,
	'Wisconsin' 			: null,
	'Wyoming' 				: 2009,

	// Territories ================
	'American Samoa' 			: null,
	'Guam' 								: null,
	'N. Mariana Islands' 	: null,
	'Puerto Rico' 				: null,
	'U.S. Virgin Islands' : null,
	'Washington, D.C.' 		: 2016
};

// Countries ====================
var countries = {
	'United States'		: 1994,
	'Canada'					: 1999,
	'Peru'						: 2005,
	'Chile'						: 2005,
	'Germany'					: 2010,
	'Italy'						: 2010,
	'Vatican City'		: 2010,
	'Spain'						: 2016,
	'Portugal'				: 2016,
	'France'					: 2016
};

// National Parks ===============
var national_parks = {
	'Yosemite'							: 2002,
	'Rocky Mountain'				: 2009,
	'Grand Canyon'					: 2011,
	'Great Smoky Mountains'	: 2017
}

// Assign attribute to each area
$.each(states, function(place, visited){	
	if (visited !== null) {		
		$('[data-state="' + place + '"]').attr('data-visited', visited);
	}
});

// Make areas visited this year blue, updates automatically
var styles = window.getComputedStyle(document.querySelector('html'));
var blue = styles.getPropertyValue('--blue');
var purple = styles.getPropertyValue('--purple');

$('[data-visited="' + current_year + '"]').css('fill', blue);
// $('[data-visited="' + (current_year - 1) + '"]').css('fill', purple);