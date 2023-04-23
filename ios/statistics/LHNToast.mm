//
//  LHNToast.m
//  statistics
//
//  Created by HeartlessSoy on 2020/4/9.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "LHNToast.h"
#import "AppDelegate.h"
#import "MBProgressHUD.h"
#import "cmdtestutils.h"
#import "cmdtestunit.h"
#import "cmdtestfunction.h"

@interface LHNToast()
@property void *pHandle;
@property(nonatomic, strong) NSMutableDictionary *infoDataMuDic;
@property(nonatomic, strong) MBProgressHUD *hud;
@property(nonatomic, assign) BOOL isPrinter;
@end

@implementation LHNToast
@synthesize pHandle;

+ (void)initialize {
  // 服务唤起
  // 端口关闭
  CP_Port_AddOnPortClosedEvent(HandleOnPortClosedEvent, (__bridge void *)self);
  // 打印机状态更新
  CP_Printer_AddOnPrinterStatusEvent(HandleOnPrinterStatusEvent, (__bridge void *)self);
  // 打印机已接收字节数更新
  CP_Printer_AddOnPrinterReceivedEvent(HandleOnPrinterReceivedEvent, (__bridge void *)self);
  // 打印机已打印页面 ID 更新
  CP_Printer_AddOnPrinterPrintedEvent(HandleOnPrinterPrintedEvent, (__bridge void *)self);
}

// 状态监听
static void HandleOnPortClosedEvent(void *handle, void *private_data);
static void HandleOnPrinterStatusEvent(void *handle, const long long printer_error_status, const long long printer_info_status, void *private_data);
static void HandleOnPrinterReceivedEvent(void *handle, const unsigned int printer_received_byte_count, void *private_data);
static void HandleOnPrinterPrintedEvent(void *handle, const unsigned int printer_printed_page_id, void *private_data);

RCT_EXPORT_MODULE()
RCT_EXPORT_METHOD(getVersionCode:(RCTResponseSenderBlock)callback) {
  NSDictionary *infoDic=[[NSBundle mainBundle] infoDictionary];
  NSString  *currentVersion=infoDic[@"CFBundleShortVersionString"];
  callback(@[[NSNull null],currentVersion]);
}
RCT_EXPORT_METHOD(printTicket:(NSDictionary *)infoData) {
  NSLog(@"====== infoData %@",infoData);
  if (infoData && [infoData isKindOfClass:[NSDictionary class]]) {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.infoDataMuDic = [NSMutableDictionary dictionaryWithDictionary:infoData];
        if (self.infoDataMuDic && self.infoDataMuDic.count > 0) {
            self.pHandle = 0;
            [self withProgressHUDForPrinter];
        }
    });
  }
}

- (void)autoPrinter {
  int nLineStartPos[3] = { 0, 201, 401};
  int nLineEndPos[3] = { 200, 400, 575};
  
  CP_Pos_SetAlignment(self.pHandle, CP_Pos_Alignment_HCenter);
  CP_Pos_SetTextScale(self.pHandle, 1, 1);
  CP_Pos_SetMultiByteMode(self.pHandle);
  CP_Pos_SetMultiByteEncoding(self.pHandle, CP_MultiByteEncoding_GBK);
  CP_Pos_PrintTextInGBK(self.pHandle, L"POS机收款凭据\r\n");
  
  CP_Pos_SetTextScale(self.pHandle, 0, 0);
  CP_Pos_SetAlignment(self.pHandle, CP_Pos_Alignment_Left);
  NSString *mchNameStr = [NSString stringWithFormat:@"商户名称：%@\r\n", [self.infoDataMuDic objectForKey:@"mchName"]];
  CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: mchNameStr]);
  
  NSString *tradeNoStr = [NSString stringWithFormat:@"商户号：%@\r\n", [self.infoDataMuDic objectForKey:@"mchId"]];
  CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: tradeNoStr]);
  
  NSString *allNameStr = [NSString stringWithFormat:@"房屋全称：%@\r\n", [self.infoDataMuDic objectForKey:@"allName"]];
  CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: allNameStr]);
  NSString *payTypeStr = [NSString stringWithFormat:@"支付渠道：%@\r\n", [self.infoDataMuDic objectForKey:@"payType"]];
  CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: payTypeStr]);
  NSString *mchIdStr = [NSString stringWithFormat:@"订单号：%@\r\n", [self.infoDataMuDic objectForKey:@"tradeNo"]];
  CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: mchIdStr]);
  NSString *userNameStr = [NSString stringWithFormat:@"收款人：%@\r\n", [self.infoDataMuDic objectForKey:@"userName"]];
  CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: userNameStr]);
  NSString *billDateStr = [NSString stringWithFormat:@"收款日期：%@\r\n", [self.infoDataMuDic objectForKey:@"billDate"]];
  CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: billDateStr]);
  NSString *amountStr = [NSString stringWithFormat:@"实付金额：%@\r\n", [self.infoDataMuDic objectForKey:@"amount"]];
  CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: amountStr]);
  CP_Pos_SetTextLineHeight(self.pHandle, 40);
  CP_Pos_PrintTextInGBK(self.pHandle, L"付款明细\r\n");
  CP_Pos_SetTextLineHeight(self.pHandle, 40);
  // 物业服务费
  NSMutableArray *billsArr = [self.infoDataMuDic objectForKey:@"bills"];
  if (billsArr && billsArr.count > 0) {
    // 横线
    CP_Pos_PrintMultipleHorizontalLinesAtOneRow(self.pHandle, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
    CP_Pos_PrintMultipleHorizontalLinesAtOneRow(self.pHandle, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);

    CP_Pos_SetTextLineHeight(self.pHandle, 2);
    CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: @"\r\n"]);
    CP_Pos_SetTextLineHeight(self.pHandle, 36);
    for (NSMutableDictionary *bill in billsArr) {
      NSString *feeName = [bill objectForKey:@"feeName"];
      NSString *amount = [bill objectForKey:@"amount"];
      NSString *feeName_amountStr = [NSString stringWithFormat:@"%@：    %@\r\n", feeName, amount];
      CP_Pos_SetTextScale(self.pHandle, 0, 0);
      CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: feeName_amountStr]);
      NSString *timeStr = [NSString stringWithFormat:@"%@ 至 %@\r\n", [bill objectForKey:@"beginDate"], [bill objectForKey:@"endDate"]];
      CP_Pos_SetTextScale(self.pHandle, 0, 0);
      CP_Pos_PrintTextInGBK(self.pHandle, [self nsstringToCharWith: timeStr]);
    }
    // 横线
    CP_Pos_PrintMultipleHorizontalLinesAtOneRow(self.pHandle, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
    CP_Pos_PrintMultipleHorizontalLinesAtOneRow(self.pHandle, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
  }
  CP_Pos_FeedLine(self.pHandle, 1);
  CP_Pos_SetTextLineHeight(self.pHandle, 30);
  CP_Pos_PrintTextInGBK(self.pHandle, L"付款人（签字）\r\n");
  CP_Pos_PrintTextInGBK(self.pHandle, L"收款单位（签字）\r\n");
  CP_Pos_SetTextLineHeight(self.pHandle, 30);
  CP_Pos_SetAlignment(self.pHandle, CP_Pos_Alignment_HCenter);

  if(![[self.infoDataMuDic objectForKey:@"stampUrl"] isEqual:[NSNull null]]) {
      NSString *stampUrl = [self.infoDataMuDic objectForKey:@"stampUrl"];
      NSURL *imgUrl = [NSURL URLWithString: stampUrl];
      UIImage *selectedImage = [UIImage imageWithData:[NSData dataWithContentsOfURL:imgUrl]];
      if (selectedImage) {
          dispatch_async(dispatch_get_global_queue(0, 0), ^{
              Test_StandardMode_ImagePrint(self.pHandle, selectedImage, CP_ImageBinarizationMethod_ErrorDiffusion, CP_ImageCompressionMethod_Level2);
              {
                CP_Pos_Beep(self.pHandle, 1, 500);
              }
              Test_Pos_QueryPrintResult(self.pHandle);
              dispatch_sync(dispatch_get_main_queue(), ^{
                  [self disconnectPrinter];
              });
          });
      }
  } else {
      dispatch_async(dispatch_get_global_queue(0, 0), ^{
          {
            CP_Pos_FeedAndHalfCutPaper(self.pHandle);
            CP_Pos_Beep(self.pHandle, 1, 500);
          }
          Test_Pos_QueryPrintResult(self.pHandle);
          dispatch_sync(dispatch_get_main_queue(), ^{
              [self disconnectPrinter];
          });
      });
  }
}

/* -------------------------------------------------------------------------------------------------------------- */
void btdevice_discovered(const char *device_name, const char *device_address, const void *private_data) {
    __block LHNToast *obj = (__bridge LHNToast *)private_data;
    dispatch_sync(dispatch_get_main_queue(), ^{
        NSString *strNameAddress = [NSString stringWithFormat:@"%s: %s", device_name, device_address];
        NSLog(@"====== strNameAddress %@", strNameAddress);
        NSString *macAddress = [NSString stringWithFormat:@"%s", device_address];
        const char *ble_address = strdup([macAddress UTF8String]);
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            obj.pHandle = CP_Port_OpenBtBle(ble_address, 1);
            dispatch_sync(dispatch_get_main_queue(), ^{
                if (obj.pHandle != 0 && !obj.isPrinter) {
                  obj.isPrinter = YES;
                  obj.hud.label.text = @"正在打印中...";
                  [obj autoPrinter];
                }
            });
        });
    });
}

- (void)withProgressHUDForPrinter {
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  UIView *currentView = app.window.rootViewController.view;
  self.hud = [MBProgressHUD showHUDAddedTo:currentView animated:YES];
  dispatch_async(dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0), ^{
      dispatch_async(dispatch_get_main_queue(), ^{
        [self searchBlePrinter];
        self.hud.label.text = @"正在打印中...";
        bool isOpen = CP_Port_IsOpened(self.pHandle);
        if (!isOpen) {
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3*NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                bool isSecondOpen = CP_Port_IsOpened(self.pHandle);
                if (isSecondOpen) {
                    [self.hud hideAnimated:YES];
                } else {
                    self.hud.label.text = @"请先打开蓝牙打印机开关";
                    self.hud.mode = MBProgressHUDModeText;
                    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2*NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                      [self.hud hideAnimated:YES];
                    });
                }
            });
        }
      });
  });
}

- (void)searchBlePrinter {
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        int cancel = 0;
        CP_Port_EnumBleDevice(3000, &cancel, btdevice_discovered, (__bridge const void *)self);
    });
}

//- (void)connectPrinter {
//    NSString *bleMacDefaults = [[NSUserDefaults standardUserDefaults] stringForKey:@"MAC_ADDRESS"];
//    const char *ble_address = strdup([bleMacDefaults UTF8String]);
//    dispatch_async(dispatch_get_global_queue(0, 0), ^{
//        self.pHandle = CP_Port_OpenBtBle(ble_address, 1);
//    });
//}

- (void)disconnectPrinter {
//    CP_Port_RemoveOnPortClosedEvent(HandleOnPortClosedEvent);
//    CP_Printer_RemoveOnPrinterStatusEvent(HandleOnPrinterStatusEvent);
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        CP_Port_Close(self.pHandle);
        self.pHandle = 0;
        dispatch_sync(dispatch_get_main_queue(), ^{
            self.isPrinter = NO;
            [self.hud hideAnimated:YES];
        });
    });
}

// 处理类型
- (wchar_t *)nsstringToCharWith:(NSString *)paramStr {
  wchar_t* charStr = (wchar_t *)[paramStr cStringUsingEncoding:NSUTF32StringEncoding];
  return charStr;
}

- (wchar_t *)nsstringToCharWithGBK:(NSString *)str {
  wchar_t *charStr = (wchar_t *)[str cStringUsingEncoding:kCFStringEncodingGB_18030_2000];
  return charStr;
}

/* ------------------------------------------------------------------------- */

static void HandleOnPortClosedEvent(void *handle, void *private_data) {
    NSLog(@"====== closed_event");
    dispatch_sync(dispatch_get_main_queue(), ^{
//        LHNToast *obj = (__bridge LHNToast *)private_data;
//        obj.pHandle = 0;
//        [obj.hud hideAnimated:YES];
    });
}

static void HandleOnPrinterStatusEvent(void *handle, const long long printer_error_status, const long long printer_info_status, void *private_data) {
    dispatch_sync(dispatch_get_main_queue(), ^{
        //LHNToast *obj = (__bridge LHNToast *)private_data;
        NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        [formatter setDateFormat:@"HH:mm:ss"];
        NSString *timeString = [formatter stringFromDate:[NSDate date]];
        
        // error status
        {
            char msg[1000] = { 0, };
            sprintf(&msg[strlen(msg)], " ErrorStatus:0x%llX", printer_error_status);
            if (printer_error_status) {
                if (CP_PRINTERSTATUS_ERROR_CUTTER(printer_error_status))
                    sprintf(&msg[strlen(msg)], "%s", "[Cutter Error]");
                if (CP_PRINTERSTATUS_ERROR_FLASH(printer_error_status))
                    sprintf(&msg[strlen(msg)], "%s", "[Flash Error]");
                if (CP_PRINTERSTATUS_ERROR_NOPAPER(printer_error_status))
                    sprintf(&msg[strlen(msg)], "%s", "[No Paper]");
                if (CP_PRINTERSTATUS_ERROR_VOLTAGE(printer_error_status))
                    sprintf(&msg[strlen(msg)], "%s", "[Voltage Error]");
                if (CP_PRINTERSTATUS_ERROR_MARKER(printer_error_status))
                    sprintf(&msg[strlen(msg)], "%s", "[Marker Error]");
                if (CP_PRINTERSTATUS_ERROR_ENGINE(printer_error_status))
                    sprintf(&msg[strlen(msg)], "%s", "[Engine Error]");
                if (CP_PRINTERSTATUS_ERROR_OVERHEAT(printer_error_status))
                    sprintf(&msg[strlen(msg)], "%s", "[Overheat]");
                if (CP_PRINTERSTATUS_ERROR_COVERUP(printer_error_status))
                    sprintf(&msg[strlen(msg)], "%s", "[Coverup]");
                if (CP_PRINTERSTATUS_ERROR_MOTOR(printer_error_status))
                    sprintf(&msg[strlen(msg)], "%s", "[Motor Error]");
            }
            // obj.printerErrorStatus = [NSString stringWithFormat:@"%@%s", timeString, msg];
            NSLog(@"====== errorStatus %@", [NSString stringWithFormat:@"%@%s", timeString, msg]);
        }
        
        // info status
        {
            char msg[1000] = { 0, };
            sprintf(&msg[strlen(msg)], " InfoStatus:0x%llX", printer_info_status);
            if (CP_PRINTERSTATUS_INFO_LABELMODE(printer_info_status))
              sprintf(&msg[strlen(msg)], "%s", "[Label Mode]");
            if (CP_PRINTERSTATUS_INFO_LABELPAPER(printer_info_status))
              sprintf(&msg[strlen(msg)], "%s", "[Label Paper]");
            if (CP_PRINTERSTATUS_INFO_PAPERNOFETCH(printer_info_status))
              sprintf(&msg[strlen(msg)], "%s", "[Paper No Fetch]");
            NSLog(@"====== InfoStatus %@", [NSString stringWithFormat:@"%@%s", timeString, msg]);
        }
    });
}

static void HandleOnPrinterReceivedEvent(void *handle, const unsigned int printer_received_byte_count, void *private_data) {
    dispatch_sync(dispatch_get_main_queue(), ^{
        //LHNToast *vc = (__bridge LHNToast *)private_data;
        NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        [formatter setDateFormat:@"HH:mm:ss"];
        NSString *timeString = [formatter stringFromDate:[NSDate date]];
        
        char msg[1000] = { 0, };
        sprintf(&msg[strlen(msg)], " Printer Received Bytes: %d", printer_received_byte_count);
      
        NSString *printerReceivedStr = [NSString stringWithFormat:@"%@ %s", timeString, msg];
        NSLog(@"====== receiverd%@", printerReceivedStr);
    });
}

static void HandleOnPrinterPrintedEvent(void *handle, const unsigned int printer_printed_page_id, void *private_data) {
    dispatch_sync(dispatch_get_main_queue(), ^{
        // LHNToast *vc = (__bridge LHNToast *)private_data;
        NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        [formatter setDateFormat:@"HH:mm:ss"];
        NSString *timeString = [formatter stringFromDate:[NSDate date]];
        char msg[1000] = { 0, };
        sprintf(&msg[strlen(msg)], " Printer Printed Page: %d", printer_printed_page_id);
        NSString *printedPageId = [NSString stringWithFormat:@"%@ %s", timeString, msg];
        NSLog(@"====== printedPageId%@", printedPageId);
    });
}

/* ------------------------------------------------------------------------- */
@end
