package com.statistics;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import android.view.View.OnClickListener;

import com.google.gson.Gson;

import java.util.StringTokenizer;

import androidx.annotation.Nullable;

public class LKLPayActivity extends Activity {
    private Bundle bundle;
    private Bundle yinshengBundle;
    private Button button;
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
        mShow.setText("等待支付请稍后！"); 
        Bundle bu = getIntent().getExtras();
        String posType = bu.getString("posType"); 
        switch (posType) {
            case "拉卡拉":
            case "威富通": {
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
        button = (Button)findViewById(R.id.button);
        button.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                // TODO Auto-generated method stub
                LHNToast.sendEventToRn("needPrint");
                finish();

            }
        });


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

//        mShow.setText(String.valueOf(transType));
//        String amount = this.yinshengBundle.getString("amount", "0");
 
        try {

            Intent intent = new Intent();
            intent.setAction("com.ys.smartpos.pay.sdk");
            intent.putExtra("transType", transType);
//            intent.putExtra("amount", Long.parseLong(amount));
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
    }


    public Intent setComponent() {
        ComponentName component = new ComponentName("com.lkl.cloudpos.payment", "com.lkl.cloudpos.payment.activity.MainMenuActivity");
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
        try {
            if (bundle != null) {
//                // 应答码
//                String msg_tp = data.getExtras().getString("msg_tp");
//                // 检索参考号
//                String refernumber = data.getExtras().getString("refernumber");
//                // 订单号
//                String order_no = data.getExtras().getString("order_no");
//                // 批次流水号
//                String batchbillno = data.getExtras().getString("batchbillno");
                // 失败原因
                String reason = data.getExtras().getString("reason");
//                // 时间戳
//                String time = data.getExtras().getString("time_stamp");
//                // 附加数据
//                String addword = data.getExtras().getString("adddataword");
//                // 交易详情
//                TransactionEntity transactionEntity = gson.fromJson(data.getExtras().getString("txndetail"),
//                        TransactionEntity.class);
                switch (resultCode) {
                    // 支付成功
                    case Activity.RESULT_OK:
                        mShow.setText("支付成功");
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
        }catch (Exception e) {
            mShow.setText(e.getMessage());
            e.printStackTrace();
        }

    }
}
