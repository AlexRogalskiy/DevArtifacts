<?php
/*============================================================*/
/* Тестирование возможности организации фонового процесса     */
/* на WEB-сервере с помощью PHP-сценария.                     */
/* Автор: Игорь Орещенков, июнь 2017 г.                       */
/* Среда разработки: AkelPad 3.9.7 + PHP 5.6.23 + Apache 2.4. */
/*============================================================*/
$tmlimit = 10;	// максимальное время выполнения в секундах
$tmout = time () + $tmlimit;
/*---------------------------------------------------------*/
/* Ответ клиенту с предложением завершить HTTP-соединение. */
/*---------------------------------------------------------*/
$body = "OK";
ignore_user_abort (true);
header ('Connection: close');
header ('Content-Encoding: none');
header ('Content-Type: text/plain; charset=ISO-8859-1');
header ('Content-Length: ' . strlen ($body));
header ('Last-Modified: ' . date ('r'));
echo "$body\r\n";
while (ob_get_level () > 0):
	ob_end_flush ();
endwhile;
flush ();
/*-----------------------*/
/* Начало нового сеанса. */
/*-----------------------*/
$miniter = 30;		// минимальное количество итераций
$id = rand ();		// идентификатор сеанса
$fnsav = 'test1.sav';	// имя файла для передачи состояния между сеансами
$fntxt = 'test1.txt';	// имя файла для результатов работы сценария
$fnlog = 'test1.log';	// имя журнального файла
Logbook ($fnlog, "#$id - start");
if (SeanceBegin ($fnsav, !(isset ($_GET['mode']) and $_GET['mode'] == 'continue'))):
	/*-------------------------------------------*/
	/* Восстановление данных предыдущего сеанса. */
	/*-------------------------------------------*/
	$i = fgets ($fsav);
	if ($i > $miniter):
		die ();
	endif;
	if ($i == ''):
		$i = 0;
	endif;
	/*-----------------------------*/
	/* Выполнение полезной работы. */
	/*-----------------------------*/
	$f = fopen ($fntxt, file_exists ($fntxt)? "at": "wt");
	fputs ($f, "$id - Seance begin: " . time () . PHP_EOL);
	while (time () < $tmout):
		fputs ($f, "$id - $i" . PHP_EOL);
		sleep (1);
		$i++;
	endwhile;
	fputs ($f, "$id - Seance end: " . time () . PHP_EOL);
	fclose ($f);
	/*---------------------------*/
	/* Сохранение данных сеанса. */
	/*---------------------------*/
	rewind ($fsav);
	fputs ($fsav, $i);
	SeanceEnd ($fsav);
	/*--------------------------------------------------------------*/
	/* Завершение текущего сеанса и передача управления следующему. */
	/*--------------------------------------------------------------*/
	$url = "$_SERVER[REQUEST_SCHEME]://$_SERVER[HTTP_HOST]$_SERVER[PHP_SELF]?mode=continue";
	Logbook ($fnlog, "#$id - pass $url.");
	PassControl ($url, strlen ($body), $fnlog, $id);
	Logbook ($fnlog, "#$id - normal shutdown.");
else:
	Logbook ($fnlog, "#$id - can't enter critical section.");
endif;
/*==============================================================*/
/* Начало сеанса как критической секции кода.                   */
/* Вызов: $fn - имя файла для хранения данных сеанса.           */
/*        $first - признак первого сеанса в последовательности. */
/* Возврат: манипулятор открытого файла или                     */
/*          FALSE в случае неудачи.                             */
/*==============================================================*/
function SeanceBegin ($fn, $first)
{
	global $fsav;
	$res = FALSE;
	$fsav = fopen ($fn, file_exists ($fn)? 'r+t': 'w+t');
	if ($fsav !== FALSE):
		if (flock ($fsav, LOCK_EX | LOCK_NB)):
			$res = TRUE;
			if ($first):
				ftruncate ($fsav, 0);
			endif;
		else:
			fclose ($fsav);
		endif;
	endif;
	return $res;
}
/*=================================================*/
/* Завершение сеанса как критической секции кода.  */
/*=================================================*/
function SeanceEnd ()
{
	global $fsav;
	flock ($fsav, LOCK_UN);
	fclose ($fsav);
}
/*===========================================================*/
/* Передача эстафеты следующему сеансу.                      */
/* Вызов: $url - URL PHP-сценария для передачи эстафеты,     */
/*        $replylen - ожидаемая длина ответа,                */
/*        $fnlog - имя журнального файла,                    */
/*        $id - идентификатор текущего сеанса.               */
/* Возврат: ответ сценария, которому была передана эстафета. */
/*===========================================================*/
function PassControl ($url, $replylen, $fnlog, $id)
{
	Logbook ($fnlog, "#$id PassControl (...) - start request");
	$res = HttpRequest ($url, '1.0', 'GET', 'Connection:close', '', 10, 4);
	Logbook ($fnlog, "#$id PassControl (...) - request done, " . ($res===FALSE? 'ERROR': 'SUCCESS'));
	return $res;
}
/*==============================================*/
/* Получение информации по HTTP-запросу.        */
/* Вызов: $url - адрес запроса,                 */
/*        $httpver - версия протокола HTTP,     */
/*        $httpmeth - метод HTTP,               */
/*        $httpopt - опции HTTP-запроса,        */
/*        $httpbody - тело запроса,             */
/*        $maxlen - максимальный размер ответа, */
/*        $timeout - таймаут в секундах.        */
/* Возврат: ответ сервера или                   */
/*          FALSE в случае ошибки.              */
/*==============================================*/
function HttpRequest ($url, $httpver = '1.1', $httpmethod = 'GET', $httpopt = '', $httpbody = '', $maxlen = 4096, $timeout = 15)
{
	global $fnlog;
	$res = FALSE;
	$urlparts = parse_url ($url);
	$tm = time ();
	/* Подготовка элементов соединения и запроса. */
	$rqscheme = ($urlparts['scheme'] == 'https'? 'tls://': '');
	$rqhost = $urlparts['host'];
	$rqport = array_key_exists ('port', $urlparts)? $urlparts['port']: ($urlparts['scheme'] == 'https'? '443': '80');
	$rqpath = array_key_exists ('path', $urlparts)? $urlparts['path']: '/';
	$rqquery = array_key_exists ('query', $urlparts)? "?$urlparts[query]": '';
	/* Установка соединения. */
	$f = @fsockopen ("$rqscheme$rqhost", $rqport, $errno, $errstr, $timeout);
	if ($f !== FALSE):
		/* Формирование заголовка запроса. */
		$header[] = "$httpmethod $rqpath$rqquery HTTP/$httpver";
		$header[] = "Host: $rqhost" . (array_key_exists ('port', $urlparts)? ":$urlparts[port]": '');
		/* Добавление в заголовок опций запроса. */
		$httpeol = "\r\n";
		if (is_array ($httpopt)):
			$httpopt = implode ($httpeol, $httpopt);
		endif;
		if ($httpopt > ''):
			$header[] = $httpopt;
		endif;
		$header[] = '';
		/* Формирование тела запроса. */
		if (is_array ($httpbody)):
			$httpbody = implode ($httpeol, $httpbody);
		endif;
		if ($httpbody > ''):
			$header[] = $httpbody;
		endif;
		$header[] = '';
		/* Сборка и отправка запроса. */
		$rq = implode ($httpeol, $header);
		fwrite ($f, $rq);
		/* Приём ответа. */
		$to = $timeout - (time () - $tm);
		if ($maxlen > 0 and $to > 0):
			stream_set_timeout ($f, $to);
			$s = fread ($f, $maxlen);
			while ($s !== FALSE):
				$res .= $s;
				$maxlen -= strlen ($s);
				$to = $timeout - (time () - $tm);
				if ($maxlen > 0 and $to > 0):
					stream_set_timeout ($f, $to);
					$s = fread ($f, $maxlen);
				else:
					$s = FALSE;
				endif;
			endwhile;
		endif;
		/* Анализ результата операции чтения. */
		$md = stream_get_meta_data ($f);
		if ($md['timed_out']):
			$res = FALSE;
		endif;
		/* Завершение соединения. */
		fclose ($f);
	endif;
	return $res;
}
/*=================================*/
/* Запись сообщения в журнал.      */
/* Вызов: $fn - имя файла журнала, */
/*        $msg - текст сообщения.  */
/*=================================*/
function Logbook ($fn, $msg)
{
	$f = fopen ($fn, file_exists ($fn)? 'at': 'wt');
	if ($f !== FALSE):
		if (flock ($f, LOCK_EX)):
			$tm = time ();
			fputs ($f, "$tm: $msg" . PHP_EOL);
			flock ($f, LOCK_UN);
		endif;
		fclose ($f);
	endif;
}
?>