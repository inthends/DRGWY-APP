#ifndef CMDTESTUTILS_H
#define CMDTESTUTILS_H

#import <UIKit/UIKit.h>
#import <autoreplyprint/autoreplyprint.h>

long Utils_GetFileSize(char *strFileName);
long Utils_ReadFile(char *strFileName, unsigned char *buffer, long length);
void Utils_MessageBox(const char *msg);
void Utils_MessageBox2With(NSString *msg);
UIImage *Utils_ScaleUIImage(UIImage *image, CGSize reSize);

#endif // CMDTESTUTILS_H
