!function(e,o,t,i){"use strict";var a=function(e){this.msie=/MSIE/.test(navigator.userAgent),this.ie6=/MSIE 6.0/.test(navigator.userAgent)&&!/MSIE 8.0/.test(navigator.userAgent),this.ie45678=!1,this.defaults={overlayCss:{},message:"",beforeCallback:null,afterCallback:null,fadeIn:0,fadeOut:0,overlay:!0,overlayClick:!1,timeout:null},this.options=t.extend({},this.defaults,e)};a.prototype={init:function(){this.create(),this.render(),this.close()},create:function(){var e=this,o='<div class="m-dialog"></div>',i='<div class="overlay"><!--[if IE 6]><iframe class="frame"  src="about:blank" frameborder="0" ></iframe><![endif]--></div>';"Microsoft Internet Explorer"!=navigator.appName||"MSIE6.0"!=navigator.appVersion.split(";")[1].replace(/[ ]/g,"")&&"MSIE7.0"!=navigator.appVersion.split(";")[1].replace(/[ ]/g,"")&&"MSIE8.0"!=navigator.appVersion.split(";")[1].replace(/[ ]/g,"")||(e.ie45678=!0),e.ie45678?"undefined"!=typeof e.options.overlayCss.opacity?e.options.overlayCss.opacity="filter:progid:DXImageTransform.Microsoft.Alpha(Opacity="+parseInt(100*e.options.overlayCss.opacity)+")":e.options.overlayCss.opacity="filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=30)":"undefined"!=typeof e.options.overlayCss.opacity?e.options.overlayCss.opacity="opacity: "+e.options.overlayCss.opacity:e.options.overlayCss.opacity="opacity:0.3 ";var a='<style class="m-style">.m-dialog {position: fixed;_position:absolute; top: 50%; left: 50%; z-index: 8003; display:none;}.overlay { background: black; z-index: 8002;cursor:default;position:absolute;top:0; left:0; width: 100%; height: 100%;'+e.options.overlayCss.opacity+"; cursor: pointer; }.overlay .frame{position:absolute;top:0; left:0; width: 100%; height: 100%;  border:0;z-index:8000; background-color:red;"+e.options.overlayCss.opacity+";}</style>";t("body").append(o),this.options.overlay===!0&&t("body").append(i),0===t(".m-style").size()&&t("body").append(a)},resize:function(){var o=this,i=t(".m-dialog"),a=t(".overlay"),s=i.height(),n=t(e).height(),r=t("body").height();o.ie6?i.css({marginLeft:-i.width()/2,marginTop:s>n?0:t(document).scrollTop()-i.height()/2,top:s>n?0:"50%"}):i.css({marginLeft:-i.width()/2,marginTop:s>n?0:-s/2,top:s>n?0:"50%",position:"fixed"}),a.height(Math.max(r,n))},render:function(){var o,i=this,a=i.options,s=t(".m-dialog"),n=t(".overlay"),r="number"==typeof a.fadeIn?a.fadeIn:0;if(!a.message)throw new Error("请设置弹框内容");"object"==typeof a.message?(o=a.message.children().size()?a.message.children():a.message.html(),s.append(o)):"string"==typeof a.message&&s.html(a.message),i.ie6&&s.css("position","absolute"),t.fn.snfadeIn=function(e,o){return this.animate({opacity:"show"},e,function(){i.msie&&this.style.removeAttribute("filter"),t.isFunction(o)&&o()})},"object"===a.overlayCss&&n.css(a.overlayCss),i.resize(),n.snfadeIn(0,function(){s.fadeIn(r,function(){"function"==typeof a.beforeCallback&&a.beforeCallback(this,a)})}),i.ie6&&t(e).scroll(function(){s.css({marginTop:s.height()>t(e).height()?t(document).scrollTop():t(document).scrollTop()-s.height()/2})}),t(e).resize(function(){i.resize()})},close:function(){function e(){s.fadeOut(r,function(){"object"==typeof a.message&&t(".m-dialog").children().appendTo(a.message),s.remove(),t(".overlay").remove()})}var o,i=this,a=i.options,s=t(".m-dialog"),n=t(".overlay"),r=0;"number"==typeof a.fadeOut&&(r=i.ie45678?0:a.fadeOut),o&&clearTimeout(o),"number"==typeof a.timeout&&(o=setTimeout(function(){e()},a.timeout)),a.overlayClick&&n.on("click",function(){e()}),s.find(".close").on("click",function(){e()}),s.find(".closeCallback").on("click",function(){var e=t(this);s.fadeOut(r,function(){"object"==typeof a.message&&t(".m-dialog").children().appendTo(a.message),s.remove(),n.remove(),"function"==typeof a.afterCallback&&a.afterCallback(e)})}),s.find(".callbackClose").on("click",function(){var o=t(this);"function"==typeof a.afterCallback&&a.afterCallback(o,e)})}},t.mDialog=function(e,o,t){var i=new a(e,o,t);return i.init()}}(window,document,jQuery);