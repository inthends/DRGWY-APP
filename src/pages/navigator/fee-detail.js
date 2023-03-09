import React from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    NativeModules,
    ScrollView,
    Alert,
    DeviceEventEmitter,
    View,
} from 'react-native';
import BasePage from '../base/base';
import { Flex, Icon, Checkbox, Modal, DatePickerView } from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
import { connect } from 'react-redux';
import common from '../../utils/common';
import LoadImage from '../../components/load-image';
import TwoChange from '../../components/two-change';
import NavigatorService from './navigator-service';
import MyPopover from '../../components/my-popover';
import UDToast from '../../utils/UDToast';
import CommonView from '../../components/CommonView';
import ActionPopover from '../../components/action-popover';
import JianFei from '../../components/jian-fei';
import ChaiFei from '../../components/chai-fei';
// import QRCode from 'react-native-qrcode-svg';
// import ListHeader from '../../components/list-header';
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
                        color: '#2c2c2c',
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

    onSelect = (opt) => {
        // console.log(opt.props.value);
        this.setState({
            action: false,
            selected: opt.props.value,
        });
    };
    handleVisibleChange = (action) => {
        this.setState({
            action,
        });
    };

    constructor(props) {
        super(props);
        this.props.navigation.setParams({
            addFee: this.addFee,
        });
        let room = common.getValueFromProps(this.props);
        // let room = common.getValueFromProps(this.props);
        //console.log('room123', room);
        this.state = {
            room,
            pageIndex: 1,
            dataInfo: {
                data: [],
            },
            isCIBLife: false,
            type: null,
            isShow: true,
            out_trade_no: null,
            visible: false,
            code: '',
            needPrint: false,
            printAgain: false,
            isML: false,
            mlType: '抹去角',
            mlScale: '四舍五入',
            price: 0.00,
            mlAmount: 0.00,
            isLKL: false,
            isYse: false,
            action: true,
            selected: '',
            chaifeiAlert: false,
            showPicker: false,
        };
        Date.prototype.getYearAndMonthAndDay = function () {
            let year = this.getFullYear();
            let month = this.getMonth() + 1 + '';
            if (month.length === 1) {
                month = 0 + month;
            }
            let day = this.getDate() + '';
            if (day.length === 1) {
                day = 0 + day;
            }
            console.log(year + '-' + month + '-' + day)
            return year + '-' + month + '-' + day;
        }
    }

    componentDidMount(): void {
        this.needPrintListener = DeviceEventEmitter.addListener('needPrint', () => {
            this.onRefresh();
            this.printInfo(this.state.out_trade_no);
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
                //     NavigatorService.wftScanPay(address.a,address.b).then(res => {
                //         alert(JSON.stringify(res));
                //
                //         this.setState({
                //             res: JSON.stringify(res),
                //         });
                //     });
                // }
            },
        );

        if (!common.isIOS()) {
            //判断是否是银盛POS或者拉卡拉POS机
            NativeModules.LHNToast.getPOSType((isLKL, isYse) => {
                this.setState({
                    isLKL: isLKL,
                    isYse: isYse,
                });
            });
        }
        // else {
        //     //方法待实现
        // }

        //获取参数，根据是否兴生活缴费来加载按钮
        NavigatorService.getSettingInfo(this.state.room.organizeId).then((res) => {
            this.setState({ isCIBLife: res });
        });

    }

    componentWillUnmount(): void {
        this.viewDidAppear.remove();
        this.needPrintListener.remove();
    }

    callBack = (out_trade_no) => {
        NavigatorService.printInfo(out_trade_no).then(res => {
            NativeModules.LHNToast.printTicket({
                ...res,
                username: res.userName,
            });
        });
    };

    click = (title) => {
        const items = this.state.dataInfo.data.filter(item => item.select === true);
        if (items.length === 0) {
            UDToast.showError('请选择');
        } else {
            let ids = JSON.stringify((items.map(item => item.id)));
            const { isML, mlType, mlScale } = this.state;
            switch (title) {
                case '刷卡': {
                    if (common.isIOS()) {
                        UDToast.showInfo('功能暂未开放，敬请期待！');
                    } else {
                        //刷卡目前只支持拉卡拉
                        NavigatorService.createOrder(ids, isML, mlType, mlScale).then(res => {
                            this.setState({
                                out_trade_no: res.out_trade_no,
                            });
                            NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                                ...res,
                                "proc_cd": "000000", //拉卡拉消费
                                "pay_tp": "0",
                            });
                        });
                    }
                    break;
                }
                case '扫码': {
                    NavigatorService.createOrder(ids, isML, mlType, mlScale).then(res => {
                        let posType = res.posType;
                        // if (posType === '银盛') {
                        //     if (!this.state.isYse) {
                        //         // 只有是银盛pos机才能扫码和收款码
                        //         UDToast.showInfo('银盛不支持手机扫码，请使用POS机！');
                        //     } else {
                        //         this.setState({
                        //             out_trade_no: res.out_trade_no,
                        //         });
                        //         NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                        //             ...res,
                        //             transType: 1070, //pos机扫顾客
                        //         });
                        //     }
                        // } else
                        if (posType === '拉卡拉') {
                            this.setState({
                                out_trade_no: res.out_trade_no,
                            });
                            NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                                ...res,
                                "proc_cd": "660000", //拉卡拉消费
                                "pay_tp": "1"
                            });

                        } else if (posType === '威富通') {
                            this.props.navigation.push('scan', {
                                // data: ids,
                                // isML: isML,
                                // mlType: mlType,
                                // mlScale: mlScale,
                                //mlAmount: mlAmount,
                                out_trade_no: res.out_trade_no,
                                printAgain: false,
                                callBack: this.callBack
                            });
                        } else if (posType === '嘉联') {
                            this.props.navigation.push('jlscan', {
                                out_trade_no: res.out_trade_no
                            });
                        }
                    });
                    break;
                }
                case '收款码': {
                    NavigatorService.createOrder(ids, isML, mlType, mlScale).then(res => {
                        let posType = res.posType;
                        // if (posType === '银盛') {
                        //     if (!this.state.isYse) {
                        //         // 只有是银盛pos机才能扫码和收款码
                        //         UDToast.showInfo('银盛不支持手机收款码，请使用POS机！');
                        //     } else { 
                        //         this.setState({
                        //             out_trade_no: res.out_trade_no,
                        //         });
                        //         NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                        //             ...res,
                        //             transType: 1054, //顾客扫pos机
                        //         });
                        //     }
                        // } else 
                        if (posType === '拉卡拉') {
                            this.setState({
                                out_trade_no: res.out_trade_no,
                            });
                            NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                                ...res,
                                "proc_cd": "710000", //拉卡拉消费
                                "pay_tp": "1"
                            });
                        }
                        else if (posType === '威富通') {
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
                        } else if (posType === '嘉联') {
                            NavigatorService.jlqrcodePay(res.out_trade_no).then(code => {
                                this.setState({
                                    visible: true,
                                    cancel: false,
                                    code,
                                    needPrint: false,
                                    printAgain: false,
                                }, () => {
                                    this.getJLOrderStatus(res.out_trade_no);
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
                                //onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            {
                                text: '确定',
                                onPress: () => {
                                    this.func = this.cashPay;
                                    this.params = ids;
                                    this.cashPay(ids, isML, mlType, mlScale);
                                }
                            }
                        ],
                        { cancelable: false },
                    );
                    break;
                }
            }
        }
    };

    //兴生活缴费
    clickCIB = () => {

        const items = this.state.dataInfo.data.filter(item => item.select === true);
        if (items.length === 0) {
            UDToast.showError('请选择');
        } else {
            let ids = JSON.stringify((items.map(item => item.id)));
            const { room } = this.state;
            NavigatorService.qrcodePayCIB(room.id, ids).then((code) => {
                this.setState(
                    {
                        visible: true,
                        cancel: false,
                        code,
                        needPrint: false,
                        printAgain: false
                    }
                );
            });
        }
    }

    cashPay = (ids, isML, mlType, mlScale) => {
        NavigatorService.cashPay(ids, isML, mlType, mlScale).then(res => {
            if (this.state.isLKL || this.state.isYse) {
                //pos机才能打印
                NavigatorService.cashPayPrint(ids).then(res => {
                    NativeModules.LHNToast.printTicket({
                        ...res,
                        username: res.userName,
                    });
                });
            }
            this.onRefresh();//刷新数据
        });
    };

    //刷新数据
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
            }
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
                },
                //price,
            });

            const items = data.filter(item => item.select === true);
            if (items.length != 0) {
                //let price = items.filter(item => item.select === true).reduce((a, b) => a + b.amount, 0).toFixed(2);
                //从后台计算抹零总金额 neo 2020年7月1日23:00:52
                let ids = JSON.stringify((items.map(item => item.id)));
                NavigatorService.CalFee(isML, mlType, mlScale, ids).then(res => {
                    this.setState({ price: res.lastAmount, mlAmount: res.mlAmount });
                });
            } else {
                this.setState({ price: 0.00, mlAmount: 0.00 });
            }
        }
    };

    //抹零计算
    mlCal = (isML, mlType, mlScale) => {
        const items = this.state.dataInfo.data.filter(item => item.select === true);
        if (items.length != 0) {
            //let price = items.filter(item => item.select === true).reduce((a, b) => a + b.amount, 0).toFixed(2);//javascript浮点运算的一个bug
            //从后台计算抹零总金额 neo 2020年7月1日23:00:52
            let ids = JSON.stringify((items.map(item => item.id)));
            NavigatorService.CalFee(isML, mlType, mlScale, ids).then(res => {
                this.setState({ price: res.lastAmount, mlAmount: res.mlAmount });
            });
        } else {
            this.setState({ price: 0.00, mlAmount: 0.00 });
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
            //console.log(123456, res)
            NativeModules.LHNToast.printTicket({
                ...res,
                username: res.userName,
            });
        });
    };

    //嘉联查询订单状态
    getJLOrderStatus = (out_trade_no) => {
        clearTimeout(this.timeOut);
        NavigatorService.orderStatus(out_trade_no).then(res => {
            if (res) {
                // if (this.state.needPrint) {
                //     this.func = this.printInfo;
                //     this.params = out_trade_no;
                //     this.printInfo(out_trade_no);
                // }
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

    delete = (item) => {
        Alert.alert(
            '确认删除',
            '',
            [
                {
                    text: '取消',
                    onPress: () => {
                    },
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
            { cancelable: false }
        );
    };

    renderItem = (item) => {
        // const { dataInfo, type, room, price, mlAmount } = this.state;
        const { type } = this.state;
        let titles = [];
        //console.log(11, item);
        if (item.billSource === '临时加费' && item.rmid === null) {
            titles = ['删除', '减免', '拆费'];
        } else {
            titles = ['减免', '拆费'];
        }
        return (
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
                            <Text style={{ fontSize: 16, width: '80%', color: 'green' }}>{item.allName}</Text>
                            {type !== '已收' &&
                                (
                                    <ActionPopover
                                        textStyle={{ fontSize: 14 }}
                                        hiddenImage={true}
                                        onChange={(title) => {
                                            //console.log(1, title);
                                            if (title === '删除') {
                                                this.delete(item);
                                            } else if (title === '减免') {
                                                this.setState({
                                                    selectItem: item,
                                                    jianfeiAlert: true,
                                                });
                                            } else {
                                                this.setState({
                                                    selectItem: item,
                                                    chaifeiAlert: true,
                                                    chaifeiDate: new Date(item.beginDate)
                                                });
                                            }

                                        }}
                                        titles={titles}
                                        visible={true} />
                                )}
                        </Flex>
                        <Flex justify={'between'}
                            style={[{
                                paddingLeft: 10,
                                paddingTop: 10,
                                paddingBottom: 5,
                                width: '100%',
                            }, type === '已收' ? { paddingBottom: 10 } : {}]}>
                            {/* <Text style={{ fontSize: 16 }}>{type === '已收' ?
                                            item.billCode :
                                            item.feeName
                                        }</Text> */}
                            {type === '已收' ? <Text style={{ fontSize: 16 }}>{item.billCode}</Text> :
                                item.rmid ?
                                    <Flex>
                                        <Text style={{ fontSize: 16, color: '#666' }}>{item.feeName + ' '}</Text>
                                        <Text style={{
                                            color: 'red',
                                            fontSize: 8,
                                            paddingBottom: 16
                                        }}>惠</Text>
                                    </Flex>
                                    :
                                    <Text style={{ fontSize: 16, color: '#666' }}>{item.feeName}</Text>
                            }

                            <Flex>
                                <Text style={{ paddingRight: 10, fontSize: 16, color: '#666' }}>{item.amount}</Text>
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
                                color: '#666'
                            }}> {item.billDate + '，收款人：' + item.createUserName}
                            </Text>
                            : item.beginDate ?
                                <Text style={{
                                    paddingLeft: 10,
                                    paddingTop: 10,
                                    color: '#666'
                                }}>{item.beginDate + '至' + item.endDate}</Text> : null
                        }

                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    //dateonChange = (value) => {
    //   console.log(11,value)
    // this.setState({
    //     chaifeiDate: value,
    // })
    //}

    render() {
        const { dataInfo, type, room, price, mlAmount } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollView
                //onScrollBeginDrag={() => console.log('onScrollBeginDrag')}
                >
                    <Text style={{ paddingLeft: 10, paddingTop: 10, fontSize: 18, color: '#2c2c2c' }}>{room.allName} {room.tenantName}</Text>
                    <TwoChange onChange={this.typeOnChange} />
                    <Flex style={{ backgroundColor: '#eee', height: 1, marginLeft: 10, marginRight: 10, marginTop: 10 }} />
                    {dataInfo.data.map(item => {
                        return this.renderItem(item);
                    })}
                </ScrollView>
                {type === '已收' || dataInfo.data.length === 0 ? null : (
                    <Flex style={{ marginBottom: 30 }} direction={'column'}>
                        <Flex justify={'between'}>
                            <Checkbox
                                defaultChecked={false}
                                onChange={(e) => {
                                    this.setState({ isML: e.target.checked });
                                    //算抹零金额
                                    this.mlCal(e.target.checked, this.state.mlType, this.state.mlScale);
                                }}
                            ><Text style={{ paddingTop: 3, paddingLeft: 3, color: '#666' }}>抹零</Text></Checkbox>

                            <MyPopover
                                textStyle={{ fontSize: 14 }}
                                onChange={(title) => {
                                    this.setState({ mlType: title });
                                    this.mlCal(this.state.isML, title, this.state.mlScale);
                                }}
                                titles={['抹去角', '抹去分']}
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
                            <Text style={{ paddingLeft: 10, fontSize: 18, color: '#666' }}>抹零：</Text>
                            <Text style={{
                                paddingLeft: 5,
                                fontSize: 18,
                                color: Macro.color_FA3951,
                            }}>¥{mlAmount}</Text>

                            <Text style={{ paddingLeft: 10, fontSize: 18, color: '#666' }}>合计：</Text>
                            <Text
                                style={{
                                    paddingLeft: 5,
                                    fontSize: 18,
                                    color: Macro.color_FA3951,
                                }}>¥{price}</Text>
                        </Flex>
                        <Flex style={{ minHeight: 40 }}>
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

                            {this.state.isCIBLife ?
                                <TouchableWithoutFeedback onPress={() => this.clickCIB()}>
                                    <Flex
                                        justify={'center'}
                                        style={[styles.ii, { backgroundColor: '#4494f0' }]}
                                    >
                                        <Text style={styles.word}>兴生活</Text>
                                    </Flex>
                                </TouchableWithoutFeedback> : null}

                            {this.state.isLKL || this.state.isYse ?
                                //手机都不能刷卡
                                <TouchableWithoutFeedback
                                    disabled={price == 0 ? true : false}
                                    onPress={() => this.click('刷卡')}>
                                    <Flex justify={'center'} style={styles.ii}>
                                        <Text style={styles.word}>刷卡</Text>
                                    </Flex>
                                </TouchableWithoutFeedback> : null}

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
                    <Flex justify={'center'}>
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
                <Modal
                    transparent
                    onClose={() => this.setState({ jianfeiAlert: false })}
                    onRequestClose={() => this.setState({ jianfeiAlert: false })}
                    maskClosable
                    visible={this.state.jianfeiAlert}>
                    <Flex justify={'center'} align={'center'}>
                        <JianFei onClose={() => {
                            this.setState({ jianfeiAlert: false });
                            this.onRefresh();
                        }} item={this.state.selectItem} />
                    </Flex>
                </Modal>
                {
                    this.state.chaifeiAlert && (
                        <TouchableWithoutFeedback onPress={() => this.setState({ chaifeiAlert: false })}>
                            <View style={{ ...styles.pp, ...styles.c }}>
                                <Flex style={{
                                    backgroundColor: 'white', marginLeft: 30, marginRight: 30, borderRadius: 10,
                                    overflow: 'hidden', padding: 15
                                }} justify={'center'} align={'center'}>
                                    <ChaiFei
                                        onClose={() => {
                                            this.setState({ chaifeiAlert: false });
                                            this.onRefresh();
                                        }}
                                        showP={showPicker => this.setState({ showPicker })}
                                        item={this.state.selectItem}
                                        chaifeiDate={this.state.chaifeiDate}
                                    />
                                </Flex>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }
                {
                    this.state.showPicker &&
                    <TouchableWithoutFeedback onPress={() => {
                        // this.setState({
                        //     showPicker: false,
                        // })
                    }}>

                        <View style={styles.pp} >
                            <DatePickerView
                                mode={'date'}
                                style={styles.dd}
                                value={this.state.chaifeiDate}
                                // onChange={this.dateonChange}
                                minDate={new Date(this.state.selectItem.beginDate)}
                                maxDate={new Date(new Date(this.state.selectItem.endDate).getTime() - 24 * 60 * 60 * 1000)}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                }
            </CommonView>

        );
    }
}

const styles = StyleSheet.create({
    mask: {
        backgroundColor: Macro.color_sky,

    },
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
    pp: {

        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        // zIndex: 99,
    },
    c: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dd: {
        // position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        overflow: 'scroll'

    }
});

const mapStateToProps = ({ memberReducer }) => {
    return { userInfo: memberReducer.userInfo };
};

export default connect(mapStateToProps)(FeeDetailPage);
