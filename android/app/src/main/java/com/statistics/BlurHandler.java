package com.statistics;
import android.graphics.Bitmap;
import android.os.Handler;
import android.os.Message;
import java.lang.ref.WeakReference;

public class BlurHandler extends Handler {
    private final WeakReference<LHNPrintActivity> mTarget;

    public BlurHandler(LHNPrintActivity controller) {
        mTarget = new WeakReference<LHNPrintActivity>(controller);
    }

    @Override
    public void handleMessage(Message msg) {
        super.handleMessage(msg);
        LHNPrintActivity activity = mTarget.get();
        if (activity != null) {
            Bitmap bitmap = (Bitmap) msg.obj;
            if (bitmap != null) {
//                activity.showMessage("下载成功");
                activity.bmp = bitmap;
                activity.canPrint = true;
                activity.showMessage("打印信息准备完毕");
                activity.print();
//                activity.getPrintState();
//                activity.printBitmap();
            } else {
                activity.showMessage("下载失败");
            }
        }
    }

}
