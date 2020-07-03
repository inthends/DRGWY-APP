import React, { Fragment } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    NativeModules,
    ScrollView,
    Alert,
    DeviceEventEmitter,
} from 'react-native';
import BasePage from '../base/base';
import { Flex, Icon, Checkbox, Modal } from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
import { connect } from 'react-redux';
// import ListHeader from '../../components/list-header';
import common from '../../utils/common';
import LoadImage from '../../components/load-image';
import TwoChange from '../../components/two-change';
import NavigatorService from './navigator-service';
import MyPopover from '../../components/my-popover';
import UDToast from '../../utils/UDToast';
// import QRCode from 'react-native-qrcode-svg';
import CommonView from '../../components/CommonView';
// import { upgrade } from 'rn-app-upgrade';


class FeeDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        // console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '上门收费',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity onPress={navigation.state.params.addFee}>
                    <Text style={{
                        fontSize: 16,
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingTop: 10,
                        paddingBottom: 10,
                    }}>加费</Text>

                    {/*<Icon name='add' style={{ width: 30, marginLeft: 15 }} />*/}
                </TouchableOpacity>
            ),
            type: null,
            isShow: true,
        };
    };

    addFee = () => {
        this.props.navigation.navigate('feeAdd', {
            data: this.state.room,
        });
    };

    constructor(props) {
        super(props);
        this.props.navigation.setParams({
            addFee: this.addFee,
        });
        // let room = common.getValueFromProps(this.props) || {id:'FY-XHF-01-0101'};
        let room = common.getValueFromProps(this.props);
        //console.log('room123', room);
        this.state = {
            room,
            pageIndex: 1,
            dataInfo: {
                data: [],
            },
            type: null,
            isShow: true,
            out_trade_no: null,
            visible: false,
            code: '',
            price: '0.00',
            needPrint: false,
            printAgain: false,
            isML: false,
            mlType: '抹去角',
            mlScale: '四舍五入',
            mlAmount: 0
        };
    }

    componentDidMount(): void {
        DeviceEventEmitter.addListener('printAgain', () => {
            setTimeout(() => {
                if (!this.state.printAgain) {
                    this.setState({
                        printAgain: true,
                    }, () => {
                        // this.func(this.params);
                    });
                }
            }, 2000);
        });
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.onRefresh();
                if (this.state.out_trade_no && this.state.visible === false) {
                    this.getOrderStatus(this.state.out_trade_no);
                }

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

    callBack = (out_trade_no) => {
        NavigatorService.printInfo(out_trade_no).then(res => {
            NativeModules.LHNToast.printTicket({
                ...res,
                username: this.props.userInfo && this.props.userInfo.username,
            });
        });
    };

    click = (title) => {
        const items = this.state.dataInfo.data.filter(item => item.select === true);
        if (items.length === 0) {
            UDToast.showError('请选择');
        } else {
            let ids = JSON.stringify((items.map(item => item.id)));
            const { isML, mlAmount, price } = this.state;
            switch (title) {
                case '刷卡': {

                    if (common.isIOS()) {
                        UDToast.showInfo('功能暂未开放，敬请期待！');
                    } else {
                        NavigatorService.createOrder(ids, isML, mlAmount).then(res => {
                            NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                                ...res,
                                transType: 101, //消费
                            });
                        });
                    }
                    break;
                }
                case '扫码': {
                    NavigatorService.createOrder(ids, isML, mlAmount).then(res => {
                        let posType = res.posType;
                        if (posType === '银盛') {
                            this.setState({
                                out_trade_no: res.out_trade_no,
                            });
                            NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                                ...res,
                                transType: 1070, //pos机扫顾客
                            });
                        } else {
                            this.props.navigation.push('scan', {
                                data: ids,
                                callBack: this.callBack,
                                printAgain: false,
                            });
                        }
                    });
                    break;
                }
                case '收款码': {

                    NavigatorService.createOrder(ids, isML, mlAmount).then(res => {
                        let posType = res.posType;
                        if (posType === '银盛') {
                            this.setState({
                                out_trade_no: res.out_trade_no,
                            });
                            NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                                ...res,
                                transType: 1054, //顾客扫pos机
                            });
                        } else {
                            NavigatorService.qrcodePay(res.out_trade_no).then(code => {
                                this.setState({
                                    visible: true,
                                    cancel: false,
                                    code,
                                    needPrint: true,
                                    printAgain: false,
                                }, () => {
                                    this.getOrderStatus(res.out_trade_no);
                                });
                            });
                        }
                    });
                    break;
                }

                case '现金': {
                    Alert.alert(
                        '确定现金支付？',
                        '',
                        [
                            {
                                text: '取消',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            {
                                text: '确定',
                                onPress: () => {
                                    this.func = this.cashPay;
                                    this.params = ids;
                                    this.cashPay(ids, isML, mlAmount);
                                },
                            },
                        ],
                        { cancelable: false },
                    );
                    break;
                }
            }
        }
    };

    cashPay = (ids, isML, mlAmount) => {
        NavigatorService.cashPay(ids, isML, mlAmount).then(res => {
            NavigatorService.cashPayPrint(ids).then(res => {
                NativeModules.LHNToast.printTicket({
                    ...res,
                    username: this.props.userInfo && this.props.userInfo.username,
                });
            });
        });
    };

    onRefresh = () => {
        const { pageIndex, type, room, isShow } = this.state;
        NavigatorService.getBillList(type, room.id, isShow, pageIndex, 1000).then(dataInfo => {
            this.setState({
                dataInfo: dataInfo,
            }, () => {
                // console.log(this.state);
            });
        });
    };

    typeOnChange = (type, isShow) => {
        // console.log(type);
        this.setState({
            type,
            isShow,
            dataInfo: {
                data: [],
            },
        }, () => {
            this.onRefresh();
        });
    };

    changeItem = item => {
        const { isML, mlType, mlScale, type } = this.state;
        if (type === '已收') {
            this.props.navigation.push('charge', { data: item });

        } else {

            let data = this.state.dataInfo.data;
            data = data.map(it => {
                if (it.id === item.id) {
                    it.select = it.select !== true;
                }
                return it;
            });

            // price = price.toFixed(2);
            this.setState({
                dataInfo: {
                    ...this.state.dataInfo,
                    data,
                }
                //price,
            });

            const items = data.filter(item => item.select === true);
            if (items.length != 0) {
                let price = items.filter(item => item.select === true).reduce((a, b) => a + b.amount, 0);
                //从后台计算抹零总金额 neo 2020年7月1日23:00:52
                let ids = JSON.stringify((items.map(item => item.id)));
                NavigatorService.CalFee(isML, mlType, mlScale, price, ids).then(res => {
                    this.setState({ price: res.lastAmount, mlAmount: res.mlAmount });
                });
            } else {
                this.setState({ price: 0.00 });
            }
        }
    };

    //抹零计算
    mlCal = (isML, mlType, mlScale) => {
        const items = this.state.dataInfo.data.filter(item => item.select === true);
        if (items.length != 0) {
            let price = items.filter(item => item.select === true).reduce((a, b) => a + b.amount, 0);
            //从后台计算抹零总金额 neo 2020年7月1日23:00:52
            let ids = JSON.stringify((items.map(item => item.id)));
            NavigatorService.CalFee(isML, mlType, mlScale, price, ids).then(res => {
                this.setState({ price: res.lastAmount, mlAmount: res.mlAmount });
            });
        }
        else {
            this.setState({ price: 0.00 });
        }
    };

    onClose = () => {
        this.setState({
            visible: false,
            cancel: true,
            code: '',
            out_trade_no: null,
            needPrint: false,
        }, () => {
            this.onRefresh();
        });
    };

    getOrderStatus = (out_trade_no) => {
        clearTimeout(this.timeOut);
        NavigatorService.orderStatus(out_trade_no).then(res => {
            if (res) {
                if (this.state.needPrint) {
                    this.func = this.printInfo;
                    this.params = out_trade_no;
                    this.printInfo(out_trade_no);
                }
                this.onClose();
            } else {
                if (!this.state.cancel) {
                    this.timeOut = setTimeout(() => {
                        this.getOrderStatus(out_trade_no);
                    }, 1000);
                }
            }
        });
    };

    printInfo = (out_trade_no) => {
        NavigatorService.printInfo(out_trade_no).then(res => {
            NativeModules.LHNToast.printTicket({
                ...res,
                username: this.props.userInfo && this.props.userInfo.username,
            });
        });
    };

    render() {
        const { dataInfo, type, room, price } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollView>
                    <Text style={{ paddingLeft: 10, paddingTop: 10, fontSize: 20 }}>{room.allName} {room.tenantName}</Text>
                    <TwoChange onChange={this.typeOnChange} />
                    <Flex style={{ backgroundColor: '#eee', height: 1, marginLeft: 10, marginRight: 10, marginTop: 10 }} />
                    {dataInfo.data.map(item => (
                        <TouchableWithoutFeedback key={item.id} onPress={() => this.changeItem(item)}>
                            <Flex style={styles.check}>
                                {type !== '已收' && <Checkbox
                                    checked={item.select === true}
                                    style={{ color: Macro.color_f39d39 }}
                                    onChange={event => {
                                        this.changeItem(item);
                                    }}
                                />}
                                <Flex align={'start'} direction={'column'} style={{ marginLeft: 3, flex: 1 }}>
                                    <Flex justify={'between'}
                                        style={{ paddingLeft: 10, paddingTop: 5, paddingBottom: 5, width: '100%' }}>
                                        {/* {type !== '已收' && <Text style={{ fontSize: 16, width: '80%',color:'green' }}>{item.allName}</Text>} */}
                                        <Text style={{ fontSize: 16, width: '80%', color: 'green' }}>{item.allName}</Text>
                                        {type !== '已收'
                                            && item.billSource === '临时加费'
                                            && item.rmid === null
                                            && (
                                                <Flex>
                                                    <Text onPress={() => {
                                                        Alert.alert(
                                                            '确认删除',
                                                            '',
                                                            [
                                                                {
                                                                    text: '取消',
                                                                    onPress: () => { },
                                                                    style: 'cancel',
                                                                },
                                                                {
                                                                    text: '确定',
                                                                    onPress: () => {
                                                                        NavigatorService.invalidBillForm(item.id).then(res => {
                                                                            this.onRefresh();
                                                                        });
                                                                    },
                                                                },
                                                            ],
                                                            { cancelable: false },
                                                        );
                                                    }} style={{
                                                        paddingRight: 10,
                                                        fontSize: 16,
                                                        color: 'red',
                                                    }}>删除</Text>
                                                </Flex>
                                            )}
                                    </Flex>
                                    <Flex justify={'between'}
                                        style={[{ paddingLeft: 10, paddingTop: 10, paddingBottom: 5, width: '100%' }, type === '已收' ? { paddingBottom: 10 } : {}]}>

                                        {/* <Text style={{ fontSize: 16 }}>{type === '已收' ?
                                            item.billCode :
                                            item.feeName 
                                        }</Text> */}

                                        {type === '已收' ? <Text style={{ fontSize: 16 }}>{item.billCode}</Text> :
                                            item.rmid ?
                                                <Flex>
                                                    <Text style={{ fontSize: 16 }}>{item.feeName + ' '}</Text>
                                                    <Text style={{
                                                        color: 'red',
                                                        fontSize: 8,
                                                        paddingBottom: 16
                                                    }}>惠</Text>
                                                </Flex>
                                                :
                                                <Text style={{ fontSize: 16 }}>{item.feeName}</Text>
                                        }

                                        <Flex>
                                            <Text style={{ paddingRight: 10, fontSize: 16 }}>{item.amount}</Text>
                                        </Flex>
                                    </Flex>

                                    {/* {item.beginDate ? <Text style={{
                                        paddingLeft: 15,
                                        paddingTop: 10,
                                    }}> {item.beginDate + '至' + item.endDate}</Text> : null} */}

                                    {type === '已收' ?
                                        <Text style={{
                                            paddingLeft: 10,
                                            paddingTop: 10,
                                        }}> {item.billDate + '，收款人：' + item.createUserName}
                                        </Text>
                                        : item.beginDate ?
                                            <Text style={{
                                                paddingLeft: 10,
                                                paddingTop: 10,
                                            }}>
                                                {item.beginDate + '至' + item.endDate}</Text> : null
                                    }

                                </Flex>
                            </Flex>
                        </TouchableWithoutFeedback>
                    ))}
                </ScrollView>
                {type === '已收' || dataInfo.data.length === 0 ? null : (
                    <Flex style={{ marginBottom: 30 }} direction={'column'}>
                        <Flex justify={'between'} >
                            <Checkbox
                                defaultChecked={false}
                                onChange={(e) => {
                                    this.setState({ isML: e.target.checked });
                                    //算抹零金额
                                    this.mlCal(e.target.checked, this.state.mlType, this.state.mlScale);
                                }}
                            ><Text style={{ paddingTop: 3, paddingLeft: 3 }}>抹零</Text></Checkbox>

                            <MyPopover
                                textStyle={{ fontSize: 14 }}
                                onChange={(title) => {
                                    this.setState({ mlType: title });
                                    this.mlCal(this.state.isML, title, this.state.mlScale);
                                }}
                                titles={['抹去角', '抹去分',]}
                                visible={true} />

                            <MyPopover
                                textStyle={{ fontSize: 14 }}
                                onChange={(title) => {
                                    this.setState({ mlScale: title });
                                    this.mlCal(this.state.isML, this.state.mlType, title, title);
                                }}
                                titles={['四舍五入', '直接舍去', '有数进一']}
                                visible={true} />

                        </Flex>

                        <Flex align={'center'}>
                            <Text style={{ paddingLeft: 10, fontSize: 20 }}>抹零：</Text>
                            <Text style={{
                                paddingLeft: 5,
                                fontSize: 20,
                                color: Macro.color_FA3951
                            }}>¥{mlAmount}</Text>

                            <Text style={{ paddingLeft: 10, fontSize: 20 }}>合计：</Text>
                            <Text
                                style={{
                                    paddingLeft: 5,
                                    fontSize: 20,
                                    color: Macro.color_FA3951
                                }}>¥{price}</Text>
                        </Flex>
                        <Flex style={{ minHeight: 40 }}>
                            <TouchableWithoutFeedback
                                disabled={price == 0 ? true : false}
                                onPress={() => this.click('刷卡')}>
                                <Flex justify={'center'} style={styles.ii}>
                                    <Text style={styles.word}>刷卡</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                disabled={price == 0 ? true : false}
                                onPress={() => this.click('扫码')}>
                                <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.color_4d8fcc }]}>
                                    <Text style={styles.word}>扫码</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                disabled={price == 0 ? true : false}
                                onPress={() => this.click('收款码')}>
                                <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.color_f39d39 }]}>
                                    <Text style={styles.word}>收款码</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.click('现金')}>
                                <Flex justify={'center'} style={[styles.ii, { backgroundColor: 'green' }]}>
                                    <Text style={styles.word}>现金</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                    </Flex>
                )
                }

                <Modal
                    transparent
                    onClose={this.onClose}
                    onRequestClose={this.onClose}
                    maskClosable
                    visible={this.state.visible}>
                    <Flex justify={'center'} style={{ margin: 30 }}>
                        {/*<QRCode*/}
                        {/*    size={200}*/}
                        {/*    value={this.state.code}*/}
                        {/*/>*/}
                        <LoadImage style={{ width: 200, height: 200 }} img={this.state.code} />
                    </Flex>

                    {/*<Button type="primary" style={{height:50}} onPress={this.onClose}>*/}
                    {/*    取消*/}
                    {/*</Button>*/}
                </Modal>
            </CommonView >

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
        paddingBottom: 10,
    },
    bottom: {
        color: '#868688',
        fontSize: 18,
        paddingBottom: 10,
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

        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
    },
    image: {
        height: 90,
        width: 90,
    },

    check: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'solid',
        paddingLeft: 10,
        paddingRight: 10,
        // width: (ScreenUtil.deviceWidth() - 50) / 3.0-1,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
    },

    name: {
        fontSize: Macro.font_16,
        fontWeight: '600',
        paddingBottom: 10,
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
        marginTop: 10,
    },
    word: {
        color: 'white',
        fontSize: 16,


    },
});

const mapStateToProps = ({ memberReducer }) => {
    return { userInfo: memberReducer.userInfo };
};

export default connect(mapStateToProps)(FeeDetailPage);
