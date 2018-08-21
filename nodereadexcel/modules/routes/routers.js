var express = require('express');
var router = express.Router();
var utils = require('../config/utils.js');
var promiss = require('../middware/nopromission.js');
var getIndex = require('../controllers/frontend/index.js');
var getSindex = require('../controllers/frontend/sindex.js');


/* 首页. */

router.get(['/', '/index.html'], function (req, res, next) {
    getIndex(req, res, next);
});

module.exports = router;

