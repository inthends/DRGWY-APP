#include "cmdtestunit.h"
#include "cmdtestfunction.h"

CmdTestUnit listCmdTestUnit[] = {
	{ "Test_StandardMode_58mmSampleTicket1", Test_StandardMode_58mmSampleTicket1 },
    { "Test_StandardMode_80mmSampleTicket1", Test_StandardMode_80mmSampleTicket1 },

    { "Test_Port_Write", Test_Port_Write },
    { "Test_Port_Read", Test_Port_Read },
    { "Test_Port_Available", Test_Port_Available },
    { "Test_Port_SkipAvailable", Test_Port_SkipAvailable },
    { "Test_Port_IsConnectionValid", Test_Port_IsConnectionValid },

    { "Test_Printer_GetPrinterInfo", Test_Printer_GetPrinterInfo },
    { "Test_Printer_ClearPrinterBuffer", Test_Printer_ClearPrinterBuffer },

    { "Test_Pos_QueryPrintResult", Test_Pos_QueryPrintResult },

    { "Test_Pos_KickOutDrawer", Test_Pos_KickOutDrawer },
    { "Test_Pos_Beep", Test_Pos_Beep },
    { "Test_Pos_FeedAndHalfCutPaper", Test_Pos_FeedAndHalfCutPaper },
    { "Test_Pos_FullCutPaper", Test_Pos_FullCutPaper },
    { "Test_Pos_HalfCutPaper", Test_Pos_HalfCutPaper },
    { "Test_Pos_Feed", Test_Pos_Feed },

    { "Test_Pos_PrintSelfTestPage", Test_Pos_PrintSelfTestPage },
    { "Test_Pos_PrintText", Test_Pos_PrintText },
    { "Test_Pos_PrintTextInUTF8", Test_Pos_PrintTextInUTF8 },
    { "Test_Pos_PrintTextInGBK", Test_Pos_PrintTextInGBK },
    { "Test_Pos_PrintTextInBIG5", Test_Pos_PrintTextInBIG5 },
    { "Test_Pos_PrintTextInShiftJIS", Test_Pos_PrintTextInShiftJIS },
    { "Test_Pos_PrintTextInEUCKR", Test_Pos_PrintTextInEUCKR },

    { "Test_Pos_PrintBarcode_UPCA", Test_Pos_PrintBarcode_UPCA },
    { "Test_Pos_PrintBarcode_UPCE", Test_Pos_PrintBarcode_UPCE },
    { "Test_Pos_PrintBarcode_EAN13", Test_Pos_PrintBarcode_EAN13 },
    { "Test_Pos_PrintBarcode_EAN8", Test_Pos_PrintBarcode_EAN8 },
    { "Test_Pos_PrintBarcode_CODE39", Test_Pos_PrintBarcode_CODE39 },
    { "Test_Pos_PrintBarcode_ITF", Test_Pos_PrintBarcode_ITF },
    { "Test_Pos_PrintBarcode_CODEBAR", Test_Pos_PrintBarcode_CODEBAR },
    { "Test_Pos_PrintBarcode_CODE93", Test_Pos_PrintBarcode_CODE93 },
    { "Test_Pos_PrintBarcode_CODE128", Test_Pos_PrintBarcode_CODE128 },

    { "Test_Pos_PrintRasterImageFromData", Test_Pos_PrintRasterImageFromData },

    { "Test_Pos_PrintHorizontalLine", Test_Pos_PrintHorizontalLine },
    { "Test_Pos_PrintHorizontalLineSpecifyThickness", Test_Pos_PrintHorizontalLineSpecifyThickness },
    { "Test_Pos_PrintMultipleHorizontalLinesAtOneRow", Test_Pos_PrintMultipleHorizontalLinesAtOneRow },

    { "Test_Pos_ResetPrinter", Test_Pos_ResetPrinter },
    { "Test_Pos_SetPrintSpeed_20", Test_Pos_SetPrintSpeed_20 },
    { "Test_Pos_SetPrintSpeed_50", Test_Pos_SetPrintSpeed_50 },
    { "Test_Pos_SetPrintSpeed_100", Test_Pos_SetPrintSpeed_100 },
    { "Test_Pos_SetPrintDensity_Light", Test_Pos_SetPrintDensity_Light },
    { "Test_Pos_SetPrintDensity_Normal", Test_Pos_SetPrintDensity_Normal },
    { "Test_Pos_SetPrintDensity_Dark", Test_Pos_SetPrintDensity_Dark },

    { "Test_Pos_SetSingleByteMode", Test_Pos_SetSingleByteMode },
    { "Test_Pos_SetMultiByteMode", Test_Pos_SetMultiByteMode },

    { "Test_Pos_SetMovementUnit", Test_Pos_SetMovementUnit },
    { "Test_Pos_SetPrintAreaLeftMargin", Test_Pos_SetPrintAreaLeftMargin },
    { "Test_Pos_SetPrintAreaWidth", Test_Pos_SetPrintAreaWidth },
    { "Test_Pos_SetPrintPosition", Test_Pos_SetPrintPosition },
    { "Test_Pos_SetAlignment", Test_Pos_SetAlignment },
    { "Test_Pos_SetTextScale", Test_Pos_SetTextScale },
    { "Test_Pos_SetAsciiTextFontType", Test_Pos_SetAsciiTextFontType },
    { "Test_Pos_SetTextBold", Test_Pos_SetTextBold },
    { "Test_Pos_SetTextUnderline", Test_Pos_SetTextUnderline },
    { "Test_Pos_SetTextUpsideDown", Test_Pos_SetTextUpsideDown },
    { "Test_Pos_SetTextWhiteOnBlack", Test_Pos_SetTextWhiteOnBlack },
    { "Test_Pos_SetTextRotate", Test_Pos_SetTextRotate },
    { "Test_Pos_SetTextLineHeight", Test_Pos_SetTextLineHeight },
    { "Test_Pos_SetAsciiTextCharRightSpacing", Test_Pos_SetAsciiTextCharRightSpacing },
    { "Test_Pos_SetKanjiTextCharSpacing", Test_Pos_SetKanjiTextCharSpacing },
    
};
size_t listCmdTestUnitSize = sizeof(listCmdTestUnit) / sizeof(CmdTestUnit);
