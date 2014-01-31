<?PHP
namespace Yiix\Utils;
/**
 * @desc       URLUtility for changing all parts of one url
 * @author     Marcel Oehler
 * @version    0.3.1
 * @package
 * @copyright
 *
 * Revision:
 * 0.1.0 - Wed Jun 30 14:00:00 2004 - MO - inital develop version
 * 0.2.0 - Fri Feb 18 12:00:00 2005 - MO - first release version
 * 0.3.0 - Mon Aug 28 18:00:00 2006 - MO - second release version
 * 0.3.1 - Tue Jan 23 10:35:00 2007 - MO - default value when getting query param
 */
class URLUtility
{

// --- CONFIG -------------------------------------------------------------------------------------

    /**
     * @desc  Default scheme on import
     */
    public $DEFAULT_SCHEME = "http";

    /**
     * @desc  Scheme of ssl connection
     */
    public $SECURE_SCHEME  = "https";

    /**
     * @desc  Suffix to scheme on export
     */
    public $SCHEME_SUFFIX  = "://";

    /**
     * @desc  Default port on export
     */
    public $DEFAULT_PORT   = 80;

    /**
     * @desc  Port of ssl connection
     */
    public $SECURE_PORT    = 443;

    /**
     * @desc  Prefix to port on export
     */
    public $PORT_PREFIX    = ":";

    /**
     * @desc  Separator between host elements
     */
    public $HOST_SEP       = ".";

    /**
     * @desc  Separator between path elements
     */
    public $PATH_SEP       = "/";

    /**
     * @desc  Prefix to current path
     */
    public $PATH_CURRENT   = ".";

    /**
     * @desc  Prefix to upper path
     */
    public $PATH_UPPER     = "..";

    /**
     * @desc  Separator between query params on import
     */
    public $QUERY_SEP      = "&";

    /**
     * @desc  Separator between query key/value pairs
     */
    public $QUERY_KV_SEP   = "=";

    /**
     * @desc  Prefix before query string on export
     */
    public $QUERY_PRE      = "?";

    /**
     * @desc  Separator between query params on export
     */
    public $QUERY_AMP_SEP  = "&amp;";

// --- RUNTIME ------------------------------------------------------------------------------------

    /**
     * @desc  Request scheme, e.g. http, ftp, etc.
     */
    public $URL_SCHEME      = "";

    /**
     * @desc  Host
     */
    public $URL_HOST        = "";

    /**
     * @desc  Post
     */
    public $URL_PORT        = 0;

    /**
     * @desc  Absolute path - starting and ending with slash "/"
     */
    public $URL_PATH        = "";

    /**
     * @desc  File name
     */
    public $URL_FILE_NAME   = "";

    /**
     * @desc  Array of query params - after the question mark ?
     */
    public $URL_QUERY_ARRAY = array();



// === CLASS ======================================================================================

    /**
     * @desc    Constructor
     * @param   string[optional] $url URL to use
     * @return  void
     */
    public function __construct($url = null)
    {
        // if no url is given use one of current script
        if ($url === null)
        {
            $this->resetURL();
        }
        else
        {
            $this->setURL($url);
        }
    }



// === URL ========================================================================================

    /**
     * @desc    Resets internal URL to URL of current script
     * @param   void
     * @return  void
     */
    public function resetURL()
    {
        // special setting possible for non-server mode or similar
        if (isset($_REQUEST['URLUtility_URL']))
        {
            $this->setURL($_REQUEST['URLUtility_URL']);
        }
        else
        {
            // get domain and query of current url
            $domain = ( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != "off"
                ? $this->SECURE_SCHEME
                : $this->DEFAULT_SCHEME
            ) . $this->SCHEME_SUFFIX . $_SERVER["HTTP_HOST"];

            $query = empty($_SERVER["QUERY_STRING"])
                ? ""
                : ($this->QUERY_PRE . $_SERVER["QUERY_STRING"]);

            // request uri is the savest way to current url
            if (isset($_SERVER["REQUEST_URI"]))
            {
                $this->setURL($domain . $_SERVER["REQUEST_URI"]);
            }
            // php self is more accurate than script name ...
            elseif (isset($_SERVER["PHP_SELF"]))
            {
                $this->setURL($domain . $_SERVER["PHP_SELF"] . $query);
            }
            // ... because script name can contain path to php interpreter
            elseif (isset($_SERVER["SCRIPT_NAME"]))
            {
                $this->setURL($domain . $_SERVER["SCRIPT_NAME"] . $query);
            }
            // script url is often not set
            elseif (isset($_SERVER["SCRIPT_URL"]))
            {
                $this->setURL($domain . $_SERVER["SCRIPT_URL"] . $query);
            }
            // domain and query string are always set
            else
            {
                $this->setURL($domain . "" . $query);
            }
        }
    }



    /**
     * @desc    Sets internal URL to given URL
     * @param   string $url URL to set
     * @return  void
     */
    public function setURL($url)
    {
        $this->setURLParts($url, true, true, true, true);
    }



    /**
     * @desc    Gets complete URL including query
     * @param   bool[optional] $html Flag if query should be ready for html pages
     * @return  string Returns complete URL
     */
    public function getURL($html = false)
    {
        return $this->getURLParts(true, true, true, true, $html);
    }



    /**
     * @desc    Merges internal URL with given URL
     * @param   string $url URL to merge
     * @return  void
     */
    public function mergeURL($url)
    {
        $this->mergeURLParts($url, true, true, true, true);
    }



// === SCHEME =====================================================================================

    /**
     * @desc    Sets scheme of URL
     * @param   string $scheme URL scheme (without "://")
     * @return  void
     */
    public function setScheme($scheme)
    {
        $this->URL_SCHEME = $scheme;
    }



    /**
     * @desc    Gets scheme of URL
     * @param   void
     * @return  string Returns URL scheme (without "://")
     */
    public function getScheme()
    {
        return $this->URL_SCHEME;
    }



    /**
     * @desc    Tells if url is secure url
     * @param   void
     * @return  bool
     */
    public function isSecure()
    {
        return ($this->URL_SCHEME == $this->SECURE_SCHEME);
    }



// === HOST =======================================================================================

    /**
     * @desc    Sets host of URL
     * @param   string $host URL host (without ending slash "/")
     * @return  void
     */
    public function setHost($host)
    {
        $this->URL_HOST= $host;
    }



    /**
     * @desc    Gets host of URL
     * @param   void
     * @return  string Returns URL host (without ending slash "/")
     */
    public function getHost()
    {
        return $this->URL_HOST;
    }



    /**
     * @desc    Gets host name of URL
     * @param   void
     * @return  string Returns URL host name
     */
    public function getHostName()
    {
        $host_list = explode($this->HOST_SEP, $this->URL_HOST);

        return (count($host_list) > 1
            ? implode("", array_slice(array_reverse($host_list), 1, 1))
            : $this->URL_HOST
        );
    }



// === PORT =======================================================================================

    /**
     * @desc    Sets port of URL
     * @param   int URL port
     * @return  void
     */
    public function setPort($port)
    {
        $this->URL_PORT = $port;
    }



    /**
     * @desc    Gets port of URL
     * @param   void
     * @return  int Returns URL port
     */
    public function getPort()
    {
        return $this->URL_PORT;
    }



// === PATH =======================================================================================

    /**
     * @desc    Sets absolute path of URL
     * @param   string $path Absolute URL path (starting and ending with slash "/")
     * @return  void
     */
    public function setPath($path)
    {
        $this->URL_PATH = $this->absolutePath($this->fixPath($path));
    }



    /**
     * @desc    Gets absolute path to file of URL (without file name)
     * @param   void
     * @return  string Returns URL path to file (starting and ending with slash "/")
     */
    public function getPath()
    {
        return $this->URL_PATH;
    }



// === FILE NAME ==================================================================================

    /**
     * @desc    Sets file name of URL (without path)
     * @param   string $file URL file name (containing no slash "/")
     * @return  void
     */
    public function setFileName($file)
    {
        $this->URL_FILE_NAME = $file;
    }



    /**
     * @desc    Gets file name of URL (without path)
     * @param   void
     * @return  string Returns URL file name (containing no slash "/")
     */
    public function getFileName()
    {
        return $this->URL_FILE_NAME;
    }



// === SCHEME HOST ================================================================================

    /**
     * @desc    Sets scheme, host and port of URL
     * @param   string $url URL containing scheme, host and port
     * @return  void
     */
    public function setSchemeHost($url)
    {
        $this->setURLParts($url, true, false, false, false);
    }



    /**
     * @desc    Gets scheme, host and port of URL
     * @param   void
     * @return  string Returns URL scheme, host and port
     */
    public function getSchemeHost()
    {
        return $this->getURLParts(true, false, false, false, false);
    }



    /**
     * @desc    Merges scheme, host and port with existing scheme, host and port
     * @param   string $url URL containing scheme, host and port
     * @return  void
     */
    public function mergeSchemeHost($url)
    {
        $this->mergeURLParts($url, true, false, false, false);
    }



// === SCHEME HOST PATH ===========================================================================

    /**
     * @desc    Sets scheme, host, port and path of URL
     * @param   string $url URL containing scheme, host, port and path
     * @return  void
     */
    public function setSchemeHostPath($url)
    {
        $this->setURLParts($url, true, true, false, false);
    }



    /**
     * @desc    Gets scheme, host, port and path of URL
     * @param   void
     * @return  string Returns URL scheme, host, port and path
     */
    public function getSchemeHostPath()
    {
        return $this->getURLParts(true, true, false, false, false, false);
    }



    /**
     * @desc    Merges scheme, host, port and path with existing scheme, host, port and path
     * @param   string $url URL containing scheme, host, port and path
     * @return  void
     */
    public function mergeSchemeHostPath($url)
    {
        $this->mergeURLParts($url, true, true, false, false);
    }



// === SCHEME HOST FILE PATH ======================================================================

    /**
     * @desc    Sets scheme, host, port, path and file of URL
     * @param   string $url URL containing scheme, host, port, path and file
     * @return  void
     */
    public function setSchemeHostFilePath($url)
    {
        $this->setURLParts($url, true, true, true, false);
    }




    /**
     * @desc    Gets scheme, host, port, path and file name of URL
     * @param   void
     * @return  string Returns URL scheme, host, port, path and file name
     */
    public function getSchemeHostFilePath()
    {
        return $this->getURLParts(true, true, true, false, false);
    }



    /**
     * @desc    Merges scheme, host, port and file path
                with existing scheme, host, port and file path
     * @param   string $url URL containing scheme, host, port and file path
     * @return  void
     */
    public function mergeSchemeHostFilePath($url)
    {
        $this->mergeURLParts($url, true, true, true, false);
    }



// === FILE PATH ==================================================================================

    /**
     * @desc    Sets absolute file path of URL
     * @param   string $file_path Absolute URL file path (starting with slash "/")
     * @return  void
     */
    public function setFilePath($file_path)
    {
        $this->setURLParts($file_path, false, true, true, false);
    }



    /**
     * @desc    Gets absolute file path of URL
     * @param   void
     * @return  string Returns Absolute URL file path (starting with slash "/")
     */
    public function getFilePath()
    {
        return $this->getURLParts(false, true, true, false, false);
    }



    /**
     * @desc    Merges file path into existing path
     * @param   string $file_path Relative or absolute path
     * @return  void
     */
    public function mergeFilePath($file_path)
    {
        $this->mergeURLParts($file_path, false, true, true, false);
    }



// === FILE PATH QUERY ============================================================================

    /**
     * @desc    Sets absolute file path of URL with query
     * @param   string $file_path_query Absolute URL file path with query
     * @return  void
     */
    public function setFilePathQuery($file_path_query)
    {
        $this->setURLParts($file_path_query, false, true, true, true);
    }



    /**
     * @desc    Gets absolute file path of URL with query
     * @param   bool $html Flag if query should be ready for html pages
     * @return  string Returns Absolute URL file path with query
     */
    public function getFilePathQuery($html = true)
    {
        return $this->getURLParts(false, true, true, true, $html);
    }



    /**
     * @desc    Merges file path with query into existing path and query
     * @param   string $file_path Relative or absolute path with query
     * @return  void
     */
    public function mergeFilePathQuery($file_path_query)
    {
        $this->mergeURLParts($file_path_query, false, true, true, true);
    }



    /**
     * @desc    Sets current file path with query as server request uri
     * @param   void
     * @return  void
     */
    public function setServerRequestURI()
    {
        $_SERVER['REQUEST_URI']  = $this->getFilePathQuery(false);
    }



// === QUERY STRING ===============================================================================

    /**
     * @desc    Sets query from string
     * @param   string $query Query string
     * @return  void
     */
    public function setQuery($query)
    {
        $this->URL_QUERY_ARRAY = $this->parseQuery($query);
    }



    /**
     * @desc    Gets complete query as string
     * @param   bool[optional] $html Flag if query should be ready for html pages
     * @return  string Returns query
     */
    public function getQuery($html = true)
    {
        $url_query = $this->buildQuery($this->URL_QUERY_ARRAY, $html);

        return ($url_query != "" ? $this->QUERY_PRE : "") . $url_query;
    }



    /**
     * @desc    Deletes complete query
     * @param   void
     * @return  void
     */
    public function delQuery()
    {
        $this->URL_QUERY_ARRAY = array();
    }



    /**
     * @desc    Merges query string into existing query
     * @param   string $query Query string to merge
     * @return  void
     */
    public function mergeQuery($query)
    {
        $this->URL_QUERY_ARRAY = array_merge(
            $this->URL_QUERY_ARRAY,
            $this->parseQuery($query)
        );
    }



// === QUERY LIST =================================================================================

    /**
     * @desc    Sets complete query from key/value list
     * @param   array $query_list Query list
     * @return  void
     */
    public function setQueryList($query_list)
    {
        $this->URL_QUERY_ARRAY = $query_list;
    }



    /**
     * @desc    Gets complete query as key/value list
     * @param   void
     * @return  array Returns query list
     */
    public function getQueryList()
    {
        return $this->URL_QUERY_ARRAY;
    }



    /**
     * @desc    Merges key/value list into existing query list
     * @param   array $query_list Query list to merge
     * @return  void
     */
    public function mergeQueryList($query_list)
    {
        foreach ($query_list as $key => $value)
        {
            $this->URL_QUERY_ARRAY[$key] = $value;
        }
    }



// === QUERY PARAM ================================================================================

    /**
     * @desc    Sets one param of query
     * @param   string $key Key of query param
     * @param   string $value Value of query param
     * @return  void
     */
    public function setQueryParam($key, $value)
    {
        $this->URL_QUERY_ARRAY[$key] = "$value";
    }



    /**
     * @desc    Gets one param of query
     * @param   string $key Key of query param
     * @param   string[optional] $default Default value if key is not set
     * @return  string Returns value of param if it exists or nothing
     */
    public function getQueryParam($key, $default = "")
    {
        return (isset($this->URL_QUERY_ARRAY[$key]) ? $this->URL_QUERY_ARRAY[$key] : $default);
    }



    /**
     * @desc    Deletes one param of query
     * @param   string $key Key of param
     * @return  void
     */
    public function delQueryParam($key)
    {
//        if (isset($this->URL_QUERY_ARRAY[$key]))
//        {
            unset($this->URL_QUERY_ARRAY[$key]);
//        }
    }



    /**
     * @desc    Tells if query param is set
     * @param   string $key Key of param
     * @return  void
     */
    public function isQueryParam($key)
    {
        return isset($this->URL_QUERY_ARRAY[$key]);
    }



// === URL HELPERS ================================================================================

    /**
     * @desc    Sets parts of url according to given url and flags
     * @param   string $url URL to set parts
     * @param   bool $scheme_host Set scheme, host and port of url
     * @param   bool $path Set path of url
     * @param   bool $file Set file of url
     * @param   bool $query Set query of url
     * @return  void
     */
    public function setURLParts($url, $scheme_host, $path, $file, $query)
    {
        $url_array = parse_url($url);

        // set scheme, host and port
        if ($scheme_host)
        {
            $this->URL_HOST = isset($url_array['host']) ? $url_array['host'] : "";

            $this->URL_SCHEME =
                isset($url_array['scheme']) ? $url_array['scheme'] : $this->DEFAULT_SCHEME;

            $this->URL_PORT = isset($url_array['port'])
                ? $url_array['port']
                : ($this->URL_SCHEME == $this->SECURE_SCHEME
                    ? $this->SECURE_PORT
                    : $this->DEFAULT_PORT
                );
        }

        // set path and/or file name
        if ($path || $file)
        {
            $file_path = isset($url_array['path']) ? $url_array['path'] : "";

            // set path and file name ...
            if ($path && $file)
            {
                list($this->URL_PATH, $this->URL_FILE_NAME) = $this->getPathFile($file_path);
            }
            // ... or just set path ...
            elseif ($path && ! $file)
            {
                list($this->URL_PATH, $dummy) = $this->getPathFile($file_path);
            }
            // ... or just set file name
            elseif (! $path && $file)
            {
                list($dummy, $this->URL_FILE_NAME) = $this->getPathFile($file_path);
            }
        }

        // set query array from parsed query
        if ($query)
        {
            $this->URL_QUERY_ARRAY =
                isset($url_array['query']) ? $this->parseQuery($url_array['query']) : array();
        }
    }



    /**
     * @desc    Gets parts of url according to given flags
     * @param   bool $scheme_host Get scheme, host and port of url
     * @param   bool $path Get path of url
     * @param   bool $file Get file of url
     * @param   bool $query Get query string of url
     * @param   bool[optional] $html Flag if query should be ready for html pages
     * @return  string Returns URL parts
     */
    public function getURLParts($scheme_host, $path, $file, $query, $html = true)
    {
        $url = "";

        // empty scheme and empty host are useless
        if ($scheme_host && $this->URL_SCHEME != "" && $this->URL_HOST != "")
        {
            $url .= $this->URL_SCHEME . $this->SCHEME_SUFFIX . $this->URL_HOST;

            if (
                ($this->URL_SCHEME == $this->DEFAULT_SCHEME &&
                 $this->URL_PORT   != $this->DEFAULT_PORT) ||
                ($this->URL_SCHEME == $this->SECURE_SCHEME &&
                 $this->URL_PORT   != $this->SECURE_PORT)
            )
            {
                $url .= $this->PORT_PREFIX . $this->URL_PORT;
            }
        }

        // get path, file and query ...
        if ($path && $file && $query)
        {
            $url .= $this->URL_PATH . $this->URL_FILE_NAME . $this->getQuery($html);
        }
        // ... or just path and file ...
        elseif ($path && $file && ! $query)
        {
            $url .= $this->URL_PATH . $this->URL_FILE_NAME;
        }
        // ... or just path (everything else is useless)
        elseif ($path && ! $file && ! $query)
        {
            $url .= $this->URL_PATH;
        }

        return $url;
    }



    /**
     * @desc    Merges parts of url according to given url and flags
     * @param   string $url URL to merge parts
     * @param   bool $scheme_host Merge scheme, host and port of url
     * @param   bool $path Merge path of url
     * @param   bool $file Merge file of url
     * @param   bool $query Merge query of url
     * @return  void
     */
    public function mergeURLParts($url, $scheme_host, $path, $file, $query)
    {
        $url_array = parse_url($url);

        // merge scheme, host and/or port into existing
        if ($scheme_host)
        {
            if (isset($url_array['host']))
            {
                $this->URL_HOST = $url_array['host'];
            }

            if (isset($url_array['scheme']))
            {
                $this->URL_SCHEME = $url_array['scheme'];
            }

            // special treatment for url port, because it is normaly determined by scheme
            if (isset($url_array['port']))
            {
                $this->URL_PORT = $url_array['port'];
            }
            else
            {
                $this->URL_PORT = ($this->URL_SCHEME == $this->SECURE_SCHEME)
                    ? $this->SECURE_PORT
                    : $this->DEFAULT_PORT;
            }
        }

        // merge path and/or file
        if ($path || $file)
        {
            $file_path = $this->absolutePath($this->mergePaths(
                $this->URL_PATH . $this->URL_FILE_NAME,
                isset($url_array['path']) ? $url_array['path'] : "")
            );

            // set merged path and file name ...
            if ($path && $file)
            {
                list($this->URL_PATH, $this->URL_FILE_NAME) = $this->getPathFile($file_path);
            }
            // ... or just set merged path ...
            elseif ($path && ! $file)
            {
                list($this->URL_PATH, $dummy) = $this->getPathFile($file_path);
            }
            // ... or just set merged file name
            elseif (! $path && $file)
            {
                list($dummy, $this->URL_FILE_NAME) = $this->getPathFile($file_path);
            }
        }

        // merge query array with parsed query
        if ($query)
        {
            $this->URL_QUERY_ARRAY = array_merge(
                $this->URL_QUERY_ARRAY,
                $this->parseQuery(isset($url_array['query']) ? $url_array['query'] : "")
            );
        }
    }



    /**
     * @desc    Gets path and file name from file path
     * @param   string $file_path URL file path
     * @return  array Returns URL path and file name
     */
    public function getPathFile($file_path)
    {
        $file_path_list = explode($this->PATH_SEP, $this->absolutePath($file_path));

        $file = array_pop($file_path_list);
        array_push($file_path_list, "");

        $path = implode($this->PATH_SEP, $file_path_list);

        return array($path, $file);
    }



// === FILE PATH HELPERS ==========================================================================

    /**
     * @desc    Prepends slash to path if necessary
     * @param   string $path Path to prepend slash
     * @return  string Returns absolute path
     */
    public function absolutePath($path)
    {
        return (substr($path, 0, 1) != $this->PATH_SEP ? $this->PATH_SEP . $path : $path);
    }



    /**
     * @desc    Apends slash to path if necessary
     * @param   string $path Path to append slash
     * @return  string Returns fixed path
     */
    public function fixPath($path)
    {
        return
            (substr(strrev($path), 0, 1) != $this->PATH_SEP ? $path . $this->PATH_SEP : $path);
    }



    /**
     * @desc    Merges two file paths into one
     * @param   string $original_path Original path
     * @param   string $merge_path Path to merge into original path
     * @return  string Returns merged path
     */
    public function mergePaths($original_path, $merge_path)
    {
        // absolute merge path overwrites original path
        if (substr($merge_path, 0, 1) == $this->PATH_SEP)
        {
            return $merge_path;
        }

        // empty merge path has no effect on original path
        if ($merge_path == "")
        {
            return $original_path;
        }

        $original_path_array = explode($this->PATH_SEP, $original_path);
        $merge_path_array    = explode($this->PATH_SEP, $merge_path);

        // discard original file name
        array_pop($original_path_array);

        foreach ($merge_path_array as $path_part)
        {
            switch ($path_part)
            {
                case $this->PATH_CURRENT:
                {
                    break;
                }

                case $this->PATH_UPPER:
                {
                    array_pop($original_path_array);
                    break;
                }

                default:
                {
                    array_push($original_path_array, $path_part);
                }
            }
        }

        return implode($this->PATH_SEP, $original_path_array);
    }



// === QUERY HELPERS ==============================================================================

    /**
     * @desc    Builds query from given url query array
                This method is necessary because http_build_query is only available in php5
     * @param   array $url_query_array URL query array
     * @param   bool[optional] $html Flag if query should be ready for html pages
     * @return  string Returns
     */
    public function buildQuery($url_query_array, $html = true)
    {
        $query_array = array();

        // build key-value pairs (e.g. a=1) and store them in temp array
        foreach ($url_query_array as $key => $value)
        {
            $query_array[] = $key . ($value != "" ? $this->QUERY_KV_SEP . $value : "");
        }

        // build query string by joining elements of temp array
        return implode($html ? $this->QUERY_AMP_SEP : $this->QUERY_SEP, $query_array);
    }



    /**
     * @desc    Parses query into array
                This method is necessary because parse_str does not really work
     * @param   string $query Query to parse into array
     * @return  array Returns query array
     */
    public function parseQuery($query)
    {
        $result = array();

        // empty query evaluates in empty query array
        if ($query == "")
        {
            return $result;
        }

        // replace all &amp; with & before parsing query string
        $query = str_replace($this->QUERY_AMP_SEP, $this->QUERY_SEP, $query);

        // remove question mark before splitting into query parts
        $query_list = explode(
            $this->QUERY_SEP,
            substr($query, 0, 1) == $this->QUERY_PRE ? substr($query, 1) : $query
        );

        // read each key value pair from query list
        foreach ($query_list as $param)
        {
            $key_value = explode($this->QUERY_KV_SEP, $param);
            $result[$key_value[0]] = @$key_value[1];
        }

        return $result;
    }



// === HELPERS ====================================================================================

    /**
     * @desc    STATIC - Tests if URL is complete or just host relative
     * @param   string $url URL to test
     * @return  bool Returns true if URL is complete, otherwise false
     */
    public function isComplete($url)
    {
        $scheme_regex = "{://}";   // php5 : 'const SCHEME_REGEX = "{://}";'

        return preg_match($scheme_regex, $url);
    }



    /**
     * @desc    STATIC - Sets utility url
     * @param   string $url URL to set
     * @return  string Returns previous utility url
     */
    public function setUtilityURL($url)
    {
        $request_url = "URLUtility_URL";   // php5 : 'const REQUEST_URL = "URLUtility_URL";'

        // store previous utility url for later use
        $previous_url = isset($_REQUEST[$request_url]) ? $_REQUEST[$request_url] : null;

        // set utility url to disired value
        $_REQUEST[$request_url] = $url;

        // return previous utility url
        return $previous_url;
    }



    /**
     * @desc    STATIC - Resets utility url
     * @param   string[optional] $previous_url URL to restore
     * @return  void
     */
    public function resetUtilityURL($previous_url = null)
    {
        $request_url = "URLUtility_URL";   // php5 : 'const REQUEST_URL = "URLUtility_URL";'

        // either unset utility url or restore previous one
        if ($previous_url == null)
        {
            unset($_REQUEST[$request_url]);
        }
        else
        {
            $_REQUEST[$request_url] = $previous_url;
        }
    }

}
