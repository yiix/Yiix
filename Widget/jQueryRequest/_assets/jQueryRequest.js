(function($,undefined){
    var jQueryRequest = function(element, options) {
        return {
            element: element,
            options: options,
            ajaxRequest: null,
            init: function() {
                return this;
            },
            loadAjax: function(callback) {
                var self = this;
                this.element.find('.btn-hide').hide();

                if (this.options.params instanceof Function) {
                    var params = this.options.params.call(this);
                }else{
                    var params = this.options.params;
                }

                params['ajax'] = this.options.id!=null?this.options.id:'1';
                params['i'] = Math.random();
                this.ajaxRequest = jQuery.ajax({
                    type:self.options.method,
                    url:self.options.url,
                    data:params,
                    dataType:self.options.dataType,
                    success:function(d){
                        var data = eval('(' + d + ')');
                        self.popupHandleJsonResponse(data);
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        if (jqXHR.responseText==''){
                            var data = {messages:[],response:jqXHR.status+' '+jqXHR.statusText,js:''}
                        }else{
                            var data = eval('(' + jqXHR.responseText + ')');
                        }
                        self.handleJsonResponse(data);
                    }
                });
            },
            handleJsonResponse: function(data,callback){
                var self = this;

                if (typeof data.messages != 'undefined' ){
                    for (var i in data.messages){
                        self.messagePopup(self.ucfirst(i),data.messages[i].join("<br>"));
                    }
                }

                if (typeof data.scriptFiles !='undefined' && typeof data.cssFiles !='undefined'){
                    self.scriptLoader( data.scriptFiles,data.cssFiles,function(){
                        if (typeof data.js != 'undefined'){
                            eval(data.js);

                            if (callback instanceof Function ){
                                callback.call(self,data);
                            }
                        }
                    });
                }else if (typeof data.js != 'undefined'){
                    eval(data.js);
                    if (callback instanceof Function ){
                        callback.call(self,data);
                    }
                }else{
                    if (callback instanceof Function ){
                        callback.call(self,data);
                    }
                }
            },
            scriptLoader: function(scriptFiles,cssFiles,onComplete){
                $.fn.jQueryAjaxSanitizer(scriptFiles,cssFiles,onComplete);
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
            }
        }.init();
    }
    $.fn.jQueryRequest = function(method) {
        var args = arguments;
        if ((api = $(this).data('jQueryRequest')) && api[method]) {
            return api[method].apply( api, Array.prototype.slice.call( args, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            $(this).each(function(){$(this).data('jQueryRequest',(new jQueryRequest($(this),$.extend({},$.fn.jQueryRequest.defaults,method))));});
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.jQueryRequest' );
        }
    };
    $.fn.jQueryRequest.defaults = {
        url: '',
        method: 'GET',
        dataType: 'text',
        params: {}
    };
})(jQuery);