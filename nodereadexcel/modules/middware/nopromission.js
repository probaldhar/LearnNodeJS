/**
 * 
 * description:登录拦截,passport==>promission,mpassport==>mpromission
 */

var utils=require('../config/utils.js');
var domain=utils.domains();
// 读取每个页面用到分类列表的内容数据
module.exports.promission = function (req, res, next) {
    var passportUrl=domain.loginstatus;
    var redirectLogin=domain.passport + "/ids/login?service=" + encodeURIComponent(domain.sslDomain+"?targetUrl="+req.protocol+"://"+req.headers.host+req.url)+"&method=GET&loginTheme=b2c";
    var cookieArray=utils.getCookie(req.headers.cookie);
    var cookieString="";
    if(cookieArray["authId"])
    {
        cookieString+="authId="+cookieArray["authId"];
    }
    if(cookieArray["TGC"]){
        cookieString+=";TGC="+cookieArray["TGC"];
    }
    var optionsAll = {
        url: passportUrl,
        headers: {
            'User-Agent': 'request',
             "Cookie":cookieString
        },
        jar: true,
        json: false // Automatically parses the JSON string in the response
    };
    utils.requestOnlyData(optionsAll).then(function (result) {
        if(result){

            if(!result[0].hasLogin){
                //没有登录进行302跳转
               res.redirect(302,redirectLogin);
               res.end();
            }
            else{
                //已经登录
                res.locals.custno=result[0].principal;
               return next();
            }
        }
        else{

            console.log("passport判断登录状态获取数据出现异常,重定向,此问题出现后直接302到登录页面");
            res.redirect(302,redirectLogin);
            res.end();
            //return next();
        }

    }).catch((error) => {

        console.log("passport判断登录状态接口链接失败,此问题出现后直接302到登录页面");
        res.redirect(302,redirectLogin);
        res.end();
    });


}
//mpassport,商户平台判断登录状态
module.exports.mpromission=function (req, res, next) {
        var passportUrl=domain.mloginstatus;
        var redirectLogin=domain.mpassport + "/ids/login?service=" + encodeURIComponent(domain.msslDomain+"?targetUrl="+req.protocol+"://"+req.headers.host+req.url)+"&loginTheme=sop";
        var cookieArray=utils.getCookie(req.headers.cookie);
        var cookieString="";
        if(cookieArray["sopAuthId"])
        {
            cookieString+="sopAuthId="+cookieArray["sopAuthId"];
        }
        if(cookieArray["sopTGC"]){
            cookieString+=";sopTGC="+cookieArray["sopTGC"];
        }
        var optionsAll = {
            url: passportUrl,
            headers: {
                'User-Agent': 'request',
                "Cookie":cookieString
            },
            jar: true,
            json: false // Automatically parses the JSON string in the response
        };
        utils.requestOnlyData(optionsAll).then(function (result) {
            if(result){

                if(!result[0].hasLogin){
                    //没有登录进行302跳转
                    res.redirect(302,redirectLogin);
                    res.end();
                }
                else{
                    //已经登录
                    res.locals.custno=result[0].principal;
                    return next();
                }
            }
            else{
                console.log("mpassport判断登录状态获取数据出现异常,重定向,,此问题出现后直接302到登录页面");
                //return next();
                res.redirect(302,redirectLogin);
                res.end();
            }

        }).catch((error) => {
            //res.redirect(302,redirectLogin);
            //res.end();
            console.log("mpassport判断登录状态接口链接失败,此问题出现后直接302到登录页面");
            res.redirect(302,redirectLogin);
            res.end();
        });


    }


