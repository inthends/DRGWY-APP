package com.statistics;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;

import com.caysn.autoreplyprint.AutoReplyPrint;
import com.sun.jna.Pointer;
import com.sun.jna.WString;
import com.sun.jna.ptr.IntByReference;
import com.sun.jna.ptr.LongByReference;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

class PrintFunction {

    public Activity ctx = null;
    Bundle btBundle = null;
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    void pos_SampleTicket(Pointer h) {
        int paperWidth = 384;

        AutoReplyPrint.INSTANCE.CP_Printer_ClearPrinterBuffer(h);//清缓存
        AutoReplyPrint.INSTANCE.CP_Pos_ResetPrinter(h);
        AutoReplyPrint.INSTANCE.CP_Pos_SetMultiByteMode(h);
        AutoReplyPrint.INSTANCE.CP_Pos_SetMultiByteEncoding(h, AutoReplyPrint.CP_MultiByteEncoding_UTF8);

        String allName = "房屋全称："+btBundle.getString("allName") + "";
        String tradeNo = "商户号："+btBundle.getString("mchId") + "";
        String mchName = "商户名称："+btBundle.getString("mchName") + "";
        String stampUrl = btBundle.getString("stampUrl") + "";
        String payType = "支付渠道："+btBundle.getString("payType") + "";
        String mchId = "订单号："+btBundle.getString("tradeNo") + "";
        String billDate = "收款日期："+btBundle.getString("billDate") + "";
        String amount = "实付金额："+btBundle.getString("amount") + "";
        String userName = "收款人："+btBundle.getString("userName") + "";
        String customerName = "客户名称："+btBundle.getString("customerName") + "";

        ArrayList<ZhangDanObj> bills = (ArrayList<ZhangDanObj>) btBundle.getSerializable("bills");

        AutoReplyPrint.INSTANCE.CP_Pos_SetAlignment(h, AutoReplyPrint.CP_Pos_Alignment_HCenter);
        AutoReplyPrint.INSTANCE.CP_Pos_SetTextScale(h, 1, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, "POS机收款凭据");
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_SetAlignment(h, AutoReplyPrint.CP_Pos_Alignment_Left);
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_SetTextScale(h, 0, 0);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, mchName);
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, tradeNo);
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, allName);
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);

        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, customerName);
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
 
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, payType);
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, mchId);
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, billDate);
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, amount);
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);

        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, "付款明细");
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, "----------------------------------------");
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        if (bills != null){
            for (ZhangDanObj bill:bills){
                String billfeename = bill.getFeeName();
                String billamount = bill.getAmount();
                String feeName_amountStr = billfeename + "  " + billamount + "";
                AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, feeName_amountStr);
                AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);

                if(bill.getBeginDate()!=null)
                {
                    String timeStr = bill.getBeginDate() + " 至 " + bill.getEndDate() + ""; 
                    AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, timeStr);
                    AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
                }
            }
        }
        
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, "----------------------------------------");
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);

        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, "付款人（签字）");
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, "收款单位（盖章）");
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        if (!stampUrl.equals("")){
            Bitmap bitmap = pos_PrintImageFromBitmap(stampUrl);
            if (bitmap != null){
                AutoReplyPrint.INSTANCE.CP_Pos_SetAlignment(h, AutoReplyPrint.CP_Pos_Alignment_HCenter);
                AutoReplyPrint.CP_Pos_PrintRasterImageFromData_Helper.PrintRasterImageFromBitmap(h, bitmap.getWidth(), bitmap.getHeight(), bitmap, AutoReplyPrint.CP_ImageBinarizationMethod_Thresholding, AutoReplyPrint.CP_ImageCompressionMethod_None);
                AutoReplyPrint.INSTANCE.CP_Pos_SetAlignment(h, AutoReplyPrint.CP_Pos_Alignment_Left);
                AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
                AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
            }
        }
        else {
            AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
            AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        }
        AutoReplyPrint.INSTANCE.CP_Pos_Beep(h, 1, 600);
        {
            Test_Pos_QueryPrintResult(h);
        }
    }
    void printRight(Pointer h,String desStr){
        int paperWidth = 384;
        String[] strs= desStr.split("：");
        String str1 = strs[0];
        String str2 = strs[1];
        AutoReplyPrint.INSTANCE.CP_Pos_FeedLine(h, 1);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, str1);
        AutoReplyPrint.INSTANCE.CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12 * 7);
        AutoReplyPrint.INSTANCE.CP_Pos_PrintText(h, str2);
    }
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    Bitmap pos_PrintImageFromBitmap(String stampUrl) {
        Tool imgTool = new Tool();
        Bitmap[] imgbit = {null};
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("进入子线程1");
                imgbit[0] = imgTool.getBitmap(stampUrl,ctx);
            }
        });
        t1.start();
        try {
            t1.join();
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
        return imgbit[0];
    }
    void Test_Pos_QueryPrintResult(Pointer h) {
        boolean result = AutoReplyPrint.INSTANCE.CP_Pos_QueryPrintResult(h, 30000);
        if (!result)
            TestUtils.showMessageOnUiThread(ctx, "打印失败");
        else
            TestUtils.showMessageOnUiThread(ctx, "打印成功");
    }

}
