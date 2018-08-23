<?php
/*==============================================*/
/* Модуль, имитирующий чтение файла диспетчером */  
/* без использования механизма блокировок.      */
/* $fn - имя файла (file name).                 */
/*==============================================*/
$fn = "index.html";
if (file_exists ($fn)):
	echo "1) file (...)\n";
	$r = file ($fn);
	var_dump ($r);
	echo "2) file_get_contents (...)\n";
	$r = file_get_contents ($fn);
	var_dump ($r);
	echo "3) readfile (...)\n";
	$r = readfile ($fn);
	var_dump ($r);	
else:
	echo "Internal server error. File not found: \"$fn\".";
endif;
?>