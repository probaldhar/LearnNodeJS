/**
 * 
 * description:
 */

// require('uglify-loader!file-loader?name=../public/js/common/[name].[ext]!../common/textArea.js')
// require('uglify-loader!file-loader?name=../public/js/base/[name].[ext]!../base/SFE.dialog.js')
require("../../scss/index.scss");
require("../common/qrcode.js");
$(function(){
var httpUrl=$(".page").attr("data-url");//获取环境变量
var url=httpUrl+"/api/data.do";
var btn = document.getElementById('submit');
var fileInputElement = document.getElementById('fileInputElement');
var bar = document.getElementsByClassName('bar')[0];
var progressBar = document.getElementsByClassName('progressBar')[0];
    // 上传文件函数
    btn.onclick=function(){
        var isIE = /msie/i.test(navigator.userAgent) && !window.opera; //IE情况
        var fileTarget=fileInputElement;
        // 限定上传文件大小和类型
        var fileSize = 0;   
        var filetypes =".xlsx";   
        var filepath = fileTarget.value.substring(fileTarget.value.lastIndexOf("."));//获取文件格式   
        var filemaxsize = 1024*3;//3M 
        var size=0;
        console.dir(filepath);
        if(filepath!=".xlsx"){
            alert("请选择正确的文件格式");
            fileTarget.value =""
            return;
        } 
        //限定文件大小
          //ie8浏览器下的判断
      if (isIE && !fileTarget.files) { 
        var filePath = fileTarget.value; 
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject"); 
        if(!fileSystem.FileExists(filePath)){ 
            alert("附件不存在，请重新输入！"); 
            return false; 
        } 
        var file = fileSystem.GetFile (filePath); 
         size = file.Size / 1024; 
        if(size>filemaxsize){ 
            alert("附件大小不能大于"+filemaxsize/1024+"M！"); 
            var obj = document.getElementById('fileInputElement') ; 
                obj.select(); 
                document.selection.clear(); 
            return false; 
          } 
        } else { 
        //chrome浏览器的文件大小校验
            size = fileTarget.files[0].size / 1024; 
            console.log(size)
            if(size>filemaxsize){ 
                alert("附件大小不能大于"+filemaxsize/1024+"M！"); 
                fileTarget.value =""
                return false; 
            } 
        } 
        if(size<=0){ 
            alert("附件大小不能为0M！"); 
            fileTarget.value =""; 
            return false; 
        } 
        progressBar.style.display = 'block';
        var oMyForm = new FormData();
        oMyForm.append("username", "Groucho");
        oMyForm.append("accountnum", 123456); 
        oMyForm.append("userfile", fileInputElement.files[0]);
        var oReq =null;
         if (window.ActiveXObject) {//如果是IE  
               oReq = new ActiveXObject("Microsoft.XMLHTTP");  
            } else if (window.XMLHttpRequest) {  
               oReq = new XMLHttpRequest(); //实例化一个xmlHttpReg  
            }  
        oReq.open("POST",url);
        // 文件上传过程的回调
        oReq.upload.onprogress = function(e) {
            console.log((e.loaded/e.total)*100+'%')
            bar.style.width = (e.loaded/e.total)*100+'%';
        }
        /**
         *   e.loaded 文件已经上传了的大小
         *   e.total  文件总大小
          e.loaded/e.total)*100+'%'  转化成比例；
         */
        // 文件上传完毕的回调
        oReq.upload.onloadend = function(e) {
            console.log('接收完成'+e.loaded+'/'+e.total);
            setTimeout(function(){
                progressBar.style.display = 'none';
                bar.style.width = 0;
            },1000)
        };
        oReq.onreadystatechange = function() {
            if (oReq.readyState == 4 && (oReq.status == 200 || oReq.status == 304)) {  // 304未修改
                var data=JSON.parse(oReq.responseText);
                //获取返回结果
                console.log(data)
            }
        };
        oReq.send(oMyForm);
    }
// 打印函数
$("#submitpint").live("click",function(){
    var bdhtml=window.document.body.innerHTML;
    var oldstr=window.document.body.innerHTML;
    var prnhtml; 
    var sprnstr="<!--startprint-->"; 
    var eprnstr="<!--endprint-->"; 
    prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17); 
    prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr)); 
    window.document.body.innerHTML=prnhtml; 
    window.print(); 
    document.body.innerHTML = oldstr; 
});
//生成二维码
//$('#output').qrcode("http://www.baidu.com");
//使用table生成
$('#qrcode').qrcode({
    render: "table",
    width: 100,
    height: 100,
    text: "shengcheng er weima"
});
$('#qrcode').qrcode({
    render: "table",
    width: 100,
    height: 100,
    text: "m.suning.com"
});
});
