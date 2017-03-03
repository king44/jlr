/**
 * Created by 04259 on 2017-03-03.
 */
var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8181 });
var links = [];
wss.handel =  function (ws) {

    console.log('client connected');
    ws.on('message', function (message) {
        console.log(message);

    });


    links.push(ws)


    //console.log("更新", JSON.stringify(stocksObj));
}


wss.send_client = function(info){

    for(var i=0;i<links.length;i++){
        var ws = links[i];
        ws.send('x:'+info);//需要将对象转成字符串。WebSocket只支持文本和二进制数据
    }

}

wss.start = function () {
    wss.on('connection',wss.handel);
}




module.exports  = wss