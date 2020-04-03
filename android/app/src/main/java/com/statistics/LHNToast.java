package com.statistics;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.PixelUtil;

import java.util.Map;
import java.util.HashMap;

import javax.annotation.Nonnull;

public class LHNToast extends ReactContextBaseJavaModule {
    private String APPID;

    public LHNToast(ReactApplicationContext context) {
        super(context);
        APPID = Tool.getPackageName(context);

    }

    @Nonnull
    @Override
    public String getName() {
        return "LHNToast";
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    @ReactMethod
    public void login(String userName, String password, Callback successCallback) {
        successCallback.invoke(userName, password, "value");
    }

    @ReactMethod
    public void startActivityFromJS(String name, ReadableMap order) {

        try {
            Activity currentActivity = getCurrentActivity();
            if (null != currentActivity) {
//                Class toActivity = Class.forName(name);


                Intent intent = new Intent(currentActivity, LKLPayActivity.class);
                Bundle bundle = new Bundle();

                String posType = order.getString("posType");
                switch (posType) {
                    case "拉卡拉": {
                        // bundle是 拉卡拉支付参数
                        bundle.putString("msg_tp", "0200");
                        bundle.putString("pay_tp", "0");
                        bundle.putString("proc_tp", "00");
                        bundle.putString("proc_cd", "000000");
                        bundle.putInt("transType",order.getInt("transType"));
                        bundle.putString("appid", APPID);
                        bundle.putString("amt", order.getString("amt"));
                        bundle.putString("order_no", order.getString("order_no"));
                        bundle.putString("notify_url", order.getString("notify_url"));
                        bundle.putString("time_stamp",DateTimeUtil.getCurrentDate("yyyyMMddhhmmss"));
                        bundle.putString("order_info", order.getString("order_info"));
                        bundle.putString("print_info", order.getString("print_info"));
                        bundle.putString("posType", posType);
                        intent.putExtras(bundle);
                        currentActivity.startActivity(intent);
                        break;
                    }
                    case "银盛": {
                        // yinshengBundle 银盛支付参数
                        // bundle.putString("amount", order.getString("amount"));
                        bundle.putInt("amount", order.getInt("amount"));
                        bundle.putString("orderBelongTo", order.getString("orderBelongTo"));
                        bundle.putString("orderId", order.getString("orderId"));
                        // bundle.putString("createOrderRemark", order.getString("createOrderRemark"));
                        // bundle.putString("notify_url", order.getString("notify_url"));
                        bundle.putInt("transType",order.getInt("transType"));
                        bundle.putString("posType", posType);
                        intent.putExtras(bundle);
                        currentActivity.startActivity(intent);

                        break;
                    }
                }


            }
        } catch (Exception e) {
            this.show(e.getMessage(), 2);
        }
    }

}
