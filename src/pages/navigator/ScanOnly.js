import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    // Linking,
    // ScrollView,
    Animated,
    View,
    Easing,
} from 'react-native';

// import QRCodeScanner from 'react-native-qrcode-scanner';
import common from '../../utils/common';
// import NavigatorService from './navigator-service';
import { Icon} from '@ant-design/react-native';
import {RNCamera} from 'react-native-camera';
import Macro from '../../utils/macro';

export default class ScanOnly extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: '扫一扫',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),

        };
    };

    constructor(props) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.startAnimation();
        // setTimeout(()=>{
        //     this.onBarCodeRead({data:'0a8a0462-e820-4eb8-b6bf-311f91f6c8e5'})
        // },2000);
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
        const {data, type} = result;
        let callBack = common.getValueFromProps(this.props).callBack;
        let needBack = common.getValueFromProps(this.props).needBack;
        if (callBack) {
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


