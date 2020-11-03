package com.statistics;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
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


}
