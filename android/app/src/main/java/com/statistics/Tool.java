package com.statistics;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;


public class Tool {

    public static String getAppId() {
        return BuildConfig.APPLICATION_ID;
    }

    public static String getPackageName(Context context) {
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
            return packageInfo.packageName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return "";
    }

    public static String getPackageCode(Context context) {

        String versionName = "1.0.0";
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
            return packageInfo.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            versionName = "";
            e.printStackTrace();
        }
        return versionName;
    }

    public static String getDeviceName() {
        return Build.BRAND;
    }


    /**
     * 检查手机上是否安装了指定的软件
     */
    public static boolean isAvailable(Context context, String packageName) {
        // 获取packagemanager
        PackageManager packageManager = context.getPackageManager();
        // 获取所有已安装程序的包信息
        List<PackageInfo> packageInfos = packageManager.getInstalledPackages(0);
        // 用于存储所有已安装程序的包名
        List<String> packageNames = new ArrayList<>();
        // 从pinfo中将包名字逐一取出，压入pName list中
        if (packageInfos != null) {
            for (int i = 0; i < packageInfos.size(); i++) {
                String packName = packageInfos.get(i).packageName;
                packageNames.add(packName);
            }
        }
        // 判断packageNames中是否有目标程序的包名，有TRUE，没有FALSE
        return packageNames.contains(packageName);
    }

    // 获取品牌
    public static String getBRAND() {
        return Build.BRAND;
    }

    // 获取型号
    // public static String getMODEL() {
    // return Build.MODEL;
    // }

    int imgUrlStatus = 0;
    Bitmap imgUrlbit;
    public Bitmap returnBitMap(final String url,Context context) {
        new Thread(new Runnable(){
            @Override
            public void run() {
                imgUrlbit = getBitmap(url,context);
            }
        }).start();

        return imgUrlbit;
    }
    public Bitmap getBitmap(String netUrl,Context context){
        URL url = null;
        try {
            url = new URL(netUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(5000);
            conn.setRequestMethod("GET");
            if (conn.getResponseCode() == 200) {
                InputStream inputStream = conn.getInputStream();
                Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
                imgUrlStatus = 1;
                return bitmap;
            }else {
                Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);
                imgUrlStatus = -1;
                return bitmap;
            }
        } catch (Exception e) {
            e.printStackTrace();
            Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);
            imgUrlStatus = -1;
            return bitmap;
        }
    }
}
