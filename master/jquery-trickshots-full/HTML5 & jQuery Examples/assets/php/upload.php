<?php

// We are receiving the file as a regular file upload. Print the file name:
echo 'You uploaded '.$_FILES['file']['name'];

// Uncomment the line below to copy the uploaded file to the directory 
// of the script. Keep in mind that this is insecure and should be used 
// for experimentation only - malicious users could upload any kind of file,
// including PHP scripts and do a lot of damage.

// move_uploaded_file($_FILES['file']['tmp_name'], $_FILES['file']['name']);