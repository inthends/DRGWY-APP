import React, {Fragment} from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback, TextInput, Keyboard} from 'react-native';
import BasePage from '../pages/base/base';
import Macro from '../utils/macro';
import {connect} from 'react-redux';
import {
    Flex,
    Button,
    WhiteSpace,
    WingBlank,
    Radio,
    List,
    Icon,
    TextareaItem,
} from '@ant-design/react-native';
import LoadImage from './load-image';
import ScreenUtil from '../utils/screen-util';

import UDToast from '../utils/UDToast';

import selectImage from '../static/images/select.png';
import unselectImage from '../static/images/no-select.png';
import CommonView from './CommonView';
import api from '../utils/api';
import DatePicker from 'react-native-datepicker'


export default class ChaiFei extends BasePage {

//onClose
    constructor(props) {
        super(props);
        this.state = {
            money: '',
            memo: '',
            last:'',
            a:this.props.item.beginDate,
        };

        console.log(112,this.props.item)

    }


    in = () => {
        let {money, memo,last,a} = this.state;
        const {item} = this.props;
        if (!money) {
            UDToast.showError('请输入金额');
            return;
        }

        let b = new Date(new Date(a).getTime() + 24*60*60*1000).getYearAndMonthAndDay();


        let data = {
            FirstAmount: money,
            FirstBeginDate: item.beginDate,
            FirstEndDate: a,
            SecondAmount: last,
            SecondBeginDate: b,
            SecondEndDate: item.endDate,
            Memo: memo
        }
        let splitData = {
            Data: JSON.stringify(data),
            keyvalue: item.id
        };

        api.postData('/api/MobileMethod/SplitBilling',splitData).then(res => {
            UDToast.showInfo('操作成功');
            this.props.onClose();
        });
    };

    /*
    allName: "祥和府/第01栋/第04层/401"
amount: 3895.5
beginDate: "2021-01-01"
billId: "2bd05a1d-bc76-4fb9-b44f-0ac3e48a8a92"
billSource: "租赁合同"
endDate: "2021-03-31"
feeName: "物业费"
id: 166
rmid: null
rowIndex: 1
unitId: "FY-XHF-01-0401"
     */

    render() {

        const {item} = this.props;
        const {a} = this.state;

       let b = new Date(new Date(a).getTime() + 24*60*60*1000)









        return (



            <View style={{flex: 1,width:'100%'}}>
                <TouchableWithoutFeedback  onPress={() => {

                    Keyboard.dismiss();
                }}>
                    <Flex direction={'column'} >
                        <Flex align={'start'} style={{width:'100%'}}>
                            <Text style={styles.left}>第一笔</Text>
                        </Flex>
                        <WhiteSpace size={'lg'}/>
                        <Flex align={'start'} style={{width:'100%'}}>
                                <Flex justify={'between'} style={{width:'100%'}}>
                                    <Text style={styles.unenable}>
                                        {item.beginDate}
                                    </Text>
                                    <Text>
                                        至
                                    </Text>
                                    {/*<Text onPress={()=>this.props.showP(true)} style={styles.enable}>*/}
                                    {/*    {a}*/}
                                    {/*</Text>*/}
                                    <DatePicker
                                        style={{width: 105}}
                                        date={a}
                                        mode="date"
                                        placeholder="select date"
                                        format="YYYY-MM-DD"
                                        minDate={item.beginDate}
                                        maxDate={new Date(new Date(item.endDate).getTime() - 24*60*60*1000)}
                                        showIcon={false}
                                        customStyles={{
                                            dateIcon: {
                                                display:'none'
                                                // position: 'absolute',
                                                // left: 0,
                                                // top: 4,
                                                // marginLeft: 0
                                            },
                                            dateInput: styles.enable
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(a) => {this.setState({a: a})}}
                                    />




                                </Flex>
                        </Flex>

                        <WhiteSpace size={'lg'}/>

                        <Flex align={'center'} style={{width:'100%'}}>

                                <Text style={styles.text}>金额</Text>

                            <TextInput
                                value={this.state.money}
                                keyboardType={'decimal-pad'}
                                onChangeText={money => {
                                    if (!isNaN(money) && money >= 0 && money <= item.amount) {
                                        this.setState({money,last:(item.amount-money).toFixed(2)})
                                    }
                                }} style={styles.input}
                                placeholder={'输入正数金额'}/>

                        </Flex>
                        <WhiteSpace size={'lg'}/>



                        <Flex align={'start'} style={{width:'100%'}}>
                            <Text style={styles.left}>第二笔</Text>
                        </Flex>
                        <WhiteSpace size={'lg'}/>
                        <Flex align={'start'} style={{width:'100%'}}>
                            <Flex justify={'between'} style={{width:'100%'}}>
                                <Text style={styles.unenable}>
                                    {b.getYearAndMonthAndDay()}
                                </Text>
                                <Text>
                                    至
                                </Text>
                                <Text style={styles.unenable}>
                                    {item.endDate}
                                </Text>
                            </Flex>
                        </Flex>

                        <WhiteSpace size={'lg'}/>

                        <Flex align={'center'} style={{width:'100%'}}>

                            <Text style={styles.text}>金额</Text>
                            <Text style={styles.input}>{this.state.last}</Text>


                        </Flex>






                            <WhiteSpace size={'lg'}/>
                            <Flex direction={'column'} align={'start'}>
                                <Flex>
                                    <Text style={styles.left}>说明</Text>
                                </Flex>
                                <WhiteSpace size={'lg'}/>

                                <TextareaItem
                                    style={styles.area}
                                    placeholder={'请输入说明'}
                                    rows={3}
                                    onChange={memo => this.setState({memo})}
                                    value={this.state.memo}

                                />

                            </Flex>

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
        width: '100%'
    },
    text: {
        fontSize: 17,
    },
    input: {
        fontSize: 17,
        marginLeft:50

    },
    state: {
        fontSize: 17,
        paddingLeft: 10,
    },
    area: {
        borderWidth: 1,
        borderColor: '#eeeeee',
        width: ScreenUtil.deviceWidth() - 90,

        borderRadius: 10,

    },
    unenable: {
        fontSize:17,
        color:'#333',
        backgroundColor:'#eeeeee',
        paddingLeft: 10,
        paddingRight:10,
        paddingTop:6,
        paddingBottom:6,
        borderRadius: 10,
        overflow:'hidden'


    },
    enable: {
        fontSize:17,
        color:'#333',
        backgroundColor:'#fff',

        paddingTop:6,
        paddingBottom:6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderStyle:'solid'
    },


});

