var redis = require("redis");
var http = require('http');
var url = require("url");
var info = "通过HTTPGet方式成功加入队列";
var info = [
    {
        name: "",
        value: 2853.802584
    }
]
http.createServer(function (req, res) {
    var params = url.parse(req.url, true).query;//解释url参数部分name=zzl&email=zzl@sina.com
    var client = redis.createClient();
    client.lpush("total", params.info);
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=utf-8'
    });
    client.lpop("topnews", function (i, o) {
        console.log(o);//回调，所以info可能没法得到o的值，就被res.write输出了
    })
    client.quit();

    var strs=[];
    strs.push({name:'',value:2222})


    info[0].value = info[0].value+(0.000001*Math.random())

    JSON.stringify(info)
    res.write(JSON.stringify(info));
    res.end();
}).listen(18000);
console.log('Server running at http://127.0.0.1:8000/');