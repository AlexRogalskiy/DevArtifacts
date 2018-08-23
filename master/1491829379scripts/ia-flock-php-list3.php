<?php
/*===============================================*/
/* Участок кода для изменения значения файлового */
/* счётчика в конкурентной среде.                */
/* $fn - имя файла (file name),                  */
/* $fp - манипулятор файла (file pointer).       */
/*===============================================*/
$fn = 'counter.txt';
$fp = @fopen ($fn, file_exists ($fn)? 'r+': 'w');
if ($fp !== FALSE):
	if (flock ($fp, LOCK_EX)):
		$counter = fread ($fp, 8192);
		$counter += 1;
		ftruncate ($fp, 0);
		rewind ($fp);
		fwrite ($fp, $counter);
		flock ($fp, LOCK_UN);
	else:
		echo "ERROR: can't exclusive lock file $fn\n";
	endif;
	fclose ($fp);
else:
	echo "ERROR: can't open file $fn\n";
endif;
?>