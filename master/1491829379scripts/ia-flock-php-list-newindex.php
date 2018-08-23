<?php
/*==============================================*/
/* Модуль, имитирующий чтение файла диспетчером */
/* с использованием разделяемой блокировки.     */
/* $fn - имя файла (file name).                 */
/*==============================================*/
$fn = "index.html";
if (file_exists ($fn)):
	$fp = fopen ($fn, 'r');
	if ($fp !== FALSE):
		if (flock ($fp, LOCK_SH)):
			echo "1) file (...)\n";
			$r = file ($fn);
			var_dump ($r);
			echo "2) file_get_contents (...)\n";
			$r = file_get_contents ($fn);
			var_dump ($r);
			echo "3) readfile (...)\n";
			$r = readfile ($fn);
			var_dump ($r);
			flock ($fp, LOCK_UN);
		else:
			echo "Can't lock file \"$fn\".\n";
		endif;
		fclose ($fp);
	else:
		echo "Can't open file \"$fn\".\n";
	endif;
else:
	echo "Internal server error. File not found: \"$fn\".\n";
endif;
?>
