
/*
 * 公共对象
 * 全局变量配置:
 * domains：各环境接口域名
 */

let mainValue=function(isVal){
    let domains;
    switch (isVal) {
        case "development":
            domains = {
                
            };
            break;
        case 'test':
            domains = {
               
            };

            break;

        case 'prepare':
            domains = {
                
            };
            break;
        case 'preparexg':
            domains = {
               
            };
            break;
        default :
            domains = {
                
            };
            break;

    };

    return domains;
}

module.exports = mainValue

