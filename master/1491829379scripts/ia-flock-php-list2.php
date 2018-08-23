<?php
/*==============================================*/
/* ������� ���� ��� ������������ ������ � ����. */
/* $fn - ��� ����� (file name),                 */
/* $fp - ����������� ����� (file pointer).      */
/*==============================================*/
$fn = 'file.txt';
$fp = @fopen ($fn, file_exists ($fn)? 'r+': 'w');
if ($fp !== FALSE):
	if (flock ($fp, LOCK_EX)):
		ftruncate ($fp, 0);
		fwrite ($fp, 'Text, text, text, text...');
		flock ($fp, LOCK_UN);
	else:
		echo "ERROR: can't exclusive lock file $fn\n";
	endif;
	fclose ($fp);
else:
	echo "ERROR: can't open file $fn\n";
endif;
?>