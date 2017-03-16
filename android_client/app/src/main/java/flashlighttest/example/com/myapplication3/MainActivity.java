package flashlighttest.example.com.myapplication3;

import java.io.*;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.pm.FeatureInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.*;
import android.hardware.Camera;
import android.hardware.camera2.*;
import android.hardware.camera2.CameraCaptureSession.StateCallback;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.os.*;
import android.util.Log;
import android.util.Size;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.TextView;

@SuppressLint({ "NewApi", "HandlerLeak" })
@SuppressWarnings("deprecation")
public class MainActivity extends Activity  implements SurfaceHolder.Callback{

	private final String TAG = MainActivity.class.getName();

	private TextView mCameraBtn;
	private Camera mCamera;
	private boolean isOpenCamera = false;

	// camera2
	private CameraDevice mCameraDevice;
	private CaptureRequest i;
	private CameraCaptureSession j = null;
	private SurfaceTexture k;
	private Surface l;
	private CameraManager b;

	private static Context context = null;
	private static SurfaceView surfaceview;
	private SurfaceHolder surfaceholder;

	private void getPreViewImage() {
		//Size size = new Size();

	}
	@Override
	public void surfaceCreated(SurfaceHolder holder) {
		System.out.println("surfacecreated");
		//获取camera对象
		//mCamera = Camera.open();
		try {
			//设置预览监听
			mCamera.setPreviewDisplay(holder);
			Camera.Parameters parameters = mCamera.getParameters();

			if (this.getResources().getConfiguration().orientation
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

	private final CameraCaptureSession.StateCallback n = new StateCallback() {

		public void onConfigured(CameraCaptureSession arg0) {
			j = arg0;
			CaptureRequest.Builder builder;
			try {
				builder = mCameraDevice
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
		mCameraBtn = (TextView) findViewById(R.id.textView2);
		context = this;
		///////////////////////
		final  int REQUEST_CODE_ASK_PERMISSIONS = 123;//权限请求码

		try {
			int hasWriteContactsPermission =this.checkSelfPermission(Manifest.permission.CAMERA);//权限检查
			if (hasWriteContactsPermission != PackageManager.PERMISSION_GRANTED) {
				requestPermissions(new String[] {Manifest.permission.CAMERA},
						REQUEST_CODE_ASK_PERMISSIONS);
				return;//没有权限，结束
			}else {
				Log.d("aaaaaaaaaaaaa","bbbbbbbbbbbbbbbb");
				//做自己的操作
			}
		} catch (Exception e) {
			e.printStackTrace();
			//ToastUtil.defaultToast(getContext().getApplicationContext(), "权限异常");
		}

		////////////////////////




		mCamera = Camera.open();
		openCamerMovie();

		mCameraBtn.setOnClickListener(new View.OnClickListener() {

			@Override
			public void onClick(View view) {
				//takeScreenShot((Activity) context);
				if(!isSupportFlash() || true) {
					//getPreViewImage();
				//	mCamera.release();
					return;
				}

				if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
					// your code using Camera API here - is between 1-20

					if (isOpenCamera) {
						isOpenCamera = false;
						turnLightOff(mCamera);

					} else {
						isOpenCamera = true;
						turnLightOn(mCamera);

					}
				} else if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
					// your code using Camera2 API here - is api 21 or higher
					if (isOpenCamera) {
						isOpenCamera = false;
						mCameraDevice.close();

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
			client.initSocketClient(this, mCamera);
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
	}

	public void closeCamerMovie(){
		surfaceview = (SurfaceView)findViewById(R.id.surfaceview);
		//surfaceholder = surfaceview.getHolder();
		//surfaceholder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
		//surfaceholder.addCallback(MainActivity.this);

		surfaceholder.removeCallback(MainActivity.this);
	}
	public Bitmap takeScreenShot(Activity act, final String toUserName, final String fromUserName) {
		if (act == null || act.isFinishing()) {
			return null;
		}
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
						yuv.compressToJpeg(new Rect(0, 0, width, height), 20, out);

						byte[] bytes = out.toByteArray();
						final Bitmap bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);


						/*String dataFileDir= context.getExternalCacheDir().getPath();//Environment.getExternalStorageDirectory().getAbsolutePath();//context.getFilesDir().getPath();
						File file=new File(dataFileDir+"/01.jpg");//将要保存图片的路径
						try {
							BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file));
							bmp.compress(Bitmap.CompressFormat.JPEG, 100, bos);

							//////
							*//*int be = 2;
							BitmapFactory.Options newOpts =  new  BitmapFactory.Options();
						    newOpts.inJustDecodeBounds =  true ;
						    Bitmap bitmap = BitmapFactory.decodeFile(path,newOpts);
						    newOpts.inJustDecodeBounds =  false ;
						    int  w = newOpts.outWidth;
						    int  h = newOpts.outHeight;
						    //计算出取样率
						    newOpts.inSampleSize = be;
						    bitmap = BitmapFactory.decodeFile(srcPath, newOpts);*//*
							/////
							bos.flush();
							bos.close();
						} catch (IOException e) {
							e.printStackTrace();
						}*/


						UpLoadImg upImg = new UpLoadImg();
						upImg.startUp(bmp,toUserName,fromUserName);

					}
				}catch(Exception ex){
					Log.e("Sys","Error:"+ex.getMessage());
				}

			}
		});

		return null;
		// 获取当前视图的view
		//surfaceview.get
		//Bitmap bitmap = Bitmap.createBitmap(surfaceview.getWidth(), surfaceview.getHeight(), Bitmap.Config.ARGB_8888);
		//Canvas canvas = surfaceview.getHolder().lockCanvas(new Rect(0,0,100,100));//new Canvas(bitmap);
		//surfaceview.getHolder().unlockCanvasAndPost(canvas);
		//canvas.setBitmap(bitmap);
		/*View scrView = surfaceview;//act.getWindow().getDecorView();
		scrView.setDrawingCacheEnabled(true);
		scrView.buildDrawingCache(true);

		// 获取状态栏高度
		Rect statuBarRect = new Rect();
		scrView.getWindowVisibleDisplayFrame(statuBarRect);
		int statusBarHeight = statuBarRect.top;
		int width = act.getWindowManager().getDefaultDisplay().getWidth();
		int height = act.getWindowManager().getDefaultDisplay().getHeight();

		Bitmap scrBmp = null;
		try {
			// 去掉标题栏的截图
			//scrBmp = Bitmap.createBitmap( scrView.getDrawingCache(), 0,0,scrView);
		} catch (IllegalArgumentException e) {
			Log.d("", "#### 旋转屏幕导致去掉状态栏失败");
		}
		scrView.setDrawingCacheEnabled(false);
		scrView.destroyDrawingCache();
		UpLoadImg upImg = new UpLoadImg();
		upImg.startUp(scrBmp);
		return scrBmp;*/
	}


	public void openCamerMovie(){
		surfaceview = (SurfaceView)findViewById(R.id.surfaceview);
		surfaceholder = surfaceview.getHolder();
		surfaceholder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
		surfaceholder.addCallback(MainActivity.this);
	}

	public void Camera2T() {
		CameraManager manager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
		b = manager;
		try {
			for (String cameraId : manager.getCameraIdList()) {
				CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId);
				System.out.println(cameraId);
				System.out.println(characteristics);

				// We don't use a front facing mCamera in this sample.
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
							mCameraDevice = camera;

							aa();

						}

						@Override
						public void onError(CameraDevice camera, int error) {
							mCameraDevice = camera;
						}

						@Override
						public void onDisconnected(CameraDevice camera) {
							mCameraDevice = camera;
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

					// We don't use a front facing mCamera in this sample.
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
		Size localSize = a(this.mCameraDevice.getId());
		this.k.setDefaultBufferSize(localSize.getWidth(), localSize.getHeight());
		this.l = new Surface(this.k);
		ArrayList localArrayList = new ArrayList(1);
		localArrayList.add(this.l);
		try {
			this.mCameraDevice.createCaptureSession(localArrayList, this.n, this.c);
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
		cameraImg(mCamera);
		List<String> flashModes = parameters.getSupportedFlashModes();
		// Check if mCamera flash exists
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



	private void cameraImg(Camera mCameraDevice) {

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
		// Check if mCamera flash exists
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
