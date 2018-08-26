////////////////////////
// KNOWN ISSUES
////////////////////////
// 1. Refactor
// 2. Type into any optional field (phone numbers, twitter), then erase your text. The raw HTML for that thing in the generated output is still there, just hidden.
// 3. Good MVP, but this code is messy. Could be better as a React app, mayhaps.

////////////////////////
// FUNCTIONS
////////////////////////

//
// Place raw HTML of each version into appropriate containers
function updateHtmlSigRaw() {
  get_html_signature_full_visual = document.getElementById("signature-full-visual").innerHTML;
  get_html_signature_horizontal_visual = document.getElementById("signature-horizontal-visual").innerHTML;
  $("#signature-full-html textarea").text(get_html_signature_full_visual);
  $("#signature-horizontal-html textarea").text(get_html_signature_horizontal_visual);
}

///
// Reset form
function resetForm() {
  document.getElementById("employee-information-form").reset();
  initialize_dummy_data();
  // Office phone
  $(".phone_office_element").hide();
  $(".output_phone_office").empty();
  // Mobile phone
  $(".phone_mobile_element").hide();
  $(".output_phone_mobile").empty();
  // Twitter
  $(".twitter_element").hide();
  $(".output_twitter").empty();
}

////////////////////////
// INITIALIZE
////////////////////////

//
// Reset form, even on soft page refreshes
// Put new functionality BELOW this
resetForm();
//
// Reset form button functionality
$("#reset-form").click(function(e) {
  e.preventDefault();
  resetForm();
});

//
// Activate Bootstrap tabs
$("#html-signature-full-tabs a").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
})
$("#html-signature-horizontal-tabs a").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
})

//
// Set variables and defaults
var employee = {
  full_name: "Your name",
  position: "Your position",
  email_address: "your.name@bayleys.co.nz",
  promo: "New Zealand's largest full service real estate company",
  company_name: "Bayleys Real Estate"
}

function initialize_dummy_data() {
  //
  // Assign default variables on DOM load
  for (var key in employee) {
    if (employee.hasOwnProperty(key)) {
      $("span.output_" + key).html(employee[key]);
    }
  }
}
initialize_dummy_data();

//
// Location addresses
var address_full = {
  auckland: "Bayleys House, 30 Gaunt Street<br>Auckland, New Zealand 1010",
  san_antonio: "110 E Houston St, Suite 202<br>San Antonio, Texas 78205",
  san_francisco: "San Francisco, California",
  london: "Second Home<br>68-80 Hanbury Street<br>London, E1 5JL, United Kingdom"
}
var address_horizontal = {
  auckland: "504 Lavaca Street, Suite 1000 Austin, Texas 78701",
  san_antonio: "110 E Houston St, Suite 202 San Antonio, Texas 78205",
  san_francisco: "San Francisco, California",
  london: "Second Home 68-80 Hanbury Street London, E1 5JL, United Kingdom"
}

////////////////////////
// FORM FIELDS
////////////////////////

//
// HTML Full signature output
function output_address_full() {
  var address_line_full = address_full.auckland;
  $("span.output_address_full").html(address_line_full);
  $(".input_office input[type=radio]").on("change", function() {
    if (document.getElementById('location_auckland').checked) {
      address_line_full = address_full.auckland;
    }
    if (document.getElementById('location_san_antonio').checked) {
      address_line_full = address_full.san_antonio;
    }
    if (document.getElementById('location_san_francisco').checked) {
      address_line_full = address_full.san_francisco;
    }
    if (document.getElementById('location_london').checked) {
      address_line_full = address_full.london;
    }
    $("span.output_address_full").html(address_line_full);
    updateHtmlSigRaw()
  });
}
output_address_full();

//
// HTML Horizontal signature output
function output_address_horizontal() {
  var address_line_horizontal = address_horizontal.austin;
  $("span.output_address_horizontal").html(address_line_horizontal);
  $(".input_office input[type=radio]").on("change", function() {
    if (document.getElementById('location_austin').checked) {
      address_line_horizontal = address_horizontal.auckland;
    }
    if (document.getElementById('location_san_antonio').checked) {
      address_line_horizontal = address_horizontal.san_antonio;
    }
    if (document.getElementById('location_san_francisco').checked) {
      address_line_horizontal = address_horizontal.san_francisco;
    }
    if (document.getElementById('location_london').checked) {
      address_line_horizontal = address_horizontal.london;
    }
    $("span.output_address_horizontal").html(address_line_horizontal);
    updateHtmlSigRaw()
  });
}
output_address_horizontal();

//
// WP Engine logo
function output_wpengine_logo() {
  var wpe_logo_html = "<td border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><br><img src=\"https://wpengine.com/wp-content/uploads/2016/06/WP-LOGO-EmailSignature-White.png\" width=\"126\" height=\"24\"></td>";
  // Logo is visible in initial state
  $(".logo_element").show();
  $(".logo_element").html(wpe_logo_html);
  // Monitor logo option to hide/show
  $(".input_logo input[type=radio]").on("change", function() {
    if (document.getElementById('logo_show').checked) {
      $(".logo_element").show();
      $(".logo_element").html(wpe_logo_html);
    } else if (document.getElementById('logo_hide').checked) {
      $(".logo_element").hide();
      $(".logo_element").html('');
    }
    updateHtmlSigRaw()
  });
}
output_wpengine_logo();

//
// Promotional lines
$("span.output_promo_line").html(employee.promo);
var promo_line = "";
$(".input_promotion input[type=radio]").on("change", function() {
  if (document.getElementById('promotion-2').checked) {
    promo_line = "New Zealand's largest full service real estate company";
  } else {
    promo_line = "";
  }
  // Inject promo line, if user wants one
  if (promo_line) {
    $(".promo_line_element").show();
    $("span.output_promo_line").html(promo_line);
  } else {
    $(".promo_line_element").hide();
  }
  updateHtmlSigRaw()
});

//
// Full name
// Check input field for data
$(".input_full_name input").on("change keyup paste", function() {
  var full_name = $(this).val();
  if (full_name) {
    $("span.output_full_name").html(full_name);
  } else {
    $("span.output_full_name").html(employee.full_name);
  }
  updateHtmlSigRaw()
});

//
// Position
// Check input field for data
$(".input_position input").on("change keyup paste", function() {
  var position = $(this).val();
  if (position) {
    $("span.output_position").html(position);
  } else {
    $("span.output_position").html(employee.position);
  }
  updateHtmlSigRaw()
});

//
// Email address
// Check input field for data
$(".input_email_address input").on("change keyup paste", function() {
  var email_address = $(this).val();
  if (email_address) {
    $("span.output_email_address").html(email_address);
    $(".email_address_anchor").attr("href", "mailto:" + email_address);
  } else {
    $("span.output_email_address").html(employee.email_address);
    $(".email_address_anchor").attr("href", "mailto:" + employee.email_address);
  }
  updateHtmlSigRaw()
});

// Hide optional phone numbers on DOM load
$(".phone_numbers_element").hide();
//
var phone_office = "";
var phone_mobile = "";
// Office phone number
// Field is optional. Hide on DOM load
$(".phone_office_element").hide();
// Check input field for data
$(".input_phone_office input").on("change keyup paste", function() {
  phone_office = $(this).val();
  if (phone_office) {
    $(".phone_numbers_element").show();
    $(".phone_office_element").show();
    $("span.output_phone_office").html(phone_office);
  } else {
    $(".phone_office_element").hide();
  }
  if (!phone_office && !phone_mobile) {
    $(".phone_numbers_element").hide();
  }
  updateHtmlSigRaw()
});
// Mobile phone number
// Field is optional. Hide on DOM load
$(".phone_mobile_element").hide();
// Check input field for data
$(".input_phone_mobile input").on("change keyup paste", function() {
  var phone_mobile = $(this).val();
  if (phone_mobile) {
    $(".phone_numbers_element").show();
    $(".phone_mobile_element").show();
    $("span.output_phone_mobile").html(phone_mobile);
  } else {
    $(".phone_mobile_element").hide();
  }
  if (!phone_office && !phone_mobile) {
    $(".phone_numbers_element").hide();
  }
  updateHtmlSigRaw()
});

//
// Twitter
// Field is optional. Hide on DOM load
$(".twitter_element").hide();
// Check input field for data
$(".input_twitter_username input").on("change keyup paste", function() {
  var twitter_username = $(this).val();
  if (twitter_username) {
    $(".twitter_element").show();
    $("span.output_twitter_username").html(twitter_username);
    $(".twitter_anchor").attr("href", "https://twitter.com/" + twitter_username);
  } else {
    $(".twitter_element").hide();
  }
  updateHtmlSigRaw()
});

////////////////////////
// Raw HTML version
////////////////////////
//
// Fill in HTML signature on DOM load
// Must be the last line of this file
updateHtmlSigRaw();