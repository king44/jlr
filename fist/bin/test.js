var express = require('express');
var app = express();
//接着，我们可以使用app.动词()定义路由。
//比如使用"GET /"响应"Hello World"字符串，因为res、req都是Node提供的准确的对象，因此你可以调用res.pipe()
//或req.on('data', callback)或者其它。
//app.get('/hello.txt', function(req, res){
//    var body = 'Hello World';
//    res.setHeader('Content-Type', 'text/plain');
//    res.setHeader('Content-Length', body.length);
//    res.end(body);
//});

//ExpressJS框架提供了更高层的方法，比如res.send()，它可以省去诸如添加Content-Length之类的事情。如下：
//处理GET请求
//http://127.0.0.1:8080/hello/?name=wujintao&email=cino.wu@gmail.com

var chexinzhanbi = '[{"x":"D2S","y":2000},{"x":"D1","y":7564},{"x":"D2","y":5916}]';
var xiaoshouTop = '[{"销售商":"湖南高翔电动汽车股份有限公司","销售金额":987658158},{"销售商":"天津中远汽车贸易有限公司","销售金额":87651500},{"销售商":"河南四海盛景汽车销售服务有限公司","销售金额":76581100},{"销售商":"山西老兵新能源有限公司","销售金额":65815100},{"销售商":"北京合太仕新能源汽车有限公司","销售金额":36581100},{"销售商":"临沂富民汽车销售服务有限公司","销售金额":28151500},{"销售商":"深圳车仆知豆新能源汽车销售有限公司","销售金额":8151100},{"销售商":"重庆寰泰汽车销售有限公司","销售金额":81115400},{"销售商":"杭州电动汽车实业发展有限公司","销售金额":81515400}]';
var xiaoshoue = '[{"value":123456789}]';
var quyuxiaoshou = '[{"x":"华北地区","y":2325},{"x":"东北地区","y":3422},{"x":"中南地区","y":1422},{"x":"华东地区","y":7422},{"x":"西南地区","y":2422},{"x":"西北地区","y":1422}]';
var gukefenxi = '[{"x":"18-25","y":80,"r":10,"s":"1"},{"x":"18-25","y":11,"r":5,"s":"2"},{"x":"25-30","y":22,"r":5,"s":"1"},{"x":"25-30","y":32,"r":5,"s":"2"},{"x":"30-40","y":55,"r":5,"s":"1"},{"x":"30-40","y":22,"r":5,"s":"2"},{"x":"40-50","y":55,"r":5,"s":"1"},{"x":"40-50","y":22,"r":5,"s":"2"},{"x":"50-60","y":55,"r":5,"s":"1"},{"x":"50-60","y":22,"r":5,"s":"2"},{"x":"60以上","y":55,"r":5,"s":"1"},{"x":"60以上","y":22,"r":5,"s":"2"}]';

app.get('/chexinzhanbi/*', function (req, res) {
    res.send(chexinzhanbi);
});

app.get('/xiaoshouTop/*', function (req, res) {
    res.send(xiaoshouTop);
});

app.get('/xiaoshoue/*', function (req, res) {
    res.send(xiaoshoue);
});

app.get('/quyuxiaoshou/*', function (req, res) {
    res.send(quyuxiaoshou);
});

app.get('/gukefenxi/*', function (req, res) {
    res.send(gukefenxi);
});
//以上表示凡是url能够匹配/hello/*的GET请求，服务器都将向客户端发送字符串“Hello World"

//app.get('/', function(req, res){
// res.render('index', {
//    title: 'Express'
//  });
//});
//上面的代码意思是，get请求根目录则调用views文件夹中的index模板，并且传入参数title为“Express”，这个title就可以在模板文件中直接使用。


//现在可以绑定和监听端口了，调用app.listen()方法，接收同样的参数，比如：
app.listen(8888);
console.log('Listening on port 8888');