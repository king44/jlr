const express = require('express');
const path = require('path')
const app = express()

var redis = require("redis");
var http = require('http');
var url = require("url");
var routerObj = require('./dataV_router');


app.use(express.static(path.join(__dirname, './web')))


for (var key in routerObj.router){
    /*app.get('/'+key,function (req,res){
        res.writeHead(200, {
            'Content-Type': 'text/plain;charset=utf-8'
        });
        routerObj.router[key](req,res);
        res.end();
    });*/

    app.get('/'+key,function (req,res){
        var pathname = url.parse(req.url).pathname.slice(1);
        res.writeHead(200, {
            'Content-Type': 'text/plain;charset=utf-8'
        });
        routerObj.router[pathname](req,res);
        res.end();
    });
}



app.get('/', function (req, res) {
    res.send('Hello World');
})
/*
app.get('/req_all_wood', function (req, res) {
    var v =  (lc/100*8*2.23- lc/100*9*0.997)/850
    var info = [
        {
            name: "",
            value:  v
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
})*/




/*
app.get('/req_all_wood', function(req,res){

    var v =  (lc/100*8*2.23- lc/100*9*0.997)/850
    var info = [
        {
            name: "",
            value:  v
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
})*/



app.listen(80, () => {
    console.log(`App listening at port 80`)
})
