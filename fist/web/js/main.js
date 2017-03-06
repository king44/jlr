/**
 * Created by 04259 on 2017-03-06.
 */
var ws = new WebSocket("ws://ec2-54-255-166-71.ap-southeast-1.compute.amazonaws.com:8181");
ws.onopen = function (e) {
    console.log('Connection to server opened');
}
function sendMessage() {
  // ws.send($('#message').val());

}
ws.onmessage = function(event) {
    // console.log('Client received a message',event);
  //  $("#serverInfo").text('Client received a message'+event.data);
    console.log('message--》》'+event.data);
    Reveal.navigateNext()
};