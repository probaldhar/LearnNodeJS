//var maxAge=require('../config/webCache.js');
var utils = require('../../config/utils.js');

function getSindex(req, res, next){
     res.snRender('sindex', {
                title:'首页'
      });

}

module.exports = getSindex;
