package com.statistics;

import android.annotation.SuppressLint;
import android.os.SystemClock;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 公司：拉卡拉
 * 创建者：liuqianlong@lakala.com
 * 创建时间：2017/2/28 17:26.
 * 说明：时间处理工具类
 * 修改者：
 * 修改时间：
 * 修改详情：
 */
public class DateTimeUtil {
    // 时间格式
    public static final String YYYYMMDD = "yyyyMMdd";
    public static final String HHMMSS = "HHmmss";
    public static final String YYYYMMDDHHMMSS = "yyyyMMddHHmmss";
    public static final String YYYYMMDDHHMMssSSS = "yyyyMMddHHmmssSSS";//有毫秒时间

    /**
     * 格式化时间，将YYYYMMDDHHSS格式化为 YYYY/MM/DD HH:SS
     *
     * @param time
     * @return
     */
    public static String formatTime(String time) {
        if (time.length() != 14) {
            return time;
        }

        return time.substring(0, 4) + "/" + time.substring(4, 6) + "/"
                + time.substring(6, 8) + " " + time.substring(8, 10) + ":"
                + time.substring(10, 12) + ":" + time.substring(12, 14);
    }

    /**
     * 将毫秒转换成yyyy-MM-dd格式日期
     *
     * @param time
     * @return
     */
    @SuppressLint("SimpleDateFormat")
    public static String formatMillisecondDate(long time) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date(time);
        String strDate = format.format(date);
        return strDate;
    }

    /**
     * 将毫秒转换成HH:mm:ss格式时间
     *
     * @param time
     * @return
     */
    @SuppressLint("SimpleDateFormat")
    public static String formatMillisecondTimeSecond(long time) {
        String strTime = "";
        SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
        Date date = new Date(time);
        strTime = format.format(date);
        return strTime;
    }


    /**
     * 将毫秒转换成HH:mm格式时间
     *
     * @param time
     * @return
     */
    @SuppressLint("SimpleDateFormat")
    public static String formatMillisecondTime(long time) {
        String strTime = "";
        SimpleDateFormat format = new SimpleDateFormat("HH:mm");
        Date date = new Date(time);
        strTime = format.format(date);
        return strTime;
    }

    /**
     * 设置系统时间
     *
     * @param year
     * @param month
     * @param day
     */
    public static void setCurrentDateTime(int year, int month, int day) {
        Calendar c = Calendar.getInstance();

        c.set(Calendar.YEAR, year);
        c.set(Calendar.MONTH, month - 1);
        c.set(Calendar.DAY_OF_MONTH, day);
        long when = c.getTimeInMillis();

        if (when / 1000 < Integer.MAX_VALUE) {
            SystemClock.setCurrentTimeMillis(when);
        }
    }

    /**
     * 设置系统时间
     *
     * @param year
     * @param month
     * @param day
     * @param hour
     * @param minute
     */
    public static void setCurrentDateTime(int year, int month, int day, int hour, int minute) {
        Calendar c = Calendar.getInstance();

        c.set(Calendar.YEAR, year);
        c.set(Calendar.MONTH, month - 1);
        c.set(Calendar.DAY_OF_MONTH, day);
        c.set(Calendar.MINUTE, minute);
        c.set(Calendar.HOUR, hour);
        long when = c.getTimeInMillis();

        if (when / 1000 < Integer.MAX_VALUE) {
            SystemClock.setCurrentTimeMillis(when);
        }
    }

    /**
     * 设置系统时间
     *
     * @param hour
     * @param minute
     */
    public static void setCurrentDateTime(int hour, int minute) {
        Calendar c = Calendar.getInstance();
        c.set(Calendar.HOUR_OF_DAY, hour);
        c.set(Calendar.MINUTE, minute);
        long when = c.getTimeInMillis();

        if (when / 1000 < Integer.MAX_VALUE) {
            SystemClock.setCurrentTimeMillis(when);
        }
    }

    /**
     * 获取当前的系统时间字符串
     *
     * @param dateFormat
     * @return
     */
    @SuppressLint("SimpleDateFormat")
    public static String getCurrentDate(String dateFormat) {
        SimpleDateFormat formatter = new SimpleDateFormat(dateFormat);
        return formatter.format(new Date());
    }
}
