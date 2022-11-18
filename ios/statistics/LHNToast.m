//
//  LHNToast.m
//  statistics
//
//  Created by HeartlessSoy on 2020/4/9.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "LHNToast.h"




@implementation LHNToast

RCT_EXPORT_MODULE()
RCT_EXPORT_METHOD(getVersionCode:(RCTResponseSenderBlock)callback) {
  NSDictionary *infoDic=[[NSBundle mainBundle] infoDictionary];
  NSString  *currentVersion=infoDic[@"CFBundleShortVersionString"];
  callback(@[[NSNull null],currentVersion]);
}
@end
