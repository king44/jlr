$.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx35d626d48bbffcda&secret=b518ace5173e5d1d32a0a81ac080ef32", function(result){
    console.log(result);
    $("#test").text(result)
});


/*

wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wx35d626d48bbffcda', // 必填，公众号的唯一标识
    timestamp:Date.getData() , // 必填，生成签名的时间戳
    nonceStr: 'zhidou', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见附录1
    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});

*/
