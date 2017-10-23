var router={}
var lc =424176641;
var day_lc= 2000000;
var o_week_d=[
    {
        "x": "周一",
        "y": 218623
    },
    {
        "x": "周二",
        "y": 208487
    },
    {
        "x": "周三",
        "y": 221600
    },
    {
        "x": "周四",
        "y": 235397
    },
    {
        "x": "周五",
        "y": 230516
    },
    {
        "x": "周六",
        "y": 193968
    },
    {
        "x": "周日",
        "y": 187259
    }
]
getTodayNowPro =function(){


    var today=new Date();
    today.setYear(2017);
    today.setMonth(7);
    today.setDate(26)

    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    var nowTime = Date.now();

    //console.log(((Date.now()-today.getTime())/1000)/86400 )
    var progress = ( ((Date.now()-today.getTime())/1000)   /86400);

    return progress;
}


lc = Math.round(lc+getTodayNowPro()*day_lc);
router.req_all_mileage = function(req,res) {
    var params = url.parse(req.url, true).query;
    var info = [
        {
            name: "",
            value: parseInt(params.lc)
        }
    ]
    lc = Math.round( info[0].value+getTodayNowPro()*day_lc)
    info[0].value =lc ;
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}


//停用

router.req_all_wood = function(req,res){

    var v =  (lc/100*8*2.23- lc/100*9*0.997)/850
    var info = [
        {
            name: "",
            value:  v
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}

router.req_all_tpf = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*8*2.23
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}


router.req_all_du = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*8*0.21
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}

router.req_all_petrol = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*8
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}

router.req_all_petrol_money = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*8*6.12
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}


router.req_week_electricity = function(req,res){

    var week = new Date().getDay();


        if(week ==0 ){

            var a1 = o_week_d.slice(6);
            var a2 = o_week_d.slice(0,6);
        }else if (week ==1 ){
            var a1 = o_week_d.slice(0);
            var a2 =[]
        }else{
            var a1 = o_week_d.slice(week - 1);
            var a2 = o_week_d.slice(0,week - 1);
        }
        var info = a1.concat(a2)
        JSON.stringify(info)
        res.write(JSON.stringify(info))
    }







////////////////////////////////////////////////

/*

 */
router.req_all_electricity = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*9
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}






router.req_zd_all_tpf = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*9*0.997
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}



router.req_all_electricity_money = function(req,res){
    var info = [
        {
            name: "",
            value:   lc/100*9.8*0.6
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}












//////////////////////






router.req_all_tpf_d = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*8*2.23/1000
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}


router.req_all_du_d = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*8*0.21/1000
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}

router.req_all_petrol_w = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*8/10000
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}

router.req_all_petrol_money_w = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*8*6.12/10000
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}


router.req_all_electricity_w = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*9/10000
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}






router.req_zd_all_tpf_d = function(req,res){
    var info = [
        {
            name: "",
            value:  lc/100*9*0.997/1000
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}



router.req_all_electricity_money_w = function(req,res){
    var info = [
        {
            name: "",
            value:   lc/100*9.8*0.6/10000
        }
    ]
    JSON.stringify(info)
    res.write(JSON.stringify(info));
}


exports.router = router;