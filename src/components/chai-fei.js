import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native';
import BasePage from '../pages/base/base';
import {
    Flex,
    Button,
    WhiteSpace,
    TextareaItem,
} from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';
import UDToast from '../utils/UDToast';
import api from '../utils/api';
import DatePicker from 'react-native-datepicker'
import Macro from '../utils/macro';
import moment from 'moment';

export default class ChaiFei extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            firstAmount: null,
            firstEndDate: null,
            secondAmount: null,
            secondBeginDate: null,
            secondEndDate: null,
            memo: null,
            //a: this.props.item.beginDate
        };
    }

    in = () => {
        let { firstAmount, firstEndDate, secondAmount, secondBeginDate, memo } = this.state;
        const { item } = this.props;
        if (!firstAmount) {
            UDToast.showError('请输入金额');
            return;
        }
        //let b = new Date(new Date(a).getTime() + 24 * 60 * 60 * 1000).getYearAndMonthAndDay();
        let data = {
            firstAmount: firstAmount,
            firstBeginDate: item.beginDate,
            firstEndDate: firstEndDate,
            secondAmount: secondAmount,
            secondBeginDate: secondBeginDate,
            secondEndDate: item.endDate,
            memo: memo
        }
        let splitData = {
            Data: JSON.stringify(data),
            keyvalue: item.id
        };
        api.postData('/api/MobileMethod/SplitBilling', splitData).then(res => {
            UDToast.showInfo('操作成功');
            this.props.onClose();
        });
    };

    render() {
        const { item } = this.props;
        //const { firstEndDate } = this.state;
        //let b = new Date(new Date(a).getTime() + 24 * 60 * 60 * 1000);
        return (
            <View style={{ flex: 1, width: '100%' }}>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }}>
                    <Flex direction={'column'} >
                        <Flex align={'start'} style={{ width: '100%' }}>
                            <Text style={styles.left}>第一笔</Text>
                        </Flex>
                        <WhiteSpace size={'lg'} />
                        <Flex align={'start'} style={{ width: '100%' }}>
                            <Flex justify={'between'} style={{ width: '100%' }}>
                                <Text style={styles.unenable}>
                                    {item.beginDate}
                                </Text>
                                <Text>
                                    至
                                </Text>
                                <DatePicker
                                    style={{ 
                                        width: 108//105
                                     }}
                                    date={this.state.firstEndDate ? this.state.firstEndDate.format('YYYY-MM-DD') : ''}
                                    mode="date"
                                    placeholder="请选择日期"
                                    format="YYYY-MM-DD"
                                    minDate={item.beginDate}
                                    //maxDate={new Date(new Date(item.endDate).getTime() - 24 * 60 * 60 * 1000)}
                                    maxDate={item.endDate}
                                    showIcon={false}
                                    customStyles={{
                                        dateIcon: {
                                            display: 'none'
                                            // position: 'absolute',
                                            // left: 0,
                                            // top: 4,
                                            // marginLeft: 0
                                        },
                                        dateInput: styles.enable
                                    }}
                                    onDateChange={(value) => {
                                        if (value) {
                                            let a = moment(item.beginDate);
                                            let b = moment(item.endDate);
                                            let iDays = b.diff(a, 'days') + 1;
                                            let firstEndDate = moment(value);
                                            this.setState({ firstEndDate: firstEndDate });

                                            let firstDays = firstEndDate.diff(a, 'days') + 1;
                                            let firstamount = (item.amount / iDays * firstDays).toFixed(2);
                                            this.setState({ firstAmount: firstamount, secondAmount: (item.amount - Number(firstamount)).toFixed(2) });
                                            if (firstEndDate < b) {
                                                let tempday = moment(firstEndDate.format('YYYY-MM-DD'));//重新赋值，防止传址引用
                                                tempday = tempday.add(1, 'days');
                                                this.setState({ secondBeginDate: tempday });
                                            } else {
                                                this.setState({ secondBeginDate: firstEndDate });
                                            }
                                        } else {
                                            this.setState({ firstEndDate: null, firstAmount: null, secondBeginDate: null, secondAmount: null });
                                        }
                                    }}
                                />
                            </Flex>
                        </Flex>

                        <WhiteSpace size={'lg'} />
                        <Flex align={'center'} style={{ width: '100%' }}>
                            <Text style={styles.text}>金额</Text>
                            <TextInput
                                value={this.state.firstAmount}
                                keyboardType={'decimal-pad'}
                                onChangeText={value => {
                                    if (!isNaN(value) && value >= 0 && value <= item.amount) {
                                        this.setState({ firstAmount: value, secondAmount: (item.amount - value).toFixed(2) });
                                        //修改金额的时候，改变日期 
                                        let a = moment(item.beginDate);
                                        let b = moment(item.endDate);
                                        let iDays = b.diff(a, 'days');
                                        let firstdays = Math.ceil(iDays * Number(value) / item.amount);
                                        let firstEndDate = a.add(firstdays, 'days');
                                        this.setState({ firstEndDate: firstEndDate });
                                        //console.log('firstEndDate1,firstEndDate:' + firstEndDate.format('YYYY-MM-DD'));
                                        if (firstEndDate < b) {
                                            let tempday = moment(firstEndDate.format('YYYY-MM-DD'));//重新赋值，防止传址引用
                                            tempday = tempday.add(1, 'days');
                                            this.setState({ secondBeginDate: tempday });
                                            //console.log('firstEndDate2,firstEndDate.:' + firstEndDate.format('YYYY-MM-DD'));
                                        } else {
                                            this.setState({ secondBeginDate: firstEndDate });
                                        }
                                    } else {
                                        this.setState({ firstEndDate: null, firstAmount: null, secondBeginDate: null, secondAmount: null });
                                    }
                                }} style={styles.input}
                                placeholder={'请输入金额'} />

                        </Flex>
                        <WhiteSpace size={'lg'} />
                        <Flex align={'start'} style={{ width: '100%' }}>
                            <Text style={styles.left}>第二笔</Text>
                        </Flex>
                        <WhiteSpace size={'lg'} />
                        <Flex align={'start'} style={{ width: '100%' }}>
                            <Flex justify={'between'} style={{ width: '100%' }}>
                                <Text style={styles.secondDate}>
                                    {/* {b.getYearAndMonthAndDay()} */}
                                    {this.state.secondBeginDate ? this.state.secondBeginDate.format('YYYY-MM-DD') : ''}
                                </Text>
                                <Text>
                                    至
                                </Text>
                                <Text style={styles.unenable}>
                                    {item.endDate}
                                </Text>
                            </Flex>
                        </Flex>

                        <WhiteSpace size={'lg'} />
                        <Flex align={'center'} style={{ width: '100%' }}>
                            <Text style={styles.text}>金额</Text>
                            <Text style={styles.input}>{this.state.secondAmount}</Text>
                        </Flex>

                        <WhiteSpace size={'lg'} />
                        <Flex direction={'column'} align={'start'}>
                            {/* <Flex>
                                <Text style={styles.left}>说明</Text>
                            </Flex>
                            <WhiteSpace size={'lg'} /> */}
                            <TextareaItem
                                //style={styles.area}
                                style={{
                                    width: ScreenUtil.deviceWidth() - 90
                                }}
                                placeholder={'请输入说明'}
                                rows={3}
                                onChange={memo => this.setState({ memo })}
                                value={this.state.memo}
                            />
                        </Flex>
                        <Button style={{ width: '100%', marginTop: 10, backgroundColor: Macro.work_blue }} type="primary"
                            onPress={this.in}>确定</Button>
                    </Flex>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    left: {
        fontSize: 16,
        width: '100%'
    },
    text: {
        fontSize: 16,
    },
    input: {
        fontSize: 16,
        marginLeft: 10
    },
    state: {
        fontSize: 16,
        paddingLeft: 10,
    },

    unenable: {
        fontSize: 16,
        color: '#404145',
        backgroundColor: '#eeeeee',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 10,
        overflow: 'hidden'
    },
    enable: {
        fontSize: 16,
        color: '#404145',//'#333'
        backgroundColor: '#fff',
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderStyle: 'solid'
    },

    secondDate: {
        width: 108, 
        fontSize: 16,
        color: '#404145',
        backgroundColor: '#eeeeee',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 10,
        overflow: 'hidden'
    },
});

