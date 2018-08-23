<?php
/*===================================================*/
/* Модуль, имитирующий изменение файла контроллером. */
/* $fn - имя файла (file name).                      */
/* $fp - манипулятор файла (file pointer).           */
/*===================================================*/
$pause = 10;
$fn = 'index.html';
$part1 = "<html><head><title>Test</title></head>";
$part2 = "<body><h1>Hello, world!</h1></body></html>";
$fp = fopen ($fn, file_exists ($fn)? 'r+': 'w');
if ($fp !== FALSE):
	if (flock ($fp, LOCK_EX)):
		echo "File $fn locked. Please wait...\n";
		ftruncate ($fp, 0);
		fputs ($fp, $part1);
		while ($pause > 0):
			echo "$pause ";
			sleep (1);
			$pause--;
		endwhile;
		fputs ($fp, $part2);
		flock ($fp, LOCK_UN);
		echo "\nFile $fn unlocked.\n";
	endif;
	fclose ($fp);
else:
	echo "Can't open file $fn.\n";
endif;
?>