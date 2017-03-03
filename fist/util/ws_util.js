/**
 * Created by 04259 on 2017-03-03.
 */
var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8181 });
wss.handel =  function (ws) {

    console.log('client connected');
    ws.on('message', function (message) {
        console.log(message);

    });
    ws.send('x:'+data.msg.nickname+data.msg.city+data.msg.groupid);//需要将对象转成字符串。WebSocket只支持文本和二进制数据
    //console.log("更新", JSON.stringify(stocksObj));
}

wss.start = function () {
    wss.on('connection',wss.handel);
}




module.exports  = wss