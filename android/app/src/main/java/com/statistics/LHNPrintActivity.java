package com.statistics;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.os.RemoteException;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

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

/**
 * 打印机测试工具类
 *
 * @author Tianxiaobo
 */

/**
 * 打印机测试工具类
 *
 * @author Tianxiaobo
 */
public class LHNPrintActivity extends BaseLKLActivity {
    private AidlPrinter printerDev = null;
    private TextView mShow;
    private ImageView imageView;
    public Bitmap bmp;
    private Integer printCount = 0;
    private BlurHandler handler = new BlurHandler(this);
    private Bundle bundle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
//        super.setContentView(R.layout.printdev);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        mShow = (TextView) findViewById(R.id.show);
        imageView = (ImageView) findViewById(R.id.imageV);
        this.bundle = getIntent().getExtras();
        this.showMessage("开始下载...");
//
        returnBitMap();

    }

    @Override
    public void showMessage(String str) {
        mShow.setText(str);
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    //BestActivity,调用
    @Override
    public void onDeviceConnected(AidlDeviceService serviceManager) {
        try {
            printerDev = AidlPrinter.Stub.asInterface(serviceManager.getPrinter());
            showMessage("绑定打印服务成功");

        } catch (RemoteException e) {
            // TODO Auto-generated catch block
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
                showMessage("准备打印");
                print();
            } else {
                showMessage("打印机状态不对");
            }

        } catch (RemoteException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            showMessage("获取到的打印机状态失败");
        }
    }

    /**
     * 打印文本
     *
     * @param v
     * @createtor：Administrator
     * @date:2015-8-4 下午2:19:28
     */
    @SuppressWarnings("serial")
    public void printText(View v) {
        try {
            Thread thread = Thread.currentThread();

            printerDev.printText(new ArrayList<PrintItemObj>() {
                {
                    //请参考开发文档，定义打印字体对象PrintItemObj相关属性
                    add(new PrintItemObj("默认打印数据测试"));
                    add(new PrintItemObj("默认打印数据测试"));
                    add(new PrintItemObj("默认打印数据测试"));
//					add(new PrintItemObj("打印数据字体放大",24));
//					add(new PrintItemObj("打印数据字体放大",24));
//					add(new PrintItemObj("打印数据字体放大",24));
//					add(new PrintItemObj("打印数据加粗",8,true));
//					add(new PrintItemObj("打印数据加粗",8,true));
//					add(new PrintItemObj("打印数据加粗",8,true));
//					add(new PrintItemObj("打印数据左对齐测试",8,false, PrintItemObj.ALIGN.LEFT));
//					add(new PrintItemObj("打印数据左对齐测试",8,false, PrintItemObj.ALIGN.LEFT));
//					add(new PrintItemObj("打印数据左对齐测试",8,false, PrintItemObj.ALIGN.LEFT));
//					add(new PrintItemObj("打印数据居中对齐测试",8,false, PrintItemObj.ALIGN.CENTER));
//					add(new PrintItemObj("打印数据居中对齐测试",8,false, PrintItemObj.ALIGN.CENTER));
//					add(new PrintItemObj("打印数据居中对齐测试",8,false, PrintItemObj.ALIGN.CENTER));
//					add(new PrintItemObj("打印数据右对齐测试",8,false, PrintItemObj.ALIGN.RIGHT));
//					add(new PrintItemObj("打印数据右对齐测试",8,false, PrintItemObj.ALIGN.RIGHT));
//					add(new PrintItemObj("打印数据右对齐测试",8,false, PrintItemObj.ALIGN.RIGHT));
//					add(new PrintItemObj("打印数据下划线",8,false, PrintItemObj.ALIGN.LEFT,true));
//					add(new PrintItemObj("打印数据下划线",8,false, PrintItemObj.ALIGN.CENTER,true));
//					add(new PrintItemObj("打印数据下划线",8,false, PrintItemObj.ALIGN.RIGHT,true));
                    add(new PrintItemObj("打印数据不换行测试打印数据不换行测试打印数据不换行测试", 8, false, PrintItemObj.ALIGN.LEFT, false, true));
                    add(new PrintItemObj("打印数据不换行测试打印数据不换行测试打印数据不换行测试", 8, false, PrintItemObj.ALIGN.CENTER, false, false));
                    add(new PrintItemObj("打印数据不换行测试打印数据不换行测试打印数据不换行测试", 8, true, PrintItemObj.ALIGN.RIGHT, true, false));
//					add(new PrintItemObj("打印数据行间距测试",8,false, PrintItemObj.ALIGN.LEFT,false,true,40));
//					add(new PrintItemObj("打印数据行间距测试",8,false, PrintItemObj.ALIGN.LEFT,false,true,100));
//					add(new PrintItemObj("打印数据行间距测试",8,false, PrintItemObj.ALIGN.LEFT,false,true,40));
//					add(new PrintItemObj("打印数据字符间距测试",8,false, PrintItemObj.ALIGN.LEFT,false,true,29,25));
//					add(new PrintItemObj("打印数据字符间距测试",8,false, PrintItemObj.ALIGN.LEFT,false,true,29,25));
//					add(new PrintItemObj("打印数据字符间距测试",8,false, PrintItemObj.ALIGN.LEFT,false,true,29,25));
//					add(new PrintItemObj("打印数据左边距测试",8,false, PrintItemObj.ALIGN.LEFT,false,true,29,0,40));
//					add(new PrintItemObj("打印数据左边距测试",8,false, PrintItemObj.ALIGN.LEFT,false,true,100,0,40));
//					add(new PrintItemObj("打印数据左边距测试",8,false, PrintItemObj.ALIGN.LEFT,false,true,29,0,40));
                }
            }, new AidlPrinterListener.Stub() {


                Thread thread = Thread.currentThread();

                @Override
                public void onPrintFinish() throws RemoteException {
                    Thread thread = Thread.currentThread();
                    showMessage("打印完成");

                }

                @Override
                public void onError(int arg0) throws RemoteException {
                    showMessage("打印出错，错误码为：" + arg0);
                }
            });
        } catch (RemoteException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            showMessage("打印异常");
        }
    }

    /**
     * 打印位图
     *
     * @createtor：Administrator
     * @date:2015-8-4 下午2:39:33
     */
    public void printBitmap() {
//        Bitmap bmp = this.bmp;
//        imageView.setImageBitmap(bmp);
        try {
//            InputStream ins = this.getAssets().open("ziti_store.png");//打印位图对象
//            Bitmap bmp = BitmapFactory.decodeStream(ins);
            Bitmap bmp = this.bmp;
//            imageView.setImageBitmap(bmp);

//            showMessage("宽：" + String.valueOf(bmp.getWidth()));

            printerDev.printBmp(50, 50, bmp.getHeight() / bmp.getWidth() * 50, bmp, new AidlPrinterListener.Stub() {

                @Override
                public void onPrintFinish() throws RemoteException {
                    showMessage("打印位图成功");
                    if (printCount < 2) {
                        getPrintState();
                    }
                }

                @Override
                public void onError(int arg0) throws RemoteException {
                    showMessage("打印位图失败，错误码" + arg0 + ",宽：" + String.valueOf(bmp.getWidth()));
                }
            });
        } catch (RemoteException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            showMessage("打印异常");
        }
    }

    public void aaa() {
        showMessage(String.valueOf(this.bmp.getWidth()));
    }

    private class PrintStateChangeListener extends AidlPrinterListener.Stub {

        @Override
        public void onError(int arg0) throws RemoteException {
            showMessage("数据打印失败,错误码" + arg0);
        }

        @Override
        public void onPrintFinish() throws RemoteException {
            showMessage("数据打印成功");
        }

    }

    /**
     * 打印条码
     *
     * @createtor：Administrator
     * @date:2015-8-4 下午3:02:21
     */
    public void printBarCode(View v) {
        try {
            this.printerDev.printBarCode(-1, 162, 18, 65, "23418753401", new PrintStateChangeListener());
//			this.printerDev.printBarCode(-1, 162, 18, 66, "03400000471", new PrintStateChangeListener());
//			this.printerDev.printBarCode(-1, 162, 18, 67, "234187534011", new PrintStateChangeListener());
//			this.printerDev.printBarCode(-1, 162, 18, 68, "2341875", new PrintStateChangeListener());
//			this.printerDev.printBarCode(-1, 162, 18, 69, "*23418*", new PrintStateChangeListener());//不支持
//			this.printerDev.printBarCode(-1, 162, 18, 70, "234187534011", new PrintStateChangeListener());
//			this.printerDev.printBarCode(-1, 162, 18, 71, "23418", new PrintStateChangeListener());
//			this.printerDev.printBarCode(-1, 162, 18, 72, "23418", new PrintStateChangeListener());
//			this.printerDev.printBarCode(-1, 162, 18, 73, "{A23418", new PrintStateChangeListener());//不支持
        } catch (RemoteException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            showMessage("打印异常");
        }
    }


    /**
     * 设置打印灰度
     *
     * @param v
     * @createtor：Administrator
     * @date:2015-8-4 下午3:02:27
     */
    public void setPrintGray(View v) {
        try {
            showMessage("打印灰度设置为4打印");
            this.printerDev.setPrinterGray(0x04);
            printText(null);
            showMessage("打印灰度设置为1打印");
            this.printerDev.setPrinterGray(0x01);
            printText(null);
        } catch (RemoteException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            showMessage("打印灰度设置异常");
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
//            myFileUrl = new URL(url);
                    HttpURLConnection conn = (HttpURLConnection) myFileUrl.openConnection();
                    conn.setRequestMethod("GET");
                    conn.setUseCaches(false);

                    conn.setDoInput(true); // true if we want to read server's response
                    conn.setDoOutput(false); // false indicates this is a GET request
                    conn.connect();
                    int responseCode = conn.getResponseCode();
                    if (responseCode == HttpURLConnection.HTTP_OK) {
                        //得到响应流
                        InputStream is = conn.getInputStream();
                        Bitmap bitmap = BitmapFactory.decodeStream(is);
                        message.obj = bitmap;
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


    //打印
    @SuppressWarnings("unchecked")
    public void print() {
        printCount++;
        showMessage("开始打印");
        try {
            Thread thread = Thread.currentThread();

            printerDev.printText(new ArrayList<PrintItemObj>() {
                {
                    int big = 16;
                    int medium = 8;
                    int small = 5;
                    /*
                    bundle.putString("unitNo",res.getString("unitNo"));
                bundle.putString("billDate",res.getString("billDate"));
                bundle.putString("amount",res.getString("amount"));
                bundle.putString("tradeNo",res.getString("tradeNo"));
                bundle.putString("payType",res.getString("payType"));
                ReadableArray params = res.getArray("bills");
                     */
                    String unitNo = bundle.getString("unitNo");
                    String billDate = bundle.getString("billDate");
                    String amount = bundle.getString("amount");
                    String tradeNo = bundle.getString("tradeNo");
                    String payType = bundle.getString("payType");
                    String username = bundle.getString("username");
                    ArrayList<ZhangDanObj> bills = (ArrayList<ZhangDanObj>) bundle.getSerializable("bills");

                    /*
                    PrintItemObj(
                    String text,
                    int fontSize,
                    boolean isBold,
                     PrintItemObj.ALIGN align,
                      boolean isUnderline,
                       boolean isWordWrap,
                        int lineHeight,
                         int letterSpacing)
                     */


                    add(new PrintItemObj("POS机收款凭据", big, true, PrintItemObj.ALIGN.CENTER, false, false, 25));
                    add(new PrintItemObj("房号：" + unitNo, medium));
                    add(new PrintItemObj("支付渠道：" + payType, medium));
                    add(new PrintItemObj("订单号：" + tradeNo, medium));
                    add(new PrintItemObj("收款人：" + username, medium));
                    add(new PrintItemObj("日期/时间：" + billDate, medium));
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
                    add(new PrintItemObj("收款单位（签章）", medium, false, PrintItemObj.ALIGN.LEFT, false, false, 40));
                }
            }, new AidlPrinterListener.Stub() {


                Thread thread = Thread.currentThread();

                @Override
                public void onPrintFinish() throws RemoteException {
                    Thread thread = Thread.currentThread();
                    showMessage("打印完成");
                    printBitmap();

                }

                @Override
                public void onError(int arg0) throws RemoteException {
                    showMessage("打印出错，错误码为：" + arg0);
                }
            });
        } catch (RemoteException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            showMessage("打印异常");
        }
    }

}
