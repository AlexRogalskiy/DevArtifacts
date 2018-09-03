<!DOCTYPE html>
<html>
<head>
<title>Form values collector</title>
</head>
<body>
<?php
foreach ($_POST as $field_name => $field_value) {
        print "Field $field_name : $field_value <br />\n";
}
?>
</body>
</html>