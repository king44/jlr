package flashlighttest.example.com.myapplication3;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

/**
 * Created by 04259 on 2017-03-15.
 */
class MySurfaceView extends SurfaceView implements SurfaceHolder.Callback{

    private SurfaceHolder holder;
    private MyThread myThread;

    public MySurfaceView(Context context) {
        super(context);
        // TODO Auto-generated constructor stub
        holder = this.getHolder();
        holder.addCallback(this);
        myThread = new MyThread(holder);//创建一个绘图线程
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width,
                               int height) {
        // TODO Auto-generated method stub

    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        // TODO Auto-generated method stub
        myThread.isRun = true;
        myThread.start();
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        // TODO Auto-generated method stub
        myThread.isRun = false;
    }

}

class MyThread extends Thread{

    private SurfaceHolder holder;
    public boolean isRun;

    public MyThread(SurfaceHolder holder){
        this.holder = holder;
        isRun = true;
    }

    @Override
    public void run() {
        // TODO Auto-generated method stub
        //super.run();
        int count = 0;
        while(isRun){
            Canvas c = null;
            try{
                synchronized(holder){
                    c = holder.lockCanvas();
                    c.drawColor(Color.BLACK);
                    Paint p = new Paint();
                    p.setColor(Color.WHITE);
                    Rect r = new Rect(100,50,300,250);
                    c.drawRect(r, p);
                    c.drawText("这是第"+(count++)+"秒", 100, 310, p);
                    Thread.sleep(1000);
                }
            }catch(Exception e){
                e.printStackTrace();
            }finally{
                if(c!=null){
                    holder.unlockCanvasAndPost(c);
                }
            }
        }
    }


}
