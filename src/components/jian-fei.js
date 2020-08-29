import React, {Fragment} from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback, TextInput, Keyboard} from 'react-native';
import BasePage from '../pages/base/base';
import Macro from '../utils/macro';
import {connect} from 'react-redux';
import {Flex, Button, WhiteSpace, WingBlank, Radio, List, Icon, TextareaItem} from '@ant-design/react-native';
import LoadImage from './load-image';
import ScreenUtil from '../utils/screen-util';

import UDToast from '../utils/UDToast';

import selectImage from '../static/images/select.png';
import unselectImage from '../static/images/no-select.png';
import CommonView from './CommonView';
import api from '../utils/api';


export default class JianFei extends BasePage {


    constructor(props) {
        super(props);
        this.state = {
            money: '',
            memo: '',

        };

    }


    in = () => {
        const {keyValue, money, memo} = this.state;

        const {item} = this.props;





        if (!money) {
            UDToast.showError('请输入金额');
            return;
        }


        let p = {
            ReductionAmount: money,
            Memo: memo,
            Rebate:10,
        }

        let params = {
            Data: JSON.stringify(p),
            keyvalue: item.id,
        };
        api.postData('/api/MobileMethod/ReductionBilling',params).then(res => {
            UDToast.showInfo('操作成功');
            this.props.onClose();
        });
    };


    render() {
        const {status} = this.state;
        return (


            <View style={{flex: 1}}>
                <TouchableWithoutFeedback onPress={() => {

                    Keyboard.dismiss();
                }}>
                    <Flex direction={'column'}>

                        <Flex align={'start'} style={{width: '100%', paddingLeft: 5}}>
                            <WingBlank>
                                <Text style={styles.left}>减免金额</Text>
                                <WhiteSpace size={'xl'}/>
                                <TextInput
                                    style={styles.area2}
                                    value={this.state.money}
                                    onChangeText={money => this.setState({money})} style={styles.input}
                                    placeholder={'输入金额'}/>
                            </WingBlank>
                        </Flex>


                        <WingBlank>
                            <WhiteSpace size={'xl'}/>
                            <Flex direction={'column'} align={'start'}>
                                <Flex>
                                    <Text style={styles.left}>说明</Text>
                                </Flex>
                                <WhiteSpace size={'xl'}/>

                                <TextareaItem
                                    style={styles.area}
                                    placeholder={'请输入说明'}
                                    rows={3}
                                    onChange={memo => this.setState({memo})}
                                    value={this.state.memo}

                                />

                            </Flex>
                        </WingBlank>
                        <Button style={{width: '100%', marginTop: 20}} type="primary"
                                onPress={this.in}>确定</Button>
                    </Flex>

                </TouchableWithoutFeedback>
            </View>


        );
    }
}

const styles = StyleSheet.create({

    left: {
        fontSize: 17,
    },
    input: {
        fontSize: 17,
    },
    state: {
        fontSize: 17,
        paddingLeft: 10,
    },
    area: {
        borderWidth: 1,
        borderColor: '#eeeeee',
        width: ScreenUtil.deviceWidth() - 200,

        borderRadius: 10,

    },
    area2: {

        borderBottomColor: '#eee',
        borderBottomWidth: 2,
        borderStyle: 'solid',

    },
});

