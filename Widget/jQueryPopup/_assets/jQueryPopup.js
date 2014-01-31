/**
 * usage
 *
 *	var popup = $.fn.jQueryPopup({
                            url:'/path/path/',
                            css:{width:'400px'},
                            keepCentered:false,
                            relativeTo:'#body',
                            showArrow:true,
                            arrowPositionClass:'right',
                            offset:{left:-12,top:-18},
                            blockUI:false,
                            showCloseButton:true,
                            buttons:{
                                    'OK':function(){this.hide(null,0);}
                            },
                            onReady:function(){
                                var self = this;
                            }
                        }

    var popup = $.fn.jQueryPopup({
                            html:'<div></div>',
                            css:{width:'400px'},
                            keepCentered:false,
                            relativeTo:'#body',
                            showArrow:true,
                            arrowPositionClass:'right',
                            offset:{left:-12,top:-18},
                            blockUI:false,
                            showCloseButton:true,
                            buttons:{
                                    'OK':function(){this.hide(null,0);}
                            },
                            onReady:function(){
                                var self = this;
                            }
                        }
    var popup = $('#id').jQueryPopup({
                            css:{width:'400px'},
                            keepCentered:false,
                            relativeTo:'#body',
                            showArrow:true,
                            arrowPositionClass:'right',
                            offset:{left:-12,top:-18},
                            blockUI:false,
                            showCloseButton:true,
                            buttons:{
                                    'OK':function(){this.hide(null,0);}
                            },
                            onReady:function(){
                                var self = this;
                            }
                        }
 */
(function($,undefined){
    var jQueryPopup = function(op) {
        var options = $.extend({},$.fn.jQueryPopup.options,op);

        var resizer = {
            animatedCenteredPull:function(){
                var self = this;
                var clone = this.element.clone();
                clone.find('*').each(function(k,v){
                    $(this).removeAttr('id');
                });
                var resizeOptions = $.extend({},{},self.options.position);
                clone.css({'position':'absolute','left':'-99999px','top':'-99999px','overflow':'hidden','height':'auto'}).show().appendTo('body');

                var height = clone.height();

                var currentHeight = self.element.height();
                clone.remove();

                if (self.options.css.width == undefined){
                    //box.css('width',width+'px');
                }
                //  [pageWidth,pageHeight,windowWidth,windowHeight]
                var width = this.element.width();

                if (this.overlay != null) {
                    var pageSize = [this.overlay.prop('clientWidth'),this.overlay.prop('clientHeight')];
                } else {
                    var pageSize = this.getPageSize();
                }
                var left = Math.round(pageSize[0]/2 - width/2);


                resizeOptions['using'] = function(css,calc) {
                    // apply new height
                    if (self.options.fullScreen==false){
                        css['height'] = height;
                        // if box size changed than we need fix it is vertical position too
                        css['top'] = css['top'] + Math.round((currentHeight - height)/2);
                        if (css['top']<0){
                            $($(this).parent()).animate({'scrollTop':0},self.options.animationSpeed, "swing");
                            css['top'] = 0;
                        }
                        css['left'] = left;
                    }

                    $(this).animate(css,self.options.animationSpeed, "swing",function(){

                        if (self.options.fullScreen==false){
                            self.element.css({'height':'auto'});
                        }
                        self.element.find('.btn-hide').show();
                    });
                }
                $(self.element).jQueryPopupPosition(resizeOptions);
            },
            centeredPull:function(){
                var self = this;

                var clone = this.element.clone(true);
                clone.find('*').each(function(k,v){
                    $(this).removeAttr('id');
                });
                var resizeOptions = $.extend({},{},self.options.position);

                clone.css({'position':'absolute','left':'-99999px','top':'-99999px','overflow':'auto','height':'auto'}).show().appendTo('body');


                var height = clone.outerHeight();
                var currentHeight = self.element.outerHeight();
                clone.remove();

                if (self.options.css.width == undefined){
                    //box.css('width',width+'px');
                }

                //  [pageWidth,pageHeight,windowWidth,windowHeight]
                var width = this.element.width();

                if (this.overlay != null) {
                    var pageSize = [this.overlay.prop('clientWidth'),this.overlay.prop('clientHeight')];
                } else {
                    var pageSize = this.getPageSize();
                }

                var left = Math.round(pageSize[0]/2 - width/2);

                resizeOptions['using'] = function(css,calc) {
                    if (self.options.fullScreen==false){
                        css['top'] = css['top'] + Math.round((currentHeight - height)/2);
                        if (css['top']<0){
                            $(this).parent().css({'scrollTop':Math.abs(css['top'])});
                            css['top'] = 0;
                        }
                        css['height'] = 'auto';
                        css['left'] = left;

                        self.element.css(css);
                    }
                    self.element.find('.btn-hide').show();
                }

                $(self.element).jQueryPopupPosition(resizeOptions);
            },
            'default':function(){
                this.element.css('height','auto');
                this.element.find('.btn-hide').show();
            },
            fixed:function(){
                var self = this;
                var resizeOptions = $.extend({},{},self.options.position);

                var height = this.options.height;
                //  [pageWidth,pageHeight,windowWidth,windowHeight]
                var width = this.element.width();

                if (this.overlay != null) {
                    var pageSize = [this.overlay.prop('clientWidth'),this.overlay.prop('clientHeight')];
                } else {
                    var pageSize = this.getPageSize();
                }

                var left = Math.round(pageSize[0]/2 - width/2);

                resizeOptions['using'] = function(css,calc) {
                    // apply new height
                    if (self.options.fullScreen==false){
                        css['height'] = height;
                        css['left'] = left;
                    }

                    $(this).animate(css,self.options.animationSpeed, "swing",function(){
                        self.element.find('.btn-hide').show();
                    });
                }
                $(self.element).jQueryPopupPosition(resizeOptions);
            }
        }

        return {
            id:null,
            resizer:resizer,
            options:options,
            element:null,
            moveCenterTimeout:null,
            overlay:null,
            trigger:options.trigger,
            active:false,
            mode:'popup', // tooltip, popover, popup
            buttonsHolder:null,
            buttons:[],
            _maxZIndex:999999,
            _offsetInitial:null,
            ajaxRequest: null,
            popupArrow:null,
            arrowPositionClasses: 'bottom bottomleft top topleft right righttop left lefttop',
            offset:{top:0,left:0},
            resize: function(before,after){
                var before = before || null, after = after || null;
                this.element.css({'height':this.element.height()+'px'});
                if (before instanceof Function && before.call(this)===false){
                    return;
                }
                var method = 'default';
                if (this.options.keepCentered==true && this.options.useAnimation==true && this.options.height!=null){
                    method = 'fixed';
                }else if (this.options.keepCentered==true && this.options.useAnimation==true){
                    method = 'animatedCenteredPull';
                }else if (this.options.keepCentered==true && this.options.useAnimation==false){
                    method = 'centeredPull';
                }else if (this.options.keepCentered==false && this.options.useAnimation==false){
                    method = 'default';
                }

                this.resizer[method].call(this);

                if (after instanceof Function){
                    after.call(this);
                }
            },
            generateId: function(){
                return Math.floor(Math.random()* 10000000000);
            },
            applyEvents: function(){
                var $this = this;
                var popup = this.element;
                var op = this.options;

                this.element.on('click',function(e){
                    e.stopPropagation();
                });


                if (op.onMouseenter){
                    popup.mouseenter(op.onMouseenter);
                }
                if (op.onMouseleave){
                    popup.mouseleave(op.onMouseleave);
                }

                this.onBeforeReady();

                //this.moveCenter(0);
                //$this.loading(false);
                //methods.redrawUI();

                popup.find('button.cancel').unbind('click').click(function(){
                    $this.hide(function(){popup.remove();});
                });

                popup.find('a[href$=#hide]').unbind('click').click(function(){
                    $this.hide(function(){popup.remove();});
                });

                popup.find('.body .ajaxable a').unbind('click').click(function(){
                    var self = this;
                    var paramsO = {};

                    $this.loading(true);

                    paramsO['ajax'] = 1;
                    paramsO['i'] = Math.random();
                    $this.ajaxRequest = $.ajax({
                        'type':'get',
                        'url':self.href,
                        'data':paramsO,
                        'dataType':'text',
                        'success':function(d){
                            var data = eval('(' + d + ')');
                            $this.popupHandleJsonResponse(data,function(data){
                                $this.loading(false);

                                if (data.response===null){
                                    this.hide();
                                }

                                if (op.onAfterSubmit instanceof Function){
                                    op.onAfterSubmit.call(window,data,this);
                                }else if (op.onAfterSubmit == 'hide'){
                                    this.hide();
                                }
                            });
                        },
                        'error':function(jqXHR, textStatus, errorThrown){
                            if (jqXHR.responseText==''){
                                var data = {messages:[],response:jqXHR.status+' '+jqXHR.statusText,js:''}
                            }else{
                                var data = eval('(' + jqXHR.responseText + ')');
                            }
                            $this.popupHandleJsonResponse(data);
                        }
                    });
                    return false;
                });
                popup.find('form:not(.noajax)').submit(function(){

                    var settings = $(this).data('settings');
                    var form = $(this);
                    if (typeof settings != 'undefined' && typeof settings.validated != 'undefined' && settings.validated==false){
                        $this.unFreezeButtons();
                        return false;
                    }
                    popup.find('.btn-submit').replaceWith('<span>'+$this.options.messages.please_wait+'</span>');
                    var params = form.serializeArray();
                    if (form.attr('id')) params.push({name:'ajax','value':form.attr('id')+'-submit'});

                    params.push({name:'i',value:Math.random()});

                    if (typeof op.data != 'undefined'){
                        $.each(op.data,function(k,v){
                            params.push({name:k,value:v});
                        });
                    }

                    $this.freezeButtons();
                    $this.ajaxRequest = $.ajax({
                        type: this.method,
                        url: this.action,
                        data: params,
                        dataType: 'text',
                        success: function(d){
                            if (d=='OK'){
                                var data = {'messages':[],'response':''};
                            }else{
                                var data = eval('(' + d + ')');
                            }
                            $this.loading(false);
                            $this.popupHandleJsonResponse(data,function(data){

                                if (data.response==null){
                                    this.hide();
                                }
                                if (op.onAfterSubmit instanceof Function){

                                    op.onAfterSubmit.call(window,data,this);
                                }else if (op.onAfterSubmit == 'hide'){
                                    this.hide();
                                }
                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            if (jqXHR.responseText==''){
                                var data = {messages:[],response:jqXHR.status+' '+jqXHR.statusText,js:''}
                            }else{
                                var data = eval('(' + jqXHR.responseText + ')');
                            }
                            $this.loading(false);
                            $this.popupHandleJsonResponse(data);
                        }
                    });
                    return false;
                });
                popup.find('input[type!=hidden]:visible:first').focus();
                this.onReady();

            },

            blockUI:function(callback){
                if (this.options.blockUI!==true) return;

                this.overlay = this.createBlockUILayer();

                var backupBodySettings = {
                    'overflow':$('body').css('overflow'),
                    'overflow-x':$('body').css('overflow-x'),
                    'overflow-y':$('body').css('overflow-y'),
                    'margin-right':$('body').css('margin-right')
                }


                $('body').data('css',backupBodySettings);

                var newBoddySettings = {'overflow':'hidden'};
                if (methods.hasScrollbar()){
                    newBoddySettings['margin-right'] = backupBodySettings['margin-right'] + methods.scrollbarWidth;
                }

                $('body').css(newBoddySettings);

                  // [pageWidth,pageHeight,windowWidth,windowHeight]
                var pageSize = this.getPageSize();

                this.overlay.height(pageSize[3]);
                this.overlay.width(pageSize[2]);
                this.overlay.css('top',$(window).scrollTop());
                this.overlay.css('left',$(window).scrollLeft());

                if (!this.overlay.is(':visible')){
                    this.overlay.show(0,function(){
                        if (callback instanceof Function) callback();
                    });
                }
                return this.overlay;
            },

            close:function(callback,speed,method){
                this.hide(callback,speed,method);
            },

            createBlockUILayer:function(){
                blockUi = $('<div class="'+this.options.prefix+'jQueryPopup-overlay" style="display:none;' +
                        'left:0px; top:0px;	margin:0; padding:0;"></div>')
                        .css({'overflow-x':'hidden','overflow-y':'scroll','z-index':this.maxZIndex()})
                        .appendTo(this.options.appendTo);

                return blockUi;
            },

            flipPosition:function(direction){
                var arrowPosition = this.getFlipedArrowPosition(this.options.arrowPositionClass,direction);
                this.setArrowPosition(arrowPosition);
            },

            getFlipedArrowPosition:function(arrowPos,direction){
                direction = direction || 'vertical';
                switch (arrowPos){
                    case 'topleft':
                        if (direction=='vertical'){
                            return 'bottomleft';
                        }else{
                            return 'topright';
                        }
                        break;
                    case 'bottomleft':
                        if (direction=='vertical'){
                            return 'topleft';
                        }else{
                            return 'bottomleft';
                        }
                        break;
                    case 'top':
                        return 'bottom';
                        break;
                    case 'left':
                        return 'right';
                        break;
                    case 'right':
                        return 'left';
                        break;
                    case 'bottom':
                        return 'top';
                        break;
                }
            },

            getPageSize: function(){
                //
                // getPageSize()
                // Returns array with page width, height and window width, height
                // Core code from - quirksmode.com
                // Edit for Firefox by pHaez
                //
                var xScroll, yScroll;

                if (window.innerHeight && window.scrollMaxY) {
                    xScroll = window.innerWidth + window.scrollMaxX;
                    yScroll = window.innerHeight + window.scrollMaxY;

                } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
                    xScroll = document.body.scrollWidth;
                    yScroll = document.body.scrollHeight;
                } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
                    xScroll = document.body.offsetWidth;
                    yScroll = document.body.offsetHeight;
                }
                var windowWidth, windowHeight;

                if (self.innerHeight) {	// all except Explorer
                    if(document.documentElement.clientWidth){
                        windowWidth = document.documentElement.clientWidth;
                    } else {
                        windowWidth = self.innerWidth;
                    }
                    windowHeight = self.innerHeight;
                } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
                    windowWidth = document.documentElement.clientWidth;
                    windowHeight = document.documentElement.clientHeight;
                } else if (document.body) { // other Explorers
                    windowWidth = document.body.clientWidth;
                    windowHeight = document.body.clientHeight;
                }

                // for small pages with total height less then height of the viewport
                if(yScroll < windowHeight){
                    pageHeight = windowHeight;
                } else {
                    pageHeight = yScroll;
                }

                // for small pages with total width less then width of the viewport
                if(xScroll < windowWidth){
                    pageWidth = xScroll;
                } else {
                    pageWidth = windowWidth;
                }
                arrayPageSize = [pageWidth,pageHeight,windowWidth,windowHeight];
                return arrayPageSize;
            },

            handleKey: function(e,op){
                if (this.options.disableHotKeys==true) return;
                switch (e.keyCode){
                    case 27:
                        if (this.options.disableKeys) return false;
                        this.hide();
                    break;
                }
            },

            hide: function(callback,speed,method){
                var self = this;
                this.active = false;
                if (this.element==null) return;
                if (typeof speed == 'undefined') speed = this.options.appearanceSpeed;
                if (typeof method =='undefined') method ='fadeOut';
                var current = this;

                if (this.options.appearanceMethod!=undefined && $.isFunction(this.options.appearanceMethod.hide)){
                    this.options.appearanceMethod.hide.call(this.element,speed,function(){
                        current.unblockUI(callback);
                        current.element.remove();
                        current.element = null;
                        delete current;
                        self.onClose();
                    });
                }else{
                    this.element[method](speed,function(){current.unblockUI(callback);
                        current.element.remove();
                        current.element = null;
                        delete current;
                        self.onClose();
                    });
                }

            },

            init: function(){
                if (this.options.height!=null){
                    this.options.css.height = this.options.height;
                }
                this.id = this.generateId();
                this.offset = $.extend({},this.options.offset);
                this.element = this.popup();

                this.element.api = this;
                if (this.options.loading==true) this.loading(true);
                  //else this.loading(false);
                this.buttonsHolder = this.element.find('.jQueryPopup-buttons');

                var self = this;
                /*$( window ).bind('resize',function(){
                      self.moveCenter();
                });*/

                return this;

            },

            reinit: function(op){
                this.options = $.extend({},$.fn.jQueryPopup.options,op);
                this.offset = $.extend({},this.options.offset);

                if (this.options.height!=null){
                    this.options.css.height = this.options.height;
                }

                this.trigger = this.options.trigger;
                this.element = this.popup();

                if (this.options.loading!==false) this.loading(this.options.loading);
                //else this.loading(false);

                //this.buttonsHolder = this.element.find('.jQueryPopup-buttons').hide();

                return this;
            },

            scriptLoader: function(scriptFiles,cssFiles,onComplete){
                $.fn.jQueryAjaxSanitizer(scriptFiles,cssFiles,onComplete);
            },
            redrawUI: function(){
                var self = this;
                clearTimeout(this.moveCenterTimeout);
                if (this.element!=null && this.element.is(':visible')){
                    self.resizeBlockUI();
                    self.moveCenter();
                    self.show();
                }
            },
            moveCenter:function(timeout,options,animate,callback){
                if (typeof timeout == 'undefined') var timeout = 10;
                if (this.options.keepCentered!==true) return;

                var self = this;
                this.moveCenterTimeout = setTimeout(function(){
                    if (typeof self.element != 'undefined' && self.element.is(':visible')){
                        var resizeOptions = $.extend({},{},self.options.position);
                        resizeOptions['using'] = function(css,calc) {
                            if (css['top']<0){
                                $(this).parent().css({'scrollTop':Math.abs(css['top'])});
                                css['top'] = 0;
                            }
                            $(self.element).css(css);
                        }

                        $(self.element).jQueryPopupPosition(resizeOptions);
                        //self.scrollCenter(self.element,options,animate,callback);
                    }
                },timeout);
            },
            resizeBlockUI:function(){
                if (this.options.blockUI!==true) return;
                var pageSize = this.getPageSize();

                $(this.overlay).height(pageSize[3]+'px');
                $(this.overlay).width(pageSize[2]+'px');


                this.overlay.css('top',$(window).scrollTop());
                this.overlay.css('left',$(window).scrollLeft());

                if (this.options.fullScreen) {
                    if (this.overlay != null) {
                        var pageSize = [this.overlay.prop('clientWidth'),this.overlay.prop('clientHeight')];
                    } else {
                        var pageSize = this.getPageSize();
                    }
                    this.element.width(pageSize[0]-this.options.fullScreenMargin*2);
                    this.element.height(pageSize[1]-this.options.fullScreenMargin*2);

                    this.element.css('left',this.options.fullScreenMargin);
                    this.element.css('top',this.options.fullScreenMargin);
                }

            },

            maxZIndex:function(){
                return this._maxZIndex++;
                /*
                 var maxZ = Math.max.apply(null,$.map($('*'), function(e,n){
                       if($(e).css('position')=='absolute' || $(e).css('position')=='fixed')
                            return parseInt($(e).css('z-index'))||1 ;
                       })
                );
                return maxZ;*/
            },

            unblockUI:function(callback,speed){
                if (this.options.blockUI!==true) return;
                var self = this;
                var op = this.options;
                if (op.onBeforeHide instanceof Function) op.onBeforeHide.call(self);

                var blockui = this.overlay;
                blockui.fadeOut(typeof speed!='undefined'?speed:300,
                    function(){
                        blockui.remove();
                        if (callback instanceof Function) callback.call(window);

                        if ($.browser.msie) {
                              $('body').css($('body').data('css'));
                          }else{
                              $('body').css($('body').data('css'));
                          }

                });
            },
            loading:function(active,useSpinner,useLoadingbox){

                active = (typeof active == 'undefined')?true:active;
                useSpinner = (typeof useSpinner == 'undefined')?true:useSpinner;
                useLoadingbox = (typeof useLoadingbox == 'undefined')?true:useLoadingbox;

                if (this.element==null) return false;
                switch (active){
                    case true:
                        if (useLoadingbox) this.element.find('.jQueryPopup-loading').html(this.options.messages.loading).show();
                        if (useSpinner) this.element.find('.jQueryPopup-loading-spinner').show();
                    break;
                    case false:
                        this.element.find('.jQueryPopup-loading').hide();
                        this.element.find('.jQueryPopup-loading-spinner').hide();
                        this.unFreezeButtons();
                    break;
                    default:
                        if (useLoadingbox) this.element.find('.jQueryPopup-loading').html(active).show();
                        if (useSpinner)  this.element.find('.jQueryPopup-loading-spinner').show();
                    break;
                }
                this.setArrowOffset();
            },

            popup: function(){
                var op = this.options,
                    self = this,
                    obj = null,
                    isnew = false;

                var obj = null;
                if (op.id && (obj = $('#'+op.id)).length>0){
                    obj.remove();
                    self.element = obj = null;
                }


                if (self.element==null){
                    this.blockUI(function(){});
                    self.popupArrow = undefined;
                    obj = $('<div class="'+this.options.prefix+'jQueryPopup" style="position:absolute; z-index:1000; display:none;"><div class="jQueryPopup-loading-spinner"></div><div class="box"><div class="jQueryPopup-loading"></div><div class=\"body\"></div><div class="jQueryPopup-buttons" style="display:none;"></div></div></div>')
                        .hide();

                    if (self.overlay!==null && op.blockUI===true){
                        obj.appendTo(self.overlay);
                    }else{
                        obj.appendTo(this.options.appendTo);
                    }

                    if (op.showCloseButton){
                        obj.find('.body').before($('<a class=\"btn-hide\" href=\"#hide\">'+op.closeButtonText+'</a>').css('z-index',this.maxZIndex()));
                    }

                    if (op.title){
                        obj.find('.body').before('<h1 class="jQueryPopup-title">'+op.title+'</h1>');
                    }

                    if (op.id) obj.attr('id',op.id);

                    obj.addClass(op['class']);

                    if (op.css) obj.css(op.css);
                    if (op.boxCss) obj.find('.box').css(op.boxCss);

                    if (op.fullScreen) {
                        obj.find('.box').css('height','100%');
                        if (this.overlay != null) {
                            var pageSize = [this.overlay.prop('clientWidth'),this.overlay.prop('clientHeight')];
                        } else {
                            var pageSize = this.getPageSize();
                        }
                        obj.width(pageSize[0]-op.fullScreenMargin*2);
                        obj.height(pageSize[1]-op.fullScreenMargin*2);
                        obj.css('left',op.fullScreenMargin+'px');
                        obj.css('top',op.fullScreenMargin+'px');
                    }


                    if (op.bodyCss) obj.find('.body').css(op.bodyCss);

                    obj.on('click','a[href$=#hide]',function(){
                        self.hide(function(){obj.remove();});
                        //methods.unblockUI.call(obj,function(){obj.hide(0,function(){obj.remove();});});
                    });

                    $(window).bind('resize.jQueryPopup.'+this.id,function(){
                        self.redrawUI();
                    });
                    $(window).bind('scroll.jQueryPopup.'+this.id,function(){
                        self.redrawUI();
                    });

                    self.element = obj;
                    self.element.api = self;

                    isnew = true;
                }

                if (op.showArrow){
                    self.element.removeClass(self.arrowPositionClasses);
                    // usage of op.arrowPositionClass is deprecated
                    // use op.pos instead
                    if (typeof op.pos != 'undefined'){
                        switch (op.pos){
                            case 't':
                                op.arrowPositionClass = 'bottom';
                                break;
                            case 'tr':
                                op.arrowPositionClass = 'bottomleft';
                                break;
                            case 'b':
                                op.arrowPositionClass = 'top';
                                break;
                            case 'br':
                                op.arrowPositionClass = 'topleft';
                                break;
                            case 'l':
                                op.arrowPositionClass = 'right';
                                break;
                            case 'lb':
                                op.arrowPositionClass = 'righttop';
                                break;
                            case 'r':
                                op.arrowPositionClass = 'left';
                                break;
                            case 'rb':
                                op.arrowPositionClass = 'lefttop';
                                break;
                        }
                    }
                    self.element.addClass(op.arrowClass).addClass(op.arrowPositionClass);
                    if (self.popupArrow==undefined){
                        self.popupArrow = $('<div class="arrow"></div>');
                        self.element.append(self.popupArrow);
                    }
                }

                self.setKeys();

                self.buttonsHolder = self.element.find('.jQueryPopup-buttons');
                self.popupLoadContent();
                if (isnew == true && self.options.onCreate instanceof Function) {
                    self.options.onCreate.call(this);
                }

                return self.element;
            },

            getArrowOffest: function(){
                var self = this;
                if (self.options.relativeTo != undefined){
                    var offset = self.options.relativeTo.offset();
                    var triggerWidth = self.options.relativeTo.outerWidth();
                    var triggerHeight = self.options.relativeTo.outerHeight();

                    if (self.element.outerWidth()<triggerWidth){
                        triggerWidth = self.element.outerWidth();
                    }

                    var arrowHeight = self.popupArrow.outerHeight();
                    var arrowWidth = self.popupArrow.outerWidth();
                    var popupOffset = self.element.offset();
                }
                var arrowOffset = {left:null,top:null};
                switch (self.options.arrowPositionClass){
                    case 'right':
                       arrowOffset.top = triggerHeight/2 + offset.top - arrowHeight/2 - popupOffset.top;
                    break;
                    case 'left':
                       arrowOffset.top = triggerHeight/2 + offset.top - arrowHeight/2 - popupOffset.top;
                    break;
                    case 'top':
                    case 'topleft':
                       arrowOffset.left = triggerWidth/2 + offset.left - arrowWidth/2 - popupOffset.left;
                    break;
                    case 'bottom':
                    case 'bottomleft':
                       arrowOffset.left = triggerWidth/2 + offset.left - arrowWidth/2 - popupOffset.left;
                    break;
                }
                return arrowOffset;
            },

            setArrowOffset: function(){
                if (this.options.relativeTo != undefined){
                    var offset = this.getArrowOffest();
                    if (offset.top!=null) this.popupArrow.css('top',offset.top);
                    if (offset.left!=null) this.popupArrow.css('left',offset.left);
                }
            },

            remove: function(callback){
                if (this.element==null) return;
                var current = this;

                this.hide();
                current.unblockUI(callback,0);
                current.element.remove();
                delete current;
            },
            setArrowPosition: function(arrowpos){
                this.element.removeClass(this.options.arrowPositionClass).addClass(arrowpos);
                this.options.arrowPositionClass = arrowpos;
            },

            show: function(){
                var self = this;
                //if (this.active) return;
                if (typeof this.element == 'undefined' || this.element==null){
                    this.element = this.popup();
                }

                this.element.stop(true);
                this.element.css({'visibility':'hidden','display':'block'});

                var op = this.options;
                if (typeof op.relativeTo != 'undefined' && op.relativeTo != null && typeof op.arrowPositionClass != 'undefined'){
                    switch (op.arrowPositionClass){
                        case 'topleft':
                            $(this.element).jQueryPopupPosition({
                                        my:'left top',
                                        at:'left bottom',
                                        of:$(op.relativeTo),
                                        collision:'fit flip',
                                        onFlip:function(position){
                                            self.flipPosition('vertical');
                                        },
                                        offset:this.offset
                            });
                            break;
                        case 'bottomleft' :
                            $(this.element).jQueryPopupPosition({
                                        my : 'left bottom',
                                        at : 'left top',
                                        of : $(op.relativeTo),
                                        collision : 'fit flip',
                                        onFlip : function(position) {
                                            self.flipPosition('vertical');
                                        },
                                        offset:this.offset
                                    });
                            break;
                        case 'top':
                            $(this.element).jQueryPopupPosition({
                                        my:'center top',
                                        at:'center bottom',
                                        of:$(op.relativeTo),
                                        collision:'fit flip',
                                        onFlip:function(position){
                                            self.flipPosition('vertical');
                                        },
                                        offset:this.offset
                            });
                            break;
                        case 'left':
                            $(this.element).jQueryPopupPosition({
                                        my : 'left top',
                                        at : 'right center',
                                        of : $(op.relativeTo),
                                        collision : 'flip fit',
                                        onFlip : function(position) {
                                            self.flipPosition('horizontal');
                                        },
                                        offset:this.offset
                                    });
                            break;
                        case 'right' :
                            $(this.element).jQueryPopupPosition({
                                        my : 'right top',
                                        at : 'left center',
                                        of : $(op.relativeTo),
                                        collision : 'flip fit',
                                        onFlip : function(position) {
                                            self.flipPosition('horizontal');
                                        },
                                        offset:this.offset

                                    });
                            break;
                        case 'bottom' :
                            $(this.element).jQueryPopupPosition({
                                        my : 'center bottom',
                                        at : 'center top',
                                        of : $(op.relativeTo),
                                        collision : 'fit flip',
                                        onFlip : function(position) {
                                            self.flipPosition('vertical');
                                        },
                                        offset:this.offset
                                    });
                            break;
                    }


                }else{
                    if (this.overlay!=null && this.options.blockUI==true){
                        this.options.position.of = this.overlay;

                        var xy = this.options.position.offset.split(' ');

                        //xy[1] =  parseInt(xy[1]) + parseInt($(window).scrollTop());
                        //xy[0] =  parseInt(xy[1]) + parseInt($('body').scrollTop()) + parseInt(this.element.outerHeight());
                        //this.options.position.offset = xy.join(' ');

                        /*if (this.options.position.of == 'overlay' && typeof this.overlay != undefined){
                            this.options.position.of = this.overlay;
                        }*/

                        $(this.element).jQueryPopupPosition(this.options.position);
                    }else{
                        /*var offset = this.element.offset();
                        offset.top += this.options.offset.top;
                        offset.left += this.options.offset.left;
                        this.element.offset(offset);*/
                    }
                }

                this.element.css({'visibility':'visible','display':'block'});

                if (this.options.appearanceMethod!=undefined && $.isFunction(this.options.appearanceMethod.show)){
                    this.options.appearanceMethod.show.call(this.element,this.options.appearanceSpeed,function(){});
                }else{
                    this.element.fadeTo(300, 1);
                }

                this.active = true;
                if (op.showArrow){
                    this.setArrowOffset();
                }
            },

            setKeys: function(){
                var self = this;
                $(window).unbind('keypress.jQueryPopup.'+this.id);
                //if (!this.options.disableKeys){
                    $(window).bind('keypress.jQueryPopup.'+this.id,function(e){
                          return self.handleKey(e,op);
                    });
            //	}
            },

            addButton: function(name,callback){
                if (this.options.buttons==null){
                    this.options.buttons = {};
                }
                this.options.buttons[name] = callback;
            },
            setButtons: function(popup,buttons){
                var self = this;
                buttons = buttons || null;
                if (buttons==null) buttons = this.options.buttons;

                if (buttons){
                    var buttonsHolder = this.buttonsHolder.hide().empty();
                    for (var i in buttons){
                        switch (buttons[i]){
                            case 'ok':

                                var button = self.createButton(i,function(){
                                    self.freezeButtons();
                                    this.element.find('form:not(.noajax)').submit();
                                },self);
                                break;
                            case 'cancel':
                                var button = self.createButton(i,function(){this.hide()},self);
                                break;
                            default:
                                var button = self.createButton(i,buttons[i],self);
                                break;
                        }
                        self.buttons.push(button);
                        buttonsHolder.append(
                            button
                        );
                    }
                    if (typeof button != 'undefined') {
                        button.addClass('last');
                        this.buttonsHolder = buttonsHolder;

                        this.buttonsHolder.show();
                        return true;
                    } else {
                        this.buttonsHolder.empty().hide();
                        return false;
                    }
                }
                return true;
            },

            freezeButtons: function(){
                this.buttonsHolder.addClass('loading');
            },
            unFreezeButtons: function(){
                this.buttonsHolder.removeClass('loading');
            },

            createButton: function(title,func,owner){
                return $('<button class="btn"></button>').html(title).click(function(e){ func.call(owner,e) });
            },

            popupLoadContent: function(callback){
                if (this.options.text!=null){
                    var res = this.popupLoadContentText();
                }else if (this.options.html!=null){
                    var res = this.popupLoadContentHtml();
                }else if (this.options.url!=null){
                    if (this.options.url instanceof Function ){
                        this.options.url = this.options.url.call(this);
                    }
                    var res = this.popupLoadContentAjax();
                }

                return res;
            },
            popupLoadContentText: function(){
                this.element.find('.body').html(this.options.text);

                this.show();
                this.applyEvents();
            },
            popupLoadContentHtml: function(callback){

                if (this.options.html instanceof Function){
                    var html = this.options.html.call(this);
                    this.element.find('.body').html(html);
                    $(html).show();
                    this.show();
                    this.applyEvents();
                }else if (this.options.html instanceof Object && typeof this.options.html.response !== 'undefined'){
                    this.popupHandleJsonResponse(this.options.html);
                }else{
                    this.element.find('.body').html(this.options.html);
                    $(this.options.html).show();
                    this.show();
                    this.applyEvents();
                }

            },
            popupLoadContentAjax: function(callback){

                var self = this;

                //this.element.css('visibility','visible');
                //this.moveCenter(0);


                this.element.find('.btn-hide').hide();
                this.loading(self.options.messages.please_wait);

                this.show();
                //this.moveCenter(0);
                if (this.options.data instanceof Function){
                    var params = this.options.data.call(this);
                }else{
                    var params = this.options.data;
                }

                params['ajax'] = this.options.id!=null?this.options.id:'1';
                params['i'] = Math.random();
                this.ajaxRequest = jQuery.ajax({
                    'type':'GET',
                    'url':self.options.url,
                    'data':params,
                    'dataType':'text',
                    'success':function(d){
                        var data = eval('(' + d + ')');
                        self.loading(false);
                        self.popupHandleJsonResponse(data);
                    },
                    'error':function(jqXHR, textStatus, errorThrown){
                        if (jqXHR.responseText==''){
                            var data = {messages:[],response:jqXHR.status+' '+jqXHR.statusText,js:''}
                        }else{
                            var data = eval('(' + jqXHR.responseText + ')');
                        }
                        self.loading(false);
                        self.popupHandleJsonResponse(data);
                    }
                });
            },
            popupHandleJsonResponse: function(data,callback){
                var self = this;
                self.unFreezeButtons();

                if (typeof data.messages != 'undefined' ){
                    for (var i in data.messages){
                        methods.messagePopup(methods.ucfirst(i),data.messages[i].join("<br>"));
                    }
                }

                if (typeof data.html != 'undefined') data.response = data.html;


                if (data.response){
                    //self.element.find('.body').empty();
                    //self.element.css('overflow','hidden');
                    self.element.find('.body').html('<div>'+data.response+'</div>');
                }else if (data.response !==null){
                    self.element.find('.body').html('No data');

                    //self.hide(this.element);
                }

                if (data.buttons != undefined){
                    self.setButtons(self.element,data.buttons);
                }
                if (typeof data.scriptFiles !='undefined' && typeof data.cssFiles !='undefined'){
                    self.scriptLoader( data.scriptFiles,data.cssFiles,function(){
                        if (typeof data.js != 'undefined'){
                            eval(data.js);

                            if (callback instanceof Function ){
                                callback.call(self,data);
                            }
                            if (self.active) {
                                self.show();
                                self.applyEvents();
                            }
                        }
                    });
                }else if (typeof data.js != 'undefined'){
                    eval(data.js);
                    if (callback instanceof Function ){
                        callback.call(self,data);
                    }
                    if (self.active) {
                        self.show();
                        self.applyEvents();
                    }
                }else{
                    if (callback instanceof Function ){
                        callback.call(self,data);
                    }
                    if (self.active) {
                        self.show();
                        self.applyEvents();
                    }
                }
                self.element.find('.btn-hide').show();


            },
            ajaxedForm: function(data){
                var self = this;
                $(data).find('form').each(function(){

                    $(this).submit(function(){
                        var current = $(this);
                        self.ajaxRequest = jQuery.ajax({
                            type:current.attr('method'),
                            url:current.attr('action'),
                            data:current.serializeArray(),
                            dataType: 'html',
                            success: function(data){
                                $this.replaceWith(data);
                            },
                            error:function(jqXHR, textStatus, errorThrown){
                                if (typeof console != 'undefined'){
                                    console.log('Error: ' + textStatus);
                                }else{
                                    alert('Error: ' + textStatus);
                                }
                            }
                        });
                    });
                });
            },

            scrollCenter: function(obj,options,animate,callback) {
                var defaults = {
                        'offset':10
                };
                var op = $.extend({},defaults,options);

                var pos = {
                    sTop 	: function() {
                                return window.pageYOffset || document.documentElement && document.documentElement.scrollTop ||	document.body.scrollTop;
                            },
                    wHeight : function() {
                                return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body.clientHeight;
                              },
                      sLeft	: function(){
                                  return window.pageXOffset || document.documentElement && document.documentElement.scrollLeft ||	document.body.scrollLeft;
                            },
                    wWidth : function(){
                                return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body.clientWidth;
                            }
                    };

                    var pageSize = this.getPageSize();

                    return obj.each(function(index) {
                        if (index == 0) {
                            var $this = $(this);
                            /*$this.height('auto').find('.body').height('auto');

                            var elHeight = 0;
                            elHeight = $this.outerHeight();
                            if (elHeight>pageSize[3]){
                                elHeight = pageSize[3] - 2*op.offset;

                                var internalContent = $this.find('.body');
                                internalContent.height(elHeight - (parseInt(internalContent.css('padding-top'))+parseInt(internalContent.css('padding-bottom')))+'px');
                                $this.height(elHeight);
                            }else{
                                $this.height('auto').find('.body').height('auto');
                            }*/

                            var elHeight = $this.outerHeight();
                            var elWidth = $this.outerWidth();
                            var elTop = pos.sTop() + (pos.wHeight() / 2) - (elHeight / 2);
                            var elLeft = pos.sLeft() + (pos.wWidth() / 2) - (elWidth / 2);

                            if (elTop<0) elTop = op.offset;

                            var dimensions = {
                                    marginTop: '0',
                                    top: elTop,
                                    left:elLeft
                                };

                            if (typeof op.height != 'undefined'){
                                dimensions['height'] = op.height;
                            }

                            if (typeof animate == 'undefined' || animate==false){

                                $this.css(dimensions);
                                if (typeof callback != 'undefuned' && callback instanceof Function){
                                    callback.call($this);
                                }
                            }else{
                                $this.animate(dimensions, "fast","swing", callback );

                            }
                          }

                });
            },
            hideAll: function(){
                $('.jQueryPopup').each(function(){
                    $(this).jQueryPopup('hide');
                });
            },
            setTrigger: function(obj){
                this.trigger = this.options.trigger = obj;
            },
            onBeforeReady: function(){
                if (this.options.onBeforeReady instanceof Function){
                    this.options.onBeforeReady.call(this,this.element);
                }
                if (this.setButtons(this.element)){
                    this.resize(function(){
                        //$(this.buttonsHolder).show();
                    });
                }else{
                    this.resize();
                }
            },
            onReady: function(){
                if (this.options.onReady instanceof Function){
                    this.options.onReady.call(this,this.element);
                }
            },
            onClose: function(){
                if (this.options.onClose instanceof Function){
                    this.options.onClose.call(this,this.element);
                }
            }
        }.init();

    };

    var jQueryPopupTooltip = function(element,options){
        var triggerHandlers = {
            click:{
                init: function(eventHolder,eventTargetSelector,options){
                    eventTargetSelector = eventTargetSelector || null;
                    $(eventHolder).on('click',eventTargetSelector,function(){

                        var element = $(this);

                        var self = element.data('jQueryPopupTooltipFactory');
                        if (self==undefined){
                            self = new factory(eventHolder,element,$.extend({},options));

                            element.data('jQueryPopupTooltipFactory',self);

                            self.options.onClose = function(){
                                $(window).off('click.jQueryPopupTooltip.'+self.id);
                            }
                            self.options.onReady = function(){
                                $(window).on('click.jQueryPopupTooltip.'+self.id,function(event){
                                    if (!self.eventInTrigger(event)
                                        && (!self.eventInPopup(event))){
                                        self.close();
                                    }
                                });
                            }
                        }
                        $(window).trigger('click.jQueryPopupTooltip');
                        self.toggle();

                        return false;
                    });
                },
                show:function(){
                    var self = this;
                    if (self.hasPopup() && self.popup.active){
                        return;
                    }else if (self.hasPopup()){
                        self.popup.reinit(self.options);
                    }else{
                        self.popup = $.fn.jQueryPopup(self.options);
                    }
                },
                close:function(){
                    var self = this;
                    self.popup.close();
                }
            },
            hover: {
                init: function(eventHolder,eventTarget,options){
                    var self = new factory(eventHolder,eventTarget,$.extend({},options));
                    $(this.element).hover(function(){
                        var element = $(this);

                        var self = element.data('jQueryPopupTooltipFactory');
                        if (self==undefined){
                            self = new factory(eventHolder,element,$.extend({},options));

                            element.data('jQueryPopupTooltipFactory',self);

                            self.options.onMouseenter = function(){
                                self.stopEvents();
                                self.show();
                            };
                            self.options.onMouseleave = function(){
                                self.stopEvents();
                                self.close();
                            };
                        }

                        self.show();
                    },function(){
                        var self = element.data('jQueryPopupTooltipFactory');
                        if (self!=undefined){
                            self.close();
                        }
                    });
                },
                show:function(){
                    var self = this;
                    this.timeout = setTimeout(function(){
                        if (self.hasPopup() && self.popup.active){
                            return;
                        }else if (self.hasPopup()){
                            self.popup.reinit(self.options);
                        }else{
                            self.popup = $.fn.jQueryPopup(self.options);
                        }
                    },self.options.waitBeforeShow);
                },
                close:function(){
                    var self = this;
                    this.timeout = setTimeout(function(){
                        self.popup.close();
                    },self.options.waitBeforeShow);
                }
            }
        }
        var factory = function(eventHolder, eventTarget, options){
            eventTarget = eventTarget || null;
            return {
                id: null,
                options: options,
                eventHolder: eventHolder,
                eventTarget: eventTarget,
                popup: null,
                init: function(){
                    this.id = this.generateId();

                    this.options.relativeTo = this.options.trigger = this.eventTarget!=null ? this.eventTarget : this.eventHolder;
                    this.options.relativeTo.data('popup',this.popup);

                    return this;
                },
                generateId: function(){
                    return Math.floor(Math.random()* 10000000000);
                },
                eventInTrigger: function(event){
                    if (this.hasPopup()){
                        // check if event target lovcated at popup
                        if (this.target){
                            if ($(event.target).closest(this.eventTarget[0]).length>0){
                                return true
                            }
                        }else if ($(event.target).closest(this.eventHolder[0]).length>0){
                            return true
                        }
                    }
                    return false;
                },
                eventInPopup: function(event){
                    if (this.hasPopup() && this.popup.element != null){
                        // check if event target lovcated at popup
                        if ($(event.target).closest(this.popup.element[0]).length>0){
                            return true
                        }
                    }
                    return false;
                },
                hasPopup: function(){
                    if (this.popup != null){
                        return true;
                    }else{
                        return false;
                    }
                },
                stopEvents: function(){
                    clearTimeout(this.timeout);
                },
                toggle:function(){
                    if (this.popup != undefined && this.popup.active){
                        this.close();
                    }else{
                        this.show();
                    }
                },
                show: function(){
                    var self = this;
                    self.stopEvents();
                    triggerHandlers[this.options.triggerEvent].show.call(this);
                },
                close: function(){
                    var self = this;
                    this.stopEvents();
                    if (!this.hasPopup()) return;

                    triggerHandlers[this.options.triggerEvent].close.call(this);
                }
            }.init();
        }
        return {
            id:null,
            timeout: null,
            options: $.extend({},$.fn.jQueryPopupTooltip.options,options),
            popup: null,
            element: element,
            target: $(options.target),
            init:function(){
                triggerHandlers[this.options.triggerEvent].init.call(this,this.element,this.options.target,this.options);
                return this;
            }

        }.init();
    };

    var jQueryPopupContent = function(element,options){
        return {
            options:$.extend({},$.fn.jQueryPopupContent.options,options),
            popup:null,
            element:element,
            init:function(){
                this.popup = $.fn.jQueryPopup($.extend({},this.options,{
                        //relativeTo:this.element,
                        url:this.element.attr('href'),
                        trigger:this.element
                },(this.element.data('popup') || {})));
                //this.popup.show();
                return this;
            }
        }.init();
    };

    var methods = {
        index:0,
        popups:[],
        init: function(options,data){
            var self = methods;
            if (this.length>0) this.each(function(){
                var html = null;
                if (options.html==null && options.url==null){
                    if ($(this).html()) html = $(this);
                    var parent = html.parent();

                    var defaults = $.extend({},$.fn.jQueryPopup.options,{
                        'onBeforeHide':function(){
                            if (parent.length>0) html.hide().appendTo(parent);
                        }
                    });
                    defaults['html'] = html;
                }

                if (typeof data != 'undefined'){
                    defaults['data'] = data;
                }
                if (options.group!=null && typeof self.popups[options.group] != 'undefined' && self.popups[options.group]!=null){
                    var api = self.popups[options.group];

                    api.reinit(options);
                    //api.setOwner($(this));
                }else{
                    var api = new jQueryPopup($.extend({},defaults,options));
                    if ($(this).length>0) $(this).data('jqpApi',api);
                    //api.setOwner($(this));
                    self.store(api);
                }
            });
            else{
                var defaults = $.fn.jQueryPopup.options;

                if (typeof data != 'undefined'){
                    defaults['data'] = data;
                }
                if (options.group!=null && typeof self.popups[options.group] != 'undefined' && self.popups[options.group]!=null){
                    var api = self.popups[options.group];
                    api.reinit(options);
                    //api.setOwner($(this));
                }else{
                    var api = new jQueryPopup($.extend({},defaults,options));

                    if (this.length>0){
                        $(this).data('jqpApi',api);
                        //api.setOwner($(this));
                    }
                    self.store(api);
                }
            }
            return api;
        },
        store: function(popup){
            if (popup.options['group']!=null){
                this.popups[popup.options['group']] = popup;
            }else{
                this.popups[this.index] = popup;
                this.index++;
            }
        },
        messagePopup: function(title,message){
            if (typeof $.gritter == 'undefined'){
                alert(title + "\n" + message);
            }else{
                $.gritter.add({
                    // (string | mandatory) the heading of the notification
                    title: title,
                    // (string | mandatory) the text inside the notification
                    text: message,
                    sticky:false
                });
            }
        },
        ucfirst: function  (str) {
            // http://kevin.vanzonneveld.net
            // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   bugfixed by: Onno Marsman
            // +   improved by: Brett Zamir (http://brett-zamir.me)
            // *     example 1: ucfirst('kevin van zonneveld');
            // *     returns 1: 'Kevin van zonneveld'
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        },
        hasScrollbar:function() {
            var obj = $('html');
            return obj.get(0).scrollHeight > obj.innerHeight();
        },
        scrollbarWidth:function() {
            var parent, child, width;

            if(width===undefined) {
                parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
                child=parent.children();
                width=child.innerWidth()-child.height(99).innerWidth();
                parent.remove();
            }
            return width;
        }
    };

    var api = {
        hide:function(callback,speed,method){
            if ($(this).data('jqpApi')){
                $(this).data('jqpApi').hide(callback,speed,method);
                delete $(this).data('jqpApi');
                $(this).data('jqpApi',null);
            }
        },
        resize: function(){
            var api = $(this).data('jqpApi');
            api.resize();
        }
    };

    $.fn.jQueryPopup = function(method) {
        if ( api[method] ) {
            return api[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.jQueryPopup' );
        }
    };


    $.fn.jQueryPopup.options = {
        'id':null,
        'fullScreen':false,
        'fullScreenMargin':2,
        'arrowClass':'hasarrow',
        'arrowPositionClass':'top',
        'pos':null, 	// position, available values:
                      // 		l - left
                      // 		lb - leftbottom
                      //		r - right
                      //		rb - rightbottom
                      //		t - top
                      //		tr - top right
                      //		b - bottom
                      //		br - bottom right
        'html':null,
        'text':null,
        'url':'',

        'boxCss':{},
        'bodyCss':{},
        'blockUI':true,
        'buttons':null,

        'class':'',
        'css':{},

        'data':{},

        'group':null, 		// if defined than single instance of popup will be used for each popup with same group

        'showArrow':false,
        'showCloseButton':true,
        'closeButtonText':'Close',
        'offset':{'top':0,'left':0},
        'onCreate':null,
        'onAfterSubmit':null,
        'onBeforeSubmit':null,
        'onBeforeHide':null,
        'onBeforeReady':null,
        'onReady':null,
        'onClose':null,

        'position':{my:'center center',at:'center center',of:'.jQueryPopup-overlay',collision:'fit fit',offset:'0 0'},

        'keepCentered':true,

        'relativeTo':null,

        'title':null,
        'useAnimation':true,
        'animationSpeed':100,
        'trigger':null,

        'messages':{
            'please_wait':'Loading, please wait...',
            'loading':'Loading...'
        },
        'onMouseenter':null,
        'onMouseleave':null,

        'disableHotKeys':false,
        'loading':false,
        'appendTo':'body',
        'height':null,
        'prefix':'',
        'appearanceSpeed':300,
        'appearanceMethod':{
            show:function(){ this.fadeIn.apply(this,arguments); },
            hide:function(){ this.fadeOut.apply(this,arguments); }
        }
    };


    /**
     * reset options.
     * options = {
     * 		pos:'t' // - position, availabel values:
     * 				// 		l - left
     * 				//		r - right
     * 				//		t - top
     * 				//		b - bottom
     * }
     */
    $.fn.jQueryPopupTooltip = function(options){
        $(this).each(function(){
            var obj = new jQueryPopupTooltip($(this),options);
        });

    };
    $.fn.jQueryPopupTooltip.options = {
        keepCentered:false,
        showArrow:true,
        waitBeforeShow:50,
        //arrowPositionClass:'bottom',
        offset:{left:20,top:-12},
        blockUI:false,
        showCloseButton:false,
        triggerEvent: 'hover',
        appearanceSpeed: 100,
        target: null,                    // the element where evenets will be saved
        appearanceMethod: {
            show: function(){
                var args = Array.prototype.slice.call( arguments, 0 );
                if (args[0]==undefined) args[0]=null;
                if (args[1]==undefined) args[1]=null;
                this.fadeTo.call(this,args[0],1,args[1]);
            },
            hide: function(){
                this.fadeOut.apply(this,arguments);
            }
        }
    };

    /**
     * Widget for easily convert static link to ajax link
     */
    $.fn.jQueryPopupContent = function(options){
        $(this).each(function(){
            $(this).on('click',function(){
                var obj = new jQueryPopupContent($(this),options);
                return false;
            });
        });
    }
    $.fn.jQueryPopupContent.options = {
        keepCentered:true,
        showArrow:false,
        blockUI:true,
        showCloseButton:true
    }

})(jQuery);

