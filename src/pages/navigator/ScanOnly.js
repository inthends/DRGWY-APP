import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Animated,
    View,
    Easing
} from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
import common from '../../utils/common';
// import NavigatorService from './navigator-service';
import { Icon } from '@ant-design/react-native';
import { RNCamera } from 'react-native-camera';
import Macro from '../../utils/macro';
import BasePage from '../base/base';
 
export default class ScanOnly extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            title: '扫一扫',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(0)
        };
    }

    componentDidMount() {
        this.startAnimation();
        
        //test
        // setTimeout(() => {
        //     this.onBarCodeRead({ data: 'ea680082-44ad-4f6b-ba82-da433c0da40c' })
        // }, 1000);
    }

    startAnimation = () => {
        this.state.moveAnim.setValue(0);
        Animated.timing(
            this.state.moveAnim,
            {
                toValue: -200,
                duration: 1500,
                easing: Easing.linear
            }
        ).start(() => this.startAnimation());
    };

    //识别二维码
    onBarCodeRead = (result) => {
        const { data } = result;
        let callBack = common.getValueFromProps(this.props).callBack;
        let needBack = common.getValueFromProps(this.props).needBack;
        
        if (callBack && !!data) {
            callBack(data);
        }

        if (needBack) {
            this.props.navigation.goBack();
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    onBarCodeRead={this.onBarCodeRead}
                >
                    <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle} />
                        <Animated.View style={[
                            styles.border,
                            { transform: [{ translateY: this.state.moveAnim }] }]} />
                        <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
                    </View>
                </RNCamera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: Macro.work_blue,
        backgroundColor: 'transparent'
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10
    },
    border: {
        flex: 0,
        width: 200,
        height: 2,
        backgroundColor: Macro.work_blue
    }
});


