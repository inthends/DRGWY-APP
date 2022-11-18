package com.statistics;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import com.caysn.autoreplyprint.AutoReplyPrint;
import com.facebook.react.bridge.ReactContext;
import com.sun.jna.Pointer;
import com.sun.jna.ptr.IntByReference;

import android.app.Service;
import android.content.Intent;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

public class BTPortPrints extends Service{
	private static final String TAG = "BTPortPrints";
	ReactContext reactContext;

	Bundle mbundle;
	private String deviceaddress = "";
	Activity currentActivity;

	private Pointer h = Pointer.NULL;
	private Boolean isToPrinting = false;
	public void initdata(Bundle aBundle,ReactContext ctx,Activity activity,String deviceadress){
		mbundle = aBundle;
		reactContext = ctx;
		currentActivity = activity;
		deviceaddress = deviceadress;
		AddCallback();
		EnumBle();
	}
	boolean inBleEnum = false;
	private void EnumBle() {
		if (inBleEnum)
			return;
		inBleEnum = true;
		ClosePort();
		isToPrinting = true;
		new Thread(new Runnable() {
			@Override
			public void run() {
				IntByReference cancel = new IntByReference(0);
				AutoReplyPrint.CP_OnBluetoothDeviceDiscovered_Callback callback = new AutoReplyPrint.CP_OnBluetoothDeviceDiscovered_Callback() {
					@Override
					public void CP_OnBluetoothDeviceDiscovered(String device_name, final String device_address, Pointer private_data) {
						if (deviceaddress.equals(device_address)) {//先要搜到
							Log.d(TAG, "CP_OnBluetoothDeviceDiscovered: "+device_address);
							if (isToPrinting){
								OpenPort();//打开端口
								isToPrinting = false;
							}
						}
					}
				};
				AutoReplyPrint.INSTANCE.CP_Port_EnumBleDevice(20000, cancel, callback, null);
				inBleEnum = false;
			}
		}).start();
	}

	AutoReplyPrint.CP_OnPortOpenedEvent_Callback opened_callback = new AutoReplyPrint.CP_OnPortOpenedEvent_Callback() {
		@Override
		public void CP_OnPortOpenedEvent(Pointer handle, String name, Pointer private_data) {
			//开端口成功====打印
			printClick();
		}
	};
	AutoReplyPrint.CP_OnPortOpenFailedEvent_Callback openfailed_callback = new AutoReplyPrint.CP_OnPortOpenFailedEvent_Callback() {
		@Override
		public void CP_OnPortOpenFailedEvent(Pointer handle, String name, Pointer private_data) {
			currentActivity.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					Toast.makeText(currentActivity, "端口打开失败", Toast.LENGTH_SHORT).show();
				}
			});
		}
	};
	AutoReplyPrint.CP_OnPortClosedEvent_Callback closed_callback = new AutoReplyPrint.CP_OnPortClosedEvent_Callback() {
		@Override
		public void CP_OnPortClosedEvent(Pointer h, Pointer private_data) {
			currentActivity.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					ClosePort();
				}
			});
		}
	};
	AutoReplyPrint.CP_OnPrinterStatusEvent_Callback status_callback = new AutoReplyPrint.CP_OnPrinterStatusEvent_Callback() {
		@Override
		public void CP_OnPrinterStatusEvent(Pointer h, final long printer_error_status, final long printer_info_status, Pointer private_data) {
			currentActivity.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					//蓝牙连接状态值监听
				}
			});
		}
	};
	AutoReplyPrint.CP_OnPrinterReceivedEvent_Callback received_callback = new AutoReplyPrint.CP_OnPrinterReceivedEvent_Callback() {
		@Override
		public void CP_OnPrinterReceivedEvent(Pointer h, final int printer_received_byte_count, Pointer private_data) {
			currentActivity.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					//蓝牙连接状态值监听
				}
			});
		}
	};
	AutoReplyPrint.CP_OnPrinterPrintedEvent_Callback printed_callback = new AutoReplyPrint.CP_OnPrinterPrintedEvent_Callback() {
		@Override
		public void CP_OnPrinterPrintedEvent(Pointer h, final int printer_printed_page_id, Pointer private_data) {
			currentActivity.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					//蓝牙获取数据
				}
			});
		}
	};
	private void OpenPort() {
		new Thread(new Runnable() {
			@Override
			public void run() {
				h = AutoReplyPrint.INSTANCE.CP_Port_OpenBtBle(deviceaddress, 1);
				//开完端口 要打印
			}
		}).start();
	}
	private void ClosePort() {
		if (h != Pointer.NULL) {
			AutoReplyPrint.INSTANCE.CP_Port_Close(h);
			h = Pointer.NULL;
		}
	}
	private void printClick() {
		new Thread(new Runnable() {
			@RequiresApi(api = Build.VERSION_CODES.KITKAT)
			@Override
			public void run() {
				try {
					PrintFunction fun = new PrintFunction();
					fun.btBundle = mbundle;
					fun.ctx = currentActivity;
					fun.pos_SampleTicket(h);
					Thread.sleep(100);
					ClosePort();
					RemoveCallback();
				} catch (Throwable tr) {
					tr.printStackTrace();
				}
			}
		}).start();
	};

	@Override
	public void onDestroy() {
		ClosePort();
		RemoveCallback();
		super.onDestroy();
	}

	@Nullable
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	private void AddCallback() {
		AutoReplyPrint.INSTANCE.CP_Port_AddOnPortOpenedEvent(opened_callback, Pointer.NULL);
		AutoReplyPrint.INSTANCE.CP_Port_AddOnPortOpenFailedEvent(openfailed_callback, Pointer.NULL);
		AutoReplyPrint.INSTANCE.CP_Port_AddOnPortClosedEvent(closed_callback, Pointer.NULL);
		AutoReplyPrint.INSTANCE.CP_Printer_AddOnPrinterStatusEvent(status_callback, Pointer.NULL);
		AutoReplyPrint.INSTANCE.CP_Printer_AddOnPrinterReceivedEvent(received_callback, Pointer.NULL);
		AutoReplyPrint.INSTANCE.CP_Printer_AddOnPrinterPrintedEvent(printed_callback, Pointer.NULL);
	}
	private void RemoveCallback() {
		AutoReplyPrint.INSTANCE.CP_Port_RemoveOnPortOpenedEvent(opened_callback);
		AutoReplyPrint.INSTANCE.CP_Port_RemoveOnPortOpenFailedEvent(openfailed_callback);
		AutoReplyPrint.INSTANCE.CP_Port_RemoveOnPortClosedEvent(closed_callback);
		AutoReplyPrint.INSTANCE.CP_Printer_RemoveOnPrinterStatusEvent(status_callback);
		AutoReplyPrint.INSTANCE.CP_Printer_RemoveOnPrinterReceivedEvent(received_callback);
		AutoReplyPrint.INSTANCE.CP_Printer_RemoveOnPrinterPrintedEvent(printed_callback);
	}
}

