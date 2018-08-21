/**
 * 
 * description: 接口api路由
 */
var express = require('express');
var router = express.Router();
var utils=require('../config/utils.js');

//分列列表接口
var formidable = require('formidable'); //异常说明步骤
var xl =require('xlsx');
router.post('/api/data.do', function(req, res, next) {
        //调试阶段   暂时未封装
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
        var workbook =  xl.readFile(files.userfile.path);
        console.log(fields)//文件信息
        console.log(files)//其他一些字段  登陆名称以及登陆ID;
        var excelData=[];//表格中的数据暂时存储的地方
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
                excelData = excelData.concat(xl.utils.sheet_to_json(workbook.Sheets[sheet]));
                console.log("json数据")
                console.log(excelData)
            }
        }
        res.send(excelData);
    })
       
    //问题ID
});
//分列列表接口
module.exports = router;