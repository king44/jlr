var router = require('express').Router();
var weixin = require('../api/weixin');
var tianqi = require('../api/tianqi');
var blog = require('../api/blog');

var config = require('../config/config');
var aotuConfig = config.wx_config.aotu;
var keywords = require('../config/keywords');
var mysql_c=require('../util/mysql');
var w_socket = require('../util/ws_util');

w_socket.start();

router.get('/', function(req, res, next) {
  console.log('req----------------11----->>:');
  if (weixin.checkSignature(req)) {
    return res.status(200).send(req.query.echostr);
  }
  return res.render('index', {
    currentTime: new Date()
  });
});

router.post('/', function(req, res) {
  weixin.loop(req, res);
});

router.bindSend = function (resMsg) {
    weixin.sendMsg(resMsg);
}

weixin.token = aotuConfig.token;

weixin.textMsg(function(msg) {
  var msgContent = trim(msg.content);
  var flag = false;
  var resMsg = {
    fromUserName: msg.toUserName,
    toUserName: msg.fromUserName,
    msgType: 'text',
    content: 'TOM在不断的成长，欢迎您给出宝贵的意见，有任何疑问请回复 help 或 bz',
    funcFlag: 0
  };
  console.log('-----keywords.exactKey[msgContent]---',keywords.exactKey[msgContent],msgContent)
  if (!!keywords.exactKey[msgContent]) {
    resMsg.content = keywords.exactKey[msgContent].content;
    w_socket.send_client(keywords.exactKey[msgContent].content+'|'+msg.toUserName+'|'+msg.fromUserName);
    //http://ec2-54-255-166-71.ap-southeast-1.compute.amazonaws.com/api/get_img

    flag = false;
  } else {
      reqBlogs = blog.getAllBlog();
      resMsg = {
          fromUserName: msg.toUserName,
          toUserName: msg.fromUserName,
          msgType: 'news',
          reqBlogs: reqBlogs,
          funcFlag: 0
      };
      flag = true;
    }





  // 去掉前后空格并且转换成大写
  function trim(str) {
    return ("" + str).replace(/^\s+/gi, '').replace(/\s+$/gi, '').toUpperCase();
  }

  function isKeyInStr(str, key) {
    str = trim(str);
    key = trim(key);
    if (str.indexOf(key) !== -1) {
      return true;
    }
    return false;
  }

  if (flag) {
    weixin.sendMsg(resMsg);
  }

});



weixin.eventMsg(function(msg) {
  console.log('event->',msg.toString())
  var flag = false;
  var resMsg = {
    fromUserName: msg.toUserName,
    toUserName: msg.fromUserName,
    msgType: 'text',
    content: '',
    funcFlag: 0
  };
  var eventName = msg.event;
  if (eventName == 'subscribe') {
    resMsg.content = '关注';
    flag = true;
  } else if (eventName == 'unsubscribe') {
    resMsg.content = '取消';
    flag = true;
  } else if (msg.event == 'CLICK') {
    if (msg.eventKey == 'getlocationweather') {
        var d = new Date()
      var dateStr = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
     console.log('----',resMsg.content);
      //  var userDate=  JSON.stringify(data.msg);

      weixin.getUser({
        openId: msg.fromUserName
      }, function(data) {

        if (data.err) {
          resMsg.content = '获取ERROR：' + data.msg;
        } else {
          resMsg.content = JSON.stringify(data.msg);
          console.log('----',resMsg.content,msg.toUserName,msg.fromUserName);
          mysql_c.insertSql('user',msg.toUserName,msg.fromUserName,dateStr,dateStr,data.msg.nickname,data.msg.city,data.msg.groupid);
        }
           var reqBlogs = [];
          reqBlogs = blog.getAllBlog();
          for(var i= 0 ;i<reqBlogs.length;i++){
              reqBlogs[i].url = reqBlogs[i].url +'?openid='+data.msg.openid+'&nickname='+data.msg.nickname;
          }


          var  resMsg2 = {
              fromUserName: msg.toUserName,
              toUserName: msg.fromUserName,
              msgType: 'news',
              reqBlogs: reqBlogs,
              funcFlag: 0
          };
          weixin.sendMsg(resMsg2);
      });



       // weixin.sendMsg(resMsg);
      flag = false;
    } else if (msg.eventKey == 'scancode_push') {

    }
  } else {
    flag = true;
  }
  if (flag) {
    weixin.sendMsg(resMsg);
  }
});

weixin.imageMsg(function(msg) {
  var resMsg = {
    fromUserName: msg.toUserName,
    toUserName: msg.fromUserName,
    msgType: 'image',
    mediaId: msg.mediaId,
    funcFlag: 0
  };
  weixin.sendPicMsg(resMsg);
});

weixin.locationMsg(function(msg) {
  /* { toUserName: 'gh_348a152366bd',
   fromUserName: 'o9jPPv6wx9Q3ZQumaCL2T5L64sBw',
   createTime: '1461072687',
   msgType: 'location',
   locationX: '31.283890',
   locationY: '121.495202',
   scale: '15',
   label: '上海市虹口区',
   msgId: '6275259408149074106' }*/
  var resMsg = {
    fromUserName: msg.toUserName,
    toUserName: msg.fromUserName,
    msgType: 'text',
    content: msg.label,
    funcFlag: 0
  };
  weixin.sendMsg(resMsg);
});

module.exports = router;
