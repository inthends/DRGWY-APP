import React from 'react'; 
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import BasePage from '../../base/base';
import { Icon } from '@ant-design/react-native';
import common from '../../../utils/common';
import service from '../statistics-service';
import Macro from '../../../utils/macro';
import { RNCamera } from 'react-native-camera';
import UDToast from '../../../utils/UDToast';

//交通银行扫码
export default class BCMScanScreen extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '上门收费',
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
            moveAnim: new Animated.Value(0),
            res: '',
            tbout_trade_no: '',
            code: '',
            result: null,
            count: null
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
            result
        }, () => {
            let out_trade_no = common.getValueFromProps(this.props, 'out_trade_no');
            let isDigital = common.getValueFromProps(this.props, 'isDigital'); 
            if (isDigital) {
                //扫数字货币付款码
                service.bcmMisScanPay(result.data, out_trade_no).then(resp => {
                    if (resp === 'need_query') {
                        this.needQueryMis(out_trade_no);
                    } else {
                        //callBack(out_trade_no);
                        this.props.navigation.goBack();
                    }
                }).catch(() => {
                    this.setState({
                        result: null,
                        count: null
                    });
                });

            } else {
                //扫人民币付款码
                service.bcmScanPay(result.data, out_trade_no).then(resp => {
                    if (resp === 'need_query') {
                        this.needQuery(out_trade_no);
                    } else {
                        //callBack(out_trade_no);
                        this.props.navigation.goBack();
                    }
                }).catch(() => {
                    this.setState({
                        result: null,
                        count: null
                    });
                });
                // this.props.navigation.navigate('feeDetail', {
                //     data: {
                //         b:tbout_trade_no,
                //         a:e.data,
                //     }
                // })
                // }).catch(() => {
                //     this.setState({
                //         result: null,
                //         count: null,
                //     });
            }
        });
    };

    //查询数字人民币扫码结果
    needQueryMis(out_trade_no) {
        //let callBack = common.getValueFromProps(this.props, 'callBack');
        let count = this.state.count || 7;
        if (count === 7) {
            this.showLoadingNumber = UDToast.showLoading('正在查询支付结果，请稍后...');
        }
        this.setState({
            count: count - 1,
        }, () => {
            if (count > 0) {
                service.bcmMisScanPayQuery(out_trade_no).then(query => {
                    if (query === 'SUCCESS') {
                        UDToast.hiddenLoading(this.showLoadingNumber);
                        this.props.navigation.goBack();
                    } else {
                        setTimeout(() => {
                            this.needQueryMis(out_trade_no);
                        }, 5000);
                    }
                }).catch(res => {
                    UDToast.hiddenLoading(this.showLoadingNumber);
                    this.setState({
                        result: null,
                        count: null,
                    });
                });
            }
        });
    }

    needQuery(out_trade_no) {
        //let callBack = common.getValueFromProps(this.props, 'callBack');
        let count = this.state.count || 10;
        if (count === 10) {
            this.showLoadingNumber = UDToast.showLoading('正在查询支付结果，请稍后...');
        }
        this.setState({
            count: count - 1,
        }, () => {
            if (count > 0) {
                service.bcmScanPayQuery(out_trade_no).then(query => {
                    if (query === 'SUCCESS') {
                        UDToast.hiddenLoading(this.showLoadingNumber);
                        //callBack(res.out_trade_no);
                        this.props.navigation.goBack();
                    } else {
                        setTimeout(() => {
                            this.needQuery(out_trade_no);
                        }, 5000);
                    }
                }).catch(res => {
                    UDToast.hiddenLoading(this.showLoadingNumber);
                    this.setState({
                        result: null,
                        count: null,
                    });
                });
            }
            // else {
            //     service.wftScanPayReserve(res.out_trade_no);
            //     setTimeout(() => {
            //         UDToast.hiddenLoading(this.showLoadingNumber);
            //         this.props.navigation.goBack();
            //     }, 1000);
            // }
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
                    //flashMode={RNCamera.Constants.FlashMode.on}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    onBarCodeRead={this.onBarCodeRead}>
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
        backgroundColor: Macro.work_blue
    }
});
