package flashlighttest.example.com.myapplication3;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Vibrator;
import android.util.Log;
import android.view.SurfaceView;
import android.view.View;
import android.widget.TextView;

import java.net.URISyntaxException;

@SuppressLint({"NewApi", "HandlerLeak"})
@SuppressWarnings("deprecation")
public class MainActivity extends Activity {

    private final String TAG = MainActivity.class.getName();
    private FlashLightUtil flashLightUtil;
    private SurfaceViewShell sShell;
    private TextView mCameraBtn;
    private Vibrator vibrator;
    private static Context context = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mCameraBtn = (TextView) findViewById(R.id.textView2);
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

               /* if(open_tag[0]%3==0){
                   // flashLightUtil.turnLightOn();
                    flashLightUtil.SwitchFlashLight(true);
                }else if(open_tag[0]%3==1){
                   // flashLightUtil.turnLightOff();
                    flashLightUtil.SwitchFlashLight(false);
                }else{
                    sShell.openCamera();
                }*/
                openVibrator();
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

        try {
            WebSocketConnect client = new WebSocketConnect(this, flashLightUtil, sShell);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }



    public void openVibrator(){
        vibrator = (Vibrator)getSystemService(Context.VIBRATOR_SERVICE);
        long [] pattern = {100,1500,100,1500,100}; // 停止 开启 停止 开启
        vibrator.vibrate(pattern,-1);
    }
}
