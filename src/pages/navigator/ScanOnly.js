import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
    ScrollView
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import common from '../../utils/common';
import NavigatorService from './navigator-service';
import {Flex} from '@ant-design/react-native';

export default class ScanOnly extends Component {
    constructor(props) {
        super(props);
        this.state = {
            res: '',
            tbout_trade_no:'',
            code:'',
        };
    }

    onSuccess = (e) => {
        // let ids = common.getValueFromProps(this.props);
        // NavigatorService.createOrder(ids).then(res=>{
        //     NavigatorService.scanPay(e.data, res.out_trade_no).then(res => {
        //         this.props.navigation.goBack();
        //     }).catch(()=>{
        //         this.scanner.reactivate();
        //     });
        //
        //     // this.props.navigation.navigate('feeDetail', {
        //     //     data: {
        //     //         b:tbout_trade_no,
        //     //         a:e.data,
        //     //     }
        //     // })
        // })



    };


    render() {
        return (
            <QRCodeScanner
                ref={ref => this.scanner = ref}
                onRead={this.onSuccess}
                topContent={
                    <ScrollView>
                        <Flex>
                            <Text style={{paddingLeft:10}}>
                                {this.state.tbout_trade_no}
                            </Text>
                            <Text style={{paddingLeft:10}}>
                                {this.state.code}
                            </Text>
                            <Text style={{paddingLeft:10}}>
                                {this.state.res}
                            </Text>
                        </Flex>
                    </ScrollView>

                }
                // bottomContent={
                //     <TouchableOpacity onPress={()=>this.scanner.reactivate()}>
                //         <Text style={styles.buttonText}>重新扫码</Text>
                //     </TouchableOpacity>
                // }
            />
        );
    }
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 20,
        color: '#666',
    },
    buttonTouchable: {
        padding: 16,
    },
});


