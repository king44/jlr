package flashlighttest.example.com.myapplication3;

import android.app.AlertDialog;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Message;
import android.util.Log;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

/**
 * Created by 04259 on 2017-03-14.
 */
public class UpLoadImg {
    private String CMD_5 = "upload_Location";
    private String CMD_3="upload_img";
    private String actionUrl ="http://ec2-54-255-229-26.ap-southeast-1.compute.amazonaws.com:80/api/";
    private String newName = "abcdef";

    public void startUpLocation(final LocationManager lm, final String toUserName, final String fromUserName){

        List<String> providers = lm.getProviders(true);
        Location l = null;
        double longitude = 0;
        double latitude =0;
        for (int i=providers.size()-1; i>=0; i--) {
            l = lm.getLastKnownLocation(providers.get(i));
            if (l != null){
                System.out.print("aa");
                longitude = l.getLongitude();
                latitude = l.getLatitude();
                break;
            }
        }


        final double finalLongitude = longitude;
        final double finalLatitude = latitude;
        Runnable networkTask = new Runnable() {

            @Override
            public void run() {
                // TODO


                uploadLocation(finalLongitude, finalLatitude,  toUserName,   fromUserName);
            }
        };

        new Thread(networkTask).start();


    }



    public void uploadLocation(double longitude, double latitude, String toUserName, String fromUserName) {
        String end = "\r\n";
        String twoHyphens = "--";
        String boundary = "*****";
        try {
            URL url = new URL(actionUrl+CMD_5);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
                         /* 允许Input、Output，不使用Cache */
            con.setDoInput(true);
            con.setDoOutput(true);
            con.setUseCaches(false);
                         /* 设置传送的method=POST */
            con.setRequestMethod("POST");
                         /* setRequestProperty */
            con.setRequestProperty("Connection", "Keep-Alive");
            con.setRequestProperty("Charset", "UTF-8");
            con.setRequestProperty("Content-Type", "multipart/form-data;boundary=" + boundary);
            //     con.setRequestProperty("toUserName",toUserName);
            //     con.setRequestProperty("fromUserName",fromUserName);
                         /* 设置DataOutputStream */
            DataOutputStream ds = new DataOutputStream(con.getOutputStream());
            ds.writeBytes(twoHyphens + boundary + end);
            ds.writeBytes("Content-Disposition: form-data; " + "name=\"file\";filename=\"" + toUserName+"&"+fromUserName+"&"+longitude+"&"+latitude + "\"" + end);
            ds.writeBytes(end);
                         /* 取得文件的FileInputStream */


                         /* 将Response显示于Dialog */
            showDialog("上传成功" );
                         /* 关闭DataOutputStream */
            ds.close();
        } catch (Exception e) {
            showDialog("上传失败" + e);
        }
    }


    public void startUp(final Bitmap bmp, final String toUserName, final String fromUserName){


        Runnable networkTask = new Runnable() {

            @Override
            public void run() {
                // TODO
                // 在这里进行 http request.网络请求相关操作
               /* Message msg = new Message();
                Bundle data = new Bundle();
                data.putString("value", "请求结果");
                msg.setData(data);*/
              //  handler.sendMessage(msg);
                uploadFile(bmp,toUserName,fromUserName);
            }
        };

        new Thread(networkTask).start();
    }

    public void uploadFile(Bitmap bmp,String toUserName,String fromUserName) {
        String end = "\r\n";
        String twoHyphens = "--";
        String boundary = "*****";
        try {
            URL url = new URL(actionUrl+CMD_3);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
                         /* 允许Input、Output，不使用Cache */
            con.setDoInput(true);
            con.setDoOutput(true);
            con.setUseCaches(false);
                         /* 设置传送的method=POST */
            con.setRequestMethod("POST");
                         /* setRequestProperty */
            con.setRequestProperty("Connection", "Keep-Alive");
            con.setRequestProperty("Charset", "UTF-8");
            con.setRequestProperty("Content-Type", "multipart/form-data;boundary=" + boundary);
       //     con.setRequestProperty("toUserName",toUserName);
       //     con.setRequestProperty("fromUserName",fromUserName);
                         /* 设置DataOutputStream */
            DataOutputStream ds = new DataOutputStream(con.getOutputStream());
            ds.writeBytes(twoHyphens + boundary + end);
            ds.writeBytes("Content-Disposition: form-data; " + "name=\"file\";filename=\"" + toUserName+"&"+fromUserName + "\"" + end);
            ds.writeBytes(end);
                         /* 取得文件的FileInputStream */

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            bmp.compress(Bitmap.CompressFormat.PNG, 100, baos);
            InputStream isBm = new ByteArrayInputStream(baos.toByteArray());
            // FileInputStream fStream = new FileInputStream(uploadFile);
                         /* 设置每次写入1024bytes */
            int bufferSize = 1024;
            byte[] buffer = new byte[bufferSize];
            int length = -1;
                         /* 从文件读取数据至缓冲区 */
            while ((length = isBm.read(buffer)) != -1) {
                                 /* 将资料写入DataOutputStream中 */
                ds.write(buffer, 0, length);
            }
            ds.writeBytes(end);
            ds.writeBytes(twoHyphens + boundary + twoHyphens + end);
                         /* close streams */
            isBm.close();
            ds.flush();
                         /* 取得Response内容 */
            InputStream is = con.getInputStream();
            int ch;
            StringBuffer b = new StringBuffer();
            while ((ch = is.read()) != -1) {
                b.append((char) ch);
            }
                         /* 将Response显示于Dialog */
            showDialog("上传成功" + b.toString().trim());
                         /* 关闭DataOutputStream */
            ds.close();
        } catch (Exception e) {
            showDialog("上传失败" + e);
        }
    }

    /* 显示Dialog的method */
    private void showDialog(String mess) {
        Log.d("aaaaaaaaaaaaa",mess);
    }
}
