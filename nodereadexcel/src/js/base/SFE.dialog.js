/**
 * @Description:
 * @Author: 15071217 .
 * @update 2016/6/12
 */

;(function(WIN, DOC, $, undefined){

    'use strict';

    var Dialog=function(opt){
        this.msie = /MSIE/.test(navigator.userAgent);
        this.ie6 = /MSIE 6.0/.test(navigator.userAgent) && !/MSIE 8.0/.test(navigator.userAgent);
        this.ie45678 = false;


        this.defaults = {
            overlayCss: {},  // 遮罩样式
            message: '',// 如果是从dom中获取弹窗内容，输入selector 或者 string
            beforeCallback: null, //弹窗完全开启之后的callback(this,opts),传出当前弹窗元素this，和此弹窗的opts。
            afterCallback: null, //弹窗完全关闭之后的callback(this,opts),传出当前弹窗元素this，和此弹窗的opts。
            fadeIn: 0,//淡入时间,设为0，取消淡入
            fadeOut: 0, //淡出时间，设为0，取消淡出
            overlay: true,//是否有遮罩
            overlayClick: false,//是否可以点击遮罩关闭弹窗
            timeout: null //自动关闭时间延迟，设置一个number类型的值
        };

        this.options= $.extend({},this.defaults,opt);
    };



    Dialog.prototype={
        init:function(){

            this.create();
            this.render();
            this.close();
            //    添加隐藏



        },
        create:function(){
            var that=this;

            var dialog =
                '<div class="m-dialog"></div>';

            var overlay = '<div class="overlay"><!--[if IE 6]><iframe class="frame"  src="about:blank" frameborder="0" ></iframe><![endif]--></div>';


            if(navigator.appName == "Microsoft Internet Explorer" && (navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE6.0" || navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0"|| navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0"))
            {
                that.ie45678=true;
            }

            if(that.ie45678){ //IE45678浏览器
                if(typeof that.options.overlayCss.opacity!="undefined"){   //如果用户自定义了opts.overlayCss.opacity(比如opacity：0.5）
                    that.options.overlayCss.opacity="filter:progid:DXImageTransform.Microsoft.Alpha(Opacity="+parseInt(that.options.overlayCss.opacity*100)+")";
                }else{   //默认
                    that.options.overlayCss.opacity="filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=30)";
                }
            }else{  //非IE45678浏览器
                if(typeof that.options.overlayCss.opacity!="undefined"){
                    that.options.overlayCss.opacity="opacity: "+that.options.overlayCss.opacity; //用户自定义
                }else{
                    that.options.overlayCss.opacity="opacity:0.3 "; //默认
                }
            }

            var style  =
                '<style class="m-style">' +
                '.m-dialog {position: fixed;_position:absolute; top: 50%; left: 50%; z-index: 8003; display:none;}' +
                '.overlay { background: black; z-index: 8002;cursor:default;position:absolute;top:0; left:0; width: 100%; height: 100%;'+that.options.overlayCss.opacity+'; cursor: pointer; }' +
                '.overlay .frame{position:absolute;top:0; left:0; width: 100%; height: 100%;  border:0;z-index:8000; background-color:red;'+that.options.overlayCss.opacity+';}'+
                '</style>';

            $('body').append(dialog);

            if (this.options.overlay === true) { //判断是否需要遮罩层
                $('body').append(overlay);
            }

            if ($('.m-style').size() === 0) {
                $('body').append(style);
            };



        },
        resize:function(){
            var that=this;

            var $dialog = $('.m-dialog');
            var $lay = $('.overlay');
            var $m = $dialog.height();
            var $w = $(WIN).height();
            var $b = $('body').height();


            if (that.ie6) {
                $dialog.css({
                    marginLeft: -$dialog.width() / 2,
                    marginTop: ($m > $w ? 0 : ($(document).scrollTop() - $dialog.height() / 2)),
                    top: ($m > $w ? 0 : '50%')
                })
            } else {
                $dialog.css({
                    marginLeft: -$dialog.width() / 2,
                    marginTop: ($m > $w ? 0 : -$m / 2),
                    top: ($m > $w ? 0 : '50%'),
                    position:'fixed'
                })
            }

            $lay.height(Math.max($b, $w));

        },
        render:function(){

            var that=this,store;
            var opts=that.options;
            var $dialog = $('.m-dialog');
            var $lay = $('.overlay');
            var fadeIn = typeof opts.fadeIn == 'number' ? opts.fadeIn : 0;

            if ( !! opts.message ) {
                if (typeof opts.message == 'object') {

                    store = opts.message.children().size() ? opts.message.children() : opts.message.html();
                    $dialog.append(store);

                }else if(typeof opts.message == 'string'){
                    $dialog.html(opts.message);
                }
            }else{
                throw new Error("请设置弹框内容");
                return;

            };



            if (that.ie6) {
                $dialog.css('position','absolute');
            };



            $.fn.snfadeIn = function(speed, callback) {
                return this.animate({
                    opacity: 'show'
                }, speed, function() {
                    if ( !! that.msie) //如果为IE,去除透明度filter属性以及filter的动画,我认为应该修改为 if ( !! ie45678) 更加准确
                        this.style.removeAttribute('filter');
                    if ($.isFunction(callback))
                        callback();
                });
            };




            if (opts.overlayCss === "object") {
                $lay.css(opts.overlayCss);

            }


            that.resize();

            $lay.snfadeIn(0,function(){  //弹框入场效果
                $dialog.fadeIn(fadeIn, function() {
                    if (typeof opts.beforeCallback == 'function') {
                        opts.beforeCallback(this, opts);
                    }
                });
            });


            if (that.ie6) {
                $(WIN).scroll(function() {
                    $dialog.css({
                        marginTop: ($dialog.height() > $(WIN).height() ? $(document).scrollTop() : ($(document).scrollTop() - $dialog.height() / 2))
                    })
                })
            }

            $(WIN).resize(function() {
                that.resize();
            })


        },
        close:function(){
            var that=this,store,timer;
            var opts=that.options;
            var $dialog = $('.m-dialog');
            var $lay = $('.overlay');
            var fadeOut = 0;


            if(typeof opts.fadeOut == 'number'){
                if(that.ie45678){
                    fadeOut = 0;
                }else{
                    fadeOut = opts.fadeOut;
                }
            }


            if (timer) {
                clearTimeout(timer);
            }

            // 自动关闭
            if (typeof opts.timeout == "number") {
                timer = setTimeout(function() {
                    removeDialog();
                }, opts.timeout)
            }

            // 点击遮罩关闭
            if ( !! opts.overlayClick) {
                $lay.on('click',function(){

                    removeDialog();
                });
            };


            //绑定关闭事件
            $dialog.find('.close').on('click',function(){


                removeDialog();
            });

            //在关闭后执行回调
            $dialog.find('.closeCallback').on('click',function(){
                var that=$(this);
                $dialog.fadeOut(fadeOut,function(){


                    if (typeof opts.message == 'object') {

                        $(".m-dialog").children().appendTo(opts.message);

                    }
                    $dialog.remove();
                    $lay.remove();
                    if (typeof opts.afterCallback == 'function') {
                        opts.afterCallback(that);
                    }
                });
            });

            //回调后关闭
            $dialog.find('.callbackClose').on('click',function(){
                var that=$(this);
                if (typeof opts.afterCallback == 'function') {
                    opts.afterCallback(that,removeDialog);
                }
            });



            function removeDialog(){
                $dialog.fadeOut(fadeOut,function(){

                    if (typeof opts.message == 'object') {





                        $(".m-dialog").children().appendTo(opts.message);

                    }

                    $dialog.remove();

                    $('.overlay').remove();

                });

            };

        }
    }


    $.mDialog=function(ele,layer,options){
        var newDialog=new Dialog(ele,layer,options);
        return  newDialog.init();
    }


})(window, document, jQuery);






