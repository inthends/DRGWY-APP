import React from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput,
    View
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon, List, DatePicker, Button } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
import common from '../../../utils/common';
import service from '../statistics-service';
import UDToast from '../../../utils/UDToast';
import CommonView from '../../../components/CommonView';
import MyPopover from '../../../components/my-popover';
import Macro from '../../../utils/macro';
const Item = List.Item;

class FeeAddPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '加费',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
            type: null,
            isShow: true
        };
    };

    constructor(props) {
        super(props);
        //let room = common.getValueFromProps(this.props) || {id:'FY-XHF-01-0101'};
        let data = common.getValueFromProps(this.props);
        this.state = {
            data,
            pageIndex: 1,
             pageSize: 10,
            dataInfo: {
                data: [],
            },
            type: null,
            isShow: true,
            tbout_trade_no: null,
            visible: false,
            code: '',
            price: '0.00',
            needPrint: false,
            printAgain: false,
            xishu: null,
            res: [],
            titles: [],
            items: [],
            big: null,
            small: null,
            fee: null
        };
        Date.prototype.yearMonthDay = function () {
            let year = this.getFullYear();
            let month = this.getMonth() + 1 + '';
            if (month.length === 1) {
                month = '0' + month;
            }
            let day = this.getDate() + '';
            if (day.length === 1) {
                day = '0' + day;
            }
            return year + '-' + month + '-' + day + ' 00:00:00';
        };
    }

    typeChange = (tit, index) => {
        const items = this.state.res[index].children;
        let big;
        if (items.length === 0) {
            big = this.state.res[index];
        }
        this.setState({
            items,
            big,
            small: null,
            fee: null
        });
    };

    save = () => {

        let { fee, data } = this.state;
        if (!fee.amount) {
            UDToast.showError('请输入金额');
            return;
        }

        fee = {
            ...fee,
            beginDate: fee.beginDate == null ? null : fee.beginDate.yearMonthDay(),
            endDate: fee.endDate == null ? null : fee.endDate.yearMonthDay()
        };
        service.saveFee(data.billSource, data.linkId, [fee]).then(res => {
            UDToast.showInfo('保存成功');
            setTimeout(() => {
                this.props.navigation.goBack();
            }, 1000);
        });
    };

    componentDidMount() {
        service.getFeeItemTreeJson(this.state.data.id).then(resp => {
            const res = resp.filter(item => item.children.length > 0);
            if (res.length === 0) {
                UDToast.showError('暂无可加费项目');
                return;
            }
            const items = res[0].children;
            let big;
            if (items.length === 0) {
                big = res[0];
            }
            this.setState({
                titles: [...res.map(item => item.title)],
                res,
                items: res[0].children,
                big,
                show: true
            }, () => { });
        });
    }

    xishuAction = (number) => {
        const { quantity, price } = this.state.fee;
        const amount = (parseFloat(number) * parseFloat(quantity) * parseFloat(price)).toFixed(2) + '';
        this.setState({
            fee: {
                ...this.state.fee,
                number,
                amount: isNaN(amount) ? null : amount,
            }
        });
    };

    click = (item) => {
        service.getFeeItemDetail(this.state.data.id, item.key).then(res => {
            this.setState({
                small: item,
                fee: {
                    ...res,
                    beginDate: (res.beginDate == null ? null : new Date(res.beginDate.split(' ')[0])),
                    endDate: (res.endDate == null ? null : new Date(res.endDate.split(' ')[0])),
                    number: res.number + '',
                    amount: res.amount == 0 ? null : res.amount + ''
                }
            }, () => {
            });
        }).catch(error => {
            this.setState({
                small: null,
                fee: null
            });
        });
    };

    render() {
        const { titles, items, big, small, fee } = this.state;
        const title = small ? small.title : (big ? big.title : null);
        if (!this.state.show) {
            return <View />;
        }
        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollView>
                    <MyPopover
                        //hiddenImage={true}
                        style={{
                            width: '100%',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            borderColor: '#1890ff'
                        }}
                        textStyle={{ fontSize: 16 }} onChange={this.typeChange}
                        titles={titles} visible={true} />
                    <Flex direction={'column'} align={'start'} style={styles.cell}>
                        <Flex wrap={'wrap'} justify={'start'} style={styles.cellContnent}>
                            {items.map((item, index) => (
                                <TouchableWithoutFeedback key={item.title} onPress={() => this.click(item)}>
                                    <Flex style={index % 2 === 0 ? styles.left : styles.right}>
                                        <Flex style={{ flex: 1 }} justify={'center'} align={'center'}>
                                            <Text style={styles.content}>{item.title}</Text>
                                        </Flex>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            ))}
                        </Flex>
                    </Flex>
                    {fee && (
                        <List style={{ flex: 1, marginTop: 10, width: '100%' }}>
                            <Item>
                                <Text style={styles.titleWord}>{title}</Text>
                            </Item>
                            <Item extra={fee.quantity}>
                                <Text style={styles.word}>数量：</Text>
                            </Item>
                            <Item extra={fee.price}>
                                <Text style={styles.word}>单价：</Text>
                            </Item>
                            <Item extra={<TextInput keyboardType="number-pad" onChangeText={this.xishuAction}
                                value={fee.number} placeholder={'请输入系数'} style={styles.input} />}>
                                <Text style={styles.word}>系数：</Text>
                            </Item>
                            <Item extra={<TextInput onChangeText={amount => this.setState({
                                fee: {
                                    ...this.state.fee,
                                    amount
                                }
                            })} value={fee.amount}
                                placeholder={'请输入金额'} style={styles.input} />}>
                                <Text style={styles.word}>金额：</Text>
                            </Item>
                            <DatePicker
                                extra={<Text style={styles.aa}>请选择开始时间</Text>}
                                mode={'date'}
                                title="选择开始时间"
                                value={this.state.fee.beginDate}
                                onChange={beginDate => this.setState({
                                    fee: {
                                        ...this.state.fee,
                                        beginDate,
                                    },
                                })}
                                // format={date}
                                style={{ backgroundColor: 'white', width: 200, borderWidth: 0 }}  >
                                <Item arrow={'empty'} style={{ borderWidth: 0 }}><Text style={styles.word}>开始时间：</Text></Item>
                            </DatePicker>
                            <DatePicker
                                extra={<Text style={styles.aa}>请选择结束时间</Text>}
                                mode={'date'}
                                title="选择结束时间"
                                value={this.state.fee.endDate}
                                onChange={endDate => this.setState({
                                    fee: {
                                        ...this.state.fee,
                                        endDate,
                                    },
                                })}
                            >
                                <Item arrow={'empty'} style={{ borderWidth: 0 }}><Text style={styles.word}>结束时间：</Text></Item>
                            </DatePicker>
                            <Item extra={<TextInput placeholder={'请输入备注'} onChangeText={memo => this.setState({
                                fee: {
                                    ...this.state.fee,
                                    memo,
                                },
                            })} value={fee.memo} style={styles.input} />}>
                                <Text style={styles.word}>备注：</Text>
                            </Item>
                        </List>
                    )}
                </ScrollView>
                {fee &&
                    <Flex justify={'center'}>
                        <Button type={'primary'}
                            style={{
                                //margin: 20,
                                width: 180,
                                height: 40,
                                marginBottom: 10,
                                backgroundColor: Macro.work_blue
                            }}
                            onPress={this.save}>保存</Button>
                    </Flex>}
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    cell: {
        marginTop: 8
    },
    title: {
        color: '#000000',
        fontSize: 16,
        paddingLeft: 6
    },
    cellContnent: {
        marginLeft: 30,
        marginRight: 30
    },
    content: {
        color: '#404145',
        fontSize: 16,
        paddingTop: 6,
        paddingBottom: 6
    },
    left: {
        width: (ScreenUtil.deviceWidth() - 100) / 2,
        textAlign: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#74BAF1'
    },
    right: {
        width: (ScreenUtil.deviceWidth() - 100) / 2,
        marginLeft: 40,
        textAlign: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#74BAF1'
    },

    titleWord: {
        color: '#404145',
        fontSize: 16
    },
    word: {
        color: '#404145',
        fontSize: 16
    },
    aa: {
        color: '#aaa',
        fontSize: 14
    },
    input: {
        minWidth: 200,
        textAlign: 'right',
        color: '#999',
        fontSize: 16,
        borderWidth: 0,
    }
});

const mapStateToProps = ({ memberReducer }) => {
    return { userInfo: memberReducer.userInfo };
};

export default connect(mapStateToProps)(FeeAddPage);
