


//var maxAge=require('../config/webCache.js');
var utils = require('../../config/utils.js');
var httpUrl = utils.domains().service;
var gcbox=utils.domains();
var setContent=utils.setContent;

function getIndex(req, res, next){
    res.snRender('index', {title:'首页',gcbox:gcbox});      
}
module.exports = getIndex;
