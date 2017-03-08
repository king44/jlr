package com.example.flashlighttest;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.pm.FeatureInfo;
import android.content.pm.PackageManager;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraCaptureSession.StateCallback;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CameraMetadata;
import android.hardware.camera2.CaptureRequest;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.provider.Settings;
import android.util.Log;
import android.util.Size;
import android.view.Surface;
import android.view.View;
import android.widget.TextView;

@SuppressLint({ "NewApi", "HandlerLeak" })
@SuppressWarnings("deprecation")
public class MainActivity extends Activity {

    private final String TAG = MainActivity.class.getName();

    private TextView textView2;
    private Camera camera;
    private boolean isOpenCamera = false;
    
    // camera2 
    private CameraDevice cameraDevice;
    private CaptureRequest i;
    private CameraCaptureSession j = null;
    private SurfaceTexture k;
    private Surface l;
    private CameraManager b;
    private final CameraCaptureSession.StateCallback n = new StateCallback() {
    	
    	public void onConfigured(CameraCaptureSession arg0) {
    		j = arg0;
    		 CaptureRequest.Builder builder;
				try {
					builder = cameraDevice  
					            .createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
	                builder.set(CaptureRequest.FLASH_MODE,  
	                        CameraMetadata.FLASH_MODE_TORCH);  
	                builder.addTarget(l);  
	                CaptureRequest request = builder.build();  
	                j.capture(request, null, null);  
	                i = request;  
				} catch (CameraAccessException e) {
					e.printStackTrace();
				}  
    	};
    	
    	public void onConfigureFailed(CameraCaptureSession arg0) {
    		j = arg0;
    	};
    	
    };

	@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        textView2 = (TextView) findViewById(R.id.textView2);

        camera = Camera.open();
        textView2.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
            	
            	if(!isSupportFlash()) {
            		return;
            	}
            	
            	if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
                    // your code using Camera API here - is between 1-20
            		if (isOpenCamera) {
            			isOpenCamera = false;
            			turnLightOff(camera);
            		} else {
            			isOpenCamera = true;
            			turnLightOn(camera);
            		}
                } else if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    // your code using Camera2 API here - is api 21 or higher
                	if (isOpenCamera) {
            			isOpenCamera = false;
            			cameraDevice.close();
            		} else {
            			isOpenCamera = true;
            			Camera2T();
            		}
                }
            }
        });
	//	Settings.System.putInt(getContentResolver(),android.provider.Settings.System.SCREEN_OFF_TIMEOUT,-1);

		WebSocketConnect client = new WebSocketConnect();
		try {
			client.initSocketClient(this,camera);
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
	}

    
	public void Camera2T() {
    	CameraManager manager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
    	b = manager;
    	try {
    		for (String cameraId : manager.getCameraIdList()) {
    			CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId);
    			System.out.println(cameraId);
    			System.out.println(characteristics);
    			
    			 // We don't use a front facing camera in this sample.
                Integer facing = characteristics.get(CameraCharacteristics.LENS_FACING);
                if (facing != null && facing == CameraCharacteristics.LENS_FACING_FRONT) {
                    continue;
                }
                
                StreamConfigurationMap map = characteristics.get(
                        CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
                if (map == null) {
                    continue;
                }
                
                boolean hasFlash = characteristics.get(CameraCharacteristics.FLASH_INFO_AVAILABLE);

                if (hasFlash) {
					manager.openCamera(cameraId, new CameraDevice.StateCallback() {
						
						@Override
						public void onOpened(CameraDevice camera) {
							cameraDevice = camera;
							
							aa();
							
						}
						
						@Override
						public void onError(CameraDevice camera, int error) {
							cameraDevice = camera;
						}
						
						@Override
						public void onDisconnected(CameraDevice camera) {
							cameraDevice = camera;
						}
					}, handler);
				}
                
    		}
		} catch (CameraAccessException e) {
			e.printStackTrace();
		}
    }
    
	/**
	 * 是否支持闪光灯
	 * 
	 * @return
	 */
	private boolean isSupportFlash() {
		boolean flag = false;
		if (isLOLLIPOP()) {
			CameraManager manager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
	    	b = manager;
	    	try {
	    		for (String cameraId : manager.getCameraIdList()) {
	    			CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId);
	    			System.out.println(cameraId);
	    			System.out.println(characteristics);
	    			
	    			 // We don't use a front facing camera in this sample.
	                Integer facing = characteristics.get(CameraCharacteristics.LENS_FACING);
	                if (facing != null && facing == CameraCharacteristics.LENS_FACING_FRONT) {
	                    continue;
	                }
	                
	                StreamConfigurationMap map = characteristics.get(
	                        CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
	                if (map == null) {
	                    continue;
	                }
	                
	                flag = characteristics.get(CameraCharacteristics.FLASH_INFO_AVAILABLE);
	    		}
	    	} catch (Exception e) {
				e.printStackTrace();
			}
			
		} else {
	    	PackageManager pm= this.getPackageManager();
	    	FeatureInfo[] features=pm.getSystemAvailableFeatures();
	    	for(FeatureInfo f : features) {
	    		if(PackageManager.FEATURE_CAMERA_FLASH.equals(f.name)){ //判断设备是否支持闪光灯
	    			flag = true;
	    		} else {
	    			flag = false;
				}
	    	}
		}
		return flag;
	}
	
	/**
	 * 判断Android系统版本是否 >= LOLLIPOP(API21)
	 * 
	 * @return
	 */
	private boolean isLOLLIPOP() {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
			return true;
		} else {
			return false;
		}
	}
    
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void aa() {
    	this.k = new SurfaceTexture(0, false);
        Size localSize = a(this.cameraDevice.getId());
        this.k.setDefaultBufferSize(localSize.getWidth(), localSize.getHeight());
        this.l = new Surface(this.k);
        ArrayList localArrayList = new ArrayList(1);
        localArrayList.add(this.l);
        try {
			this.cameraDevice.createCaptureSession(localArrayList, this.n, this.c);
		} catch (CameraAccessException e) {
			e.printStackTrace();
		}
    }
    
    
	private Size a(String paramString) {
		Size[] arrayOfSize = null;
		try {
			arrayOfSize = ((StreamConfigurationMap) this.b
					.getCameraCharacteristics(paramString)
					.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP))
					.getOutputSizes(SurfaceTexture.class);
		} catch (CameraAccessException e) {
			e.printStackTrace();
		}
		if ((arrayOfSize == null) || (arrayOfSize.length == 0))
			throw new IllegalStateException("Camera " + paramString
					+ "doesn't support any outputSize.");
		Size localSize = arrayOfSize[0];
		int i1 = arrayOfSize.length;
		int i2 = 0;
		Object localObject1 = localSize;
		Object localObject2 = null;
		if (i2 < i1) {
			localObject2 = arrayOfSize[i2];
			if ((((Size) localObject1).getWidth() < ((Size) localObject2)
					.getWidth())
					|| (((Size) localObject1).getHeight() < ((Size) localObject2)
							.getHeight()))
				return (Size) localObject1;
		}
		while (true) {
			i2++;
			localObject1 = localObject2;
			break;
		}
		return (Size) localObject1;
	}
    
    private Handler handler = new Handler() {
    	
    	@Override
    	public void handleMessage(Message msg) {
    		
    	};
    };
    
    private Handler c = new Handler() {
    	
    	@Override
    	public void handleMessage(Message msg) {
    		
    	};
    };
    
    /**
     * * 通过设置Camera打开闪光灯
     *
     * @param mCamera
     */
    public void turnLightOn(Camera mCamera) {
        Camera.Parameters parameters = mCamera.getParameters();
        if (parameters == null) {
            return;
        }
        List<String> flashModes = parameters.getSupportedFlashModes();
        // Check if camera flash exists
        if (flashModes == null) {
            // Use the screen as a flashlight (next best thing)
            return;
        }
        String flashMode = parameters.getFlashMode();
        Log.i(TAG, "Flash mode: " + flashMode);
        Log.i(TAG, "Flash modes: " + flashModes);
        if (!Camera.Parameters.FLASH_MODE_TORCH.equals(flashMode)) {
            // Turn on the flash
            if (flashModes.contains(Camera.Parameters.FLASH_MODE_TORCH)) {
                parameters.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
                mCamera.setParameters(parameters);
            } else {
            }
        }
    }

    /**
     * 通过设置Camera关闭闪光灯
     *
     * @param mCamera
     */
    public void turnLightOff(Camera mCamera) {
        if (mCamera == null) {
            return;
        }
        Camera.Parameters parameters = mCamera.getParameters();
        if (parameters == null) {
            return;
        }
        List<String> flashModes = parameters.getSupportedFlashModes();
        String flashMode = parameters.getFlashMode();
        // Check if camera flash exists
        if (flashModes == null) {
            return;
        }
        Log.i(TAG, "Flash mode: " + flashMode);
        Log.i(TAG, "Flash modes: " + flashModes);
        if (!Camera.Parameters.FLASH_MODE_OFF.equals(flashMode)) {
            // Turn off the flash
            if (flashModes.contains(Camera.Parameters.FLASH_MODE_OFF)) {
                parameters.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
                mCamera.setParameters(parameters);
            } else {
                Log.e(TAG, "FLASH_MODE_OFF not supported");
            }
        }
    }

}
