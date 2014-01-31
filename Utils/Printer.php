<?php
namespace Yiix\Utils;
class Printer {
    public static function printLine($message='',$lineBreak=true,$flush=true){
        echo $message;

        if ($lineBreak) echo "\n";

        if ($flush){ flush(); }
    }

    public static function startLogPrint($htmlOptions=array('style'=>'line-height:18px; font-size:12px; margin:0;')){
        echo \CHtml::openTag('pre',$htmlOptions);
    }
    public static function endLogPrint(){
        echo \CHtml::closeTag('pre');
    }

    public static function startLongTask($title='',$htmlOptions=array()){
        @ini_set('zlib.output_compression', 0);
        if (function_exists('implicit_flush')) {
            @ini_set('implicit_flush', 1);
        }
        if (function_exists('apache_setenv')) {
            @apache_setenv('no-gzip', 1);
        }

        for ($i = 0; $i < ob_get_level(); $i++) { ob_end_flush(); }
        ob_implicit_flush(1);
        set_time_limit(0);
        echo str_pad(' ', 4096);

        $htmlOptions=array('style'=>'line-height:18px; font-size:12px; margin:0;');
        echo \CHtml::openTag('pre',$htmlOptions);

        self::printLine('--=========== '.$title.' ===========--');
    }

    public static function endLongTask(){
        echo \CHtml::closeTag('pre');
    }

    /**
     * call $func on each item from dataprovider
     *
     * @param CDataProvider
     * @param Closure $func($model,$controller)
     */
    public static function each($dataProvider,$controller,$func){
        $row = 0;
        while ($models = $dataProvider->getData(true)){
            foreach ($models as $model){
                call_user_func_array($func, array($model,$controller,$row));
                $row++;
            }

            $currentPage = $dataProvider->pagination->getCurrentPage()+1;
            $dataProvider->pagination->setCurrentPage($currentPage);
            if ($currentPage==$dataProvider->pagination->getPageCount()) break;

        }
        return $row;
    }
}