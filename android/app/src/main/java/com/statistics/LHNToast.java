package com.statistics;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.PixelUtil;

import java.util.Map;
import java.util.HashMap;

import javax.annotation.Nonnull;

public class LHNToast extends ReactContextBaseJavaModule {
    public LHNToast(ReactApplicationContext context) {
        super(context);
    }

    @Nonnull
    @Override
    public String getName() {
        return "LHNToast";
    }

    @ReactMethod
    public void show(String message,int duration) {
        Toast.makeText(getReactApplicationContext(),message,duration).show();
    }

    @ReactMethod
    public void login(String userName, String password, Callback successCallback) {
        successCallback.invoke(userName,password,"value");
    }
}
