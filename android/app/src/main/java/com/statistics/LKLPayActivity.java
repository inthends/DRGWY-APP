package com.statistics;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import com.google.gson.Gson;

import androidx.annotation.Nullable;


public class LKLPayActivity extends Activity {
    private Bundle bundle;
    // 交易金额
//    private EditText mMoneyEt;
    // 调用收单应用
//    private Button mCall;
    // 显示交易信息
    private TextView mShow;
    private Gson gson;
    // 订单号
//    private EditText mOrderNo;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        initView();
        initData();
        this.bundle = getIntent().getExtras();
        mShow.setText("正在支付中...");
        pay();

    }
    private void initView() {
        mShow = (TextView) findViewById(R.id.show);

    }
    private void initData() {

    }

    public void pay() {
        Intent intent = setComponent();
        intent.putExtras(this.bundle);
        startActivityForResult(intent, 1);

    }
    public Intent setComponent() {
        ComponentName component = new ComponentName(
                "com.lkl.cloudpos.payment",
                "com.lkl.cloudpos.payment.activity.MainMenuActivity"
        );
        Intent intent = new Intent();
        intent.setComponent(component);
        return intent;
    }
    /**
     * 收单接口回调结果
     * @param requestCode
     * @param resultCode
     * @param data
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
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
        TransactionEntity transactionEntity = gson.fromJson(data.getExtras()
                .getString("txndetail"), TransactionEntity.class);
        switch (resultCode) {
            // 支付成功
            case Activity.RESULT_OK:
                mShow.setText("  应答码：" + msg_tp + "\n\r 检索参考号：" + refernumber
                        + "\n\r 订单号：" + order_no + "\n\r 批次流水号：" + batchbillno
                        + "\n\r 时间：" + time + "\n\r 附加数据域：" + addword + "\n\r ");
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
    }
}
