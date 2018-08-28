
$(document).ready( function() {
    
    $.post("/login",
	   {
	       email : "test@lehigh.edu",
	       password : "password"
	   },
	   function(data, status) {
	       alert("data: " + data + "status: " + status);
	   });
});
