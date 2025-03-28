//威富通扫码
import React  from 'react'; 
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import BasePage from '../../base/base';
import { Icon } from '@ant-design/react-native'; 
import common from '../../../utils/common';
import service from '../statistics-service'; 
import Macro from '../../../utils/macro';
import { RNCamera } from 'react-native-camera';
import UDToast from '../../../utils/UDToast';

//export default class WFTScanScreen extends Component {
export default class WFTScanScreen extends BasePage {
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

    // onSuccess = (e) => {
    //     let ids = common.getValueFromProps(this.props);
    //     service.createOrder(ids).then(res=>{
    //         service.wftScanPay(e.data, res.out_trade_no).then(res => {
    //             this.props.navigation.goBack();
    //         }).catch(()=>{
    //             this.scanner.reactivate();
    //         }); 
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
            result,
        }, () => {
            //let ids = common.getValueFromProps(this.props);
            //抹零 neo add
            //let isML = common.getValueFromProps(this.props, 'isML');
            //let mlAmount = common.getValueFromProps(this.props, 'mlAmount');
            //let mlType = common.getValueFromProps(this.props, 'mlType');
            //let mlScale = common.getValueFromProps(this.props, 'mlScale');
            let out_trade_no = common.getValueFromProps(this.props, 'out_trade_no');
            let callBack = common.getValueFromProps(this.props, 'callBack');
            //service.createOrder(ids, isML, mlType, mlScale).then(res => {
            service.wftScanPay(result.data, out_trade_no).then(resp => {
                if (resp === 'need_query') {
                    this.needQuery(out_trade_no);
                }
                else {
                    //支付成功
                    callBack(out_trade_no);
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

            // }).catch(() => {
            //     this.setState({
            //         result: null,
            //         count: null,
            //     });
            // });
        });
    };

    needQuery(out_trade_no) {
        let callBack = common.getValueFromProps(this.props, 'callBack');
        let count = this.state.count || 10;//改为9次轮询
        if (count === 10) {
            this.showLoadingNumber = UDToast.showLoading('正在查询支付结果，请稍后...');
        }
        this.setState({
            count: count - 1,
        }, () => {
            if (count > 0) {
                service.wftScanPayQuery(out_trade_no).then(query => {
                    if (query === 'SUCCESS') {
                        UDToast.hiddenLoading(this.showLoadingNumber);
                        callBack(out_trade_no);
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
             else {
                //支付不成功，冲正
                service.wftScanPayReserve(out_trade_no);
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



