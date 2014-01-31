<?php
namespace Yiix\Utils;
class Url {
        public static function urlEncode($str){
            return urlencode($str);
        }
        public static function urlDecode($str){
            return urldecode($str);
        }

        public static function urlRawEncode($str){
            return rawurlencode ($str);
        }
        public static function urlRawDecode($str){
            return rawurldecode($str);
        }
        public static function cleanUrl($url){
            $result = trim($url);

            $result = preg_replace('/\\\\/','/',$result);
            $pattern = "/\/[^\.\/]+\/\.\.\//";

            while (preg_match($pattern,$result)){
                $result = preg_replace($pattern,"/",$result);
            }
            $result = preg_replace('/(?<!:)\/+/','/',$result);

            return $result;
        }

        /**
         * delete dublicate slashes
         * and fixes relative paths like:
         * 		/path/../file.png -> /file.png
         * 		/path/path/../file.png -> /path/file.png
         * @param $url
         * @return unknown_type
         */
        public static function normalizeURL($url){
            $result = trim($url);

            $result = preg_replace('/\\\\/','/',$result);
            $pattern = "/\/[^\.\/]+\/\.\.\//";

            while (preg_match($pattern,$result)){
                $result = preg_replace($pattern,"/",$result);
            }

            $result = preg_replace('/^http:\/\/|^https:\/\//','',$result);
            $result = preg_replace('/\/+/','/',$result);

            return $result;
        }
        public static function urlTrim($url){
            $result = trim($url);

            $pattern = "/\/[^\.\/]+\/\.\.\//";

            while (preg_match($pattern,$result)){
                $result = preg_replace($pattern,"/",$result);
            }

            $result = preg_replace('/http:\/\/|https:\/\//','',$result);
            $result = preg_replace('/\/+/','/',$result);


            return $result;
        }

        /**
         * makes urlTrim and will delete www.
         *
         * @param string $url
         * @return string
         */
        public static function urlShort($url){
            $tmp = self::urlTrim($url);
            $tmp = preg_replace("/^www\./","",$tmp);
            return $tmp;
        }

        public static function pathinfo($path){
            $first_pos = strrpos($path,"://");

            $last_slash_pos = strrpos($path,"/",$first_pos+3);
            if (!$last_slash_pos) $last_slash_pos = strlen($path);
            $dirname = substr($path,0,$last_slash_pos);

            $filename = substr($path,$last_slash_pos+1,strlen($path)-$last_slash_pos-1);

            //cal ext
            if ($filename){
                $dotpos = strpos($filename,".");
                if ($dotpos){
                    $ext = substr($filename,$dotpos+1,strlen($filename)-$dotpos);
                }
            }


            $result = array();
            $result['dirname'] = trim($dirname);
            $result['filename'] = trim($filename);
            $result['extension'] = trim($ext);

            return $result;
        }

        /**
         * url encode string, but encode all not safe chars by {char code} syntax
         * @return unknown_type
         */
        public static function safeEncode($string){

            $string = preg_replace_callback("/(\/|\||\%)/",array('String','replace_safe_chars'),$string);
            $string = urlencode($string);
            return $string;
        }

        public static function isUrl($url){
            $tmp = explode('?',$url);
            $url = $tmp[0];
            if (preg_match("/\||,| |\"|'|`|\#|\@|\!|\%|\^|\&|\*|\(|\)|>|<|\?|;|~/",urldecode($url))){
                return false;
            }
//			if (!preg_match("/((http:\/\/)|(https:\/\/))?(www\.)?[^\.(www)]+\..+/",$url)){
//
//				return false;
//			}
            return true;
        }
}