var router = require('express').Router();
var request = require('request');
var fs = require('fs');
var path = require('path');
var config = require('../config/config');
var util = require('../util/util');
var jssdk = require('../api/jssdk');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();
var blog = require('../api/blog');
var url = require("url");
var w_socket = require('../util/ws_util');
router.bind = function (weixin) {
    wxrouter = weixin;
}


router.all('/', function (req, res, next) {
    res.status(200).send('api page');
});
router.get('/jssdkDemo', function (req, res, next) {
    var filePath = process.cwd()  +'/web/jssdkDemo/index.html';
     res.sendFile(filePath)
});
module.exports = router;