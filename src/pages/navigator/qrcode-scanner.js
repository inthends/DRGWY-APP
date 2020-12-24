import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View, Animated, Easing,
    // TouchableOpacity,
    // Linking,
    // ScrollView,
    // NativeModules,
} from 'react-native';

//import QRCodeScanner from 'react-native-qrcode-scanner';
import common from '../../utils/common';
import NavigatorService from './navigator-service';
//import { Flex } from '@ant-design/react-native';
import Macro from '../../utils/macro';
import { RNCamera } from 'react-native-camera';
import UDToast from '../../utils/UDToast';

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
            count: null,
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

    //识别二维码
    onBarCodeRead = (result) => {
        if (this.state.result) {
            return;
        }

        this.setState({
            time: 30,
            result,
        }, () => {
            let ids = common.getValueFromProps(this.props);
            //抹零 neo add
            let isML = common.getValueFromProps(this.props, 'isML');
            //let mlAmount = common.getValueFromProps(this.props, 'mlAmount');
            let mlType = common.getValueFromProps(this.props, 'mlType');
            let mlScale = common.getValueFromProps(this.props, 'mlScale');
            let callBack = common.getValueFromProps(this.props, 'callBack');
            NavigatorService.createOrder(ids, isML, mlType, mlScale).then(res => {
                NavigatorService.scanPay(result.data, res.out_trade_no).then(resp => {
                    if (resp === 'need_query') {
                        this.needQuery(res);
                    } else {
                        callBack(res.out_trade_no);
                        this.props.navigation.goBack();
                    }
                }).catch(() => {
                    this.setState({
                        result: null,
                        count: null,
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
                    count: null,
                });
            });
        }); 
    };

    needQuery(res) {
        let callBack = common.getValueFromProps(this.props, 'callBack');
        let count = this.state.count || 7; 
        if (count === 7) {
            this.showLoadingNumber = UDToast.showLoading('正在查询支付结果，请稍后...');
        }
        this.setState({
            count: count - 1,
        }, () => {
            if (count > 0) {
                NavigatorService.scanPayQuery(res.out_trade_no).then(query => {
                    if (query === 'SUCCESS') {
                        UDToast.hiddenLoading(this.showLoadingNumber);
                        callBack(res.out_trade_no);
                        this.props.navigation.goBack();
                    } else {
                        setTimeout(() => {
                            this.needQuery(res);
                        }, 5000);
                    }
                }).catch(res => {
                    UDToast.hiddenLoading(this.showLoadingNumber);
                    this.setState({
                        result: null,
                        count: null,
                    });
                });
            } else {
                NavigatorService.scanPayReserve(res.out_trade_no);
                setTimeout(() => {
                    UDToast.hiddenLoading(this.showLoadingNumber);
                    this.props.navigation.goBack();
                }, 1000);
            }
        });
    }


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



