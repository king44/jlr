var router = require('express').Router();
var request = require('request');
var fs = require('fs');
var path = require('path');
var config = require('../config/config');
var util = require('../util/util');
var jssdk = require('../api/jssdk');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();
var url = require("url");
var w_socket = require('../util/ws_util');

var token='';
router.bind = function (weixin) {
    wxrouter = weixin;
}


router.all('/', function (req, res, next) {
    res.status(200).send('api page');
});
router.get('/token', function (req, res, next) {
   /* var filePath = process.cwd()  +'/web/jssdkDemo/index.html';
     res.sendFile(filePath)*/
    res.status(200).send(token);
});
router.get('/info', function (req, res, next) {
    /* var filePath = process.cwd()  +'/web/jssdkDemo/index.html';
      res.sendFile(filePath)*/
    let https = require("https");
    var url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+token+'&openid='+'oJwGGwqSBb3bJ7uL8vJiJ7TvcMWc'+'&lang=zh_CN '

    console.log('url:',url)

    https.get(url, function(res_c) {
            var resData = "";
            res_c.on("data",function(data){
                resData += data;
            });
            res_c.on("end", function() {
                var d = JSON.parse(resData);
                token= d.access_token;
                console.log(resData);
                res.status(200).send(resData);
            });

        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });


});


module.exports = router;

//updateToken();
function updateToken(){


var https = require('https');

https.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx35d626d48bbffcda&secret=b518ace5173e5d1d32a0a81ac080ef32", function(res) {
    var resData = "";
    res.on("data",function(data){
        resData += data;
    });
    res.on("end", function() {
        var d = JSON.parse(resData);
        token= d.access_token;
        console.log(resData)
    });

}).on('error', function(e) {
    console.log("Got error: " + e.message);
});
}