<?php
Yii::import('widgets.WidgetsBase');
class jQueryPopup extends WidgetsBase{
    public $selector;
    public $mode = 'full'; // full , preload
    public $forceCopyTill = '2013-10-15 00:00:00';

    public function registerScripts(){
        Yii::app()->clientScript->registerCoreScript('jquery');
        Yii::app()->clientScript->registerCoreScript('jquery.ui');
        $this->createWidget('widgets.jGritter');
        $this->createWidget('widgets.jQueryAjaxSanitizer');
        parent::registerScripts();
        Yii::app()->clientScript->registerScriptFile($this->assetsPath.'/jQueryPopupPosition.js',CClientScript::POS_END);
    }
    public function run(){

    }
}