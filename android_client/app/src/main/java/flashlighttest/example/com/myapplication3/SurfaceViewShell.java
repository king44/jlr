package flashlighttest.example.com.myapplication3;

import android.app.Activity;
import android.content.res.Configuration;
import android.graphics.*;
import android.hardware.Camera;
import android.hardware.camera2.*;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * Created by 04259 on 2017-03-16.
 */
public class SurfaceViewShell implements SurfaceHolder.Callback {


    private SurfaceHolder surfaceholder;
    private Camera mCamera;
    // camera2
    private CameraDevice mCameraDevice;



    private SurfaceView mSurfaceView;


    public SurfaceViewShell(SurfaceView viewById) {
        mSurfaceView = viewById;
        SurfaceHolder surfaceholder = mSurfaceView.getHolder();
        surfaceholder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
        surfaceholder.addCallback(this);

    }


    public void releaseCamera(){
       // mCamera.stopPreview();
        mCamera.release();
    }

    public void openCamera(){
        //mCamera = Camera.open();
        surfaceholder = mSurfaceView.getHolder();
        surfaceholder.addCallback(this);
        startOpen(surfaceholder);
    }
    private void startOpen(SurfaceHolder holder){
        System.out.println("surfacecreated");
        //获取camera对象
        mCamera = Camera.open();
        try {
            //设置预览监听
            mCamera.setPreviewDisplay(holder);
            Camera.Parameters parameters = mCamera.getParameters();

            if (mSurfaceView.getResources().getConfiguration().orientation
                    != Configuration.ORIENTATION_LANDSCAPE) {
                parameters.set("orientation", "portrait");
                mCamera.setDisplayOrientation(90);
                parameters.setRotation(90);
            } else {
                parameters.set("orientation", "landscape");
                mCamera.setDisplayOrientation(0);
                parameters.setRotation(0);
            }
            mCamera.setParameters(parameters);
            //启动摄像头预览
            mCamera.startPreview();
            System.out.println("mCamera.startpreview");

        } catch (IOException e) {
            e.printStackTrace();
            mCamera.release();
            System.out.println("mCamera.release");
        }
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        startOpen(holder);

    }

    @Override
    public void surfaceChanged(SurfaceHolder arg0, int arg1, int arg2, int arg3) {
        System.out.println("surfacechanged");
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder arg0) {
        System.out.println("surfaceDestroyed");
        if (mCamera != null) {
            mCamera.stopPreview();
            mCamera.release();
        }
    }

    public Bitmap takeScreenShot( final String toUserName, final String fromUserName) {

        mCamera.setPreviewCallback(new Camera.PreviewCallback(){

            @Override
            public void onPreviewFrame(byte[] data, Camera camera) {
                Camera.Size size = camera.getParameters().getPictureSize();
                try{
                    YuvImage image = new YuvImage(data, ImageFormat.NV21, size.width, size.height, null);
                    if(image!=null){
                        camera.setPreviewCallback(null);
                        Camera.Parameters parameters = camera.getParameters();
                        int width = parameters.getPreviewSize().width;
                        int height = parameters.getPreviewSize().height;

                        YuvImage yuv = new YuvImage(data, parameters.getPreviewFormat(), width, height, null);

                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        yuv.compressToJpeg(new Rect(0, 0, width, height), 40, out);

                        byte[] bytes = out.toByteArray();
                        final Bitmap bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
                        UpLoadImg upImg = new UpLoadImg();
                        upImg.startUp(bmp,toUserName,fromUserName);
                    }
                }catch(Exception ex){
                    Log.e("Sys","Error:"+ex.getMessage());
                }

            }
        });

        return null;
    }
}
