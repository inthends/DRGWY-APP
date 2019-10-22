import React, {Fragment} from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Linking, Image, NativeModules,
} from 'react-native';
import BasePage from '../base/base';
import {Button, Flex, Icon, List, WhiteSpace, Checkbox, Modal} from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
import {connect} from 'react-redux';
import ListHeader from '../../components/list-header';
import common from '../../utils/common';
import LoadImage from '../../components/load-image';
import TwoChange from '../../components/two-change';
import NavigatorService from './navigator-service';
import UDToast from '../../utils/UDToast';
import QRCode from 'react-native-qrcode-svg';
import CommonView from '../../components/CommonView';


export default class FeeDetailPage extends BasePage {
    static navigationOptions = ({navigation}) => {

        console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '上门收费',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
            type: null,
        };
    };

    constructor(props) {
        super(props);
        let room = common.getValueFromProps(this.props);
        console.log('room', room);
        this.state = {
            room,
            pageIndex: 1,
            dataInfo: {
                data: [],
            },
            type: null,
            tbout_trade_no: null,
            visible: false,
            code: '',
        };

    }


    componentDidMount(): void {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.onRefresh();
                // if (obj.state.params) {
                //     let address = obj.state.params.data;
                //     NavigatorService.scanPay(address.a,address.b).then(res => {
                //         alert(JSON.stringify(res));
                //
                //         this.setState({
                //             res: JSON.stringify(res),
                //         });
                //     });
                // }


            },
        );

    }

    componentWillUnmount(): void {
        this.viewDidAppear.remove();
    }


    click = (title) => {
        const items = this.state.dataInfo.data.filter(item => item.select === true);
        if (items.length === 0) {
            UDToast.showError('请选择');
        } else {
            let ids = JSON.stringify((items.map(item => item.id)));


            switch (title) {
                case '刷卡': {
                    if (common.isIOS()) {
                        UDToast.showInfo('功能暂未开放，敬请期待！');
                    } else {
                        NavigatorService.createOrder(ids).then(res => {
                            NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', res);
                        });
                    }

                    break;
                }
                case '扫码': {
                    this.props.navigation.push('scan', {data: ids});
                    break;
                }
                case '收款码': {
                    NavigatorService.createOrder(ids).then(res => {
                        NavigatorService.qrcodePay(res.out_trade_no).then(code => {

                            this.setState({
                                visible: true,
                                cancel:false,
                                code,
                            }, () => {
                                this.getOrderStatus(res.out_trade_no);
                            });
                        });
                    });

                    break;
                }
                case '现金': {
                    NavigatorService.cashPay(ids).then(res => {
                        this.onRefresh();
                    });
                    break;
                }
            }


        }

    };


    onRefresh = () => {
        const {pageIndex, type, room} = this.state;
        NavigatorService.getBillList(type, room.id, pageIndex, 1000).then(dataInfo => {
            this.setState({
                dataInfo: dataInfo,
            }, () => {
                console.log(this.state);
            });
        });
    };
    typeOnChange = (type) => {
        console.log(type);
        this.setState({type}, () => {
            this.onRefresh();
        });
    };

    changeItem = item => {
        let data = this.state.dataInfo.data;
        data = data.map(it => {
            if (it.id === item.id) {
                it.select = it.select !== true;
            }
            return it;
        });
        this.setState({
            dataInfo: {
                ...this.state.dataInfo,
                data,
            },
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
            cancel:true,
            code: '',
        }, () => {
            this.onRefresh();
        });
    };

    getOrderStatus = (out_trade_no) => {
        clearTimeout(this.timeOut);
        NavigatorService.orderStatus(out_trade_no).then(res => {
            if (res) {
                this.onClose();
            }else {
                if (!this.state.cancel) {
                    this.timeOut = setTimeout(()=>{
                        this.getOrderStatus(out_trade_no);
                    },1000);
                }

            }
        });

    };


    render() {
        const {statistics, dataInfo, type, room} = this.state;
        return (

            <CommonView style={{flex: 1}}>
                <Text style={{paddingLeft: 15, paddingTop: 15, fontSize: 20}}>{room.allName} {room.tenantName}</Text>
                <TwoChange onChange={this.typeOnChange}/>
                <Flex style={{backgroundColor: '#eee', height: 1, marginLeft: 15, marginRight: 15, marginTop: 15}}/>
                {dataInfo.data.map(item => (
                    <TouchableWithoutFeedback key={item.id} onPress={() => this.changeItem(item)}>
                        <Flex align={'start'} direction={'column'} style={styles.item}>

                            <Flex justify={'between'}
                                  style={{paddingLeft: 15, paddingTop: 5, paddingBottom: 5, width: '100%'}}>
                                <Text style={{fontSize: 16}}>{item.feeName}</Text>
                                <Flex>
                                    <Text style={{paddingRight: 15, fontSize: 16}}>{item.amount}</Text>
                                    {type !== '已交' && <Checkbox
                                        checked={item.select === true}
                                        style={{color: Macro.color_f39d39}}
                                        onChange={event => {
                                            this.changeItem(item);
                                        }}
                                    />}
                                </Flex>
                            </Flex>
                            <Text style={{paddingLeft: 15, paddingTop: 10}}>{item.beginDate}至{item.endDate}</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                ))}
                {type === '已交' ? null : (
                    <Flex>
                        <TouchableWithoutFeedback onPress={() => this.click('刷卡')}>
                            <Flex justify={'center'} style={styles.ii}>
                                <Text style={styles.word}>刷卡</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.click('扫码')}>
                            <Flex justify={'center'} style={[styles.ii, {backgroundColor: Macro.color_4d8fcc}]}>
                                <Text style={styles.word}>扫码</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.click('收款码')}>
                            <Flex justify={'center'} style={[styles.ii, {backgroundColor: Macro.color_f39d39}]}>
                                <Text style={styles.word}>收款码</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.click('现金')}>
                            <Flex justify={'center'} style={[styles.ii, {backgroundColor: 'green'}]}>
                                <Text style={styles.word}>现金</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                )}

                <Modal
                    transparent
                    onClose={this.onClose}
                    maskClosable
                    visible={this.state.visible}

                >
                    <Flex justify={'center'} style={{margin: 30}}>
                        {/*<QRCode*/}
                        {/*    size={200}*/}
                        {/*    value={this.state.code}*/}
                        {/*/>*/}
                        <LoadImage style={{width: 200, height: 200}} img={this.state.code}/>
                    </Flex>

                    {/*<Button type="primary" style={{height:50}} onPress={this.onClose}>*/}
                    {/*    取消*/}
                    {/*</Button>*/}
                </Modal>
            </CommonView>

        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_sky,
        flex: 1,
    },
    content: {
        backgroundColor: Macro.color_white,
        flex: 1,


    },
    title: {
        color: '#333',
        fontSize: 16,
    },


    top: {

        fontSize: 18,
        paddingBottom: 15,
    },
    bottom: {
        color: '#868688',
        fontSize: 18,
        paddingBottom: 20,
    },
    button: {
        color: '#868688',
        fontSize: 16,
        paddingTop: 10,
    },
    blue: {
        borderLeftColor: Macro.color_4d8fcc,
        borderLeftWidth: 8,
    },
    orange: {
        borderLeftColor: Macro.color_f39d39,
        borderLeftWidth: 8,
    },

    left: {
        flex: 1,

    },
    right: {
        flex: 3,

        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: 20,
    },
    image: {
        height: 90,
        width: 90,
    },
    item: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'solid',
        paddingLeft: 5,
        paddingRight: 15,

        // width: (ScreenUtil.deviceWidth() - 50) / 3.0-1,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        marginRight: 15,
        marginLeft: 15,
    },
    name: {
        fontSize: Macro.font_16,
        fontWeight: '600',
        paddingBottom: 15,
    },
    area: {
        color: Macro.color_636470,
        fontSize: Macro.font_14,
    },
    complete: {
        color: Macro.color_80aae2,
        fontSize: Macro.font_14,
        backgroundColor: Macro.color_dae9ff,
        padding: 3,
        paddingLeft: 5,
        borderRadius: 1,
    },
    number: {
        color: Macro.color_9c9ca5,
        fontSize: Macro.font_14,
    },
    desc: {
        color: Macro.color_c2c1c5,
        fontSize: Macro.font_14,
    },
    line: {
        width: 1,
        height: 15,
        backgroundColor: Macro.color_c2c1c5,
        marginLeft: 5,
        marginRight: 5,
    },
    ii: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 3) / 4.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginTop: 30,
    },
    word: {
        color: 'white',
        fontSize: 16,


    },
});
