package com.statistics;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.songlcy.rnupgrade.UpgradePackage;

import cn.jiguang.plugins.push.JPushModule;
import cn.jiguang.plugins.push.JPushPackage;

import com.microsoft.codepush.react.CodePush;
import com.github.reactnativecommunity.location.RNLocationPackage;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;

import org.reactnative.camera.RNCameraPackage;

import com.horcrux.svg.SvgPackage;
import com.ys.serviceapi.api.YSSDKManager;
import com.zmxv.RNSound.RNSoundPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new UpgradePackage(),
                    new JPushPackage(),
                    new RNLocationPackage(),
                    new RNPermissionsPackage(),
                    new RNCameraPackage(),
                    new SvgPackage(),
                    new RNSoundPackage(),
                    new ImagePickerPackage(),
                    new ReactNativeAudioPackage(),
                    new RNCWebViewPackage(),
                    new AsyncStoragePackage(),
                    new RNGestureHandlerPackage(),
                    new ReanimatedPackage(),
                    new CustomLHNToastPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
//         YSSDKManager.login(getApplicationContext(), "95E1926350CD95EF0F1C065190092F23");
        YSSDKManager.login(getApplicationContext(), "4B53EEDCF8DAA0BD5AA11411AD9F854B");
        SoLoader.init(this, /* native exopackage */ false);
        JPushModule.registerActivityLifecycle(this);
    }
}
