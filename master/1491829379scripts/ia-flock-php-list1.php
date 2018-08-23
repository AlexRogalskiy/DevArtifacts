<?php
/*=================================================*/
/* Участок кода для конкурентного чтения из файла. */
/* $fn - имя файла (file name),                    */
/* $fp - манипулятор файла (file pointer).         */
/*=================================================*/
$fn = 'file.txt';
$fp = @fopen ($fn, 'r');
if ($fp !== FALSE):
	if (flock ($fp, LOCK_SH)):
		$text = fread ($fp, 8192);
		flock ($fp, LOCK_UN);
	else:
		echo "ERROR: can't shared lock file $fn\n";
	endif;
	fclose ($fp);
else:
	echo "ERROR: can't open file $fn\n";
endif;
?>