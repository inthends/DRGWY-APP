package com.statistics;

import android.Manifest;
import android.app.Activity;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.text.format.DateFormat;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.RequiresApi;

import com.caysn.autoreplyprint.AutoReplyPrint;
import com.sun.jna.Pointer;
import com.sun.jna.ptr.IntByReference;

import java.lang.reflect.Method;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Vector;

public class SearchBTActivity extends Activity implements OnClickListener {

	private LinearLayout linearlayoutdevices;
	private ProgressBar progressBarSearchStatus;

	Button btnSearch;
	SearchBTActivity mActivity;

	private static String TAG = "SearchBTActivity";
	Bundle bundle = null;
	private List<String> arrData = new Vector<String>(20);
	private String addressStr = "";
	private Pointer h = Pointer.NULL;
	SharedPreferences saveput;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_searchbt);

		mActivity = this;
		saveput = getSharedPreferences("divice_address", MODE_PRIVATE);

		progressBarSearchStatus = (ProgressBar) findViewById(R.id.progressBarSearchStatus);
		linearlayoutdevices = (LinearLayout) findViewById(R.id.linearlayoutdevices);

		btnSearch = (Button) findViewById(R.id.buttonSearch);
		btnSearch.setOnClickListener(this);
		btnSearch.setEnabled(true);

		this.bundle = getIntent().getExtras();

		AddCallback();

		if (!hasAllPermissions()) {
			requestAllPermissions();
		}
	}


	@Override
	protected void onDestroy() {
		RemoveCallback();
		ClosePort();
		super.onDestroy();
	}

	public void onClick(View arg0) {
		// TODO Auto-generated method stub
		switch (arg0.getId()) {
			case R.id.buttonSearch: {
				ClosePort();
				try {
					Thread.sleep(200);
					EnumBle();
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		}
	}

	boolean inBleEnum = false;
	private void EnumBle() {
		if (inBleEnum)
			return;
		inBleEnum = true;
		new Thread(new Runnable() {
			@Override
			public void run() {
				IntByReference cancel = new IntByReference(0);
				AutoReplyPrint.CP_OnBluetoothDeviceDiscovered_Callback callback = new AutoReplyPrint.CP_OnBluetoothDeviceDiscovered_Callback() {
					@Override
					public void CP_OnBluetoothDeviceDiscovered(String device_name, final String device_address, Pointer private_data) {
						if (!device_name.equals("null")) {
							Log.d(TAG, "CP_OnBluetoothDeviceDiscovered: "+device_address);
							Button button = new Button(mActivity);
							button.setEnabled(true);
							button.setText(device_name + ": " + device_address);

							for(int i = 0; i < linearlayoutdevices.getChildCount(); ++i)
							{
								Button btn = (Button)linearlayoutdevices.getChildAt(i);
								if(btn.getText().equals(button.getText()))
								{
									return;
								}
							}

							button.setGravity(Gravity.CENTER_VERTICAL
									| Gravity.LEFT);
							button.setOnClickListener(new OnClickListener() {

								public void onClick(View arg0) {
									// TODO Auto-generated method stub
///选择  打开端口 打印
									addressStr = device_address;
									saveDeviceAddress(addressStr);
									if (bundle != null) {
										OpenPort();//打开端口
									}
									else {
										Toast.makeText(mActivity, "设置打印机完毕", Toast.LENGTH_SHORT).show();
										finish();
									}
								}
							});
							button.getBackground().setAlpha(100);
							linearlayoutdevices.addView(button);
						}

						mActivity.runOnUiThread(new Runnable() {
							@Override
							public void run() {
								if (!arrData.contains(device_address))
									arrData.add(device_address);
							}
						});
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
			mActivity.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					Toast.makeText(mActivity, "Open Success", Toast.LENGTH_SHORT).show();
				}
			});
		}
	};
	AutoReplyPrint.CP_OnPortOpenFailedEvent_Callback openfailed_callback = new AutoReplyPrint.CP_OnPortOpenFailedEvent_Callback() {
		@Override
		public void CP_OnPortOpenFailedEvent(Pointer handle, String name, Pointer private_data) {
			mActivity.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					Toast.makeText(mActivity, "Open Failed", Toast.LENGTH_SHORT).show();
				}
			});
		}
	};
	AutoReplyPrint.CP_OnPortClosedEvent_Callback closed_callback = new AutoReplyPrint.CP_OnPortClosedEvent_Callback() {
		@Override
		public void CP_OnPortClosedEvent(Pointer h, Pointer private_data) {
			mActivity.runOnUiThread(new Runnable() {
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
			mActivity.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					Calendar calendar = Calendar.getInstance();
					Date calendarDate = calendar.getTime();
					String time = DateFormat.format("yyyy-MM-dd kk:mm:ss", calendarDate).toString();
					AutoReplyPrint.CP_PrinterStatus status = new AutoReplyPrint.CP_PrinterStatus(printer_error_status, printer_info_status);
					String error_status_string = String.format(" Printer Error Status: 0x%04X", printer_error_status & 0xffff);

				}
			});
		}
	};
	AutoReplyPrint.CP_OnPrinterReceivedEvent_Callback received_callback = new AutoReplyPrint.CP_OnPrinterReceivedEvent_Callback() {
		@Override
		public void CP_OnPrinterReceivedEvent(Pointer h, final int printer_received_byte_count, Pointer private_data) {
			mActivity.runOnUiThread(new Runnable() {
				@Override
				public void run() {

				}
			});
		}
	};
	AutoReplyPrint.CP_OnPrinterPrintedEvent_Callback printed_callback = new AutoReplyPrint.CP_OnPrinterPrintedEvent_Callback() {
		@Override
		public void CP_OnPrinterPrintedEvent(Pointer h, final int printer_printed_page_id, Pointer private_data) {
			mActivity.runOnUiThread(new Runnable() {
				@Override
				public void run() {

				}
			});
		}
	};

	private void OpenPort() {
		new Thread(new Runnable() {
			@Override
			public void run() {
				h = AutoReplyPrint.INSTANCE.CP_Port_OpenBtBle(addressStr, 1);
				printClick();
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
		final String functionName = "Test_Pos_SampleTicket_58MM_1";
		if ((functionName == null) || (functionName.isEmpty()))
			return;
		new Thread(new Runnable() {
			@RequiresApi(api = Build.VERSION_CODES.KITKAT)
			@Override
			public void run() {
				try {
					PrintFunction fun = new PrintFunction();
					fun.btBundle = bundle;
					fun.ctx = mActivity;
					fun.pos_SampleTicket(h);
				} catch (Throwable tr) {
					tr.printStackTrace();
				}
				mActivity.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						ClosePort();
					}
				});
			}
		}).start();
	};

	private static final int RequestCode_RequestAllPermissions = 1;
	private void requestAllPermissions() {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
			String permissions[] = {
					android.Manifest.permission.ACCESS_FINE_LOCATION,
					android.Manifest.permission.ACCESS_COARSE_LOCATION,
					android.Manifest.permission.CAMERA,
					android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
					Manifest.permission.READ_EXTERNAL_STORAGE,
			};
			requestPermissions(permissions, RequestCode_RequestAllPermissions);
		}
	}
	@Override
	public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
		switch (requestCode) {
			case RequestCode_RequestAllPermissions:
				Toast.makeText(this, "有权限", Toast.LENGTH_SHORT).show();
				break;
		}
	}
	private boolean hasAllPermissions() {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
			boolean hasLocationPermission = (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED);
			boolean hasCameraPermission = (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED);
			boolean hasStoragePermission = (checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED);
			return hasLocationPermission && hasCameraPermission && hasStoragePermission;
		}
		return true;
	}
	public void saveDeviceAddress(String addressStr){
		saveput.edit().putString("deviceadress",addressStr).apply();//apply才会写入到xml配置文件里面
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
