var sign = require('./sign.js');

console.log(sign('jinliren', 'http://ec2-54-255-229-26.ap-southeast-1.compute.amazonaws.com'));
/*
 *something like this
 *{
 *  jsapi_ticket: 'jsapi_ticket',
 *  nonceStr: '82zklqj7ycoywrk',
 *  timestamp: '1415171822',
 *  url: 'http://example.com',
 *  signature: '1316ed92e0827786cfda3ae355f33760c4f70c1f'
 *
 *
 *}
 */
