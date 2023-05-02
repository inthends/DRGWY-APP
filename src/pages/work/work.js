import React, { Fragment } from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from 'react-native';
import BasePage from '../base/base';
import { Flex  } from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import WorkService from './work-service';
import Macro from '../../utils/macro';
import CommonView from '../../components/CommonView';
import JPush from 'jpush-react-native';


export default class WorkPage extends BasePage {
    static navigationOptions = options => {
        const { navigation } = options;
        const params = navigation.state.params;
        return {
            title: '工作台',
            headerTitleStyle: {
                flex: 1,
                textAlign: 'center',
            },
            headerForceInset:this.headerForceInset,
            headerLeft: (
                <Fragment>
                    <TouchableWithoutFeedback onPress={() => navigation.push('scanonly')}>
                        <Flex direction='column' style={{ marginLeft: 20 }}>
                            <LoadImage defaultImg={require('../../static/images/scan2.png')}
                                style={{ width: 27, height: 20 }} />
                            <Text style={styles.button}>扫一扫</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.push('AddWork')}>
                        <Flex direction='column' style={{ marginLeft: 20 }}>
                            <LoadImage defaultImg={require('../../static/images/paiyipai.png')}
                                style={{ width: 22, height: 20 }} />
                            <Text style={styles.button}>拍一拍</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                </Fragment>
            ),
            headerRight: (
                <Fragment>
                    <TouchableWithoutFeedback onPress={() => navigation.push('newsList')}>
                        <Flex direction='column' style={{ marginRight: 20 }}>
                            <Text style={styles.buttonInfo}>{params ? params.news : 0}</Text>
                            <Text style={styles.button}>消息</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <Flex direction='column' style={{ marginRight: 20 }}>
                            <LoadImage defaultImg={require('../../static/images/qiandao.png')}
                                style={{ width: 19, height: 20 }} />
                            <Text style={styles.button}>签到</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                </Fragment> 
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            showLoading: true,
            count: 0,
            refreshing: false,
            data: {},
            news: '0',
        };
    }

    componentDidMount(): void {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                WorkService.workData(this.state.showLoading).then(data => {
                    // console.log(123, data);
                    this.setState({
                        data,
                        showLoading: false,
                    });
                });
                WorkService.unreadCount().then(news => {
                    this.props.navigation.setParams({ news });
                    JPush.setBadge({
                        badge: news,
                        appBadge: news,
                    });
                });
            },
        );
    }


    componentWillUnmount(): void {
        this.viewDidAppear.remove();
    }

    getData = () => {
        this.setState({ refreshing: true }, () => {
            setTimeout(() => {
                this.setState({ refreshing: false });
            }, 2000);
        });
    };


    render() {
        const { data } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#efefef' }}>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.getData()}
                    />
                }>
                    <Flex direction={'column'} style={{ padding: 15, paddingTop: 30 }}>
                        <Flex direction='column' align={'start'}
                            style={[styles.card, { borderLeftColor: Macro.work_blue, borderLeftWidth: 5 }]}>
                            <Text style={styles.title}>服务单</Text>
                            <Flex style={styles.line} />
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': 'fuwu',
                                        title: '服务单待回复列表',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.pendingreply}</Text>
                                        <Text style={styles.bottom}>待回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback> 


                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': 'fuwu',
                                        overdue: -1,//已经回复不判断是否逾期
                                        hiddenHeader: true,
                                        title: '服务单已回复列表',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.reply}</Text>
                                        <Text style={styles.bottom}>已回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>


                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': 'visit', 
                                        hiddenHeader: true,
                                        title: '服务单待回访列表',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.tobevisit}</Text>
                                        <Text style={styles.bottom}>待回访</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                          
                                <Flex direction='column' style={{ width: '25%' }}>
                                    <Text style={styles.top} />
                                    <Text style={styles.bottom} />
                                </Flex>

                            </Flex>
                        </Flex>
                        <Flex direction='column' align={'start'}
                            style={[styles.card, {
                                borderLeftColor: Macro.work_green,
                                borderLeftWidth: 5,
                                borderStyle: 'solid',
                            }]}>
                            <Text style={styles.title}>工单任务</Text>
                            <Flex style={styles.line} />
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': '1',
                                        title: '待派单列表',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.todo}</Text>
                                        <Text style={styles.bottom}>待派单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': '2',
                                        title: '待接单列表',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.going}</Text>
                                        <Text style={styles.bottom}>待接单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': '3',
                                        title: '待完成列表',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.unfinish}</Text>
                                        <Text style={styles.bottom}>待完成</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': '6',
                                        hiddenHeader: true,
                                        title: '待检验列表',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.nottest}</Text>
                                        <Text style={styles.bottom}>待检验</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </Flex>
                        <Flex direction='column' align={'start'}
                            style={[styles.card, { borderLeftColor: Macro.work_orange, borderLeftWidth: 5 }]}>
                            <Text style={styles.title}>工单逾期</Text>
                            <Flex style={styles.line} />
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': '1',
                                        overdue: 1,
                                        hiddenHeader: true,
                                        title: '派单逾期列表',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '33.3%' }}>
                                        <Text style={styles.top}>{data.overduedispatch}</Text>
                                        <Text style={styles.bottom}>派单逾期</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': '2',
                                        overdue: 1,
                                        hiddenHeader: true,
                                        title: '接单逾期列表',
                                    },
                                })}>

                                    <Flex direction='column' style={{ width: '33.3%' }}>
                                        <Text style={styles.top}>{data.overdueorder}</Text>
                                        <Text style={styles.bottom}>接单逾期</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': '3',
                                        overdue: 1,
                                        hiddenHeader: true,
                                        title: '接单列表',
                                    },
                                })}>

                                    <Flex direction='column' style={{ width: '33.3%' }}>
                                        <Text style={styles.top}>{data.overduefinish}</Text>
                                        <Text style={styles.bottom}>完成逾期</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </Flex>

                        <Flex direction='column' align={'start'}
                            style={[styles.card, {
                                borderLeftColor: Macro.work_green,
                                borderLeftWidth: 5,
                                borderStyle: 'solid',
                            }]}>
                            <Text style={styles.title}>订单中心</Text>
                            <Flex style={styles.line} />
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('orderlist', {
                                    'data': {
                                        'type': '0',
                                        title: '待查阅',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.orderUnRead}</Text>
                                        <Text style={styles.bottom}>待查阅</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('orderlist', {
                                    'data': {
                                        'type': '1',
                                        title: '待回复',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.orderUnReply}</Text>
                                        <Text style={styles.bottom}>待回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('orderlist', {
                                    'data': {
                                        'type': '2',
                                        title: '已回复',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.orderReply}</Text>
                                        <Text style={styles.bottom}>已回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('orderlist', {
                                    'data': {
                                        'type': '-1',
                                        hiddenHeader: true,
                                        title: '已关闭',
                                    },
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.orderClose}</Text>
                                        <Text style={styles.bottom}>已关闭</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </Flex>
                    </Flex>
                </ScrollView>
            </CommonView>
        );
    }
}
const styles = StyleSheet.create({
    title: {
        paddingTop: 14.67,
        textAlign: 'left',
        color: '#3E3E3E',
        fontSize: 17.6,
        paddingBottom: 12.67,
        marginLeft: 20,
        marginRight: 20
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30,
        backgroundColor: '#E0E0E0',
        height: 1,
    },
    top: {
        paddingTop: 20,
        color: '#74BAF1',
        fontSize: 14.67,
        paddingBottom: 3,
    },
    bottom: {
        color: '#999999',
        fontSize: 14.67,
        paddingBottom: 20,
    },
    button: {
        color: '#2C2C2C',
        fontSize: 8,
        paddingTop: 4,

    },
    buttonInfo: {
        color: Macro.color_FA3951,
        fontSize: 16,
        // paddingTop: 4,

    },
    card: {
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: { h: 10, w: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.8,
    },
    blue: {
        borderLeftColor: Macro.color_4d8fcc,
        borderLeftWidth: 8,
        borderStyle: 'solid',
    },
    orange: {
        borderLeftColor: Macro.color_f39d39,
        borderLeftWidth: 8,
        borderStyle: 'solid', 
    },
});
