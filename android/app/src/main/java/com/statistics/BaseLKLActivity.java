package com.statistics;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

//import com.lakala.cloudpos.demo.mdxsdk.view.CancelOnclick;
//import com.lakala.cloudpos.demo.mdxsdk.view.NotifyDialogBuilder;
//import com.lakala.cloudpos.demo.mdxsdk.view.OkOnclick;
import com.lkl.cloudpos.mdx.aidl.AidlDeviceService;

import java.util.ArrayList;
import java.util.List;

public abstract class BaseLKLActivity extends Activity {

    public static final String LKL_SERVICE_ACTION = "lkl_cloudpos_mdx_service";
    private static String TAG = "PACKAGEINFO";
    private static ArrayList<String> nameList;
    private int showLineNum = 0;
    private LinearLayout linearLayout;
    private ScrollView scrollView;
    private TextView textView1;
    private TextView textView2;
    protected Activity curActivity = this;
//    public NotifyDialogBuilder notifyDialog;

    //设别服务连接桥
    private ServiceConnection conn = new ServiceConnection() {


        @Override
        public void onServiceConnected(ComponentName name, IBinder serviceBinder) {
            Log.d("aaa", "aidlService服务连接成功");
            if (serviceBinder != null) {    //绑定成功
                AidlDeviceService serviceManager = AidlDeviceService.Stub.asInterface(serviceBinder);
                if (serviceManager != null) {
                    onDeviceConnected(serviceManager);
                }

            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            Log.d("aaa", "AidlService服务断开了");
        }
    };

    //绑定服务
    public void bindService() {
        try {
            Intent intent = new Intent();
            intent.setAction(LKL_SERVICE_ACTION);
            Intent eintent = new Intent(getExplicitIntent(this, intent));
            if (eintent != null) {
                Log.d("packageName", eintent.toString());
                boolean flag = false;

                flag = bindService(eintent, conn, Context.BIND_AUTO_CREATE);

                if (flag) {
                    Log.d("aaa", "服务绑定成功");
                } else {
                    Log.d("aaa", "服务绑定失败");
                }
            }

        } catch (Exception e) {
            return;
        }

    }

    public static Intent getExplicitIntent(Context context, Intent implicitIntent) {
        // Retrieve all services that can match the given intent
        Intent explicitIntent = null;
        try {
            int j = 0;
            PackageManager pm = context.getPackageManager();
            List<ResolveInfo> resolveInfos = pm.queryIntentServices(implicitIntent, 0);
            for (ResolveInfo resolveInfo : resolveInfos) {
                //得到手机上已经安装的应用的名字,即在AndriodMainfest.xml中的app_name。
                String appName = resolveInfo.loadLabel(pm).toString();
                //得到应用所在包的名字,即在AndriodMainfest.xml中的package的值。
                String packageName = resolveInfo.serviceInfo.packageName;
                Log.i(TAG, "应用的名字:" + appName);
                Log.i(TAG, "应用的包名字:" + packageName);
                if ("com.lkl.cloudpos.payment".equals(packageName)) {
                    nameList.add(appName + ":" + packageName);
                    j++;
                }
            }
            // Make sure only one match was found
            if (resolveInfos == null || resolveInfos.size() != 1) {
                return null;
            }
            // Get component info and create ComponentName
            ResolveInfo serviceInfo = resolveInfos.get(0);
            Log.d("PackageName", resolveInfos.size() + "");
            String packageName = serviceInfo.serviceInfo.packageName;
            String className = serviceInfo.serviceInfo.name;

            ComponentName component = new ComponentName(packageName, className);
            // Create a new intent. Use the old one for extras and such reuse
            explicitIntent = new Intent(implicitIntent);
            // Set the component to be explicit
            explicitIntent.setComponent(component);
            return explicitIntent;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }


    }

//    private Handler handler = new Handler() {
//        @Override
//        public void handleMessage(Message msg) {
//            // TODO Auto-generated method stub
//            super.handleMessage(msg);
//            Bundle bundle = msg.getData();
//            String msg1 = bundle.getString("msg1");
//            String msg2 = bundle.getString("msg2");
//            int color = bundle.getInt("color");
//            updateView(msg1, msg2, color);
//        }
//    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
//		 super.setContentView(R.layout.base_activity);
//        linearLayout = (LinearLayout) this.findViewById(R.id.tipLinearLayout);
//        scrollView = (ScrollView) this.findViewById(R.id.tipScrollView);
        //rightButArea = (LinearLayout) this.findViewById(R.id.main_linearlayout);
    }

    /**
     * 清屏操作
     *
     * @param v
     */
    public void clean(View v) {
        if (linearLayout != null && linearLayout.getChildCount() != 0) {
            linearLayout.removeAllViews();
        }

    }

    @Override
    protected void onResume() {
        // TODO Auto-generated method stub
        super.onResume();
        bindService();
    }

    /**
     * 显示信息
     *
     * @param msg1
     * @param color
     * @createtor：Administrator
     * @date:2014-9-15 下午9:45:18
     */
//    public void updateView(final String msg1, final String msg2, final int color) {
//        if (showLineNum % 300 == 0) { // 显示够20行的时候重新开始
//            linearLayout.removeAllViews();
//            showLineNum = 0;
//        }
//        showLineNum++;
//        LayoutInflater inflater = getLayoutInflater();
//        View v = inflater.inflate(R.layout.show_item, null);
//        textView1 = (TextView) v.findViewById(R.id.tip1);
//        textView2 = (TextView) v.findViewById(R.id.tip2);
//        textView1.setText(msg1);
//        textView2.setText(msg2);
//        textView1.setTextColor(Color.BLACK);
//        textView2.setTextColor(color);
//        textView1.setTextSize(20);
//        textView2.setTextSize(20);
//        linearLayout.addView(v);
//        scrollView.post(new Runnable() {
//            public void run() {
//                scrollView.fullScroll(ScrollView.FOCUS_DOWN);
//            }
//        });
//
//    }

    /**
     * 更新UI
     *
     * @param msg1
     * @param msg2
     * @param color
     * @createtor：Administrator
     * @date:2014-11-29 下午7:01:16
     */
    public void showMessage(final String msg1, final String msg2,
                            final int color) {
//        Message msg = new Message();
//        Bundle bundle = new Bundle();
//        bundle.putString("msg1", msg1);
//        bundle.putString("msg2", msg2);
//        bundle.putInt("color", color);
//        msg.setData(bundle);
//        handler.sendMessage(msg);
    }

    // 显示单条信息
    public void showMessage(final String msg1, final int color) {

//        Message msg = new Message();
//        Bundle bundle = new Bundle();
//        bundle.putString("msg1", msg1);
//        bundle.putString("msg2", "");
//        bundle.putInt("color", color);
//        msg.setData(bundle);
//        handler.sendMessage(msg);
    }

    public void showMessage(String str) {
        this.showMessage(str, Color.BLACK);
    }

    @Override
    protected void onPause() {
        // TODO Auto-generated method stub
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        // TODO Auto-generated method stub
        super.onDestroy();
        this.unbindService(conn);
    }

    /**
     * 服务连接成功时回调
     *
     * @param serviceManager
     * @createtor：Administrator
     * @date:2015-8-4 上午7:38:08
     */
    public abstract void onDeviceConnected(AidlDeviceService serviceManager);


    /**
     * 防止重复点击
     *
     * @param duration 重复点击间隔时间 毫秒
     * @return
     */
    protected long lastClickTime = 0;

    public boolean isCanClick(int duration) {
        long cur = System.currentTimeMillis();
        long time = cur - lastClickTime;
        time = Math.abs(time);
        if (time < duration) {
            return false;
        }
        lastClickTime = cur;
        return true;
    }

    /**
     * 隐藏提示框
     */
//    public void dismissNotifyDialog() {
//        runOnUiThread(new Runnable() {
//
//            @Override
//            public void run() {
//                if (notifyDialog != null && notifyDialog.isShowing()) {
//                    notifyDialog.dismiss();
//                    notifyDialog = null;
//                }
//            }
//        });
//    }

    /**
     * 复合卡操作选择对话框
     *
     * @param content
     * @param okText
     * @param okclick
     * @param cancelText
     * @param cancelclick
     */
//    public void showNotifyDialog( final String[] content,
//                                  final String okText, final OkOnclick okclick,
//                                  final String cancelText, final CancelOnclick cancelclick) {
//        if (curActivity == null || curActivity.isFinishing())
//            return;
//        runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//                if (notifyDialog == null) {
//                    notifyDialog = new NotifyDialogBuilder(curActivity,content);
//                }
//                notifyDialog
//                        .withMessage("选择复位卡类型：")
//                        .withPositiveBtnText(
//                                TextUtils.isEmpty(okText) ? (okclick == null ? null : "确定") : okText)
//                        .withNegativeBtnText(
//                                TextUtils.isEmpty(cancelText) ? (cancelclick == null ? null : "取消") : cancelText)
//                        .setNegativeBtnClick(cancelclick == null ? null : new View.OnClickListener() {
//
//                            @Override
//                            public void onClick(View v) {
//                                cancelclick.cancel(v);
//                                dismissNotifyDialog();
//                            }
//                        })
//                        .setPositiveClick(okclick == null ? null : new View.OnClickListener() {
//
//                            @Override
//                            public void onClick(View v) {
//                                okclick.ok(v);
//                                dismissNotifyDialog();
//                            }
//                        })
//                        .isCancelableOnTouchOutside(false)
//                        .isCancelable(false);
//
//                if (!notifyDialog.isShowing()) {
//                    notifyDialog.show();
//                }
//            }
//        });
//    }

}
