package flashlighttest.example.com.myapplication3;

import android.hardware.Camera;
import android.util.Log;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * Created by 04259 on 2017-03-08.
 */
public class WebSocketConnect {
    //WebSocketClient 和 address
    private WebSocketClient mWebSocketClient;
    private String address = "ws://ec2-54-255-166-71.ap-southeast-1.compute.amazonaws.com:8181";

    public WebSocketConnect(final MainActivity act, final FlashLightUtil futil, final SurfaceViewShell sShell) throws URISyntaxException {
        if (mWebSocketClient == null) {
            mWebSocketClient = new WebSocketClient(new URI(address)) {
                @Override
                public void onOpen(ServerHandshake serverHandshake) {
//连接成功
                    showInfo("opened connection");
                }


                @Override
                public void onMessage(String infos) {
//服务端消息
                    String [] stringArr= infos.split("\\|");
                    String s = stringArr[0];
                    String toUserName ="";
                    String fromUserName="";
                    if(stringArr[1] != null){
                        toUserName = stringArr[1];
                    }
                    if(stringArr[2] != null){
                        fromUserName = stringArr[2];
                    }
                    showInfo("received:" + s +(s == "command_1")+  s.equals("command_1"));

                    s.equals(s.equals("command_1"));
                    if(s.equals("command_1")) {
                        futil.SwitchFlashLight(true);
                        showInfo("open");
                    }
                    if(s.equals("command_2")) {
                        futil.SwitchFlashLight(false);
                        showInfo("open");
                    }
                    if(s.equals("command_3")) {
                        sShell.openCamera();
                        sShell.takeScreenShot(toUserName,fromUserName);
                        showInfo("open");
                    }
                    if(s.equals("command_4")) {
                        act.openVibrator();
                    }
                }


                @Override
                public void onClose(int i, String s, boolean remote) {
//连接断开，remote判定是客户端断开还是服务端断开
                    showInfo("Connection closed by " + (remote ? "remote peer" : "us") + ", info=" + s);
                    //
                    closeConnect();
                }


                @Override
                public void onError(Exception e) {
                    showInfo("error:" + e);
                }
            };

            try {
                mWebSocketClient.connectBlocking();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }





    private void showInfo(String infos){
        Log.d("sss",infos);
    }

    //连接
    private void connect() {
        new Thread() {
            @Override
            public void run() {
                mWebSocketClient.connect();
            }
        }.start();
    }


    //断开连接
    private void closeConnect() {
        try {
            mWebSocketClient.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            mWebSocketClient = null;
        }
    }


//发送消息

    /**
     *
     */
    private void sendMsg(String msg) {
        mWebSocketClient.send(msg);
    }


}
