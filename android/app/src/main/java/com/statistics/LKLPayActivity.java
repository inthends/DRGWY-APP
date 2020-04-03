package com.statistics;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.google.gson.Gson;

import java.util.StringTokenizer;

import androidx.annotation.Nullable;

public class LKLPayActivity extends Activity {
    private Bundle bundle;
    private Bundle yinshengBundle;
    // 交易金额
    // private EditText mMoneyEt;
    // 调用收单应用
    // private Button mCall;
    // 显示交易信息
    private TextView mShow;
    private Gson gson;

    // 订单号
    // private EditText mOrderNo;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        initView();
        initData();

        mShow.setText("正在支付中...");

        Bundle bu = getIntent().getExtras();
        String posType = bu.getString("posType");

        //
        switch (posType) {
            case "拉卡拉": {
                this.bundle = bu;
                lakalaPay();

                break;
            }
            case "银盛": {
                this.yinshengBundle = bu;
                yinshengPay();
                break;
            }
        }

    }

    private void initView() {
        mShow = (TextView) findViewById(R.id.show);

    }

    private void initData() {

    }

    public void lakalaPay() {
        Intent intent = setComponent();
        intent.putExtras(this.bundle);
        startActivityForResult(intent, 1);
    }

    public String changeY2F(String amount) {
        StringTokenizer stringTokenizer = new StringTokenizer(amount, ".");

        return stringTokenizer.nextToken();
    }

    // 银盛正扫和反扫
    public void yinshengPay() {

        int transType = this.yinshengBundle.getInt("transType");
        // mShow.setText(String.valueOf(transType));
        // String amount = this.yinshengBundle.getString("amount", "0");

        try {

            Intent intent = new Intent();
            intent.setAction("com.ys.smartpos.pay.sdk");
            intent.putExtra("transType", transType);
            // intent.putExtra("amount", Long.parseLong(amount));
            intent.putExtra("amount", (long)this.yinshengBundle.getInt("amount"));
            intent.putExtra("transAction", 1);
            intent.putExtra("orderBelongTo", this.yinshengBundle.getString("orderBelongTo"));
            intent.putExtra("orderId", this.yinshengBundle.getString("orderId"));// 客户订单号最大长度20
            // intent.putExtra("printContent",
            // this.yinshengBundle.getString("createOrderRemark"));
            intent.putExtra("syncFlag", "1");
            // intent.putExtra("notify_url", this.yinshengBundle.getString("notify_url"));
            //mShow.setText("开始调用银盛支付" + "transType=" + transType + ",amount=" + (long)this.yinshengBundle.getInt("amount")+ ",orderBelongTo=" + this.yinshengBundle.getString("orderBelongTo") + ",orderId=" + this.yinshengBundle.getString("orderId"));
            startActivityForResult(intent, transType);

        } catch (Exception e) {
            mShow.setText(e.getMessage());
        }

        // String orderBelongTo = this.yinshengBundle.getString("orderBelongTo");
        // String orderId = this.yinshengBundle.getString("orderId");
        // Intent intent = this.getCommonIntent(orderBelongTo, orderId);
        // intent.putExtra("amount", Long.parseLong(amount));
        // callPay(intent, 1054, amount, orderBelongTo, orderId);
    }

    // private void callPay(Intent intent, int transType, String amount, String
    // orderBelongTo, String orderId) {
    // intent.setAction("com.ys.smartpos.pay.sdk");
    // intent.putExtra("transType", transType);
    // mShow.setText("开始调用银盛支付" + " ___ " + amount + " __ " + orderBelongTo + " __ "
    // + orderId);

    // startActivityForResult(intent, transType);
    // }
    //
    // private Intent getCommonIntent(String orderBelongTo, String getOrderId) {
    // Intent intent = new Intent();
    //// String imgHexStr = ByteUtils.getHexStr(MainActivity.this,
    // R.drawable.customerlogo);
    //// String imgHexStr_append = "image,300,200,1," + imgHexStr + "|";
    // String qrcode = "qrCode,300,1,safsfd21423432dfdgf3ds3|";
    // String barcode = "barCode,0,0,1,12345678|";
    // String text = "text,0,1,扫码抢红包喽|";
    // String printContent = "dottedline";
    //// printContent = barcode + qrcode + text + imgHexStr_append + printContent;
    // intent.putExtra("transAction", 1); // 订单支付模式——必填参数
    // intent.putExtra("orderBelongTo", orderBelongTo); // 订单支付模式——必填参数
    // intent.putExtra("orderId", getOrderId); // 订单支付模式——必填参数
    // intent.putExtra("syncFlag", "1"); // 订单支付模式——新版订单模式的标志位
    // intent.putExtra("createOrderRemark", "remark");
    // intent.putExtra("printContent", printContent);// 打印内容
    //// intent.putExtra("receiptLogo", imgHexStr); // 小票logo
    //// intent.putExtra("bankCardType", "02"); // 借贷记标识
    // return intent;
    // }

    public Intent setComponent() {
        ComponentName component = new ComponentName("com.lkl.cloudpos.payment",
                "com.lkl.cloudpos.payment.activity.MainMenuActivity");
        Intent intent = new Intent();
        intent.setComponent(component);
        return intent;
    }

    /**
     * 收单接口回调结果
     *
     * @param requestCode
     * @param resultCode
     * @param data
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (bundle != null) {
            // 应答码
            String msg_tp = data.getExtras().getString("msg_tp");
            // 检索参考号
            String refernumber = data.getExtras().getString("refernumber");
            // 订单号
            String order_no = data.getExtras().getString("order_no");
            // 批次流水号
            String batchbillno = data.getExtras().getString("batchbillno");
            // 失败原因
            String reason = data.getExtras().getString("reason");
            // 时间戳
            String time = data.getExtras().getString("time_stamp");
            // 附加数据
            String addword = data.getExtras().getString("adddataword");
            // 交易详情
            TransactionEntity transactionEntity = gson.fromJson(data.getExtras().getString("txndetail"),
                    TransactionEntity.class);
            switch (resultCode) {
                // 支付成功
                case Activity.RESULT_OK:
                    mShow.setText("  应答码：" + msg_tp + "\n\r 检索参考号：" + refernumber + "\n\r 订单号：" + order_no
                            + "\n\r 批次流水号：" + batchbillno + "\n\r 时间：" + time + "\n\r 附加数据域：" + addword + "\n\r ");
                    if (null != transactionEntity) {
                        mShow.append(transactionEntity.toString());
                    }
                    break;
                // 支付取消
                case Activity.RESULT_CANCELED:
                    if (reason != null) {
                        mShow.setText(reason);
                    }
                    break;
                case -2:
                    // 交易失败
                    if (reason != null) {
                        mShow.setText(" 交易失败：\n\n\r" + reason);
                    }
                    break;
                default:

                    break;
            }
        } else if (yinshengBundle != null) {
            Integer result = data.getExtras().getInt("transResult", -1);
            switch (result) {
                case 0:
                    mShow.setText("支付成功");
                    break;
                default:
                    mShow.setText("支付失败");
                    break;
            }
        }

    }
}
