<?php
namespace Torag\Utils;
class HttpPost{
    public static function send($url,$params,$auth=null){
        $chx = curl_init();

        $header = array();
        $timeout = 30;

        $header[0] = "Accept: text/xml,application/xml,application/xhtml+xml,";
        $header[0] .= "text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5";
        $header[] = "Cache-Control: max-age=0";
        $header[] = "Connection: keep-alive";
        $header[] = "Keep-Alive: 300";
        $header[] = "Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7";
        $header[] = "Accept-Language: en-us,en;q=0.5";
        $header[] = "Pragma: "; // browsers keep this blank.

        curl_setopt ($chx, CURLOPT_URL, $url);
        curl_setopt ($chx, CURLOPT_HEADER, 0);
        curl_setopt ($chx, CURLOPT_HTTPHEADER, $header);
        curl_setopt ($chx, CURLOPT_RETURNTRANSFER,1);
        curl_setopt ($chx, CURLOPT_FOLLOWLOCATION,1);
        curl_setopt ($chx, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt ($chx, CURLOPT_TIMEOUT, $timeout);
        curl_setopt ($chx, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Opera 7.54");
        curl_setopt ($chx, CURLOPT_VERBOSE,0);
        curl_setopt ($chx, CURLOPT_POST, 1);
        curl_setopt ($chx, CURLOPT_POSTFIELDS, http_build_query($params));
        if (isset($auth)) {
            curl_setopt ($chx, CURLOPT_USERPWD,$auth);
        }

        $resultx = @curl_exec ($chx);

        $curl_info = curl_getinfo($chx);
        curl_close($chx);

        return $curl_info['http_code'];
    }
    public static function request($url,$params,$auth=null){
        $chx = curl_init();

        $header = array();
        $timeout = 30;

        $header[0] = "Accept: text/xml,application/xml,application/xhtml+xml,";
        $header[0] .= "text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5";
        $header[] = "Cache-Control: max-age=0";
        $header[] = "Connection: keep-alive";
        $header[] = "Keep-Alive: 300";
        $header[] = "Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7";
        $header[] = "Accept-Language: en-us,en;q=0.5";
        $header[] = "Pragma: "; // browsers keep this blank.

        curl_setopt ($chx, CURLOPT_URL, $url);
        curl_setopt ($chx, CURLOPT_HEADER, 0);
        curl_setopt ($chx, CURLOPT_HTTPHEADER, $header);
        curl_setopt ($chx, CURLOPT_RETURNTRANSFER,1);
        curl_setopt ($chx, CURLOPT_FOLLOWLOCATION,1);
        curl_setopt ($chx, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt ($chx, CURLOPT_TIMEOUT, $timeout);
        curl_setopt ($chx, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Opera 7.54");
        curl_setopt ($chx, CURLOPT_VERBOSE,0);
        curl_setopt ($chx, CURLOPT_POST, 1);
        curl_setopt ($chx, CURLOPT_POSTFIELDS, http_build_query($params));
        if (isset($auth)) {
            curl_setopt ($chx, CURLOPT_USERPWD,$auth);
        }

        $resultx = curl_exec ($chx);



        curl_close($chx);

        return $resultx;
    }
}
?>