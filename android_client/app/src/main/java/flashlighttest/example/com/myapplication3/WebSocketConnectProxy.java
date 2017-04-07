package flashlighttest.example.com.myapplication3;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by 04259 on 2017-03-08.
 */
public class WebSocketConnectProxy {
    //WebSocketClient 和 address
    private WebSocketClient mWebSocketClient;
    private String address = "ws://ec2-54-255-229-26.ap-southeast-1.compute.amazonaws.com:8181";
    private Handler mHandler;
    private MainActivity mAct;

    static WebSocketConnectProxy client = null;
    static void createSocketClient(final MainActivity act, final FlashLightUtil futil, final SurfaceViewShell sShell, final Handler handler) {

        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                // task to run goes here
                System.out.println("Hello !!!");
                try {
                    if(client ==null||client.mWebSocketClient == null){
                        WebSocketConnectProxy client = new WebSocketConnectProxy(act,futil,sShell,handler);
                    }
                } catch (URISyntaxException e) {
                    e.printStackTrace();
                }

            }
        };
        Timer timer = new Timer();
        long delay = 0;
        long intevalPeriod = 10 * 1000;
        // schedules the task to be run in an interval
        timer.scheduleAtFixedRate(task, delay,
                intevalPeriod);


    }




    public WebSocketConnectProxy(final MainActivity act, final FlashLightUtil futil, final SurfaceViewShell sShell, Handler handler) throws URISyntaxException {
        mAct= act;
        mHandler = handler;
        if (mWebSocketClient == null) {
            mWebSocketClient = new WebSocketClient(new URI(address)) {
                @Override
                public void onOpen(ServerHandshake serverHandshake) {
//连接成功
                    showInfo("opened connection");
                    updateState("已连接");
                }
                @Override
                public void onMessage(String infos) {
//服务端消息
                    String [] stringArr= infos.split("\\|");
                    String s = stringArr[0];
                    String toUserName =stringArr[1];
                    String fromUserName=stringArr[2];

                    Bundle b = new Bundle();
                    Message msg = new Message();
                    msg.setData(b);
                    b.putString("toUserName",toUserName);
                    b.putString("fromUserName",fromUserName);
                    if(stringArr[1] != null){
                        toUserName = stringArr[1];
                    }
                    if(stringArr[2] != null){
                        fromUserName = stringArr[2];
                    }
                    showInfo("received:" + s +(s == "command_1")+  s.equals("command_1"));

                    s.equals(s.equals("command_1"));
                    if(s.equals("command_1")) {
                        //futil.SwitchFlashLight(true);
                        b.putString("cmd","command_1");
                        mHandler.sendMessage(msg);
                        showInfo("open");
                    }
                    if(s.equals("command_2")) {
                        b.putString("cmd","command_2");
                        mHandler.sendMessage(msg);
                        //futil.SwitchFlashLight(false);

                        mHandler.sendMessage(msg);
                        showInfo("open");
                    }
                    if(s.equals("command_3")) {
                        b.putString("cmd","command_3");

                        msg.setData(b);
                        mHandler.sendMessage(msg);


                        showInfo("open");
                    }



                    if(s.equals("command_5")) {
                        b.putString("cmd","command_5");

                        msg.setData(b);
                        mHandler.sendMessage(msg);

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

                    updateState("连接已中断");
                }


                @Override
                public void onError(Exception e) {
                    showInfo("error:" + e);

                    updateState("连接错误:"+e);

                }
            };


            try {
                mWebSocketClient.connectBlocking();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }


        }
    }

    private void updateState(String info ){
        Message msg = new Message();
        Bundle b = new Bundle();
        b.putString("info", info);

        msg.setData(b);

        //msg.what = COMPLETED;
        //handler.sendMessage(msg);
        mHandler.sendMessage(msg);
        // mStateInfoTxt.setText(info);
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
