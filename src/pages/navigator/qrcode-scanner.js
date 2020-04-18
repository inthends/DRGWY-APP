import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
    ScrollView, View, Animated, Easing, NativeModules,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import common from '../../utils/common';
import NavigatorService from './navigator-service';
import {Flex} from '@ant-design/react-native';
import Macro from '../../utils/macro';
import {RNCamera} from 'react-native-camera';

export default class ScanScreen extends Component {


    // onSuccess = (e) => {
    //     let ids = common.getValueFromProps(this.props);
    //     NavigatorService.createOrder(ids).then(res=>{
    //         NavigatorService.scanPay(e.data, res.out_trade_no).then(res => {
    //             this.props.navigation.goBack();
    //         }).catch(()=>{
    //             this.scanner.reactivate();
    //         });
    //
    //         // this.props.navigation.navigate('feeDetail', {
    //         //     data: {
    //         //         b:tbout_trade_no,
    //         //         a:e.data,
    //         //     }
    //         // })
    //     })
    // };
    constructor(props) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(0),
            res: '',
            tbout_trade_no: '',
            code: '',
            result: null,
        };
    }

    componentDidMount() {
        this.startAnimation();
    }

    startAnimation = () => {
        this.state.moveAnim.setValue(0);
        Animated.timing(
            this.state.moveAnim,
            {
                toValue: -200,
                duration: 1500,
                easing: Easing.linear,
            },
        ).start(() => this.startAnimation());
    };
    //  识别二维码
    onBarCodeRead = (result) => {
        if (this.state.result) {
            return;
        }

        this.setState({
            result,
        }, () => {
            let ids = common.getValueFromProps(this.props);
            let callBack = common.getValueFromProps(this.props,'callBack');
            NavigatorService.createOrder(ids).then(res => {
                NavigatorService.scanPay(result.data, res.out_trade_no).then(resp => {
                    callBack(res.out_trade_no);
                    this.props.navigation.goBack();
                }).catch(() => {
                    this.setState({
                        result: null,
                    });
                });

                // this.props.navigation.navigate('feeDetail', {
                //     data: {
                //         b:tbout_trade_no,
                //         a:e.data,
                //     }
                // })
            }).catch(() => {
                this.setState({
                    result: null,
                });
            });
        });


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
                    // flashMode={RNCamera.Constants.FlashMode.on}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    onBarCodeRead={this.onBarCodeRead}
                >
                    <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle}/>
                        <Animated.View style={[
                            styles.border,
                            {transform: [{translateY: this.state.moveAnim}]}]}/>
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
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: Macro.work_blue,
        backgroundColor: 'transparent',
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10,
    },
    border: {
        flex: 0,
        width: 200,
        height: 2,
        backgroundColor: Macro.work_blue,
    },
});



