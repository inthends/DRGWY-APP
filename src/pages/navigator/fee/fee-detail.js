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
    View
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon, Checkbox, Modal, DatePickerView } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import TwoChange from '../../../components/two-change';
import service from '../statistics-service';
import MyPopover from '../../../components/my-popover';
import UDToast from '../../../utils/UDToast';
import CommonView from '../../../components/CommonView';
import ActionPopover from '../../../components/action-popover';
import JianFei from '../../../components/jian-fei';
import ChaiFei from '../../../components/chai-fei';
// import QRCode from 'react-native-qrcode-svg';
// import ListHeader from '../../components/list-header';
// import { upgrade } from 'rn-app-upgrade';

class FeeDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '上门收费',
            headerForceInset: this.headerForceInset,
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
                        paddingBottom: 10
                    }}>加费</Text>
                    {/*<Icon name='add' style={{ width: 30, marginLeft: 15 }} />*/}
                </TouchableOpacity>
            ),
            type: null,
            isShow: true
        };
    };

    addFee = () => {
        this.props.navigation.navigate('feeAdd', {
            data: {
                id: this.state.room.id,
                billSource: '临时加费'
            } //this.state.room
        });
    };

    onSelect = (opt) => {
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
            addFee: this.addFee
        });
        let room = common.getValueFromProps(this.props);
        // let room = common.getValueFromProps(this.props);
        this.state = {
            room,
            pageIndex: 1,
            pageSize: 100,
            dataInfo: {
                data: [],
            },
            isCIBLife: false,
            type: '未收',
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
            // isLKL: false,
            // isYse: false,
            action: true,
            selected: '',
            chaifeiAlert: false,
            showPicker: false,
            isDigital: false//数字货币二维码
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
            return year + '-' + month + '-' + day;
        }
    }

    componentDidMount() {
        //获取参数，根据是否兴生活缴费来加载按钮
        service.getSettingInfo(this.state.room.organizeId).then((res) => {
            this.setState({ isCIBLife: res });
        });

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
                //     service.wftScanPay(address.a,address.b).then(res => { 
                //         this.setState({
                //             res: JSON.stringify(res),
                //         });
                //     });
                // }
            },
        );

        // if (!common.isIOS()) {
        //     //判断是否是银盛POS或者拉卡拉POS机
        //     NativeModules.LHNToast.getPOSType((isLKL, isYse) => {
        //         this.setState({
        //             isLKL: isLKL,
        //             isYse: isYse
        //         });
        //     });
        // }
        // else {
        //     //方法待实现
        // }
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
        this.needPrintListener.remove();
    }

    callBack = (out_trade_no) => {
        service.printInfo(out_trade_no).then(res => {
            NativeModules.LHNToast.printTicket({
                ...res,
                username: res.userName
            });
        });
    };

    click = (title) => {
        const items = this.state.dataInfo.data.filter(item => item.select === true);
        if (items.length === 0) {
            UDToast.showError('请选择费用');
        } else {
            let ids = JSON.stringify((items.map(item => item.id)));
            const { isML, mlType, mlScale, isDigital } = this.state;
            switch (title) {
                //app 不支持刷卡
                case '扫码': {
                    service.createOrder(ids, isML, mlType, mlScale, 1).then(res => {
                        if (!res.posType) {
                            UDToast.showError(res);
                            return;
                        }
                        let posType = res.posType;
                        switch (posType) {
                            // case '银盛':
                            //     {
                            //         if (!this.state.isYse) {
                            //             // 只有是银盛pos机才能扫码和收款码
                            //             UDToast.showError('银盛不支持手机扫码，请使用POS机！');
                            //         } else {
                            //             this.setState({
                            //                 out_trade_no: res.out_trade_no,
                            //             });
                            //             NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                            //                 ...res,
                            //                 transType: 1070, //pos机扫顾客
                            //             });
                            //         }
                            //         break;
                            //     }
                            case '拉卡拉':
                                {
                                    this.setState({
                                        out_trade_no: res.out_trade_no,
                                    });
                                    NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                                        ...res,
                                        "proc_cd": "660000", //拉卡拉消费
                                        "pay_tp": "1"
                                    });
                                    break;
                                }

                            case '拉卡拉聚合':
                                {
                                    this.props.navigation.push('lklscan', {
                                        out_trade_no: res.out_trade_no
                                    });
                                    break;
                                }

                            case '威富通':
                                {
                                    this.props.navigation.push('wftscan', {
                                        // data: ids,
                                        // isML: isML,
                                        // mlType: mlType,
                                        // mlScale: mlScale,
                                        // mlAmount: mlAmount,
                                        out_trade_no: res.out_trade_no,
                                        printAgain: false,
                                        callBack: this.callBack
                                    });
                                    break;
                                }

                            case '嘉联':
                                {
                                    this.props.navigation.push('jlscan', {
                                        out_trade_no: res.out_trade_no
                                    });
                                    break;
                                }

                            case '交通银行':
                                {
                                    this.props.navigation.push('bcmscan', {
                                        isDigital: isDigital,
                                        out_trade_no: res.out_trade_no
                                    });
                                    break;
                                }

                            case '兴业银行':
                                {
                                    this.props.navigation.push('cibscan', {
                                        isDigital: isDigital,
                                        out_trade_no: res.out_trade_no
                                    });
                                    break;
                                }

                            case '南京银行':
                                {
                                    // this.setState({
                                    //     nanjingRes: res
                                    // });
                                    // this.props.navigation.push('scanForHome', {
                                    //     data: {
                                    //         callBack: (scanCodeData) => {
                                    //             setTimeout(() => {
                                    //                 NativeModules.LHNToast.startActivityFromJS(
                                    //                     'com.statistics.LKLPayActivity',
                                    //                     {
                                    //                         ...res,
                                    //                         transName: '二维码被扫',
                                    //                         scanCodeData
                                    //                     }
                                    //                 );
                                    //             }, 2000);
                                    //         },
                                    //         needBack: true
                                    //     }
                                    // }); 
                                    //扫码接口
                                    this.props.navigation.push('njscan', {
                                        out_trade_no: res.out_trade_no
                                    });
                                    break;
                                }

                            case '建设银行':
                                {
                                    this.props.navigation.push('ccbscan', {
                                        out_trade_no: res.out_trade_no
                                    });
                                    break;
                                }

                            default:
                                break;
                        }
                    }).catch(err => { UDToast.showError(err); });
                    break;
                }

                case '收款码': {
                    service.createOrder(ids, isML, mlType, mlScale, 2).then(res => {
                        if (!res.posType) {
                            UDToast.showError(res);
                            return;
                        }
                        let posType = res.posType;
                        switch (posType) {
                            //case "银盛":
                            //{
                            //     if (!this.state.isYse) {
                            //         // 只有是银盛pos机才能扫码和收款码
                            //         UDToast.showError('银盛不支持手机收款码，请使用POS机！');
                            //     } else { 
                            //         this.setState({
                            //             out_trade_no: res.out_trade_no,
                            //         });
                            //         NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                            //             ...res,
                            //             transType: 1054, //顾客扫pos机
                            //         });
                            //     }
                            //break;
                            //}

                            case "拉卡拉":
                                {
                                    //提供给拉卡拉POS机使用
                                    this.setState({
                                        out_trade_no: res.out_trade_no,
                                    });
                                    NativeModules.LHNToast.startActivityFromJS('com.statistics.LKLPayActivity', {
                                        ...res,
                                        "proc_cd": "710000", //拉卡拉消费
                                        "pay_tp": "1"
                                    });
                                    break;
                                }

                            case "拉卡拉聚合":
                                {
                                    //拉卡拉聚合收银台支付
                                    service.lklallqrcodePay(res.out_trade_no).then(code => {
                                        this.setState({
                                            visible: true,
                                            cancel: false,
                                            code,
                                            needPrint: true,
                                            printAgain: false
                                        }, () => {
                                            this.getOrderStatus(res.out_trade_no);
                                        });
                                    });
                                    break;
                                }

                            case "威富通":
                                {
                                    service.qrcodePay(res.out_trade_no, isDigital).then(code => {
                                        this.setState({
                                            visible: true,
                                            cancel: false,
                                            code,
                                            needPrint: true,
                                            printAgain: false
                                        }, () => {
                                            this.getOrderStatus(res.out_trade_no);
                                        });
                                    });
                                    break;
                                }

                            case "嘉联":
                                {
                                    service.jlqrcodePay(res.out_trade_no).then(code => {
                                        this.setState({
                                            visible: true,
                                            cancel: false,
                                            code,
                                            needPrint: false,
                                            printAgain: false
                                        }, () => {
                                            this.getOrderStatus(res.out_trade_no);
                                            //this.getJLOrderStatus(res.out_trade_no);
                                        });
                                    });

                                    break;
                                }

                            case "交通银行":
                                {
                                    service.bcmCodePay(res.out_trade_no, isDigital).then(code => {
                                        this.setState({
                                            visible: true,
                                            cancel: false,
                                            code,
                                            needPrint: true,
                                            printAgain: false
                                        }, () => {
                                            this.getOrderStatus(res.out_trade_no);
                                        });
                                    });
                                    break;
                                }

                            case "兴业银行":
                                {
                                    service.cibCodePay(res.out_trade_no, isDigital).then(code => {
                                        this.setState({
                                            visible: true,
                                            cancel: false,
                                            code,
                                            needPrint: true,
                                            printAgain: false
                                        }, () => {
                                            this.getOrderStatus(res.out_trade_no);
                                        });
                                    });
                                    break;
                                }

                            case "兴生活H5":
                                {
                                    service.cibH5CodePay(res.out_trade_no, isDigital).then(code => {
                                        this.setState({
                                            visible: true,
                                            cancel: false,
                                            code,
                                            needPrint: true,
                                            printAgain: false
                                        }, () => {
                                            this.getOrderStatus(res.out_trade_no);
                                        });
                                    });
                                    break;
                                }

                            case "南京银行":
                                {
                                    // this.setState({
                                    //     nanjingRes: res,
                                    // });
                                    // NativeModules.LHNToast.startActivityFromJS(
                                    //     'com.statistics.LKLPayActivity',
                                    //     {
                                    //         ...res,
                                    //         transName: '二维码主扫',
                                    //         scanCodeData: ''
                                    //     },
                                    // );
                                    //生成收款码接口 2024年4月17日
                                    service.njCodePay(res.out_trade_no, isDigital).then(code => {
                                        this.setState({
                                            visible: true,
                                            cancel: false,
                                            code,
                                            needPrint: true,
                                            printAgain: false
                                        }, () => {
                                            this.getOrderStatus(res.out_trade_no);
                                        });
                                    });
                                    break;
                                }

                            case "建设银行":
                                {
                                    service.ccbCodePay(res.out_trade_no).then(code => {
                                        this.setState({
                                            visible: true,
                                            cancel: false,
                                            code,
                                            needPrint: true,
                                            printAgain: false
                                        }, () => {
                                            this.getOrderStatus(res.out_trade_no);
                                        });
                                    });

                                    break;
                                }

                            default:
                                break;

                        }

                    }).catch(err => { UDToast.showError(err); });
                    break;
                }

                case '现金': {
                    Alert.alert(
                        '请确认',
                        '是否现金支付？',
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
                        { cancelable: false }
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
            UDToast.showError('请选择费用');
        } else {
            let ids = JSON.stringify((items.map(item => item.id)));
            const { room } = this.state;
            service.qrcodePayCIB(room.id, ids).then((code) => {
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
        service.cashPay(ids, isML, mlType, mlScale).then(res => {
            //if (this.state.isLKL || this.state.isYse) {
            //支持蓝牙打印
            service.cashPayPrint(ids).then(res => {
                if (res) {
                    NativeModules.LHNToast.printTicket({
                        ...res,
                        username: res.userName,
                    });
                }
            });
            //}
            this.onRefresh();//刷新数据
        });
    };

    //刷新数据
    onRefresh = () => {
        const { pageIndex, pageSize, type, room, isShow } = this.state;
        service.getBillList(type, room.id, isShow, pageIndex, pageSize).then(dataInfo => {
            //重置选择框状态值
            this.setState({
                dataInfo: dataInfo,
                isML: false,
                isDigital: false,
                mlType: '抹去角',
                mlScale: '四舍五入',
                price: 0.00,
                mlAmount: 0.00
            }, () => {
            });
        });
    };

    typeOnChange = (type, isShow) => {
        this.setState({
            type,
            isShow,
            dataInfo: { data: [] }
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
                    data
                }
                //price,
            });

            const items = data.filter(item => item.select === true);
            if (items.length != 0) {
                //let price = items.filter(item => item.select === true).reduce((a, b) => a + b.amount, 0).toFixed(2);
                //从后台计算抹零总金额 neo 2020年7月1日23:00:52
                let ids = JSON.stringify((items.map(item => item.id)));
                service.CalFee(isML, mlType, mlScale, ids).then(res => {
                    this.setState({ price: res.lastAmount, mlAmount: res.mlAmount });
                });
            } else {
                this.setState({ price: 0.00, mlAmount: 0.00 });
            }
        }
    };

    //全选
    checkAll = () => {
        const { isML, mlType, mlScale, type } = this.state;
        let data = this.state.dataInfo.data;
        data = data.map(it => {
            it.select = it.select !== true;
            return it;
        });
        this.setState({
            dataInfo: {
                ...this.state.dataInfo,
                data,
            }
        });
        const items = data.filter(item => item.select === true);
        if (items.length != 0) {
            let ids = JSON.stringify((items.map(item => item.id)));
            service.CalFee(isML, mlType, mlScale, ids).then(res => {
                this.setState({ price: res.lastAmount, mlAmount: res.mlAmount });
            });
        } else {
            this.setState({ price: 0.00, mlAmount: 0.00 });
        }
    }

    //抹零计算
    mlCal = (isML, mlType, mlScale) => {
        const items = this.state.dataInfo.data.filter(item => item.select === true);
        if (items.length != 0) {
            //let price = items.filter(item => item.select === true).reduce((a, b) => a + b.amount, 0).toFixed(2);//javascript浮点运算的一个bug
            //从后台计算抹零总金额 neo 2020年7月1日23:00:52
            let ids = JSON.stringify((items.map(item => item.id)));
            service.CalFee(isML, mlType, mlScale, ids).then(res => {
                this.setState({ price: res.lastAmount, mlAmount: res.mlAmount });
            });
        } else {
            this.setState({ price: 0.00, mlAmount: 0.00 });
        }
    };

    //刷新
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

    //通用订单状态查询
    getOrderStatus = (out_trade_no) => {
        clearTimeout(this.timeOut);
        service.orderStatus(out_trade_no).then(res => {
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

    //嘉联查询订单状态
    // getJLOrderStatus = (out_trade_no) => {
    //     clearTimeout(this.timeOut);
    //     service.orderStatus(out_trade_no).then(res => {
    //         if (res) {
    //             // if (this.state.needPrint) {
    //             //     this.func = this.printInfo;
    //             //     this.params = out_trade_no;
    //             //     this.printInfo(out_trade_no);
    //             // }
    //             this.onClose();
    //         } else {
    //             if (!this.state.cancel) {
    //                 this.timeOut = setTimeout(() => {
    //                     this.getOrderStatus(out_trade_no);
    //                 }, 1000);
    //             }
    //         }
    //     });
    // };

    printInfo = (out_trade_no) => {
        service.printInfo(out_trade_no).then(res => {
            NativeModules.LHNToast.printTicket({
                ...res,
                username: res.userName,
            });
        });
    };

    delete = (item) => {
        Modal.alert('请确认', '是否作废？',
            [
                { text: '取消', onPress: () => { }, style: 'cancel' },
                {
                    text: '确定', onPress: () => {
                        service.invalidBillForm(item.id).then(res => {
                            this.onRefresh();
                        });
                    }
                }
            ]
        )

    };

    renderItem = (item) => {
        // const { dataInfo, type, room, price, mlAmount } = this.state;
        const { type } = this.state;
        let titles = [];
        if (item.billSource === '临时加费') {
            if (item.reductionAmount == 0 && item.offsetAmount == 0) {
                titles = ['作废', '减免', '拆费'];
            } else {
                //有减免和冲抵，不允许作废
                titles = ['减免', '拆费'];
            }

        } else {
            titles = ['减免', '拆费'];
        }
        return (
            <TouchableWithoutFeedback
                key={item.id}
                onPress={() => this.changeItem(item)}>
                <Flex style={styles.check}>
                    {type == '未收' ?
                        <>
                            <Checkbox
                                checked={item.select === true}
                                onChange={event => {
                                    this.changeItem(item);
                                }}
                            />
                            <Flex align={'start'} direction={'column'} style={{ marginLeft: 3, flex: 1 }}>
                                <Flex justify={'between'}
                                    style={{ paddingLeft: 5, paddingTop: 3, paddingBottom: 3, width: '100%' }}>
                                    <Text style={{ fontSize: 15, width: '80%', color: 'green' }}>{item.allName}</Text>
                                    <ActionPopover
                                        textStyle={{ fontSize: 14 }}
                                        hiddenImage={true}
                                        onChange={(title) => {
                                            if (title === '作废') {
                                                this.delete(item);
                                            } else if (title === '减免') {
                                                this.setState({
                                                    selectItem: item,
                                                    jianfeiAlert: true,
                                                });
                                            } else {
                                                //需要验证权限
                                                service.checkBillFee(item.id).then(res => {
                                                    if (res == 0) {
                                                        //拆费 
                                                        this.setState({
                                                            selectItem: item,
                                                            chaifeiAlert: true,
                                                            chaifeiDate: new Date(item.beginDate)
                                                        });
                                                    } else {
                                                        if (res == 1) {
                                                            UDToast.showError('该费用已经生成了通知单，不允许拆费');
                                                        } else if (res == 2) {
                                                            UDToast.showError('该费用已经生成了减免单，不允许拆费');
                                                        } else if (res == 3) {
                                                            UDToast.showError('该费用已经生成了冲抵单，不允许拆费');
                                                        }
                                                        else {
                                                            UDToast.showError('该费用已经生成了优惠单，不允许拆费');
                                                        }
                                                    }

                                                });
                                            }
                                        }}
                                        titles={titles}
                                        visible={true} />
                                </Flex>
                                <Flex justify={'between'}
                                    style={{
                                        paddingLeft: 5,
                                        paddingBottom: 3,
                                        width: '100%'
                                    }}>
                                    {item.rmid ?
                                        <Flex>
                                            <Text style={{ fontSize: 15, color: '#666' }}>{item.feeName + ' '}</Text>
                                            <Text style={{
                                                color: 'red',
                                                fontSize: 8,
                                                paddingBottom: 16
                                            }}>惠</Text>
                                        </Flex> :
                                        <Flex>
                                            <Text style={{ fontSize: 15, color: '#666' }}>{item.feeName}</Text>
                                        </Flex>
                                    }
                                    <Flex>
                                        <Text style={{ fontFamily: "", paddingRight: 10, fontSize: 15, color: 'red' }}>{item.amount}</Text>
                                    </Flex>
                                </Flex>
                                {item.beginDate ?
                                    <Flex>
                                        <Text style={{
                                            paddingLeft: 5,
                                            paddingTop: 7,
                                            color: '#666'
                                        }}>{item.beginDate + '至' + item.endDate}</Text>
                                    </Flex> : null
                                }
                            </Flex>
                        </>
                        :
                        <>
                            <Flex align={'start'} direction={'column'} style={{ marginLeft: 3, flex: 1 }}>
                                <Flex justify={'between'}
                                    style={{ paddingLeft: 5, paddingTop: 10, paddingBottom: 8, width: '100%' }}>
                                    <Text style={{ fontSize: 15, width: '80%', color: 'green' }}>{item.allName}</Text>
                                </Flex>
                                <Flex justify={'between'}
                                    style={{
                                        paddingLeft: 5,
                                        paddingBottom: 5,
                                        width: '100%'
                                    }}>
                                    <Text style={{ fontSize: 15 }}>{item.billCode}</Text>
                                    {/* <Flex> */}
                                    <Text style={{ fontSize: 15, paddingRight: 8, color: 'red' }}>{item.amount}</Text>
                                    {/* </Flex> */}
                                </Flex>
                                <Text style={{
                                    paddingLeft: 4,
                                    color: '#666'
                                }}>{item.billDate + '，收款人：' + item.createUserName}
                                </Text>
                            </Flex>
                        </>
                    }
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    render() {
        const { isDigital, isML, dataInfo, type, room, price, mlAmount } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollView>
                    <Text style={{ paddingLeft: 10, paddingTop: 10, fontSize: 16, color: '#2c2c2c' }}>{room.allName} {room.tenantName}</Text>
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
                                onChange={event => {
                                    this.checkAll();
                                }}
                            ><Text style={{ fontSize: 15, paddingTop: 3, paddingLeft: 3, paddingRight: 3, color: '#666' }}>全选</Text></Checkbox>
                            <Checkbox
                                defaultChecked={false}
                                checked={isDigital}
                                onChange={(e) => {
                                    this.setState({ isDigital: e.target.checked });
                                }}
                            ><Text style={{ fontSize: 15, paddingTop: 3, paddingLeft: 3, paddingRight: 3, color: '#666' }}>数字货币</Text></Checkbox>
                            <Checkbox
                                defaultChecked={false}
                                checked={isML}
                                onChange={(e) => {
                                    this.setState({ isML: e.target.checked });
                                    //算抹零金额
                                    this.mlCal(e.target.checked, this.state.mlType, this.state.mlScale);
                                }}><Text style={{ fontSize: 15, paddingTop: 3, paddingLeft: 3, paddingRight: 3, color: '#666' }}>抹零</Text></Checkbox>
                            <MyPopover
                                style={{ paddingRight: 3 }}
                                textStyle={{ paddingLeft: 3, fontSize: 15 }}
                                onChange={(title) => {
                                    this.setState({ mlType: title });
                                    this.mlCal(this.state.isML, title, this.state.mlScale);
                                }}
                                titles={['抹去角', '抹去分']}
                                visible={true} />
                            <MyPopover
                                textStyle={{ paddingLeft: 3, fontSize: 15 }}
                                onChange={(title) => {
                                    this.setState({ mlScale: title });
                                    this.mlCal(this.state.isML, this.state.mlType, title, title);
                                }}
                                titles={['四舍五入', '直接舍去', '有数进一']}
                                visible={true} />
                        </Flex>

                        <Flex align={'center'}>
                            <Text style={{
                                fontSize: 15, color: '#666'
                            }}>抹零：</Text>
                            <Text style={{
                                fontSize: 15,
                                color: 'red'
                            }}>¥{mlAmount}</Text>
                            <Text style={{ paddingLeft: 5, fontSize: 15, color: '#666' }}>合计：</Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: 'red'
                                }}>¥{price}</Text>
                        </Flex>
                        <Flex style={{ minHeight: 40 }}>
                            <TouchableWithoutFeedback
                                disabled={price == 0 ? true : false}
                                onPress={() => this.click('扫码')}>
                                <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_blue }]}>
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
                            {/* 
                                 //手机都不能刷卡
                                <TouchableWithoutFeedback
                                    disabled={price == 0 ? true : false}
                                    onPress={() => this.click('刷卡')}>
                                    <Flex justify={'center'} style={styles.ii}>
                                        <Text style={styles.word}>刷卡</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>   */}

                        </Flex>
                    </Flex>
                )}

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
    check: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'solid',
        paddingLeft: 10,
        paddingRight: 5,//10,
        //paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10
    },
    ii: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 3) / 4.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginTop: 10
    },
    word: {
        color: 'white',
        fontSize: 16
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
