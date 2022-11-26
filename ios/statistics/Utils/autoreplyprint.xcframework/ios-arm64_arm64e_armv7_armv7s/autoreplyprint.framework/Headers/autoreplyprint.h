
#ifndef AUTOREPLYPRINT_H
#define AUTOREPLYPRINT_H

#ifndef AUTOREPLYPRINT_API
#define AUTOREPLYPRINT_API
#endif

#include <wchar.h>

#ifdef __cplusplus
extern "C" {
#endif


typedef enum CP_CharacterSet {
    CP_CharacterSet_USA = 0,
    CP_CharacterSet_FRANCE = 1,
    CP_CharacterSet_GERMANY = 2,
    CP_CharacterSet_UK = 3,
    CP_CharacterSet_DENMARK_I = 4,
    CP_CharacterSet_SWEDEN = 5,
    CP_CharacterSet_ITALY = 6,
    CP_CharacterSet_SPAIN_I = 7,
    CP_CharacterSet_JAPAN = 8,
    CP_CharacterSet_NORWAY = 9,
    CP_CharacterSet_DENMARK_II = 10,
    CP_CharacterSet_SPAIN_II = 11,
    CP_CharacterSet_LATIN = 12,
    CP_CharacterSet_KOREA = 13,
    CP_CharacterSet_SLOVENIA = 14,
    CP_CharacterSet_CHINA = 15
} CP_CharacterSet;


typedef enum CP_CharacterCodepage {
    CP_CharacterCodepage_CP437 = 0,
    CP_CharacterCodepage_KATAKANA = 1,
    CP_CharacterCodepage_CP850 = 2,
    CP_CharacterCodepage_CP860 = 3,
    CP_CharacterCodepage_CP863 = 4,
    CP_CharacterCodepage_CP865 = 5,
    CP_CharacterCodepage_WCP1251 = 6,
    CP_CharacterCodepage_CP866 = 7,
    CP_CharacterCodepage_MIK = 8,
    CP_CharacterCodepage_CP755 = 9,
    CP_CharacterCodepage_IRAN = 10,
    CP_CharacterCodepage_CP862 = 15,
    CP_CharacterCodepage_WCP1252 = 16,
    CP_CharacterCodepage_WCP1253 = 17,
    CP_CharacterCodepage_CP852 = 18,
    CP_CharacterCodepage_CP858 = 19,
    CP_CharacterCodepage_IRAN_II = 20,
    CP_CharacterCodepage_LATVIAN = 21,
    CP_CharacterCodepage_CP864 = 22,
    CP_CharacterCodepage_ISO_8859_1 = 23,
    CP_CharacterCodepage_CP737 = 24,
    CP_CharacterCodepage_WCP1257 = 25,
    CP_CharacterCodepage_THAI = 26,
    CP_CharacterCodepage_CP720 = 27,
    CP_CharacterCodepage_CP855 = 28,
    CP_CharacterCodepage_CP857 = 29,
    CP_CharacterCodepage_WCP1250 = 30,
    CP_CharacterCodepage_CP775 = 31,
    CP_CharacterCodepage_WCP1254 = 32,
    CP_CharacterCodepage_WCP1255 = 33,
    CP_CharacterCodepage_WCP1256 = 34,
    CP_CharacterCodepage_WCP1258 = 35,
    CP_CharacterCodepage_ISO_8859_2 = 36,
    CP_CharacterCodepage_ISO_8859_3 = 37,
    CP_CharacterCodepage_ISO_8859_4 = 38,
    CP_CharacterCodepage_ISO_8859_5 = 39,
    CP_CharacterCodepage_ISO_8859_6 = 40,
    CP_CharacterCodepage_ISO_8859_7 = 41,
    CP_CharacterCodepage_ISO_8859_8 = 42,
    CP_CharacterCodepage_ISO_8859_9 = 43,
    CP_CharacterCodepage_ISO_8859_15 = 44,
    CP_CharacterCodepage_THAI_2 = 45,
    CP_CharacterCodepage_CP856 = 46,
    CP_CharacterCodepage_CP874 = 47,
    CP_CharacterCodepage_TCVN3 = 48
} CP_CharacterCodepage;


typedef enum CP_MultiByteEncoding { CP_MultiByteEncoding_GBK = 0, CP_MultiByteEncoding_UTF8 = 1, CP_MultiByteEncoding_BIG5 = 3, CP_MultiByteEncoding_ShiftJIS = 4, CP_MultiByteEncoding_EUCKR = 5 } CP_MultiByteEncoding;


typedef enum CP_ImageBinarizationMethod { CP_ImageBinarizationMethod_Dithering, CP_ImageBinarizationMethod_Thresholding, CP_ImageBinarizationMethod_ErrorDiffusion } CP_ImageBinarizationMethod;


typedef enum CP_ImageCompressionMethod { CP_ImageCompressionMethod_None, CP_ImageCompressionMethod_Level1, CP_ImageCompressionMethod_Level2 } CP_ImageCompressionMethod;


typedef enum CP_ImagePixelsFormat { 
    CP_ImagePixelsFormat_MONO = 1,
    CP_ImagePixelsFormat_MONOLSB = 2,
    CP_ImagePixelsFormat_GRAY8 = 3,
    CP_ImagePixelsFormat_BYTEORDERED_RGB24 = 4,
    CP_ImagePixelsFormat_BYTEORDERED_BGR24 = 5,
    CP_ImagePixelsFormat_BYTEORDERED_ARGB32 = 6,
    CP_ImagePixelsFormat_BYTEORDERED_RGBA32 = 7,
    CP_ImagePixelsFormat_BYTEORDERED_ABGR32 = 8,
    CP_ImagePixelsFormat_BYTEORDERED_BGRA32 = 9
} CP_ImagePixelsFormat;


typedef enum CP_QRCodeECC { CP_QRCodeECC_L = 1, CP_QRCodeECC_M = 2, CP_QRCodeECC_Q = 3, CP_QRCodeECC_H = 4 } CP_QRCodeECC;


typedef enum CP_Pos_Alignment { CP_Pos_Alignment_Left, CP_Pos_Alignment_HCenter, CP_Pos_Alignment_Right } CP_Pos_Alignment;


typedef enum CP_Pos_BarcodeType { 
    CP_Pos_BarcodeType_UPCA = 0x41,
    CP_Pos_BarcodeType_UPCE = 0x42,
    CP_Pos_BarcodeType_EAN13 = 0x43,
    CP_Pos_BarcodeType_EAN8 = 0x44,
    CP_Pos_BarcodeType_CODE39 = 0x45,
    CP_Pos_BarcodeType_ITF = 0x46,
    CP_Pos_BarcodeType_CODEBAR = 0x47,
    CP_Pos_BarcodeType_CODE93 = 0x48,
    CP_Pos_BarcodeType_CODE128 = 0x49
} CP_Pos_BarcodeType;


typedef enum CP_Pos_BarcodeTextPrintPosition { CP_Pos_BarcodeTextPrintPosition_None, CP_Pos_BarcodeTextPrintPosition_AboveBarcode, CP_Pos_BarcodeTextPrintPosition_BelowBarcode, CP_Pos_BarcodeTextPrintPosition_AboveAndBelowBarcode } CP_Pos_BarcodeTextPrintPosition;


typedef enum CP_Page_DrawDirection { CP_Page_DrawDirection_LeftToRight, CP_Page_DrawDirection_BottomToTop, CP_Page_DrawDirection_RightToLeft, CP_Page_DrawDirection_TopToBottom } CP_Page_DrawDirection;

    // Page mode draw functions (CP_Page_DrawXXX)
    // Horizontal and vertical coordinates can be specified as -1 -2 -3 to indicate that the print is aligned
#ifndef MarcoDefinitionCPPageDrawAlignment
#define MarcoDefinitionCPPageDrawAlignment
#define CP_Page_DrawAlignment_Left -1
#define CP_Page_DrawAlignment_HCenter -2
#define CP_Page_DrawAlignment_Right -3
#define CP_Page_DrawAlignment_Top -1
#define CP_Page_DrawAlignment_VCenter -2
#define CP_Page_DrawAlignment_Bottom -3
#endif


typedef enum CP_Label_BarcodeType { 
    CP_Label_BarcodeType_UPCA = 0,
    CP_Label_BarcodeType_UPCE = 1,
    CP_Label_BarcodeType_EAN13 = 2,
    CP_Label_BarcodeType_EAN8 = 3,
    CP_Label_BarcodeType_CODE39 = 4,
    CP_Label_BarcodeType_ITF = 5,
    CP_Label_BarcodeType_CODEBAR = 6,
    CP_Label_BarcodeType_CODE93 = 7,
    CP_Label_BarcodeType_CODE128 = 8,
    CP_Label_BarcodeType_CODE11 = 9,
    CP_Label_BarcodeType_MSI = 10,
    CP_Label_BarcodeType_128M = 11,
    CP_Label_BarcodeType_EAN128 = 12,
    CP_Label_BarcodeType_25C = 13,
    CP_Label_BarcodeType_39C = 14,
    CP_Label_BarcodeType_39 = 15,
    CP_Label_BarcodeType_EAN13PLUS2 = 16,
    CP_Label_BarcodeType_EAN13PLUS5 = 17,
    CP_Label_BarcodeType_EAN8PLUS2 = 18,
    CP_Label_BarcodeType_EAN8PLUS5 = 19,
    CP_Label_BarcodeType_POST = 20,
    CP_Label_BarcodeType_UPCAPLUS2 = 21,
    CP_Label_BarcodeType_UPCAPLUS5 = 22,
    CP_Label_BarcodeType_UPCEPLUS2 = 23,
    CP_Label_BarcodeType_UPCEPLUS5 = 24,
    CP_Label_BarcodeType_CPOST = 25,
    CP_Label_BarcodeType_MSIC = 26,
    CP_Label_BarcodeType_PLESSEY = 27,
    CP_Label_BarcodeType_ITF14 = 28,
    CP_Label_BarcodeType_EAN14 = 29
} CP_Label_BarcodeType;


typedef enum CP_Label_BarcodeTextPrintPosition { CP_Label_BarcodeTextPrintPosition_None, CP_Label_BarcodeTextPrintPosition_AboveBarcode, CP_Label_BarcodeTextPrintPosition_BelowBarcode, CP_Label_BarcodeTextPrintPosition_AboveAndBelowBarcode } CP_Label_BarcodeTextPrintPosition;


typedef enum CP_Label_Rotation { CP_Label_Rotation_0, CP_Label_Rotation_90, CP_Label_Rotation_180, CP_Label_Rotation_270 } CP_Label_Rotation;


typedef enum CP_Label_Color { CP_Label_Color_White, CP_Label_Color_Black } CP_Label_Color;

    // ERROR_CUTTER
    //      Cutter error
    // ERROR_FLASH
    //      FLASH error
    // ERROR_NOPAPER
    //      No paper
    // ERROR_VOLTAGE
    //      Voltage error
    // ERROR_MARKER
    //      Black mark or seam mark error detected
    // ERROR_ENGINE
    //      Unrecognized printer engine
    // ERROR_OVERHEAT
    //      Overheat
    // ERROR_COVERUP
    //      Open cover or shaft not pressed down
    // ERROR_MOTOR
    //      Motor out of step (usually paper jam)
    // INFO_LABELPAPER
    //      Current paper identified as label paper (0 is continuous paper)
    // INFO_LABELMODE
    //      Currently in label mode
    // INFO_HAVEDATA
    //      We have data to start processing
    // INFO_NOPAPERCANCELED
    //      The last document was cancelled after it was short of paper
    // INFO_PAPERNOFETCH
    //      The documents were not taken
    // INFO_PRINTIDLE
    //      Current print idle
    // INFO_RECVIDLE
    //      The current receive buffer is empty
#ifndef MarcoDefinitionCPPrinterStatus
#define MarcoDefinitionCPPrinterStatus
#define CP_PRINTERSTATUS_ERROR_CUTTER(error_status) (error_status & 0x01)
#define CP_PRINTERSTATUS_ERROR_FLASH(error_status) (error_status & 0x02)
#define CP_PRINTERSTATUS_ERROR_NOPAPER(error_status) (error_status & 0x04)
#define CP_PRINTERSTATUS_ERROR_VOLTAGE(error_status) (error_status & 0x08)
#define CP_PRINTERSTATUS_ERROR_MARKER(error_status) (error_status & 0x10)
#define CP_PRINTERSTATUS_ERROR_ENGINE(error_status) (error_status & 0x20)
#define CP_PRINTERSTATUS_ERROR_OVERHEAT(error_status) (error_status & 0x40)
#define CP_PRINTERSTATUS_ERROR_COVERUP(error_status) (error_status & 0x80)
#define CP_PRINTERSTATUS_ERROR_MOTOR(error_status) (error_status & 0x100)
#define CP_PRINTERSTATUS_INFO_LABELPAPER(info_status) (info_status & 0x02)
#define CP_PRINTERSTATUS_INFO_LABELMODE(info_status) (info_status & 0x04)
#define CP_PRINTERSTATUS_INFO_HAVEDATA(info_status) (info_status & 0x08)
#define CP_PRINTERSTATUS_INFO_NOPAPERCANCELED(info_status) (info_status & 0x10)
#define CP_PRINTERSTATUS_INFO_PAPERNOFETCH(info_status) (info_status & 0x20)
#define CP_PRINTERSTATUS_INFO_PRINTIDLE(info_status) (info_status & 0x40)
#define CP_PRINTERSTATUS_INFO_RECVIDLE(info_status) (info_status & 0x80)
#endif

    // The real-time state here is four bytes
    // From low byte to high byte corresponds to these four instructions in the instruction set:
    //   10 04 01
    //   10 04 02
    //   10 04 03
    //   10 04 04
    // For some models, due to customization or other reasons, the definition of state value may be inconsistent with here, subject to the actual measurement
    //
    // DRAWER_OPENED
    //      Drawer Opened
    // OFFLINE
    //      Offline
    // COVERUP
    //      Cover UP
    // FEED_PRESSED
    //      Feed Pressed
    // NOPAPER
    //      No Paper
    // ERROR_OCCURED
    //      Error Occured
    // CUTTER_ERROR
    //      Cutter Error
    // UNRECOVERABLE_ERROR
    //      Unrecoverable Error
    // DEGREE_OR_VOLTAGE_OVERRANGE
    //      Degree or voltage error
    // PAPER_NEAREND
    //      Paper Near End
    // PAPER_TAKEOUT
    //      Paper takeout
#ifndef MarcoDefinitionCPRTStatus
#define MarcoDefinitionCPRTStatus
#define CP_RTSTATUS_DRAWER_OPENED(status) (((status >> 0) & 0x04) == 0x00)
#define CP_RTSTATUS_OFFLINE(status) (((status >> 0) & 0x08) == 0x08)
#define CP_RTSTATUS_COVERUP(status) (((status >> 8) & 0x04) == 0x04)
#define CP_RTSTATUS_FEED_PRESSED(status) (((status >> 8) & 0x08) == 0x08)
#define CP_RTSTATUS_NOPAPER(status) (((status >> 8) & 0x20) == 0x20)
#define CP_RTSTATUS_ERROR_OCCURED(status) (((status >> 8) & 0x40) == 0x40)
#define CP_RTSTATUS_CUTTER_ERROR(status) (((status >> 16) & 0x08) == 0x08)
#define CP_RTSTATUS_UNRECOVERABLE_ERROR(status) (((status >> 16) & 0x20) == 0x20)
#define CP_RTSTATUS_DEGREE_OR_VOLTAGE_OVERRANGE(status) (((status >> 16) & 0x40) == 0x40)
#define CP_RTSTATUS_PAPER_NEAREND(status) (((status >> 24) & 0x08) == 0x08)
#define CP_RTSTATUS_PAPER_TAKEOUT(status) (((status >> 24) & 0x04) == 0x04)
#endif


#ifndef MarcoDefinitionCPLabelTextStyle
#define MarcoDefinitionCPLabelTextStyle
#define CP_LABEL_TEXT_STYLE_BOLD (1<<0)
#define CP_LABEL_TEXT_STYLE_UNDERLINE (1<<1)
#define CP_LABEL_TEXT_STYLE_HIGHLIGHT (1<<2)
#define CP_LABEL_TEXT_STYLE_STRIKETHROUGH (1<<3)
#define CP_LABEL_TEXT_STYLE_ROTATION_0 (0<<4)
#define CP_LABEL_TEXT_STYLE_ROTATION_90 (1<<4)
#define CP_LABEL_TEXT_STYLE_ROTATION_180 (2<<4)
#define CP_LABEL_TEXT_STYLE_ROTATION_270 (3<<4)
#define CP_LABEL_TEXT_STYLE_WIDTH_ENLARGEMENT(n) ((n)<<8)
#define CP_LABEL_TEXT_STYLE_HEIGHT_ENLARGEMENT(n) ((n)<<12)
#endif


typedef void (*CP_OnNetPrinterDiscovered)(const char *local_ip, const char *discovered_mac, const char *discovered_ip, const char *discovered_name, const void *private_data);


typedef void (*CP_OnBluetoothDeviceDiscovered)(const char *device_name, const char *device_address, const void *private_data);


typedef void (*CP_OnPortOpenedEvent)(void *handle, const char *name, void *private_data);


typedef void (*CP_OnPortOpenFailedEvent)(void *handle, const char *name, void *private_data);


typedef void (*CP_OnPortClosedEvent)(void *handle, void *private_data);


typedef void (*CP_OnPortWrittenEvent)(void *handle, const unsigned char *buffer, unsigned int count, void *private_data);


typedef void (*CP_OnPortReceivedEvent)(void *handle, const unsigned char *buffer, unsigned int count, void *private_data);


typedef void (*CP_OnPrinterStatusEvent)(void *handle, const long long printer_error_status, const long long printer_info_status, void *private_data);


typedef void (*CP_OnPrinterReceivedEvent)(void *handle, const unsigned int printer_received_byte_count, void *private_data);


typedef void (*CP_OnPrinterPrintedEvent)(void *handle, const unsigned int printer_printed_page_id, void *private_data);

    //      get library version string
    //
    //  return
    //      return library version string
AUTOREPLYPRINT_API const char *CP_Library_Version(void);

    //      Enumerate net printer
    //
    //  timeout
    //      enumrate timeout ms
    //
    //  cancel
    //      cancel bit, if value is non-zero, enum process will exit.
    //
    //  on_discovered
    //      enumrated callback function
    //
    //  private_data
    //      the parameter passed to callback function
    //
    //  return
    //      none
AUTOREPLYPRINT_API void CP_Port_EnumNetPrinter(unsigned int timeout, int *cancel, CP_OnNetPrinterDiscovered on_discovered, const void *private_data);

    //      Enumerate BLE printer
    //
    //  timeout
    //      enumrate timeout ms
    //
    //  cancel
    //      cancel bit, if value is non-zero, enum process will exit.
    //
    //  on_discovered
    //      enumrated callback function
    //
    //  private_data
    //      the parameter passed to callback function
    //
    //  return
    //      none
AUTOREPLYPRINT_API void CP_Port_EnumBleDevice(unsigned int timeout, int *cancel, CP_OnBluetoothDeviceDiscovered on_discovered, const void *private_data);

    //      Open Tcp
    //
    // local_ip
    //      Bind to local IP
    //      For multiple network CARDS or multiple local ips, select the specified IP
    //      Passing in a 0 indicates that it is not specified
    //
    // dest_ip
    //      IP Addres or printer name
    //      For example: 192.168.1.87
    //
    // dest_port
    //      Port Number
    //      Fixed value: 9100
    //
    // timeout
    //      connect timeout
    //
    // autoreplymode
    //      0 don't start autoreplymode
    //      1 start autoreplymode
    //      attention:
    //      Only some models support automatic return mode, please ask the seller if you support it
    //      After the automatic return mode is enabled, the printer will return the status automatically
    //      The state of the printer cannot be automatically obtained if it is not started
    //
    // return
    //      Return handle, If open success, return non-zero value, else return zero.
    //
    // remarks
    //      PC and printer need in the same network segment, so they can connect
AUTOREPLYPRINT_API void *CP_Port_OpenTcp(const char *local_ip, const char *dest_ip, unsigned short dest_port, unsigned int timeout, int autoreplymode);

    //      Connect Bluetooth Printer Via BLE
    //
    // address
    //      bluetooth address
    //
    // autoreplymode
    //      0 don't start autoreplymode
    //      1 start autoreplymode
    //      attention:
    //      Only some models support automatic return mode, please ask the seller if you support it
    //      After the automatic return mode is enabled, the printer will return the status automatically
    //      The state of the printer cannot be automatically obtained if it is not started
    //
    // return
    //      Return handle, If open success, return non-zero value, else return zero.
    //
    // remarks
    //      only for android,ios,macos
AUTOREPLYPRINT_API void *CP_Port_OpenBtBle(const char *address, int autoreplymode);

    //      Connect Bluetooth Printer Via BLE(Use Special Proto To Transfer Data)
    //
    // address
    //      bluetooth address
    //
    // autoreplymode
    //      0 don't start autoreplymode
    //      1 start autoreplymode
    //      attention:
    //      Only some models support automatic return mode, please ask the seller if you support it
    //      After the automatic return mode is enabled, the printer will return the status automatically
    //      The state of the printer cannot be automatically obtained if it is not started
    //
    // return
    //      Return handle, If open success, return non-zero value, else return zero.
    //
    // remarks
    //      only for ios,macos
AUTOREPLYPRINT_API void *CP_Port_OpenBtBleProtoV2(const char *address, int autoreplymode);

    //      Connect Bluetooth Printer Via BLE(Use Special Proto To Transfer Data)
    //
    // address
    //      bluetooth address
    //
    // autoreplymode
    //      0 don't start autoreplymode
    //      1 start autoreplymode
    //      attention:
    //      Only some models support automatic return mode, please ask the seller if you support it
    //      After the automatic return mode is enabled, the printer will return the status automatically
    //      The state of the printer cannot be automatically obtained if it is not started
    //
    // return
    //      Return handle, If open success, return non-zero value, else return zero.
    //
    // remarks
    //      only for ios,macos
AUTOREPLYPRINT_API void *CP_Port_OpenBtBleProtoV3(const char *address, int autoreplymode);

    //      Connect Bluetooth Printer Via BLE(Auto Select Best Proto To Transfer Data)
    //
    // address
    //      bluetooth address
    //
    // autoreplymode
    //      0 don't start autoreplymode
    //      1 start autoreplymode
    //      attention:
    //      Only some models support automatic return mode, please ask the seller if you support it
    //      After the automatic return mode is enabled, the printer will return the status automatically
    //      The state of the printer cannot be automatically obtained if it is not started
    //
    // return
    //      Return handle, If open success, return non-zero value, else return zero.
    //
    // remarks
    //      only for ios,macos
AUTOREPLYPRINT_API void *CP_Port_OpenBtBleProtoVA(const char *address, int autoreplymode);

    //      Creates a memory buffer that all subsequent print instructions are written to
    //
    // buffer_size
    //      buffer size
    //
    // return
    //      Return handle, If open success, return non-zero value, else return zero.
    //
    // remarks
    //      This can be used in the following two scenarios
    //      scenario one:
    //          A single document needs to send more than one instruction, and you want to put all the instructions together and send them to the printer at once to improve the transmission speed
    //      scenario two:
    //          Sometimes you need to know exactly what a function is sending, you need to know exactly what data is being sent, right
AUTOREPLYPRINT_API void *CP_Port_OpenMemoryBuffer(unsigned int buffer_size);

    //      get memory buffer data pointer
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      return memory buffer data pointer. or return zero means failed
AUTOREPLYPRINT_API unsigned char *CP_Port_GetMemoryBufferDataPointer(void *handle);

    //      get memory buffer data length
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      return memory buffer data length
AUTOREPLYPRINT_API unsigned int CP_Port_GetMemoryBufferDataLength(void *handle);

    //      Clear memory buffer data
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_ClearMemoryBufferData(void *handle);

    //      Write data to port
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // buffer
    //      buffer
    //
    // count
    //      buffer length
    //
    // timeout
    //      Timeout ms
    //
    // return
    //      return bytes writted. or return -1 means failed
AUTOREPLYPRINT_API int CP_Port_Write(void *handle, const unsigned char *buffer, unsigned int count, unsigned int timeout);

    //      Receive data from port
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // buffer
    //      buffer
    //
    // count
    //      buffer length
    //
    // timeout
    //      Timeout ms
    //
    // return
    //      return bytes readed. or return -1 means failed
AUTOREPLYPRINT_API int CP_Port_Read(void *handle, unsigned char *buffer, unsigned int count, unsigned int timeout);

    //      Receive data from port
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // buffer
    //      buffer
    //
    // count
    //      buffer length
    //
    // timeout
    //      Timeout ms
    //
    // breakByte
    //      break read byte
    //
    // return
    //      return bytes readed. or return -1 means failed
AUTOREPLYPRINT_API int CP_Port_ReadUntilByte(void *handle, unsigned char *buffer, unsigned int count, unsigned int timeout, unsigned char breakByte);

    //      get readable data from port
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      return readable. or return -1 means failed
AUTOREPLYPRINT_API int CP_Port_Available(void *handle);

    //      Skip receive buffer
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_SkipAvailable(void *handle);

    //      Check Connection Valid
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      Returns true if the port is open and the status is continuously updated
    //      False is returned if the port is not open, closed, or the status is not updated for more than 6 seconds
AUTOREPLYPRINT_API int CP_Port_IsConnectionValid(void *handle);

    //      Check Port Is Opened
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      Returns true if the port is open and the connection is not broken or closed
    //      Returns false if the port is not open, or if the connection is broken or closed
AUTOREPLYPRINT_API int CP_Port_IsOpened(void *handle);

    //      Close Port
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_Close(void *handle);

    //      Add Callback, Open Port Success
    //
    //  event
    //      callback function
    //
    //  private_data
    //      the parameter passed to callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_AddOnPortOpenedEvent(const CP_OnPortOpenedEvent event, void *private_data);

    //      Add Callback, Open Port Failed
    //
    //  event
    //      callback function
    //
    //  private_data
    //      the parameter passed to callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_AddOnPortOpenFailedEvent(const CP_OnPortOpenFailedEvent event, void *private_data);

    //      Add Callback, Port Closed
    //
    //  event
    //      callback function
    //
    //  private_data
    //      the parameter passed to callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_AddOnPortClosedEvent(const CP_OnPortClosedEvent event, void *private_data);

    //      Add Callback, Port Written Bytes
    //
    //  event
    //      callback function
    //
    //  private_data
    //      the parameter passed to callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_AddOnPortWrittenEvent(const CP_OnPortWrittenEvent event, void *private_data);

    //      Add Callback, Port Received Bytes
    //
    //  event
    //      callback function
    //
    //  private_data
    //      the parameter passed to callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_AddOnPortReceivedEvent(const CP_OnPortReceivedEvent event, void *private_data);

    //      Remove Callback
    //
    //  event
    //      callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_RemoveOnPortOpenedEvent(const CP_OnPortOpenedEvent event);

    //      Remove Callback
    //
    //  event
    //      callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_RemoveOnPortOpenFailedEvent(const CP_OnPortOpenFailedEvent event);

    //      Remove Callback
    //
    //  event
    //      callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_RemoveOnPortClosedEvent(const CP_OnPortClosedEvent event);

    //      Remove Callback
    //
    //  event
    //      callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_RemoveOnPortWrittenEvent(const CP_OnPortWrittenEvent event);

    //      Remove Callback
    //
    //  event
    //      callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Port_RemoveOnPortReceivedEvent(const CP_OnPortReceivedEvent event);

    //      Add Callback, Printer Status Updated
    //
    //  event
    //      callback function
    //
    //  private_data
    //      the parameter passed to callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_AddOnPrinterStatusEvent(const CP_OnPrinterStatusEvent event, void *private_data);

    //      Add Callback, Printer Received Byte Count Updated
    //
    //  event
    //      callback function
    //
    //  private_data
    //      the parameter passed to callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_AddOnPrinterReceivedEvent(const CP_OnPrinterReceivedEvent event, void *private_data);

    //      Add Callback, Printer Printed Page ID Updated
    //
    //  event
    //      callback function
    //
    //  private_data
    //      the parameter passed to callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_AddOnPrinterPrintedEvent(const CP_OnPrinterPrintedEvent event, void *private_data);

    //      Remove Callback
    //
    //  event
    //      callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_RemoveOnPrinterStatusEvent(const CP_OnPrinterStatusEvent event);

    //      Remove Callback
    //
    //  event
    //      callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_RemoveOnPrinterReceivedEvent(const CP_OnPrinterReceivedEvent event);

    //      Remove Callback
    //
    //  event
    //      callback function
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_RemoveOnPrinterPrintedEvent(const CP_OnPrinterPrintedEvent event);

    //      Get Printer Resolution Info
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    //  width_mm
    //      Max Page Width
    //
    //  height_mm
    //      Max Page Height
    //
    //  dots_per_mm
    //      Dots Per MM
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_GetPrinterResolutionInfo(void *handle, unsigned int *width_mm, unsigned int *height_mm, unsigned int *dots_per_mm);

    //      Get Printer Firmware Version
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    //  pBuf
    //      The buffer
    //
    //  cbBuf
    //      The buffer size
    //
    //  pcbNeeded
    //      The buffer bytes needed
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_GetPrinterFirmwareVersion(void *handle, char *pBuf, unsigned int cbBuf, unsigned int *pcbNeeded);

    //      Get Printer Status
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    //  printer_error_status
    //      Printer Error Status
    //
    //  printer_info_status
    //      Printer Info Status
    //
    //  timestamp_ms
    //      timestamp
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_GetPrinterStatusInfo(void *handle, long long *printer_error_status, long long *printer_info_status, long long *timestamp_ms);

    //      Get Printer Received Byte Count
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    //  printer_received_byte_count
    //      Printer Received Byte Count
    //
    //  timestamp_ms
    //      timestamp
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_GetPrinterReceivedInfo(void *handle, unsigned int *printer_received_byte_count, long long *timestamp_ms);

    //      Get Printer Printed Page ID
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    //  printer_printed_page_id
    //      Printer Printed Page ID
    //
    //  timestamp_ms
    //      timestamp
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_GetPrinterPrintedInfo(void *handle, unsigned int *printer_printed_page_id, long long *timestamp_ms);

    //      Get Printer Label Position Adjustment
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    //  label_print_position_adjustment
    //      Printer label print position adjustment
    //
    //  label_tear_position_adjustment
    //      Printer label tear position adjustment
    //
    //  timestamp_ms
    //      timestamp
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_GetPrinterLabelPositionAdjustmentInfo(void *handle, double *label_print_position_adjustment, double *label_tear_position_adjustment, long long *timestamp_ms);

    //      adjust label print position and tear paper position
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // label_print_position_adjustment
    //      Label print position adjustment mm (adjustment can not exceed [-4,4])
    //
    // label_tear_position_adjustment
    //      Label tear position adjustment mm (adjustment can not exceed [-4,4])
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Printer_SetPrinterLabelPositionAdjustmentInfo(void *handle, double label_print_position_adjustment, double label_tear_position_adjustment);

    //      Clear Printer Buffer Runtime
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_ClearPrinterBuffer(void *handle);

    //      Clear Printer Error Runtime
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      true on success.
    //      false on failed.
AUTOREPLYPRINT_API int CP_Printer_ClearPrinterError(void *handle);

    //      Query the real-time status of the printer
    //      If it is a machine that supports automatic return, the state will be returned automatically. No need to use this command to query
    //      Due to the real-time state instruction, there is no check, the result cannot be guaranteed to be correct
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // timeout
    //      timeout ms
    //      The wait time for query does not exceed this time
    //
    // return
    //      If command is successfully, it returns rtstatus else it returns 0.
    //      Please check CP_RTSTATUS_XXX for the detailed status. If the status definition is inconsistent with the actual model, the actual measurement shall prevail.
AUTOREPLYPRINT_API int CP_Pos_QueryRTStatus(void *handle, unsigned int timeout);

    //      Query the print result of the previous content
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // timeout
    //      timeout ms
    //      The wait time for query print results does not exceed this time
    //
    // return
    //      If print is successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_QueryPrintResult(void *handle, unsigned int timeout);

    //      Turn on cashbox
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nDrawerIndex
    //      Cashbox no, value are defined as follow:
    //      value      define
    //        0      Cashbox pin 2
    //        1      Cashbox pin 5
    //
    // nHighLevelTime
    //      Cashbox pulse high potential ms time
    //
    // nLowLevelTime
    //      Cashbox pulse low potential ms time
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_KickOutDrawer(void *handle, int nDrawerIndex, int nHighLevelTime, int nLowLevelTime);

    //      Buzzer call
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nBeepCount
    //      Calling times
    //
    // nBeepMs
    //      Calling time ms, value range is [100,900], flour to 100 milliseconds.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_Beep(void *handle, int nBeepCount, int nBeepMs);

    //      feed to cutter position and half cut paper
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_FeedAndHalfCutPaper(void *handle);

    //      full cut paper
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_FullCutPaper(void *handle);

    //      half cut paper
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_HalfCutPaper(void *handle);

    //      printer feed numLines
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // numLines
    //      number of lines to feed
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_FeedLine(void *handle, int numLines);

    //      printer feed numDots
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // numDots
    //      number of dots to feed
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_FeedDot(void *handle, int numDots);

    //      printer print self test page
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintSelfTestPage(void *handle);

    //      print text
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintText(void *handle, const char *str);

    //      print text
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to UTF8 encoding.
AUTOREPLYPRINT_API int CP_Pos_PrintTextInUTF8(void *handle, const wchar_t *str);

    //      print text
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to GBK encoding.
AUTOREPLYPRINT_API int CP_Pos_PrintTextInGBK(void *handle, const wchar_t *str);

    //      print text
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to BIG5 encoding.
AUTOREPLYPRINT_API int CP_Pos_PrintTextInBIG5(void *handle, const wchar_t *str);

    //      print text
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to ShiftJIS encoding.
AUTOREPLYPRINT_API int CP_Pos_PrintTextInShiftJIS(void *handle, const wchar_t *str);

    //      print text
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to EUCKR encoding.
AUTOREPLYPRINT_API int CP_Pos_PrintTextInEUCKR(void *handle, const wchar_t *str);

    //      print 1D barcode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nBarcodeType
    //      barcode type
    //      values are defined as follow:
    //      value    type
    //      0x41     UPC-A
    //      0x42     UPC-E
    //      0x43     EAN13
    //      0x44     EAN8
    //      0x45     CODE39
    //      0x46     ITF
    //      0x47     CODABAR
    //      0x48     CODE93
    //      0x49     CODE128
    //
    // str
    //      the barcode data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintBarcode(void *handle, CP_Pos_BarcodeType nBarcodeType, const char *str);

    //      print Code128 barcode, this function auto change type b and c to print more characters.
    //      Normally, do not use this function to print CODE128 code
    //      This function is mainly used for compatibility with some older models
    //      New models already support automatic switching codes by default
    //      New models cannot print barcodes using this function
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // str
    //      the barcode data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintBarcode_Code128Auto(void *handle, const char *str);

    //      print qrcode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nVersion
    //      Assign charater version. The value range is:[0,16]
    //      When version is 0, printer caculates version number according to character set automatically.
    //
    // nECCLevel
    //      Assign error correction level.
    //      The value range is: [1, 4].
    //      Definitios are as below:
    //      ECC error correction level
    //      1   L:7%, low error correction, much data.
    //      2   M:15%, medium error correction
    //      3   Q:optimize error correction
    //      4   H:30%, the highest error correction, less data.
    //
    // str
    //      the qrcode data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintQRCode(void *handle, int nVersion, CP_QRCodeECC nECCLevel, const char *str);

    //      print qrcode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nQRCodeUnitWidth
    //     QRCode code block width, the value range is [1, 16]
    //
    // nECCLevel
    //      Assign error correction level.
    //      The value range is: [1, 4].
    //      Definitios are as below:
    //      ECC error correction level
    //      1   L:7%, low error correction, much data.
    //      2   M:15%, medium error correction
    //      3   Q:optimize error correction
    //      4   H:30%, the highest error correction, less data.
    //
    // str
    //      the qrcode data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintQRCodeUseEpsonCmd(void *handle, int nQRCodeUnitWidth, CP_QRCodeECC nECCLevel, const char *str);

    //      print 2 qrcode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nQRCodeUnitWidth
    //     QRCode code block width, the value range is [1, 8]
    //
    // nQR1Position
    // nQR2Position
    //      QRCode position
    //
    // nQR1Version
    // nQR2Version
    //      Assign charater version. The value range is:[0,16]
    //      When version is 0, printer caculates version number according to character set automatically.
    //
    // nQR1ECCLevel
    // nQR2ECCLevel
    //      Assign error correction level.
    //      The value range is: [1, 4].
    //      Definitios are as below:
    //      ECC error correction level
    //      1   L:7%, low error correction, much data.
    //      2   M:15%, medium error correction
    //      3   Q:optimize error correction
    //      4   H:30%, the highest error correction, less data.
    //
    // strQR1
    // strQR2
    //      the qrcode data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintDoubleQRCode(void *handle, int nQRCodeUnitWidth, int nQR1Position, int nQR1Version, CP_QRCodeECC nQR1ECCLevel, const char *strQR1, int nQR2Position, int nQR2Version, CP_QRCodeECC nQR2ECCLevel, const char *strQR2);

    //      print pdf417 barcode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // columnCount
    //      column count, range is [0,30]
    //
    // rowCount
    //      row count, range is 0,[3,90]
    //
    // unitWidth
    //      module unit width, range is [2,8]
    //
    // rowHeight
    //      row height, range is [2,8]
    //
    // nECCLevel
    //      ecc level, range is [0,8]
    //
    // dataProcessingMode
    //      data processing mode, 0 select standard PDF417, 1 select cutoff PDF417
    //
    // str
    //      the pdf417 data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintPDF417BarcodeUseEpsonCmd(void *handle, int columnCount, int rowCount, int unitWidth, int rowHeight, int nECCLevel, int dataProcessingMode, const char *str);

    //      print image
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // dstw
    //      the width to print
    //
    // dsth
    //      the height to print
    //
    // pszFile
    //      image file path
    //
    // binaryzation_method
    //      image binaryzation method. 0 means use dithering, 1 means use thresholding, 2 means use error diffusion.
    //
    // compression_method
    //      print data compress method, values are defined as follow
    //      value define
    //      0     no compress
    //      1     compress level 1
    //      2     compress level 2
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintRasterImageFromFile(void *handle, int dstw, int dsth, const char *pszFile, CP_ImageBinarizationMethod binaryzation_method, CP_ImageCompressionMethod compression_method);

    //      print image (data can be readed from file)
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // dstw
    //      the width to print
    //
    // dsth
    //      the height to print
    //
    // data
    //      image data
    //
    // data_size
    //      image data size
    //
    // binaryzation_method
    //      image binaryzation method. 0 means use dithering, 1 means use thresholding, 2 means use error diffusion.
    //
    // compression_method
    //      print data compress method, values are defined as follow
    //      value define
    //      0     no compress
    //      1     compress level 1
    //      2     compress level 2
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintRasterImageFromData(void *handle, int dstw, int dsth, const unsigned char *data, unsigned int data_size, CP_ImageBinarizationMethod binaryzation_method, CP_ImageCompressionMethod compression_method);

    //      print image pixels
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // img_data
    //      image pixels data
    //
    // img_datalen
    //      image pixels data length
    //
    // img_width
    //      image pixel width
    //
    // img_height
    //      image pixel height
    //
    // img_stride
    //      image horizontal stirde. means bytes per line.
    //
    // img_format
    //      image pixel data format, values are defined as follow
    //      value define
    //      1     mono
    //      2     monolsb
    //      3     gray
    //      4     r.g.b in byte-ordered
    //      5     b.g.r in byte-ordered
    //      6     a.r.g.b in byte-ordered
    //      7     r.g.b.a in byte-ordered
    //      8     a.b.g.r in byte-ordered
    //      9     b.g.r.a in byte-ordered
    //
    // binaryzation_method
    //      image binaryzation method. 0 means use dithering, 1 means use thresholding, 2 means use error diffusion.
    //
    // compression_method
    //      print data compress method, values are defined as follow
    //      value define
    //      0     no compress
    //      1     compress level 1
    //      2     compress level 2
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintRasterImageFromPixels(void *handle, const unsigned char *img_data, unsigned int img_datalen, int img_width, int img_height, int img_stride, CP_ImagePixelsFormat img_format, CP_ImageBinarizationMethod binaryzation_method, CP_ImageCompressionMethod compression_method);

    //      print one horizontal line
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nLineStartPosition
    //      line start position
    //
    // nLineEndPosition
    //      line end position
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintHorizontalLine(void *handle, int nLineStartPosition, int nLineEndPosition);

    //      print one horizontal line
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nLineStartPosition
    //      line start position
    //
    // nLineEndPosition
    //      line end position
    //
    // nLineThickness
    //      line thickness
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintHorizontalLineSpecifyThickness(void *handle, int nLineStartPosition, int nLineEndPosition, int nLineThickness);

    //      print multiple horizontal lines at one row, multi call can print curve
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nLineCount
    //      Line count
    //
    // pLineStartPosition
    //      Line start position
    //
    // pLineEndPosition
    //      Line end position
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_PrintMultipleHorizontalLinesAtOneRow(void *handle, int nLineCount, int *pLineStartPosition, int *pLineEndPosition);

    //      reset printer, clear settings
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_ResetPrinter(void *handle);

    //      set print speed (some printer suppert)
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nSpeed
    //      print speed in mm/s
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetPrintSpeed(void *handle, int nSpeed);

    //      set print density (some printer suppert)
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nDensity
    //      the print density[0,15]
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetPrintDensity(void *handle, int nDensity);

    //      set printer to single byte mode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetSingleByteMode(void *handle);

    //      set character set
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nCharacterSet
    //      character set, range is [0, 15]
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetCharacterSet(void *handle, CP_CharacterSet nCharacterSet);

    //      set character codepage
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nCharacterCodepage
    //      character codepage, range is [0,255]
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetCharacterCodepage(void *handle, CP_CharacterCodepage nCharacterCodepage);

    //      set printer to multi byte mode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetMultiByteMode(void *handle);

    //      set printer multi byte encoding
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nEncoding
    //      multi byte encoding, values defined as follow:
    //      value define
    //      0     GBK
    //      1     UTF8
    //      3     BIG5
    //      4     SHIFT-JIS
    //      5     EUC-KR
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetMultiByteEncoding(void *handle, CP_MultiByteEncoding nEncoding);

    //      set print movement unit
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nHorizontalMovementUnit
    //      horizontal movement unit
    //
    // nVerticalMovementUnit
    //      vertical movement unit
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      if set movement unit to 200, 1mm means 8point.
AUTOREPLYPRINT_API int CP_Pos_SetMovementUnit(void *handle, int nHorizontalMovementUnit, int nVerticalMovementUnit);

    //      set print area left margin
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nLeftMargin
    //      print area left margin
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetPrintAreaLeftMargin(void *handle, int nLeftMargin);

    //      set print area width
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nWidth
    //      print area width
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetPrintAreaWidth(void *handle, int nWidth);

    //      set horizontal absolute print position
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nPosition
    //      print position
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetHorizontalAbsolutePrintPosition(void *handle, int nPosition);

    //      set horizontal relative print position
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nPosition
    //      print position
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetHorizontalRelativePrintPosition(void *handle, int nPosition);

    //      set vertical absolute print position, only valid in page mode.
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nPosition
    //      print position
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetVerticalAbsolutePrintPosition(void *handle, int nPosition);

    //      set vertical relative print position, only valid in page mode.
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nPosition
    //      print position
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetVerticalRelativePrintPosition(void *handle, int nPosition);

    //      set print alignment
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nAlignment
    //      print alignment, value are defined as follow:
    //      value define
    //      0     align left
    //      1     align center
    //      2     align right
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetAlignment(void *handle, CP_Pos_Alignment nAlignment);

    //      set text scale
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nWidthScale
    //      width scale
    //
    // nHeightScale
    //      height scale
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetTextScale(void *handle, int nWidthScale, int nHeightScale);

    //      set ascii text font type
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nFontType
    //      ascii text font type, values defined as follow:
    //      value define
    //      0     FontA (12x24)
    //      1     FontB (9x17)
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetAsciiTextFontType(void *handle, int nFontType);

    //      set text bold
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nBold
    //      text bold , values defined as follow:
    //      value define
    //      0     don't bold
    //      1     bold
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetTextBold(void *handle, int nBold);

    //      set text underline
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nUnderline
    //      text underline, values defined as follow:
    //      value define
    //      0     no underline
    //      1     1 point underline
    //      2     2 point underline
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetTextUnderline(void *handle, int nUnderline);

    //      set text upside down
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nUpsideDown
    //      upside down, values defined as follow:
    //      value define
    //      0     print text dont't upside down
    //      1     print text upside down
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetTextUpsideDown(void *handle, int nUpsideDown);

    //      set text black and white reverse
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nWhiteOnBlack
    //      black and white reverse, values defined as follow:
    //      value define
    //      0     print text normal
    //      1     print text black and white reverse
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetTextWhiteOnBlack(void *handle, int nWhiteOnBlack);

    //      set text rotate 90 print
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nRotate
    //      set text rotate, value defined as follow:
    //      value define
    //      0     print normal
    //      1     text print rotate 90 degree
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetTextRotate(void *handle, int nRotate);

    //      set line height
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nLineHeight
    //      line height, value range is [1,255]
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetTextLineHeight(void *handle, int nLineHeight);

    //      set ascii text char right spacing
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nSpacing
    //      right spacing, range is [1,255]
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetAsciiTextCharRightSpacing(void *handle, int nSpacing);

    //      set kanji text char left spacing and right spacing
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nLeftSpacing
    //      left spacing, range is [1,255]
    //
    // nRightSpacing
    //      right spacing, range is [1,255]
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetKanjiTextCharSpacing(void *handle, int nLeftSpacing, int nRightSpacing);

    //      set barcode and qrcode unit width
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nBarcodeUnitWidth
    //      It assigns the code basic element width. range is [2,6]
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetBarcodeUnitWidth(void *handle, int nBarcodeUnitWidth);

    //      set barcode height
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nBarcodeHeight
    //      Barcode height, range is [1,255]
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetBarcodeHeight(void *handle, int nBarcodeHeight);

    //      set barcode readable text font type
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nFontType
    //      It assigns HRI(Human Readable Interpretation) character font types.
    //      value type
    //      0     standard ASCII
    //      1     small ASCII
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetBarcodeReadableTextFontType(void *handle, int nFontType);

    //      set barcode readable text print position
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nTextPosition
    //      barcode readable text position, value range is [0, 3].
    //      value defined as follow:
    //      value define
    //      0     don't show readable text
    //      1     show readable text below barcode
    //      2     show readable text above barcode
    //      3     show readable text above and below barcode
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Pos_SetBarcodeReadableTextPosition(void *handle, CP_Pos_BarcodeTextPrintPosition nTextPosition);

    //      select page mode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_SelectPageMode(void *handle);

    //      select page mode and set movement unit , page area.and other params to default value.
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nHorizontalMovementUnit
    //      horizontal movement unit
    //
    // nVerticalMovementUnit
    //      vertical movement unit
    //
    // x
    //      horizontal start position
    //
    // y
    //      vertical start position
    //
    // width
    //      print area width
    //
    // height
    //      print area height
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_SelectPageModeEx(void *handle, int nHorizontalMovementUnit, int nVerticalMovementUnit, int x, int y, int width, int height);

    //      exit page mode and enter standard mode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //      none
AUTOREPLYPRINT_API int CP_Page_ExitPageMode(void *handle);

    //      print page in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_PrintPage(void *handle);

    //      clear page in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_ClearPage(void *handle);

    //      set page area in pagemode, max height is 2000(8 dot per mm)
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal start position
    //
    // y
    //      vertical start position
    //
    // width
    //      print area width
    //
    // height
    //      print area height
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_SetPageArea(void *handle, int x, int y, int width, int height);

    //      set print direction in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nDirection
    //      print area direction
    //      0    left -> right
    //      1    bottom -> top
    //      2    right -> left
    //      3    top -> bottom
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_SetPageDrawDirection(void *handle, CP_Page_DrawDirection nDirection);

    //      draw rect in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // width
    //      rect width
    //
    // height
    //      rect height
    //
    // color
    //      rect color, 0 means white, 1 means black.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_DrawRect(void *handle, int x, int y, int width, int height, int color);

    //      draw box in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // width
    //      box width
    //
    // height
    //      box height
    //
    // borderwidth
    //      box border width
    //
    // bordercolor
    //      box border color, 0 means white, 1 means black.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_DrawBox(void *handle, int x, int y, int width, int height, int borderwidth, int bordercolor);

    //      draw text in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_DrawText(void *handle, int x, int y, const char *str);

    //      draw text in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to UTF8 encoding.
AUTOREPLYPRINT_API int CP_Page_DrawTextInUTF8(void *handle, int x, int y, const wchar_t *str);

    //      draw text in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to GBK encoding.
AUTOREPLYPRINT_API int CP_Page_DrawTextInGBK(void *handle, int x, int y, const wchar_t *str);

    //      draw text in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to BIG5 encoding.
AUTOREPLYPRINT_API int CP_Page_DrawTextInBIG5(void *handle, int x, int y, const wchar_t *str);

    //      draw text in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to ShiftJIS encoding.
AUTOREPLYPRINT_API int CP_Page_DrawTextInShiftJIS(void *handle, int x, int y, const wchar_t *str);

    //      draw text in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to EUCKR encoding.
AUTOREPLYPRINT_API int CP_Page_DrawTextInEUCKR(void *handle, int x, int y, const wchar_t *str);

    //      print 1D barcode in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // nBarcodeType
    //      barcode type
    //      values are defined as follow:
    //      value    type
    //      0x41     UPC-A
    //      0x42     UPC-E
    //      0x43     EAN13
    //      0x44     EAN8
    //      0x45     CODE39
    //      0x46     ITF
    //      0x47     CODABAR
    //      0x48     CODE93
    //      0x49     CODE128
    //
    // str
    //      the barcode data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_DrawBarcode(void *handle, int x, int y, CP_Pos_BarcodeType nBarcodeType, const char *str);

    //      print qrcode in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // nVersion
    //      Assign charater version. The value range is:[0,16]
    //      When version is 0, printer caculates version number according to character set automatically.
    //
    // nECCLevel
    //      Assign error correction level.
    //      The value range is: [1, 4].
    //      Definitios are as below:
    //      ECC error correction level
    //      1   L:7%, low error correction, much data.
    //      2   M:15%, medium error correction
    //      3   Q:optimize error correction
    //      4   H:30%, the highest error correction, less data.
    //
    // str
    //      the qrcode data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_DrawQRCode(void *handle, int x, int y, int nVersion, CP_QRCodeECC nECCLevel, const char *str);

    //      print image in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // dstw
    //      the width to print
    //
    // dsth
    //      the height to print
    //
    // pszFile
    //      image file path
    //
    // binaryzation_method
    //      image binaryzation method. 0 means use dithering, 1 means use thresholding, 2 means use error diffusion.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_DrawRasterImageFromFile(void *handle, int x, int y, int dstw, int dsth, const char *pszFile, CP_ImageBinarizationMethod binaryzation_method);

    //      print image in pagemode(data can be readed from file)
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // dstw
    //      the width to print
    //
    // dsth
    //      the height to print
    //
    // data
    //      image data
    //
    // data_size
    //      image data size
    //
    // binaryzation_method
    //      image binaryzation method. 0 means use dithering, 1 means use thresholding, 2 means use error diffusion.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_DrawRasterImageFromData(void *handle, int x, int y, int dstw, int dsth, const unsigned char *data, unsigned int data_size, CP_ImageBinarizationMethod binaryzation_method);

    //      print image pixels in pagemode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // img_data
    //      image pixels data
    //
    // img_datalen
    //      image pixels data length
    //
    // img_width
    //      image pixel width
    //
    // img_height
    //      image pixel height
    //
    // img_stride
    //      image horizontal stirde. means bytes per line.
    //
    // img_format
    //      image pixel data format, values are defined as follow
    //      value define
    //      1     mono
    //      2     monolsb
    //      3     gray
    //      4     r.g.b in byte-ordered
    //      5     b.g.r in byte-ordered
    //      6     a.r.g.b in byte-ordered
    //      7     r.g.b.a in byte-ordered
    //      8     a.b.g.r in byte-ordered
    //      9     b.g.r.a in byte-ordered
    //
    // binaryzation_method
    //      image binaryzation method. 0 means use dithering, 1 means use thresholding, 2 means use error diffusion.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Page_DrawRasterImageFromPixels(void *handle, int x, int y, const unsigned char *img_data, unsigned int img_datalen, int img_width, int img_height, int img_stride, CP_ImagePixelsFormat img_format, CP_ImageBinarizationMethod binaryzation_method);

    //      enable black mark mode, need reboot printer.
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_BlackMark_EnableBlackMarkMode(void *handle);

    //      disable black mark mode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_BlackMark_DisableBlackMarkMode(void *handle);

    //      set black mark max search length(reboot will also valid)
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // maxFindLength
    //      max find length (maxFindLength x 0.125 mm)
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_BlackMark_SetBlackMarkMaxFindLength(void *handle, int maxFindLength);

    //      find next black mark
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_BlackMark_FindNextBlackMark(void *handle);

    //      in black mode, set start print position
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // position
    //      position > 0 means feed, position < 0 means feedback. distance is position x 0.125 mm.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_BlackMark_SetBlackMarkPaperPrintPosition(void *handle, int position);

    //      in black mark mode, set cut position
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // position
    //      position > 0 means feed, position < 0 means feedback. distance is position x 0.125 mm.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_BlackMark_SetBlackMarkPaperCutPosition(void *handle, int position);

    //      full cut paper
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_BlackMark_FullCutBlackMarkPaper(void *handle);

    //      half cut paper
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_BlackMark_HalfCutBlackMarkPaper(void *handle);

    //      enable label mode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_EnableLabelMode(void *handle);

    //      disable label mode
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DisableLabelMode(void *handle);

    //      calibrate label paper(change to different label paper, need calibration)
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_CalibrateLabel(void *handle);

    //      Feed paper to gap
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_FeedLabel(void *handle);

    //      printer feed paper back to print position (for label printting starts positioning)
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_BackPaperToPrintPosition(void *handle);

    //      printer feed paper to tear position (for label printting ends positioning)
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_FeedPaperToTearPosition(void *handle);

    //      assign the start of a label page, and set Page size, reference point coordinates and page rotation.
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      page start point x coordinates
    //
    // y
    //      page start point y coordinates
    //
    // width
    //      page width
    //
    // height
    //      page height
    //
    // rotation
    //      page rotating. The value range of rotate is {0,1}. Page doesn't rotate to print as 0, and rotate 90 degree to print as 1.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_PageBegin(void *handle, int x, int y, int width, int height, CP_Label_Rotation rotation);

    //      print the label page contents to label paper
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // copies
    //      Copies [ 1 - 255 ]
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_PagePrint(void *handle, int copies);

    //      draw text in assigned position of label page.only for single line
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      define text start position x coordinates,the value range is: [0,Page_Width-1]
    //
    // y
    //      define text start position y coordinates,the value range is: [0,Page_Height-1]
    //
    // font
    //      Choose font, can use 24.
    //      some printer can use 16, [20,99].
    //
    // style
    //      chracter style.
    //      Databits                 define
    //      0 Bold flag bit:         font bold for 1,don't bold if reset zero clearing.
    //      1 underline flag bit:    underline text for 1, don't underline if rest zero clearing
    //      2 inverse flag bit:      inverse for 1(white in black), don't inverse rest zero clearing
    //      3 delete line flage bit: for 1 text with delete line,don't delete line if reset zero clearing.
    //      [5,4]  rotate flag bit:  00 rotates 0 degree
    //                               01 rotates 90 degree
    //                               10 rotates 180 degree
    //                               11 rotates 270 degree
    //      [11,8] font width magnification times;
    //      [15,12] font height magnification times;
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DrawText(void *handle, int x, int y, int font, int style, const char *str);

    //      draw text in assigned position of label page.only for single line
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      define text start position x coordinates,the value range is: [0,Page_Width-1]
    //
    // y
    //      define text start position y coordinates,the value range is: [0,Page_Height-1]
    //
    // font
    //      Choose font, can use 24.
    //      some printer can use 16, [20,99].
    //
    // style
    //      chracter style.
    //      Databits                 define
    //      0 Bold flag bit:         font bold for 1,don't bold if reset zero clearing.
    //      1 underline flag bit:    underline text for 1, don't underline if rest zero clearing
    //      2 inverse flag bit:      inverse for 1(white in black), don't inverse rest zero clearing
    //      3 delete line flage bit: for 1 text with delete line,don't delete line if reset zero clearing.
    //      [5,4]  rotate flag bit:  00 rotates 0 degree
    //                               01 rotates 90 degree
    //                               10 rotates 180 degree
    //                               11 rotates 270 degree
    //      [11,8] font width magnification times;
    //      [15,12] font height magnification times;
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to UTF8 encoding.
AUTOREPLYPRINT_API int CP_Label_DrawTextInUTF8(void *handle, int x, int y, int font, int style, const wchar_t *str);

    //      draw text in assigned position of label page.only for single line
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      define text start position x coordinates,the value range is: [0,Page_Width-1]
    //
    // y
    //      define text start position y coordinates,the value range is: [0,Page_Height-1]
    //
    // font
    //      Choose font, can use 24.
    //      some printer can use 16, [20,99].
    //
    // style
    //      chracter style.
    //      Databits                 define
    //      0 Bold flag bit:         font bold for 1,don't bold if reset zero clearing.
    //      1 underline flag bit:    underline text for 1, don't underline if rest zero clearing
    //      2 inverse flag bit:      inverse for 1(white in black), don't inverse rest zero clearing
    //      3 delete line flage bit: for 1 text with delete line,don't delete line if reset zero clearing.
    //      [5,4]  rotate flag bit:  00 rotates 0 degree
    //                               01 rotates 90 degree
    //                               10 rotates 180 degree
    //                               11 rotates 270 degree
    //      [11,8] font width magnification times;
    //      [15,12] font height magnification times;
    //
    // str
    //      the string to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
    //
    // remarks
    //      The function converts the data to GBK encoding.
AUTOREPLYPRINT_API int CP_Label_DrawTextInGBK(void *handle, int x, int y, int font, int style, const wchar_t *str);

    //      Draw 1D code in the assigned position of label page
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      barcode top left corner x coordinates, the value range is: [0,Page_Width-1]
    //
    // y
    //      barcode top left corner y coordinates, the value range is: [0,Page_Height-1]
    //
    // nBarcodeType
    //      barcode type
    //      values are defined as macros
    //
    // nBarcodeTextPrintPosition
    //      barcode readable text position, value range is [0, 3].
    //      value defined as follow:
    //      value define
    //      0     don't show readable text
    //      1     show readable text below barcode
    //      2     show readable text above barcode
    //      3     show readable text above and below barcode
    //
    // height
    //      define barcode height
    //
    // unitwidth
    //      It assigns the basic element width. value range is [1, 4].
    //
    // rotation
    //      Mean rotating angle,
    //      the value range is: [0, 3].
    //      Definitions are as below:
    //      Rotate value define
    //      0 doesn't rotate to draw
    //      1 rotates 90 degree draw.
    //      2 rotates 180 degree draw.
    //      3 rotates 270 degree draw
    //
    // str
    //      the barcode data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DrawBarcode(void *handle, int x, int y, CP_Label_BarcodeType nBarcodeType, CP_Label_BarcodeTextPrintPosition nBarcodeTextPrintPosition, int height, int unitwidth, CP_Label_Rotation rotation, const char *str);

    //      print qrcode in the assigned position of label page
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      Top left corner x coordinates, the value range is: [0,Page_Width-1]
    //
    // y
    //      Top left corner y coordinates, the value range is: [0,Page_Height-1]
    //
    // nVersion
    //      Assign charater version. The value range is:[0,16]
    //      When version is 0, printer caculates version number according to character set automatically.
    //
    // nECCLevel
    //      Assign error correction level.
    //      The value range is: [1, 4].
    //      Definitios are as below:
    //      ECC error correction level
    //      1   L: 7%, low error correction, much data.
    //      2   M: 15%, medium error correction
    //      3   Q: optimize error correction
    //      4   H: 30%, the highest error correction, less data.
    //
    // unitwidth
    //      It assigns the basic element width. value range is [1, 4].
    //
    // rotation
    //      Mean rotating angle,
    //      the value range is: [0, 3].
    //      Definitions are as below:
    //      Rotate value define
    //      0 doesn't rotate to draw
    //      1 rotates 90 degree draw.
    //      2 rotates 180 degree draw.
    //      3 rotates 270 degree draw
    //
    // str
    //      the qrcode data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DrawQRCode(void *handle, int x, int y, int nVersion, CP_QRCodeECC nECCLevel, int unitwidth, CP_Label_Rotation rotation, const char *str);

    //      print pdf417code in the assigned position of label page
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      Top left corner x coordinates, the value range is: [0,Page_Width-1]
    //
    // y
    //      Top left corner y coordinates, the value range is: [0,Page_Height-1]
    //
    // column
    //      ColNum is colnum, which means how many digits in per line. A digit is 17*UnitWidth dots. Line number is produces automatically by printer,the limited range is 3~90. ColNum value range:[1,30].
    //
    // nECCLevel
    //      Assign error correction level.
    //      The value range is: [0, 8].
    //      Ecc value, error correction number, stored files number(byte)
    //      0 2 1108
    //      1 4 1106
    //      2 8 1101
    //      3 16 1092
    //      4 32 1072
    //      5 64 1024
    //      6 128 957
    //      7 256 804
    //      8 512 496
    //
    // unitwidth
    //      It assigns the basic element width. value range is [1, 3].
    //
    // rotation
    //      Mean rotating angle,
    //      the value range is: [0, 3].
    //      Definitions are as below:
    //      Rotate value define
    //      0 doesn't rotate to draw
    //      1 rotates 90 degree draw.
    //      2 rotates 180 degree draw.
    //      3 rotates 270 degree draw
    //
    // str
    //      the pdf417 data to print
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DrawPDF417Code(void *handle, int x, int y, int column, int nAspectRatio, int nECCLevel, int unitwidth, CP_Label_Rotation rotation, const char *str);

    //      Draw picture in the assigned position of label page
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      Top left corner x coordinates, the value range is: [0,Page_Width-1]
    //
    // y
    //      Top left corner y coordinates, the value range is: [0,Page_Height-1]
    //
    // dstw
    //      the width to print
    //
    // dsth
    //      the height to print
    //
    // pszFile
    //      image file path
    //
    // binaryzation_method
    //      image binaryzation method. 0 means use dithering, 1 means use thresholding, 2 means use error diffusion.
    //
    // compression_method
    //      print data compress method, values are defined as follow
    //      value define
    //      0     no compress
    //      1     compress level 1
    //      2     compress level 2
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DrawImageFromFile(void *handle, int x, int y, int dstw, int dsth, const char *pszFile, CP_ImageBinarizationMethod binaryzation_method, CP_ImageCompressionMethod compression_method);

    //      Draw picture in the assigned position of label page
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      Top left corner x coordinates, the value range is: [0,Page_Width-1]
    //
    // y
    //      Top left corner y coordinates, the value range is: [0,Page_Height-1]
    //
    // dstw
    //      the width to print
    //
    // dsth
    //      the height to print
    //
    // data
    //      image data
    //
    // data_size
    //      image data size
    //
    // binaryzation_method
    //      image binaryzation method. 0 means use dithering, 1 means use thresholding, 2 means use error diffusion.
    //
    // compression_method
    //      print data compress method, values are defined as follow
    //      value define
    //      0     no compress
    //      1     compress level 1
    //      2     compress level 2
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DrawImageFromData(void *handle, int x, int y, int dstw, int dsth, const unsigned char *data, unsigned int data_size, CP_ImageBinarizationMethod binaryzation_method, CP_ImageCompressionMethod compression_method);

    //      Draw picture in the assigned position of label page
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      Top left corner x coordinates, the value range is: [0,Page_Width-1]
    //
    // y
    //      Top left corner y coordinates, the value range is: [0,Page_Height-1]
    //
    // img_data
    //      image pixels data
    //
    // img_datalen
    //      image pixels data length
    //
    // img_width
    //      image pixel width
    //
    // img_height
    //      image pixel height
    //
    // img_stride
    //      image horizontal stirde. means bytes per line.
    //
    // img_format
    //      image pixel data format, values are defined as follow
    //      value define
    //      1     mono
    //      2     monolsb
    //      3     gray
    //      4     r.g.b in byte-ordered
    //      5     b.g.r in byte-ordered
    //      6     a.r.g.b in byte-ordered
    //      7     r.g.b.a in byte-ordered
    //      8     a.b.g.r in byte-ordered
    //      9     b.g.r.a in byte-ordered
    //
    // binaryzation_method
    //      image binaryzation method. 0 means use dithering, 1 means use thresholding, 2 means use error diffusion.
    //
    // compression_method
    //      print data compress method, values are defined as follow
    //      value define
    //      0     no compress
    //      1     compress level 1
    //      2     compress level 2
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DrawImageFromPixels(void *handle, int x, int y, const unsigned char *img_data, unsigned int img_datalen, int img_width, int img_height, int img_stride, CP_ImagePixelsFormat img_format, CP_ImageBinarizationMethod binaryzation_method, CP_ImageCompressionMethod compression_method);

    //      draw line in the assigned position of label page
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // startx
    //      straightway start point x coordinates,the value range is: [0,Page_Width-1]
    //
    // starty
    //      straightway start point y coordinates,the value range is: [0,Page_Height-1]
    //
    // endx
    //      straightway end point x coordinates,the value range is: [0,Page_Width-1]
    //
    // endy
    //      straightway end point y coordinates,the value range is:[0,Page_Height-1]
    //
    // linewidth
    //      line width
    //
    // linecolor
    //      line color, 0 means white, 1 means black.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DrawLine(void *handle, int startx, int starty, int endx, int endy, int linewidth, CP_Label_Color linecolor);

    //      draw rect in the assigned position of label page
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // width
    //      rect width
    //
    // height
    //      rect height
    //
    // color
    //      rect color, 0 means white, 1 means black.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DrawRect(void *handle, int x, int y, int width, int height, CP_Label_Color color);

    //      draw box in the assigned position of label page
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // x
    //      horizontal position
    //
    // y
    //      vertical position
    //
    // width
    //      box width
    //
    // height
    //      box height
    //
    // borderwidth
    //      box border width
    //
    // bordercolor
    //      box border color, 0 means white, 1 means black.
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Label_DrawBox(void *handle, int x, int y, int width, int height, int borderwidth, CP_Label_Color bordercolor);

    //      Query battery level
    //      Only some models with batteries support this command
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // timeout
    //      timeout ms
    //      The wait time for query does not exceed this time
    //
    // return
    //      Returns the battery power, and a range of 0-100. returns -1 to indicate that the query failed.
AUTOREPLYPRINT_API int CP_Proto_QueryBatteryLevel(void *handle, unsigned int timeout);

    //      Query serial number
    //      Only some models support this command
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // buffer
    //      receive buffer
    //
    // count
    //      buffer size
    //
    // timeout
    //      timeout ms
    //      The wait time for query does not exceed this time
    //
    // return
    //      Returns the serial number length.
    //      returns -1 to indicate that the query failed.
    //      returns >= 0 indicate the serial number length.
    //      the serial number stored in buffer.
AUTOREPLYPRINT_API int CP_Proto_QuerySerialNumber(void *handle, char *buffer, unsigned int count, unsigned int timeout);

    //      Set system name and serial number
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // systemName
    //      system name
    //
    // serialNumber
    //      serial number
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Proto_SetSystemNameAndSerialNumber(void *handle, const char *systemName, const char *serialNumber);

    //      Set bluetooth name and bluetooth password
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // bluetoothName
    //      bluetooth name
    //
    // bluetoothPassword
    //      bluetooth password
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Proto_SetBluetoothNameAndPassword(void *handle, const char *bluetoothName, const char *bluetoothPassword);

    //      Set basic parameters, include codepage,baudrate,density, like printersetting.exe ptp page.
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // baudrate
    //      the baudrate to set
    //
    // codepage
    //      the codepage to set
    //      see following:
    //      { ("Simplified Chinese"), 255 },
    //      { ("Traditional Chinese"), 254 },
    //      { ("UTF - 8"), 253 },
    //      { ("SHIFT - JIS"), 252 },
    //      { ("EUC - KR"), 251 },
    //      { ("CP437[U.S.A., Standard Europe]"), 0 },
    //      { ("Katakana"), 1 },
    //      { ("CP850[Multilingual]"), 2 },
    //      { ("CP860[Portuguese]"), 3 },
    //      { ("CP863[Canadian - French]"), 4 },
    //      { ("CP865[Nordic]"), 5 },
    //      { ("WCP1251[Cyrillic]"), 6 },
    //      { ("CP866 Cyrilliec #2"), 7 },
    //      { ("MIK[Cyrillic / Bulgarian]"), 8 },
    //      { ("CP755[East Europe, Latvian 2]"), 9 },
    //      { ("Iran"), 10 },
    //      { ("CP862[Hebrew]"), 15 },
    //      { ("WCP1252 Latin I"), 16 },
    //      { ("WCP1253[Greek]"), 17 },
    //      { ("CP852[Latina 2]"), 18 },
    //      { ("CP858 Multilingual Latin I + Euro)"), 19 },
    //      { ("Iran II"), 20 },
    //      { ("Latvian"), 21 },
    //      { ("CP864[Arabic]"), 22 },
    //      { ("ISO - 8859 - 1[West Europe]"), 23 },
    //      { ("CP737[Greek]"), 24 },
    //      { ("WCP1257[Baltic]"), 25 },
    //      { ("Thai"), 26 },
    //      { ("CP720[Arabic]"), 27 },
    //      { ("CP855"), 28 },
    //      { ("CP857[Turkish]"), 29 },
    //      { ("WCP1250[Central Eurpoe]"), 30 },
    //      { ("CP775"), 31 },
    //      { ("WCP1254[Turkish]"), 32 },
    //      { ("WCP1255[Hebrew]"), 33 },
    //      { ("WCP1256[Arabic]"), 34 },
    //      { ("WCP1258[Vietnam]"), 35 },
    //      { ("ISO - 8859 - 2[Latin 2]"), 36 },
    //      { ("ISO - 8859 - 3[Latin 3]"), 37 },
    //      { ("ISO - 8859 - 4[Baltic]"), 38 },
    //      { ("ISO - 8859 - 5[Cyrillic]"), 39 },
    //      { ("ISO - 8859 - 6[Arabic]"), 40 },
    //      { ("ISO - 8859 - 7[Greek]"), 41 },
    //      { ("ISO - 8859 - 8[Hebrew]"), 42 },
    //      { ("ISO - 8859 - 9[Turkish]"), 43 },
    //      { ("ISO - 8859 - 15[Latin 3]"), 44 },
    //      { ("Thai2"), 45 },
    //      { ("CP856"), 46 },
    //      { ("Cp874"), 47 },
    //      { ("Other(Vietnam)"), 48 },
    //
    // density
    //      the density to set
    //      0 - Light
    //      1 - Normal
    //      2 - Dark
    //
    // asciiFontType
    //      the ascii text font type
    //      0 - FontA(12x24)
    //      1 - FontB(9x24)
    //      2 - FontC(9x17)
    //      3 - FontD(8x16)
    //
    // lineFeed
    //      the line feed char
    //      0 - LF(0x0A)
    //      1 - CR(0x0D)
    //
    // idleTime
    //      idle time (seconds)
    //
    // powerOffTime
    //      power off time (seconds)
    //
    // maxFeedLength
    //      max feed length (mm)
    //
    // pageLength
    //      page length (mm)
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Proto_SetPTPBasicParameters(void *handle, int baudrate, int codepage, int density, int asciiFontType, int lineFeed, int idleTime, int powerOffTime, int maxFeedLength, int pageLength);

    //      set print speed
    //
    // handle
    //      Port handle, returned by OpenXXX
    //
    // nSpeed
    //      print speed in mm/s
    //
    // return
    //      If command is written successfully, it returns true else it returns false.
AUTOREPLYPRINT_API int CP_Settings_Hardware_SetPrintSpeed(void *handle, int nSpeed);


#ifdef __cplusplus
}
#endif

#endif

