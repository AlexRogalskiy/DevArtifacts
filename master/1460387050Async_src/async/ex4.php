<?php
$ch1 = curl_init();
$ch2 = curl_init();

curl_setopt($ch1, CURLOPT_URL, "http://127.0.0.1/sleep.php?2");
curl_setopt($ch2, CURLOPT_URL, "http://127.0.0.1/sleep.php?3");

$mh = curl_multi_init();
curl_multi_add_handle($mh,$ch1);
curl_multi_add_handle($mh,$ch2);

$time = time();
$active = null;
do {
    do {
        $mrc = curl_multi_exec($mh, $active);
    } while ($mrc == CURLM_CALL_MULTI_PERFORM);
    usleep(1000);
} while (curl_multi_select($mh) === -1);

while ($active && $mrc == CURLM_OK) {
    if (curl_multi_select($mh) != -1) {
        do {
            $mrc = curl_multi_exec($mh, $active);
            //echo $mrc, PHP_EOL;
        } while ($mrc == CURLM_CALL_MULTI_PERFORM);
    }
}

echo 'time=', (time() - $time), "sec\n";
curl_multi_remove_handle($mh, $ch1);
curl_multi_remove_handle($mh, $ch2);
curl_multi_close($mh);