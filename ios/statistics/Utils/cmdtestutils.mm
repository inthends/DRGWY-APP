#include "cmdtestutils.h"

#include <stdio.h>
#include <stdlib.h>
#import <UIKit/UIKit.h>

long Utils_GetFileSize(char *strFileName)
{
	FILE *fp = fopen(strFileName, "rb");
    if(!fp) return -1;  
    fseek(fp,0L,SEEK_END);  
    long size=ftell(fp);  
    fclose(fp);
    return size;  
}

long Utils_ReadFile(char *strFileName, unsigned char *buffer, long length)
{
	FILE *fp = fopen(strFileName, "rb");
    if(!fp) return -1;  
    size_t readed = fread(buffer, 1, length, fp);
    fclose(fp);
    return (long)readed;  
}

void Utils_MessageBox(const char *msg)
{
    dispatch_sync(dispatch_get_main_queue(), ^{
        UIAlertView* v = [[UIAlertView alloc] initWithTitle:@"提示" message:[NSString stringWithFormat:@"%s", msg] delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [v show];
    });
}

void Utils_MessageBox2With(NSString *msg)
{
    dispatch_sync(dispatch_get_main_queue(), ^{
        UIAlertView* v = [[UIAlertView alloc] initWithTitle:@"提示" message:msg delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [v show];
    });
}

UIImage *Utils_ScaleUIImage(UIImage *image, CGSize reSize)
{
    UIGraphicsBeginImageContext(CGSizeMake(reSize.width, reSize.height));
    [image drawInRect:CGRectMake(0, 0, reSize.width, reSize.height)];
    UIImage *reSizeImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return reSizeImage;
}
