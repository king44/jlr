var router = require('express').Router();
var request = require('request');
var fs = require('fs');

var config = require('../config/config');
var aotuConfig = config.wx_config.aotu;

var util = require('../util/util');

var jssdk = require('../api/jssdk');

var multiparty = require('connect-multiparty')
var multipartMiddleware = multiparty();
var wxrouter = null;
var blog = require('../api/blog');
var url = require("url");
var w_socket = require('../util/ws_util');
//var wx = null;
router.bind = function (weixin) {
    wxrouter = weixin;
}


router.get('/', function (req, res, next) {
    res.status(200).send('api page');
});


router.get('/token', function (req, res, next) {
    util.getToken(aotuConfig, function (result) {
        if (result.err) {
            return res.status(500).send(result.msg);
        }
        return res.status(200).send(result.data);
    });
});

router.get('/menu_list', function (req, res, next) {
    util.getToken(aotuConfig, function (result) {
        if (result.err) {
            return res.status(500).send(result.msg);
        }
        var access_token = result.data.access_token;
        var url = 'https://api.weixin.qq.com/cgi-bin/menu/get?access_token=' + access_token;

        request.get({
            url: url
        }, function (error, response, body) {
            if (!error) {
                return res.status(200).send(JSON.parse(body));
            }
            return res.status(500).send('获取menu_list出错');
        });

    });
});

router.get('/menu_create', function (req, res, next) {
    var key = req.query.key;
    var form = !!key ? aotuConfig[key] : aotuConfig['menu'];
    var url = !!key ? 'https://api.weixin.qq.com/cgi-bin/menu/addconditional?access_token=' : 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=';

    util.getToken(aotuConfig, function (result) {
        if (result.err) {
            return res.status(500).send(result.msg);
        }
        var access_token = result.data.access_token;
        request.post({
            url: url + access_token,
            form: JSON.stringify(form)
        }, function (error, response, body) {
            if (!error) {
                return res.status(200).send(JSON.parse(body));
            }
            return res.status(500).send('创建菜单失败');
        });
    });
});

//发送群发消息
router.post('/send_all_text', function (req, res, next) {
    var content = req.body.msgContent;
    var url = 'https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=';

    util.getToken(aotuConfig, function (result) {
        if (result.err) {
            return res.status(500).send(result.msg);
        }

        var form = {
            "filter": {
                "is_to_all": true
            },
            "text": {
                "content": content
            },
            "msgtype": "text"
        };
        var access_token = result.data.access_token;
        request.post({
            url: url + access_token,
            form: JSON.stringify(form)
        }, function (error, httpResponse, body) {
            if (!error) {
                return res.status(200).send(JSON.parse(body));
            }
            return res.status(500).send('群发消息失败');
        });
    });
});
//查看群发消息状态
router.post('/request_send_all_status', function (req, res, next) {
    var msgId = req.body.msgId;
    var url = 'https://api.weixin.qq.com/cgi-bin/message/mass/get?access_token=';
    util.getToken(aotuConfig, function (result) {
        if (result.err) {
            return res.status(500).send(result.msg);
        }
        var form = {
            "msg_id": msgId
        }

        var access_token = result.data.access_token;
        request.post({
            url: url + access_token,
            form: JSON.stringify(form)
        }, function (error, httpResponse, body) {
            if (!error) {
                return res.status(200).send(JSON.parse(body));
            }

            return res.status(500).send('查看群发消息失败');
        })
    });
});


router.get('/jssdk', function (req, res, next) {
    var url = req.query.url || '';
    //console.log(url);
    if (!!url) {
        new jssdk(url, res, function (data) {
            res.status(200).send({
                url: data.url,
                noncestr: data.noncestr,
                timestamp: data.timestamp,
                signature: data.signature,
                appid: aotuConfig.appid
            });
        });
    } else {
        res.status(200).send('请传入url');
    }
});

/**
 * https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
 * */

router.get('/login', function (req, res, next) {
    var host = req.headers.host;
    var rUrl = encodeURIComponent('http://' + host + '/api/getUserInfo');
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + aotuConfig.appid + '&redirect_uri=' + rUrl + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
    res.redirect(url);
});

//刷新access_token
var refreshUserAccessToken = function (refresh_token) {
    return new Promise(function (resolve, reject) {
        var url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=' + aotuConfig.appid + '&grant_type=refresh_token&refresh_token=' + refresh_token;
        request.get(url, function (err, httpResponse, body) {
            if (err) return reject(err);
            resolve(body);
        });
    });
}

//检验授权凭证
var verificationUserAccessToken = function (access_token, openid) {
    return new Promise(function (resolve, reject) {
        var url = 'https://api.weixin.qq.com/sns/auth?access_token=' + access_token + '&openid=' + openid;
        request.get(url, function (err, httpResponse, body) {
            if (err) return reject(err);
            resolve(body);
        });
    });
}


// https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
router.get('/getUserInfo', function (req, res, next) {
    // console.log(req.query);
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + aotuConfig.appid + '&secret=' + aotuConfig.secret + '&code=' + req.query.code + '&grant_type=authorization_code';
    request.get(url, function (err, httpResponse, body) {
        //res.json(body);
        if (err) return res.send('error');
        var data = JSON.parse(body);
        var access_token = data.access_token;
        var openid = data.openid;
        var userUri = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN';
        request.get(userUri, function (err, httpResponse, body) {
            res.send(body);
        });
    });
});


//获取用户列表
router.get('/getuserlist', function (req, res, next) {
    var nextOpenId = req.query.nextopenid || '';
    util.getToken(aotuConfig, function (result) {
        if (result.err) return res.status(500).send(result.msg);
        var access_token = result.data.access_token;
        var url = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + access_token + '&next_openid=' + nextOpenId;
        request.get(url, function (err, httpResponse, body) {
            if (err) return res.status(500).send(err);
            var datas = JSON.parse(body).data.openid;
            if (datas && datas.length) {
                var openid = datas[0];
                if (openid) {
                    new getUserInfoByOpenid(access_token, openid)
                        .then(function (data) {
                            return res.status(200).send(data);
                        })
                        .catch(function (err) {
                            return res.status(500).send('get user info by openid error:' + err);
                        });
                } else {
                    return res.status(200).send('openid error');
                }
            } else {
                return res.status(200).send('无任何人关注');
            }
        });
    });
});

router.get('/get_img', function (req, res) {
        var pathname = url.parse(req.url).pathname;
        var arg = url.parse(req.url, true).query
        console.log('url:-->', pathname, arg.imgpath);
        fs.readFile(arg.imgpath, 'binary', function (err, file) {
            if (err) {
                console.log(err);
                return;
            } else {
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                res.write(file, 'binary');
                res.end();
            }
        });


    }
)

router.post('/upload_Location', multipartMiddleware, function (req, res) {

    console.log('------zz-------', req.files.file);
    console.log('------zz-------', __dirname);
    var path = req.files.file.path;
    var t_f = req.files.file.originalFilename.split('&');
    var from = t_f[0];
    var to = t_f[1];
    var l_1 = t_f[2];
    var l_2 = t_f[3];
    var msgId = req.body.msgId;
    var resMsg = {
        toUserName: to,
        fromUserName: from,
        msgType: 'location',
        locationX: l_1,
        locationY: l_2,
        scale: '15',
        label: '上海市虹口区',

    }


});
router.post('/dp_pageChange', multipartMiddleware, function (req, res) {

    w_socket.send_client(req.body.op);
    console.log('------dp_pageChange---1----',req.body);
    console.log('------dp_pageChange---2----',req.body.op);
    res.end('success ');

})



router.post('/upload_img', multipartMiddleware, function (req, res) {

    var path = req.files.file.path;
    var t_f = req.files.file.originalFilename.split('&');
    var from = t_f[0];
    var to = t_f[1];

    console.log('------00-------', to, from);
    var source = fs.createReadStream(path);
    var time = Math.round(new Date().getTime() / 1000);
    var path = '/home/ubuntu/home/git/jlr/fist/upload_img/' + time + '_img.png';
    var dest = fs.createWriteStream(path);

    source.pipe(dest);
    source.on('error', function (err) {
        console.log(err)
    })


    /* var resMsg = {
     fromUserName: from,
     toUserName: to,
     msgType: 'image',
     url: 'http://ec2-54-255-229-26.ap-southeast-1.compute.amazonaws.com/api/get_img',
     mediaId: 0
     };*/
    //
    reqBlogs = [{
        title: 'king',
        description: 'aaaaaa',
        picUrl: 'http://ec2-54-255-229-26.ap-southeast-1.compute.amazonaws.com/api/get_img' + '?imgpath=' + path,
        url: 'http://ec2-54-255-229-26.ap-southeast-1.compute.amazonaws.com/api/get_img' + '?imgpath=' + path,
        date: time,
        index: 0
    }];//blog.getAllBlog();


    resMsg = {
        fromUserName: from,
        toUserName: to,
        msgType: 'news',
        reqBlogs: reqBlogs,
        funcFlag: 0
    };
    console.log('send_wx_start---->>')
    wxrouter.bindSend(resMsg);
    res.end('success ');
    ///router.mergeParams
    // weixin.sendPicMsg(resMsg);
    /*
     var postdata='';
     req.addListener("data",function(postchunk){
     postdata+=postchunk;
     });
     //获取到了POST数据
     req.addListener("end",function(){


     var imgData = req.body.imgData;

     var base64Data = postdata.replace(/^data:image\/\w+;base64,/, "");

     var dataBuffer = new Buffer(postdata, 'base64');

     fs.writeFile("image.png", dataBuffer, function(err) {

     if(err){
     res.send(err);
     }else{
     res.send("保存成功！");



     }
     });
     res.end('success ');
     })*/
    ;
});
//获取用户信息
var getUserInfoByOpenid = function (access_token, openid) {
    return new Promise(function (resolve, reject) {
        var url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN';
        request.get(url, function (err, httpResponse, body) {
            if (err) return reject(err);
            resolve(body);
        });
    });
}


module.exports = router;
