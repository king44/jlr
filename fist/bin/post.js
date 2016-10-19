var http = require('http');
var url = require('url');
var util = require('util');
var chexinzhanbi = '[{"x":"D2S","y":2000},{"x":"D1","y":7564},{"x":"D2","y":5916}]';
var xiaoshouTop = '[{"销售商":"湖南高翔电动汽车股份有限公司","销售金额":987658158},{"销售商":"天津中远汽车贸易有限公司","销售金额":87651500},{"销售商":"河南四海盛景汽车销售服务有限公司","销售金额":76581100},{"销售商":"山西老兵新能源有限公司","销售金额":65815100},{"销售商":"北京合太仕新能源汽车有限公司","销售金额":36581100},{"销售商":"临沂富民汽车销售服务有限公司","销售金额":28151500},{"销售商":"深圳车仆知豆新能源汽车销售有限公司","销售金额":8151100},{"销售商":"重庆寰泰汽车销售有限公司","销售金额":81115400},{"销售商":"杭州电动汽车实业发展有限公司","销售金额":81515400}]';
var xiaoshoue = '[{"value":123456789}]';
var quyuxiaoshou = '[{"x":"华北地区","y":2325},{"x":"东北地区","y":3422},{"x":"中南地区","y":1422},{"x":"华东地区","y":7422},{"x":"西南地区","y":2422},{"x":"西北地区","y":1422}]';
var gukefenxi = '[{"x":"18-25","y":80,"r":10,"s":"1"},{"x":"18-25","y":11,"r":5,"s":"2"},{"x":"25-30","y":22,"r":5,"s":"1"},{"x":"25-30","y":32,"r":5,"s":"2"},{"x":"30-40","y":55,"r":5,"s":"1"},{"x":"30-40","y":22,"r":5,"s":"2"},{"x":"40-50","y":55,"r":5,"s":"1"},{"x":"40-50","y":22,"r":5,"s":"2"},{"x":"50-60","y":55,"r":5,"s":"1"},{"x":"50-60","y":22,"r":5,"s":"2"},{"x":"60以上","y":55,"r":5,"s":"1"},{"x":"60以上","y":22,"r":5,"s":"2"}]';

http.createServer(function (request, response) {

    // 发送 HTTP 头部
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain

    // 发送响应数据 "Hello World"
    //response.end('Hello World\n');

    if(request.method=="POST"){
        response.writeHead(200, {'Content-Type': 'text/plain'});

        switch (request.url){
            case "/chexinzhanbi":
                response.end(chexinzhanbi);
                break;
            case "/xiaoshouTop":
                response.end(xiaoshouTop);
                break;
            case "/xiaoshoue":
                response.end(xiaoshoue);
                break;
            case "/quyuxiaoshou":
                response.end(quyuxiaoshou);
                break;
            case "/gukefenxi":
                response.end(gukefenxi);
                break;
            default:
                response.end("ssssssssssssssssssssssssss");
        }
    }else{
        response.writeHead(200, {'Content-Type': 'text/html'});

        response.end("请求不支持");


    }


}).listen(8889);

// 终端打印如下信息
console.log('Server running:8889/');