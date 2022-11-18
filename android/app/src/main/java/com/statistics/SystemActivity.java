package com.statistics;

import com.lkl.cloudpos.mdx.aidl.AidlDeviceService;
import com.lkl.cloudpos.mdx.aidl.system.AidlMerListener;
import com.lkl.cloudpos.mdx.aidl.system.AidlSystem;

import android.os.RemoteException;


public class SystemActivity extends BaseLKLActivity {

    private AidlSystem systemInf = null;


    @Override
    public void onDeviceConnected(AidlDeviceService serviceManager) {

        try {
            systemInf = AidlSystem.Stub.asInterface(serviceManager
                    .getSystemService());
            showMessage("绑定系统服务接口正常");
        } catch (RemoteException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            showMessage("绑定系统服务接口异常");
        }
    }

    /**
     * 读取终端序列号
     *
     * @createtor：Administrator
     * @date:2015-8-4 上午9:16:41
     */
    public String getTerminalSn() {
        String string = "";
        try {
            String a = systemInf.getSerialNo();
            string = a == null ? "" : a;

        } catch (RemoteException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return string;
    }
}
