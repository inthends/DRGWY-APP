#include "cmdtestfunction.h"
#include "cmdtestutils.h"
#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>
#import <UIKit/UIKit.h>

static unsigned char *Get_StandardMode_ImagePrint_Cmd(UIImage *image, CP_ImageBinarizationMethod binarization_method, CP_ImageCompressionMethod compression_method, int printable_width, unsigned int *cmd_length)
{
    unsigned char *cmd_buffer = 0;

    void *h = CP_Port_OpenMemoryBuffer(0x100000);
    if (h) {

        if (image) {
            int width = image.size.width;
            int height = image.size.height;

            int page_width = printable_width;
            int dstw = width;
            int dsth = height;
            if (dstw > page_width) {
                dstw = page_width;
                dsth = (int)(dstw*((double)height/width));
            }
            image = Utils_ScaleUIImage(image, CGSizeMake(dstw, dsth));
            NSData *data = UIImagePNGRepresentation(image);
            if (data) {
                CP_Pos_PrintRasterImageFromData(h, dstw, dsth, (unsigned char *)data.bytes, (unsigned int)data.length, binarization_method, compression_method);
                CP_Pos_FeedLine(h, 3);
            }
        }
        
        unsigned char *data_pointer = CP_Port_GetMemoryBufferDataPointer(h);
        unsigned int data_length = CP_Port_GetMemoryBufferDataLength(h);
        if (data_pointer && data_length) {
            cmd_buffer = (unsigned char *)malloc(data_length);
            if (cmd_buffer) {
                memcpy(cmd_buffer, data_pointer, data_length);
                *cmd_length = data_length;
            }
        }

        CP_Port_Close(h);
    }

    return cmd_buffer;
}

void Test_StandardMode_ImagePrint(void *h, UIImage *image, CP_ImageBinarizationMethod binarization_method, CP_ImageCompressionMethod compression_method)
{
    unsigned int width_mm, height_mm, dots_per_mm;
    if (CP_Printer_GetPrinterResolutionInfo(h, &width_mm, &height_mm, &dots_per_mm)) {
        unsigned int printable_width = width_mm * dots_per_mm;
        if (printable_width > 0) {
            unsigned int cmd_length = 0;
            unsigned char *cmd_buffer = Get_StandardMode_ImagePrint_Cmd(image, binarization_method, compression_method, printable_width, &cmd_length);
            if (cmd_buffer && cmd_length) {
                
                NSDate *begin = [NSDate date];
                int written = CP_Port_Write(h, cmd_buffer, cmd_length, 100000);
                NSDate *end = [NSDate date];
                NSTimeInterval used_second = [end timeIntervalSinceDate:begin];
                
                Test_Pos_QueryPrintResultAndShowDataTransferResult(h, written, used_second);
                
                free(cmd_buffer);
            }
        }
    }
}

void Test_StandardMode_58mmSampleTicket1(void * h)
{
    int paperWidth = 384;
    
    CP_Pos_ResetPrinter(h);
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);
    
    CP_Pos_PrintText(h, "123xxstreet,xxxcity,xxxxstate\r\n");
    CP_Pos_SetAlignment(h, CP_Pos_Alignment_Right);
    CP_Pos_PrintText(h, "TEL 9999-99-9999  C#2\r\n");
    CP_Pos_SetAlignment(h, CP_Pos_Alignment_HCenter);
    CP_Pos_PrintText(h, "2018-06-19 14:09:00");
    CP_Pos_FeedLine(h, 1);
    
    CP_Pos_FeedLine(h, 1);
    CP_Pos_PrintText(h, "apples");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12*6);
    CP_Pos_PrintText(h, "$10.00");
    CP_Pos_FeedLine(h, 1);
    CP_Pos_PrintText(h, "grapes");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12*6);
    CP_Pos_PrintText(h, "$20.00");
    CP_Pos_FeedLine(h, 1);
    CP_Pos_PrintText(h, "bananas");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12*6);
    CP_Pos_PrintText(h, "$30.00");
    CP_Pos_FeedLine(h, 1);
    CP_Pos_PrintText(h, "lemons");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12*6);
    CP_Pos_PrintText(h, "$40.00");
    CP_Pos_FeedLine(h, 1);
    CP_Pos_PrintText(h, "oranges");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12*7);
    CP_Pos_PrintText(h, "$100.00");
    CP_Pos_FeedLine(h, 1);
    CP_Pos_FeedLine(h, 1);
    CP_Pos_PrintText(h, "Before adding tax");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12*7);
    CP_Pos_PrintText(h, "$200.00");
    CP_Pos_FeedLine(h, 1);
    CP_Pos_PrintText(h, "tax 5.0%");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12*6);
    CP_Pos_PrintText(h, "$10.00");
    CP_Pos_FeedLine(h, 1);
    char line[100] = { 0, };
    memset(line, ' ', paperWidth / 12);
    CP_Pos_SetTextUnderline(h, 2);
    CP_Pos_PrintText(h, line);
    CP_Pos_SetTextUnderline(h, 0);
    CP_Pos_FeedLine(h, 1);
    CP_Pos_SetTextScale(h, 1, 0);
    CP_Pos_PrintText(h, "total");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12*2*7);
    CP_Pos_PrintText(h, "$190.00");
    CP_Pos_SetTextScale(h, 0, 0);
    CP_Pos_FeedLine(h, 1);
    CP_Pos_PrintText(h, "Customer's payment");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12*7);
    CP_Pos_PrintText(h, "$200.00");
    CP_Pos_FeedLine(h, 1);
    CP_Pos_PrintText(h, "Change");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, paperWidth - 12*6);
    CP_Pos_PrintText(h, "$10.00");
    CP_Pos_FeedLine(h, 1);
    
    CP_Pos_SetBarcodeHeight(h, 60);
    CP_Pos_SetBarcodeUnitWidth(h, 3);
    CP_Pos_SetBarcodeReadableTextPosition(h, CP_Pos_BarcodeTextPrintPosition_BelowBarcode);
    CP_Pos_PrintBarcode(h, CP_Pos_BarcodeType_UPCA, "12345678901");
    
    CP_Pos_Beep(h, 1, 500);
    
    Test_Pos_QueryPrintResult(h);
}

void Test_StandardMode_80mmSampleTicket1(void * h)
{
	int nLineStartPos[3] = { 0, 201, 401};
    int nLineEndPos[3] = { 200, 400, 575};

    {
        CP_Pos_ResetPrinter(h);
        CP_Pos_FeedLine(h, 2);
    }

    {
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
    }

    {
        CP_Pos_SetMultiByteMode(h);
        CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);
        CP_Pos_FeedLine(h, 2);
        CP_Pos_SetAlignment(h, CP_Pos_Alignment_Right);
        CP_Pos_PrintTextInUTF8(h, L"服务台\r\n");
    }

    {
        CP_Pos_FeedLine(h, 2);

        int nStartPos = 0;
        int nEndPos = 120;
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, 1, &nStartPos, &nEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, 1, &nStartPos, &nEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, 1, &nStartPos, &nEndPos);
        CP_Pos_FeedDot(h, 10);
        CP_Pos_SetAlignment(h, CP_Pos_Alignment_Left);
        CP_Pos_SetTextBold(h, true);
        CP_Pos_SetTextScale(h, 1, 1);
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 12);
        CP_Pos_PrintTextInUTF8(h, L"圆桌");
        CP_Pos_FeedDot(h, 0);
        CP_Pos_SetTextScale(h, 0, 0);
        CP_Pos_FeedDot(h, 10);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, 1, &nStartPos, &nEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, 1, &nStartPos, &nEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, 1, &nStartPos, &nEndPos);
        CP_Pos_FeedLine(h, 1);
        CP_Pos_SetTextBold(h, false);
        CP_Pos_PrintTextInUTF8(h, L"麻辣香锅（上梅林店）\r\n2018年2月7日15:51:00\r\n\r\n");
    }

    {
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
    }

    {
        CP_Pos_SetAlignment(h, CP_Pos_Alignment_HCenter);
        CP_Pos_SetTextScale(h, 1, 1);
        CP_Pos_PrintTextInUTF8(h, L"\r\n15-D-一楼-大厅-散座\r\n");
        CP_Pos_SetAlignment(h, CP_Pos_Alignment_Left);
        CP_Pos_SetTextScale(h, 0, 0);
        CP_Pos_PrintTextInUTF8(h, L"\r\n扫码点餐订单\r\n店内用餐\r\n7人\r\n");
    }

    {
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
    }

    {
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 0);
        CP_Pos_PrintTextInUTF8(h, L"\r\n热菜类\r\n");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 80);
        CP_Pos_PrintTextInUTF8(h, L"鱼香肉丝");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 200);
        CP_Pos_PrintTextInUTF8(h, L"1");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 480);
        CP_Pos_PrintTextInUTF8(h, L"¥23.50\r\n");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 80);
        CP_Pos_PrintTextInUTF8(h, L"麻辣鸡丝");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 200);
        CP_Pos_PrintTextInUTF8(h, L"1");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 480);
        CP_Pos_PrintTextInUTF8(h, L"¥23.50\r\n");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 0);

        CP_Pos_PrintTextInUTF8(h, L"凉菜类\r\n");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 80);
        CP_Pos_PrintTextInUTF8(h, L"凉拌腐竹");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 200);
        CP_Pos_PrintTextInUTF8(h, L"1");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 480);
        CP_Pos_PrintTextInUTF8(h, L"¥23.50\r\n");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 80);
        CP_Pos_PrintTextInUTF8(h, L"糖醋花生");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 200);
        CP_Pos_PrintTextInUTF8(h, L"1");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 480);
        CP_Pos_PrintTextInUTF8(h, L"¥23.50\r\n");
    }

    {
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
    }

    {
        CP_Pos_FeedDot(h, 30);
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 80);
        CP_Pos_PrintTextInUTF8(h, L"消毒餐具");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 200);
        CP_Pos_PrintTextInUTF8(h, L"7");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 480);
        CP_Pos_PrintTextInUTF8(h, L"¥14.00\r\n");
    }

    {
        CP_Pos_FeedLine(h, 2);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_FeedLine(h, 1);
    }

    {
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 0);
        CP_Pos_PrintTextInUTF8(h, L"在线支付");
        CP_Pos_SetHorizontalAbsolutePrintPosition(h, 480);
        CP_Pos_PrintTextInUTF8(h, L"¥114.00\r\n");
    }

    {
        CP_Pos_PrintTextInUTF8(h, L"备注\r\n");
        CP_Pos_SetPrintAreaLeftMargin(h, 80);
        CP_Pos_PrintTextInUTF8(h, L"所有菜都不要放葱，口味要微辣。百事可乐不要加冰。上菜快点，太慢了！！\r\n\r\n");
        CP_Pos_SetPrintAreaLeftMargin(h, 0);
    }

    {
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
        CP_Pos_FeedLine(h, 1);
    }

    {
        CP_Pos_SetAlignment(h, CP_Pos_Alignment_HCenter);
        CP_Pos_PrintQRCode(h, 0, CP_QRCodeECC_L, "麻辣香锅");
        CP_Pos_PrintTextInUTF8(h, L"\r\n用心服务每一天\r\n40008083030\r\n\r\n");
    }

    {
       CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
       CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, sizeof(nLineStartPos) / sizeof(int), nLineStartPos, nLineEndPos);
    }

    {
        CP_Pos_FeedAndHalfCutPaper(h);
        CP_Pos_Beep(h, 1, 500);
    }
    
    Test_Pos_QueryPrintResult(h);
}

void Test_Port_Write(void * h)
{
    // send this cmd to print a selftest page
    uint8_t cmd[] = { 0x12, 0x54 };
    if (CP_Port_Write(h, cmd, sizeof(cmd), 1000) != (int32_t)sizeof(cmd))
        Utils_MessageBox("Write failed");
}

void Test_Port_Read(void * h)
{
    // send this cmd to query printer status
    uint8_t cmd[] = { 0x10, 0x04, 0x01 };
    CP_Port_SkipAvailable(h);
    if (CP_Port_Write(h, cmd, sizeof(cmd), 1000) == (int32_t)sizeof(cmd)) {
        uint8_t status;
        if (CP_Port_Read(h, &status, 1, 2000) == 1) {
            char msg[100];
            sprintf(msg, "Status: %02X", status);
            Utils_MessageBox(msg);
        } else {
            Utils_MessageBox("Read failed");
        }
    } else {
        Utils_MessageBox("Write failed");
    }
}

void Test_Port_Available(void * h)
{
    int available = CP_Port_Available(h);
    char msg[100];
    sprintf(msg, "available: %d", available);
    Utils_MessageBox(msg);
}

void Test_Port_SkipAvailable(void * h)
{
    CP_Port_SkipAvailable(h);
}

void Test_Port_IsConnectionValid(void * h)
{
    bool valid = CP_Port_IsConnectionValid(h);
    char msg[100];
    sprintf(msg, "valid: %d", valid);
    Utils_MessageBox(msg);
}

void Test_Printer_GetPrinterInfo(void * h)
{
    long long printer_error_status;
    long long printer_info_status;
    unsigned int printer_received_byte_count;
    unsigned int printer_printed_page_id;
    long long timestamp_ms_printer_status;
    long long timestamp_ms_printer_received;
    long long timestamp_ms_printer_printed;
    if (CP_Printer_GetPrinterStatusInfo(h, &printer_error_status, &printer_info_status, &timestamp_ms_printer_status) &&
            CP_Printer_GetPrinterReceivedInfo(h, &printer_received_byte_count, &timestamp_ms_printer_received) &&
            CP_Printer_GetPrinterPrintedInfo(h, &printer_printed_page_id, &timestamp_ms_printer_printed)) {
        char msg[1000];
        sprintf(msg, "Printer Error Status: 0x%llX\r\nPrinter Info Status: 0x%llX\r\nPrinter Received Byte Count: %u\r\nPrinter Printed Page ID: %u\r\n", printer_error_status, printer_info_status, printer_received_byte_count, printer_printed_page_id);
        Utils_MessageBox(msg);
    }
}

void Test_Printer_ClearPrinterBuffer(void * h)
{
    CP_Printer_ClearPrinterBuffer(h);
}

void Test_Pos_QueryPrintResult(void * h)
{
    bool result = CP_Pos_QueryPrintResult(h, 30000);
    if (!result)
        Utils_MessageBox2With(@"打印失败");
    else
        Utils_MessageBox2With(@"打印成功");
}
void Test_Pos_QueryPrintResultAndShowDataTransferResult(void * h, int data_count, double used_second)
{
    bool result = CP_Pos_QueryPrintResult(h, 30000);
    if (!result) {
        Utils_MessageBox("Print failed");
    } else {
        char msg[1000] = { 0, };
        double data_speed = 0;
        if ((data_count > 0) && (used_second > 0)) {
            data_speed = data_count / used_second / 1024;
        }
//        sprintf(msg, "Print Success\r\nTotal %d Bytes, Speed %.1fkb/s", data_count, data_speed);
//        Utils_MessageBox(msg);
    }
}

void Test_Pos_KickOutDrawer(void * h)
{
    CP_Pos_KickOutDrawer(h, 0, 100, 100);
    bool result = CP_Pos_KickOutDrawer(h, 1, 100, 100);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_Beep(void * h)
{
    bool result = CP_Pos_Beep(h, 3, 300);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_FeedAndHalfCutPaper(void * h)
{
    bool result = CP_Pos_FeedAndHalfCutPaper(h);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_FullCutPaper(void * h)
{
    bool result = CP_Pos_FullCutPaper(h);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_HalfCutPaper(void * h)
{
    bool result = CP_Pos_HalfCutPaper(h);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_Feed(void * h)
{
    CP_Pos_PrintText(h, "12345678901234567890");
    CP_Pos_FeedLine(h, 4);
    CP_Pos_PrintText(h, "12345678901234567890");
    CP_Pos_FeedDot(h, 100);
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_PrintSelfTestPage(void * h)
{
    bool result = CP_Pos_PrintSelfTestPage(h);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_PrintText(void * h)
{
    CP_Pos_PrintText(h, "12345678901234567890\r\n");
    bool result = CP_Pos_PrintText(h, "12345678901234567890\r\n");
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_PrintTextInUTF8(void * h)
{
    const wchar_t *str =
                    L"1234567890\r\n"
                    L"abcdefghijklmnopqrstuvwxyz\r\n"
                    L"ΑΒΓΔΕΖΗΘΙΚ∧ΜΝΞΟ∏Ρ∑ΤΥΦΧΨΩ\r\n"
                    L"αβγδεζηθικλμνξοπρστυφχψω\r\n"
                    L"你好，欢迎使用！\r\n"
                    L"你號，歡迎使用！\r\n"
                    L"梦を见る事が出来なければ\r\n未来を変える事は出来ません\r\n"
                    L"왕관을 쓰려는자\r\n그 무게를 견뎌라\r\n";
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);
    bool result = CP_Pos_PrintTextInUTF8(h, str);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintTextInGBK(void * h)
{
    const wchar_t *str = L"1234567890\r\nabcdefghijklmnopqrstuvwxyz\r\n你好，欢迎使用！\r\n你號，歡迎使用！\r\n";
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_GBK);
    bool result = CP_Pos_PrintTextInGBK(h, str);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintTextInBIG5(void * h)
{
    const wchar_t *str = L"1234567890\r\nabcdefghijklmnopqrstuvwxyz\r\n你號，歡迎使用！\r\n";
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_BIG5);
    bool result = CP_Pos_PrintTextInBIG5(h, str);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintTextInShiftJIS(void * h)
{
    const wchar_t *str =
                    L"1234567890\r\n"
                    L"abcdefghijklmnopqrstuvwxyz\r\n"
                    L"こんにちは\r\n";
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_ShiftJIS);
    bool result = CP_Pos_PrintTextInShiftJIS(h, str);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintTextInEUCKR(void * h)
{
    const wchar_t *str =
                    L"1234567890\r\n"
                    L"abcdefghijklmnopqrstuvwxyz\r\n"
                    L"왕관을 쓰려는자\r\n"
                    L"그 무게를 견뎌라\r\n";
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_EUCKR);
    bool result = CP_Pos_PrintTextInEUCKR(h, str);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_PrintBarcode_UPCA(void * h)
{
    const char *str = "01234567890";
    CP_Pos_SetBarcodeUnitWidth(h, 2);
    CP_Pos_SetBarcodeHeight(h, 60);
    CP_Pos_SetBarcodeReadableTextFontType(h, 0);
    CP_Pos_SetBarcodeReadableTextPosition(h, CP_Pos_BarcodeTextPrintPosition_BelowBarcode);
    CP_Pos_PrintBarcode(h, CP_Pos_BarcodeType_UPCA, str);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintBarcode_UPCE(void * h)
{
    const char *str = "123456";
    CP_Pos_SetBarcodeUnitWidth(h, 2);
    CP_Pos_SetBarcodeHeight(h, 60);
    CP_Pos_SetBarcodeReadableTextFontType(h, 0);
    CP_Pos_SetBarcodeReadableTextPosition(h, CP_Pos_BarcodeTextPrintPosition_BelowBarcode);
    CP_Pos_PrintBarcode(h, CP_Pos_BarcodeType_UPCE, str);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintBarcode_EAN13(void * h)
{
    const char *str = "123456789012";
    CP_Pos_SetBarcodeUnitWidth(h, 2);
    CP_Pos_SetBarcodeHeight(h, 60);
    CP_Pos_SetBarcodeReadableTextFontType(h, 0);
    CP_Pos_SetBarcodeReadableTextPosition(h, CP_Pos_BarcodeTextPrintPosition_BelowBarcode);
    CP_Pos_PrintBarcode(h, CP_Pos_BarcodeType_EAN13, str);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintBarcode_EAN8(void * h)
{
    const char *str = "1234567";
    CP_Pos_SetBarcodeUnitWidth(h, 2);
    CP_Pos_SetBarcodeHeight(h, 60);
    CP_Pos_SetBarcodeReadableTextFontType(h, 0);
    CP_Pos_SetBarcodeReadableTextPosition(h, CP_Pos_BarcodeTextPrintPosition_BelowBarcode);
    CP_Pos_PrintBarcode(h, CP_Pos_BarcodeType_EAN8, str);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintBarcode_CODE39(void * h)
{
    const char *str = "123456";
    CP_Pos_SetBarcodeUnitWidth(h, 2);
    CP_Pos_SetBarcodeHeight(h, 60);
    CP_Pos_SetBarcodeReadableTextFontType(h, 0);
    CP_Pos_SetBarcodeReadableTextPosition(h, CP_Pos_BarcodeTextPrintPosition_BelowBarcode);
    CP_Pos_PrintBarcode(h, CP_Pos_BarcodeType_CODE39, str);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintBarcode_ITF(void * h)
{
    const char *str = "123456";
    CP_Pos_SetBarcodeUnitWidth(h, 2);
    CP_Pos_SetBarcodeHeight(h, 60);
    CP_Pos_SetBarcodeReadableTextFontType(h, 0);
    CP_Pos_SetBarcodeReadableTextPosition(h, CP_Pos_BarcodeTextPrintPosition_BelowBarcode);
    CP_Pos_PrintBarcode(h, CP_Pos_BarcodeType_ITF, str);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintBarcode_CODEBAR(void * h)
{
    const char *str = "A123456A";
    CP_Pos_SetBarcodeUnitWidth(h, 2);
    CP_Pos_SetBarcodeHeight(h, 60);
    CP_Pos_SetBarcodeReadableTextFontType(h, 0);
    CP_Pos_SetBarcodeReadableTextPosition(h, CP_Pos_BarcodeTextPrintPosition_BelowBarcode);
    CP_Pos_PrintBarcode(h, CP_Pos_BarcodeType_CODEBAR, str);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintBarcode_CODE93(void * h)
{
    const char *str = "123456";
    CP_Pos_SetBarcodeUnitWidth(h, 2);
    CP_Pos_SetBarcodeHeight(h, 60);
    CP_Pos_SetBarcodeReadableTextFontType(h, 0);
    CP_Pos_SetBarcodeReadableTextPosition(h, CP_Pos_BarcodeTextPrintPosition_BelowBarcode);
    CP_Pos_PrintBarcode(h, CP_Pos_BarcodeType_CODE93, str);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintBarcode_CODE128(void * h)
{
    const char *str = "No.123456";
    CP_Pos_SetBarcodeUnitWidth(h, 2);
    CP_Pos_SetBarcodeHeight(h, 60);
    CP_Pos_SetBarcodeReadableTextFontType(h, 0);
    CP_Pos_SetBarcodeReadableTextPosition(h, CP_Pos_BarcodeTextPrintPosition_BelowBarcode);
    CP_Pos_PrintBarcode(h, CP_Pos_BarcodeType_CODE128, str);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_PrintRasterImageFromData(void * h)
{
    UIImage *image = [UIImage imageNamed:@"blackwhite.png"];
    NSData *data = UIImagePNGRepresentation(image);
    if (data == 0)
        return;

    int width = image.size.width;
    int height = image.size.height;

    int page_width = 384;
    int dstw = width;
    int dsth = height;
    if (dstw > page_width) {
        dstw = page_width;
        dsth = (int)(dstw*((double)height/width));
    }

    CP_Pos_PrintRasterImageFromData(h, dstw, dsth, (unsigned char *)data.bytes, (unsigned int)data.length, CP_ImageBinarizationMethod_Thresholding, CP_ImageCompressionMethod_None);
    
    CP_Pos_FeedLine(h, 3);
    Test_Pos_QueryPrintResult(h);
}

void Test_Pos_PrintHorizontalLine(void * h)
{
    for (int i = 0; i < 50; i += 1)
        CP_Pos_PrintHorizontalLine(h, i, i + 100);
    for (int i = 50; i > 0; i -= 1)
        CP_Pos_PrintHorizontalLine(h, i, i + 100);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintHorizontalLineSpecifyThickness(void * h)
{
    CP_Pos_PrintHorizontalLineSpecifyThickness(h, 0, 200, 10);

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_PrintMultipleHorizontalLinesAtOneRow(void * h)
{
    int r = 150;
    for (int y = -r; y <= r; ++y) {
        int x = sqrt(r*r-y*y);
        int x1 = -x+r;
        int x2 = x+r;
        int pLineStartPosition[2] = { x1, x2 };
        int pLineEndPosition[2] = { x1, x2 };
        if (CP_Pos_PrintMultipleHorizontalLinesAtOneRow(h, 2, pLineStartPosition, pLineEndPosition))
            continue;
        else
            break;
    }

    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_ResetPrinter(void * h)
{
    bool result = CP_Pos_ResetPrinter(h);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetPrintSpeed_20(void * h)
{
    CP_Pos_SetPrintSpeed(h, 20);
    bool result = CP_Pos_PrintSelfTestPage(h);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_SetPrintSpeed_50(void * h)
{
    CP_Pos_SetPrintSpeed(h, 50);
    bool result = CP_Pos_PrintSelfTestPage(h);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_SetPrintSpeed_100(void * h)
{
    CP_Pos_SetPrintSpeed(h, 100);
    bool result = CP_Pos_PrintSelfTestPage(h);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetPrintDensity_Light(void * h)
{
    CP_Pos_SetPrintDensity(h, 0);
    bool result = CP_Pos_PrintSelfTestPage(h);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_SetPrintDensity_Normal(void * h)
{
    CP_Pos_SetPrintDensity(h, 7);
    bool result = CP_Pos_PrintSelfTestPage(h);
    if (!result)
        Utils_MessageBox("Write failed");
}
void Test_Pos_SetPrintDensity_Dark(void * h)
{
    CP_Pos_SetPrintDensity(h, 15);
    bool result = CP_Pos_PrintSelfTestPage(h);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetSingleByteMode(void * h)
{
    const char *str = "Welcome 你好\r\n";

    CP_Pos_SetSingleByteMode(h);
    CP_Pos_SetCharacterSet(h, CP_CharacterSet_CHINA);
    CP_Pos_SetCharacterCodepage(h, CP_CharacterCodepage_CP437);

    bool result = CP_Pos_PrintText(h, str);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetMultiByteMode(void * h)
{
    const char *str = "Welcome 你好";

    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);

    bool result = CP_Pos_PrintText(h, str);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetMovementUnit(void * h)
{
    CP_Pos_SetMovementUnit(h, 100, 100);
    CP_Pos_SetAsciiTextCharRightSpacing(h, 10);
    CP_Pos_PrintText(h, "1234567890\r\n");
    CP_Pos_SetMovementUnit(h, 200, 200);
    CP_Pos_SetAsciiTextCharRightSpacing(h, 10);
    CP_Pos_PrintText(h, "1234567890\r\n");
    bool result = CP_Pos_SetAsciiTextCharRightSpacing(h, 0);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetPrintAreaLeftMargin(void * h)
{
    CP_Pos_SetPrintAreaLeftMargin(h, 96);
    CP_Pos_SetPrintAreaWidth(h, 384);
    CP_Pos_PrintText(h, "1234567890123456789012345678901234567890\r\n");
    bool result = CP_Pos_ResetPrinter(h);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetPrintAreaWidth(void * h)
{
    CP_Pos_SetPrintAreaWidth(h, 384);
    CP_Pos_PrintText(h, "1234567890123456789012345678901234567890\r\n");
    bool result = CP_Pos_ResetPrinter(h);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetPrintPosition(void * h)
{
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, 0);
    CP_Pos_PrintText(h, "12345678901234567890\r\n");
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, 24);
    CP_Pos_PrintText(h, "1234567890");
    CP_Pos_SetHorizontalRelativePrintPosition(h, 24);
    CP_Pos_PrintText(h, "1234567890");
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetAlignment(void * h)
{
    CP_Pos_SetAlignment(h, CP_Pos_Alignment_Right);
    CP_Pos_PrintText(h, "12345678901234567890\r\n");
    CP_Pos_SetAlignment(h, CP_Pos_Alignment_HCenter);
    CP_Pos_PrintText(h, "12345678901234567890\r\n");
    CP_Pos_SetAlignment(h, CP_Pos_Alignment_Left);
    CP_Pos_PrintText(h, "12345678901234567890\r\n");
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetTextScale(void * h)
{
    int nPosition = 0;
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, nPosition);
    CP_Pos_SetTextScale(h, 0, 0);
    CP_Pos_PrintText(h, "a");
    nPosition += 12;
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, nPosition);
    CP_Pos_SetTextScale(h, 1, 1);
    CP_Pos_PrintText(h, "a");
    nPosition += 12*2;
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, nPosition);
    CP_Pos_SetTextScale(h, 2, 2);
    CP_Pos_PrintText(h, "a");
    nPosition += 12*3;
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, nPosition);
    CP_Pos_SetTextScale(h, 3, 3);
    CP_Pos_PrintText(h, "a");
    nPosition += 12*4;
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, nPosition);
    CP_Pos_SetTextScale(h, 4, 4);
    CP_Pos_PrintText(h, "a");
    nPosition += 12*5;
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, nPosition);
    CP_Pos_SetTextScale(h, 5, 5);
    CP_Pos_PrintText(h, "a");
    nPosition += 12*6;
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, nPosition);
    CP_Pos_SetTextScale(h, 6, 6);
    CP_Pos_PrintText(h, "a");
    nPosition += 12*7;
    CP_Pos_SetHorizontalAbsolutePrintPosition(h, nPosition);
    CP_Pos_SetTextScale(h, 7, 7);
    CP_Pos_PrintText(h, "a");
    CP_Pos_SetTextScale(h, 0, 0);
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetAsciiTextFontType(void * h)
{
    CP_Pos_SetAsciiTextFontType(h, 0);
    CP_Pos_PrintText(h, "FontA\r\n");
    CP_Pos_SetAsciiTextFontType(h, 1);
    CP_Pos_PrintText(h, "FontB\r\n");
    CP_Pos_SetAsciiTextFontType(h, 2);
    CP_Pos_PrintText(h, "FontC\r\n");
    CP_Pos_SetAsciiTextFontType(h, 3);
    CP_Pos_PrintText(h, "FontD\r\n");
    CP_Pos_SetAsciiTextFontType(h, 4);
    CP_Pos_PrintText(h, "FontE\r\n");
    CP_Pos_SetAsciiTextFontType(h, 0);
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetTextBold(void * h)
{
    CP_Pos_SetTextBold(h, 1);
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);
    CP_Pos_PrintTextInUTF8(h, L"粗体 Bold\r\n");
    CP_Pos_SetTextBold(h, 0);
    CP_Pos_PrintText(h, "Normal\r\n");
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetTextUnderline(void * h)
{
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);
    CP_Pos_SetTextUnderline(h, 2);
    CP_Pos_PrintTextInUTF8(h, L"下划线2点 Underline2\r\n");
    CP_Pos_SetTextUnderline(h, 1);
    CP_Pos_PrintTextInUTF8(h, L"下划线1点 Underline2\r\n");
    CP_Pos_SetTextUnderline(h, 0);
    CP_Pos_PrintTextInUTF8(h, L"无下划线 No Underline\r\n");
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetTextUpsideDown(void * h)
{
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);
    CP_Pos_SetTextUpsideDown(h, 1);
    CP_Pos_PrintTextInUTF8(h, L"上下倒置 UpsideDown\r\n");
    CP_Pos_SetTextUpsideDown(h, 0);
    CP_Pos_PrintText(h, "Normal\r\n");
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetTextWhiteOnBlack(void * h)
{
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);
    CP_Pos_SetTextWhiteOnBlack(h, 1);
    CP_Pos_PrintTextInUTF8(h, L"黑白反显 WhiteOnBlack\r\n");
    CP_Pos_SetTextWhiteOnBlack(h, 0);
    CP_Pos_PrintText(h, "Normal\r\n");
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetTextRotate(void * h)
{
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);
    CP_Pos_SetTextRotate(h, 1);
    CP_Pos_PrintTextInUTF8(h, L"文字旋转打印 TextRotate\r\n");
    CP_Pos_SetTextRotate(h, 0);
    CP_Pos_PrintText(h, "Normal\r\n");
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetTextLineHeight(void * h)
{
    CP_Pos_SetTextLineHeight(h, 100);
    CP_Pos_PrintText(h, "LineHeight 100\r\nLineHeight 100\r\nLineHeight 100\r\n");
    CP_Pos_SetTextLineHeight(h, 32);
    CP_Pos_PrintText(h, "LineHeight 32\r\nLineHeight 32\r\nLineHeight 32\r\n");
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetAsciiTextCharRightSpacing(void * h)
{
    const wchar_t *str = L"Hello你好\r\n";
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);
    CP_Pos_SetAsciiTextCharRightSpacing(h, 2);
    CP_Pos_PrintTextInUTF8(h, str);
    CP_Pos_SetAsciiTextCharRightSpacing(h, 0);
    CP_Pos_PrintTextInUTF8(h, str);
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}

void Test_Pos_SetKanjiTextCharSpacing(void * h)
{
    const wchar_t *str = L"Hello你好\r\n";
    CP_Pos_SetMultiByteMode(h);
    CP_Pos_SetMultiByteEncoding(h, CP_MultiByteEncoding_UTF8);
    CP_Pos_SetKanjiTextCharSpacing(h, 2, 2);
    CP_Pos_PrintTextInUTF8(h, str);
    CP_Pos_SetKanjiTextCharSpacing(h, 0, 0);
    CP_Pos_PrintTextInUTF8(h, str);
    bool result = CP_Pos_FeedLine(h, 3);
    if (!result)
        Utils_MessageBox("Write failed");
}
