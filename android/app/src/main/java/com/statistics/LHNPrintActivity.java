package com.statistics;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.os.RemoteException;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.lkl.cloudpos.mdx.aidl.AidlDeviceService;
import com.lkl.cloudpos.mdx.aidl.printer.AidlPrinter;
import com.lkl.cloudpos.mdx.aidl.printer.AidlPrinterListener;
import com.lkl.cloudpos.mdx.aidl.printer.PrintItemObj;
import com.statistics.BaseLKLActivity;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Timer;
import java.util.TimerTask;

/**
 * 打印类
 *
 * @author Tianxiaobo
 */

/**
 * 打印类
 *
 * @author Tianxiaobo
 */
public class LHNPrintActivity extends BaseLKLActivity {
    private AidlPrinter printerDev = null;
    private TextView mShow;
    private ImageView imageView;
    public Bitmap bmp;
    public Boolean canPrint;
    public Button button;

    private BlurHandler handler = new BlurHandler(this);
    private Bundle bundle;
    private Boolean printText = false;
    private Boolean printImage = false;
    // private SystemActivity systemActivity = new SystemActivity();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // super.setContentView(R.layout.printdev);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        mShow = (TextView) findViewById(R.id.show);
        imageView = (ImageView) findViewById(R.id.imageV);
        button = (Button) findViewById(R.id.button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                print();
            }
        });
        this.bundle = getIntent().getExtras();
        this.showMessage("准备打印信息...");

    }

    @Override
    public void showMessage(String str) {
        mShow.setText(str);
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    // BestActivity,调用
    @Override
    public void onDeviceConnected(AidlDeviceService serviceManager) {
        try {
            printerDev = AidlPrinter.Stub.asInterface(serviceManager.getPrinter());
            showMessage("绑定打印服务成功");
            getPrintState();
            returnBitMap();
            printKong();

        } catch (RemoteException e) {
            e.printStackTrace();
            showMessage("绑定打印服务失败");
        }
    }

    /**
     * 获取打印机状态
     *
     * @createtor：Administrator
     * @date:2015-8-4 下午2:18:47
     */
    public void getPrintState() {
        try {
            int printState = printerDev.getPrinterState();

            showMessage("获取到的打印机状态为" + printState);
            if (printState == 0) {
                showMessage("打印机状态可以打印");

            } else {
                showMessage("打印机状态不对");
            }

        } catch (RemoteException e) {
            e.printStackTrace();
            showMessage("获取到的打印机状态失败");
        }
    }

    /**
     * 打印位图
     *
     * @createtor：Administrator
     * @date:2015-8-4 下午2:39:33
     */
    public void printBitmap() {

        try {

            Bitmap bmp = this.bmp;
            // imageView.setImageBitmap(bmp);

            printerDev.printBmp(50, 30, 30, bmp, new AidlPrinterListener.Stub() {

                @Override
                public void onPrintFinish() throws RemoteException {
                    // showMessage("打印位图成功");
                    printImage = true; 
                }

                @Override
                public void onError(int arg0) throws RemoteException {
                    showMessage("打印位图失败，错误码" + arg0 + ",宽：" + String.valueOf(bmp.getWidth()));
                }
            });
        } catch (RemoteException e) {
            e.printStackTrace();
            showMessage("打印异常");
        }
    }

    public void returnBitMap() {
        String url = this.bundle.getString("stampUrl");
        if (url == null || url.length() == 0) {
            return;
        }

        new Thread(new Runnable() {
            @Override
            public void run() {
                URL myFileUrl = null;
                Message message = new Message();

                try {

                    myFileUrl = new URL(url);
                    // myFileUrl = new URL(url);
                    HttpURLConnection conn = (HttpURLConnection) myFileUrl.openConnection();
                    conn.setRequestMethod("GET");
                    conn.setUseCaches(false);
                    conn.setDoInput(true); // true if we want to read server's response
                    conn.setDoOutput(false); // false indicates this is a GET request
                    conn.connect();
                    int responseCode = conn.getResponseCode();
                    if (responseCode == HttpURLConnection.HTTP_OK) {
                        // 得到响应流
                        InputStream is = conn.getInputStream();
                        message.obj = BitmapFactory.decodeStream(is);
                        is.close();
                        handler.sendMessage(message);
                    }
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    // 打印
    @SuppressWarnings("unchecked")
    public void printText() { 
        showMessage("开始打印");
        try {
            Thread thread = Thread.currentThread(); 
            printerDev.printText(new ArrayList<PrintItemObj>() {
                {
                    int big = 16;
                    int medium = 8;
                    int small = 4;
                    /*
                     * bundle.putString("allName",res.getString("allName"));
                     * bundle.putString("billDate",res.getString("billDate"));
                     * bundle.putString("amount",res.getString("amount"));
                     * bundle.putString("tradeNo",res.getString("tradeNo"));
                     * bundle.putString("payType",res.getString("payType")); ReadableArray params =
                     * res.getArray("bills");
                     */
                    String allName = bundle.getString("allName");
                    String billDate = bundle.getString("billDate");
                    String amount = bundle.getString("amount");
                    String tradeNo = bundle.getString("tradeNo");
                    String payType = bundle.getString("payType");
                    String username = bundle.getString("username");
                    String mchName = bundle.getString("mchName");
                    String mchId = bundle.getString("mchId");
                    ArrayList<ZhangDanObj> bills = (ArrayList<ZhangDanObj>) bundle.getSerializable("bills");

                    /*
                     * PrintItemObj( String text, int fontSize, boolean isBold, PrintItemObj.ALIGN
                     * align, boolean isUnderline, boolean isWordWrap, int lineHeight, int
                     * letterSpacing)
                     */

                    add(new PrintItemObj("POS机收款凭据", big, true, PrintItemObj.ALIGN.CENTER, false, false, 25));
                    add(new PrintItemObj("商户名称：" + mchName, medium));
                    add(new PrintItemObj("商户号：" + mchId, medium));
                    // add(new PrintItemObj("终端号：" + systemActivity.getTerminalSn(), medium));
                    add(new PrintItemObj("房屋全称：" + allName, medium));
                    add(new PrintItemObj("支付渠道：" + payType, medium));
                    add(new PrintItemObj("订单号：" + tradeNo, medium));
                    add(new PrintItemObj("收款人：" + username, medium));
                    add(new PrintItemObj("收款日期：" + billDate, medium));
                    add(new PrintItemObj("实付金额：" + amount, medium, false, PrintItemObj.ALIGN.LEFT, false, false, 20));
                    add(new PrintItemObj("付款明细", medium, false, PrintItemObj.ALIGN.LEFT, false, false, 20));
                    add(new PrintItemObj("--------------------------------", medium));

                    if (bills != null) {
                        for (ZhangDanObj list : bills) {

                            add(new PrintItemObj(list.getFeeName() + "：   " + list.getAmount(), medium));
                            add(new PrintItemObj(list.getBeginDate() + " 至 " + list.getEndDate(), small));
                        }
                    }

                    add(new PrintItemObj("--------------------------------", medium));
                    add(new PrintItemObj("付款人（签字）", medium, false, PrintItemObj.ALIGN.LEFT, false, false, 40));
                    add(new PrintItemObj("收款单位（签章）", medium, false, PrintItemObj.ALIGN.LEFT, false, false));
                }
            }, new AidlPrinterListener.Stub() {

                Thread thread = Thread.currentThread();

                @Override
                public void onPrintFinish() throws RemoteException {
                    Thread thread = Thread.currentThread();
                    printText = true;
                    showMessage("打印完成"); 
                }

                @Override
                public void onError(int arg0) throws RemoteException {
                    showMessage("打印出错，错误码为：" + arg0);
                }
            });
        } catch (RemoteException e) {
            e.printStackTrace();
            showMessage("打印异常");
        }
    }

    // 打印空白换行
    @SuppressWarnings("unchecked")
    public void printKong() {

        try {
            Thread thread = Thread.currentThread();
            printerDev.printText(new ArrayList<PrintItemObj>() {
                {
                    add(new PrintItemObj("", 16, true, PrintItemObj.ALIGN.CENTER, false, false, 50));
                }
            }, new AidlPrinterListener.Stub() {

                @Override
                public void onPrintFinish() throws RemoteException {

                }

                @Override
                public void onError(int arg0) throws RemoteException {
                    showMessage("打印出错，错误码为：" + arg0);
                }
            });
        } catch (RemoteException e) {
            e.printStackTrace();
            showMessage("打印异常");
        }
    }

    public void print() {
        showMessage("开始打印");

        printText();

        String url = this.bundle.getString("stampUrl");
        if (url != null && url.length() > 0) {
            printBitmap();
        }

        printKong();

    }
}
