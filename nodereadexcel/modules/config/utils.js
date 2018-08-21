/**
 * author:  lirong on 2017/5/18.
 * description:工具函数
 */
var rq=require('request');
let mainValue = require('./var.js');
/*lirong by 取环境变量内容 ,Version:v1.0 */
let domains=function(){
    const isVal = process.env.NODE_ENV;
    return mainValue(isVal);
}

//异步请求,服务端数据,promise,多个请求
var  requestData=function(){
    var data={};
        var arr = Array.prototype.slice.apply(arguments);
        var dataArr = [];//存放promise对象;


        for (var i = 0; i < arr.length; i++) {

            var p1 = new Promise(function (resolve, reject) {
                rq(arr[i], function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var info = JSON.parse(body);
                        resolve(info);
                    } else {
                        reject("请求数据报错")
                    }
                });
            });
            dataArr[i] = p1;
        }
         data = Promise.all(dataArr).catch(function(err){
             console.error(err);

         });


    return data;
};

//异步请求,服务端数据,promise,单个请求
var  requestOnlyData=function(options){
            var data={},dataArr=[];
        var p1 = new Promise(function (resolve, reject) {
            rq(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if(body.indexOf("callback(")==0){
                        body=body.replace("callback(","");

                        body=body.replace(");","");

                    }
                    var info = JSON.parse(body);
                    resolve(info);
                } else {
                    reject(error)
                }
            });
        });
        dataArr[0] = p1;

    data = Promise.all(dataArr).catch(function(err){
        console.error(err);

    });


    return data;
};
var setContent=function(str,num){
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/\s+|" "|\n/g, ""); //去除行尾空白
    str.length>num?str=str.slice(0,num)+"...":str;
    return str;
}
//cookie数据处理
function getCookie(cookieStr) {

    //将本地cookie转换成数组形式,cookie以“;”结尾

    var list =[];
    if(cookieStr)
        list=cookieStr.split("; ");
    //创建一个空数组对象
    var cookieList = {};
    //然后遍历数组
    for (var i = 0; i < list.length; i++){
        //cookie是由name=value形式存在，所以获取当前=位置
        var pos = list[i].indexOf("=");
        //然后获取=前面的name
        var c_name = list[i].substring(0,pos);
        //获取=后面的value
        var c_value = list[i].substring(pos+1);
        //对其只进行解码
        c_value = decodeURIComponent(escape(c_value));
        //以name=value形式存入数组中
        cookieList[c_name] = c_value;
    }

    return cookieList;

}

exports.domains = domains;
exports.requestData= requestData;
exports.setContent=setContent;
exports.requestOnlyData=requestOnlyData;
exports.getCookie=getCookie;
