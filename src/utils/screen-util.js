/*
 设备的像素密度，例如：
 PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
 PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
 PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,xhdpi Android 设备 (320 dpi)
 PixelRatio.get() === 3          iPhone 6 plus , xxhdpi Android 设备 (480 dpi)
 PixelRatio.get() === 3.5        Nexus 6       */

import {
    Dimensions,
    PixelRatio,
    Platform,
    NativeModules,
    DeviceInfo,
} from 'react-native';

import {Header} from 'react-navigation';


const defaultPixel = 2;                           //iphone6的像素密度
//px转换成dp
const w2 = 750 / defaultPixel;
const h2 = 1334 / defaultPixel;
const deviceWidth = Dimensions.get('window').width;      //设备的宽度
const deviceHeight = Dimensions.get('window').height;    //设备的高度
const scale = Math.min(deviceHeight / h2, deviceWidth / w2);   //获取缩放比例
const pixelRatio = PixelRatio.get();      //当前设备的像素密度
const fontScale = PixelRatio.getFontScale();                      //返回字体大小缩放比例

const X_WIDTH = 375;
const X_HEIGHT = 812;

const {height: D_HEIGHT, width: D_WIDTH} = Dimensions.get('window');

const {PlatformConstants = {}} = NativeModules;
const {minor = 0} = PlatformConstants.reactNativeVersion || {};


export default {
    deviceWidth() {
        return deviceWidth;
    },
    deviceHeight() {
        return deviceHeight;
    },
    /**
     * 设置text为sp
     * @param size sp
     * return number dp
     */
    setSpText(size: number) {
        size = Math.round((size * scale + 0.5) / fontScale);
        return size / defaultPixel;
    },

    scaleSize(size: number) {
        size = Math.round((size * scale + 0.5));
        return size / defaultPixel;
    },
    isIphoneX() {
        if (Platform.OS === 'web') return false;
        if (minor >= 50) {
            return DeviceInfo.isIPhoneX_deprecated;
        }
        return (
            Platform.OS === 'ios' &&
            ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
                (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
        );
    },
    tabbarHeight() {
        return this.isIphoneX() ? 82 : 48;
    },
    navigationHeight() {
        console.log('Header.HEIGHT', Header.HEIGHT);
        return Header.HEIGHT;
    },

    contentHeight() {
        return this.deviceHeight() - this.tabbarHeight() - this.navigationHeight();
    },
    contentHeightWithNoTabbar() {
        return this.deviceHeight()-this.navigationHeight()
    },
    borderBottom() {
        return {
            borderBottomWidth:1,
            borderStyle:'solid',
            borderBottomColor:'#eee'
        }
    },


};
