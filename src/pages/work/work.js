import React, { Fragment } from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import BasePage from '../base/base';
import { Flex, Icon } from '@ant-design/react-native';
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
                textAlign: 'center'
            },
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <Fragment>
                    {/* <TouchableWithoutFeedback onPress={() => navigation.push('scanonly')}>
                        <Flex direction='column' style={{ marginLeft: 20 }}>
                            <LoadImage defaultImg={require('../../static/images/scan2.png')}
                                style={{ width: 20, height: 19 }} />
                            <Text style={styles.button}>扫一扫</Text>
                        </Flex>
                    </TouchableWithoutFeedback> */}
                    <TouchableWithoutFeedback onPress={() => navigation.push('AddWork')}>
                        <Flex direction='column' style={{ marginLeft: 20 }}>
                            <LoadImage defaultImg={require('../../static/images/paiyipai.png')}
                                style={{ width: 22, height: 17 }} />
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
                    {/* <TouchableWithoutFeedback>
                        <Flex direction='column' style={{ marginRight: 20 }}>
                            <LoadImage defaultImg={require('../../static/images/qiandao.png')}
                                style={{ width: 20, height: 19 }} />
                            <Text style={styles.button}>签到</Text>
                        </Flex>
                    </TouchableWithoutFeedback> */}
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
            news: '0'
        };
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                //刷新
                WorkService.workData(this.state.showLoading).then(data => {
                    this.setState({
                        data,
                        showLoading: false,
                    });
                });
                WorkService.unreadCount().then(news => {
                    this.props.navigation.setParams({ news });
                    JPush.setBadge({
                        badge: news,
                        appBadge: news
                    });
                });
            }
        );
    }


    componentWillUnmount() {
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
                    <Flex direction={'column'} style={{ padding: 15, paddingTop: 10 }}>
                        <Flex direction='column' align={'start'}
                            style={[styles.card, { borderLeftColor: Macro.work_red, borderLeftWidth: 5 }]}>
                            <Text style={styles.title}>常用功能</Text>
                            <Flex style={styles.line} />
                            <Flex>
                                <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.navigate('feeHouse')}
                                >
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Flex style={{ paddingTop: 20, paddingBottom: 5 }}>
                                            <LoadImage
                                                style={{ width: 19, height: 22 }}
                                                defaultImg={require('../../static/images/navigator/shangmen.png')}
                                            />
                                        </Flex>
                                        <Text style={styles.bottom}>上门收费</Text>
                                    </Flex>

                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.push('xunjian')}
                                >
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Flex style={{ paddingTop: 20, paddingBottom: 5 }}>
                                            <LoadImage
                                                style={{ width: 22, height: 22 }}
                                                defaultImg={require('../../static/images/navigator/zonghexunjian.png')}
                                            />
                                        </Flex>
                                        <Text style={styles.bottom}>综合巡检</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.push('check')}
                                >
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Flex style={{ paddingTop: 20, paddingBottom: 5 }}>
                                            <Icon
                                                name="flag"
                                                size={22}
                                                color={Macro.work_blue}
                                            />
                                        </Flex>
                                        <Text style={styles.bottom}>现场检查</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.push('chaobiao')}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Flex style={{ paddingTop: 20, paddingBottom: 5 }}>
                                            <Icon
                                                name="form"
                                                size={22}
                                                color={Macro.work_blue}
                                            />
                                        </Flex>
                                        <Text style={styles.bottom}>移动抄表</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </Flex>
                        <Flex direction='column' align={'start'}
                            style={[styles.card, {
                                borderLeftColor: Macro.work_blue,
                                borderLeftWidth: 5,
                                borderStyle: 'solid'
                            }]}>
                            <Flex>
                                <Text style={styles.title}>工单任务</Text>
                                <TouchableWithoutFeedback onPress={() =>
                                    this.props.navigation.push('Taskqd', {
                                        'data': {
                                            title: '工单列表'
                                        }
                                    })
                                }>
                                    <Text style={{ fontSize: 16, color: Macro.work_red, textAlign: 'right' }}>待抢工单({data.unqd})</Text>
                                </TouchableWithoutFeedback>
                            </Flex>
                            <Flex style={styles.line} />
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.pendingreply == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': 'fuwu',
                                            title: '待回复列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.pendingreply}</Text>
                                        <Text style={styles.bottom}>待回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.reply == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': 'fuwu',
                                            overdue: -1,//已经回复不判断是否逾期
                                            hiddenHeader: true,
                                            title: '已回复列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.reply}</Text>
                                        <Text style={styles.bottom}>已回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.todo == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': '1',
                                            title: '派单列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.todo}</Text>
                                        <Text style={styles.bottom}>待派单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.mydo == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('TaskDispatch', {
                                        'data': {
                                            title: '已派单列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.mydo}</Text>
                                        <Text style={styles.bottom}>已派单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.going == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': '2',
                                            title: '待接单列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.going}</Text>
                                        <Text style={styles.bottom}>待接单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.assist == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': 'assist',
                                            hiddenHeader: true,
                                            title: '待协助列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.assist}</Text>
                                        <Text style={styles.bottom}>待协助</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.unfinish == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': '3',
                                            title: '待完成列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.unfinish}</Text>
                                        <Text style={styles.bottom}>待完成</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.nottest == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': '6',
                                            hiddenHeader: true,
                                            title: '待检验列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.nottest}</Text>
                                        <Text style={styles.bottom}>待检验</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.tobevisit == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': 'visit',
                                            hiddenHeader: true,
                                            title: '待回访列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.tobevisit}</Text>
                                        <Text style={styles.bottom}>待回访</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.overduedispatch == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': '1',
                                            overdue: 1,
                                            hiddenHeader: true,
                                            title: '派单逾期列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.overduedispatch}</Text>
                                        <Text style={styles.bottom}>派单逾期</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.overdueorder == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': '2',
                                            overdue: 1,
                                            hiddenHeader: true,
                                            title: '接单逾期列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.overdueorder}</Text>
                                        <Text style={styles.bottom}>接单逾期</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.overduefinish == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('Task', {
                                        'data': {
                                            'type': '3',
                                            overdue: 1,
                                            hiddenHeader: true,
                                            title: '接单列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.overduefinish}</Text>
                                        <Text style={styles.bottom}>完成逾期</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </Flex>

                        {/* <Flex direction='column' align={'start'}
                            style={[styles.card, { borderLeftColor: Macro.work_orange, borderLeftWidth: 5 }]}>
                            <Text style={styles.title}>工单逾期</Text>
                            <Flex style={styles.line} />
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                                    'data': {
                                        'type': '1',
                                        overdue: 1,
                                        hiddenHeader: true,
                                        title: '派单逾期列表'
                                    }
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
                                        title: '接单逾期列表'
                                    }
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
                                        title: '接单列表'
                                    }
                                })}>
                                    <Flex direction='column' style={{ width: '33.3%' }}>
                                        <Text style={styles.top}>{data.overduefinish}</Text>
                                        <Text style={styles.bottom}>完成逾期</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </Flex> */}

                        <Flex direction='column' align={'start'}
                            style={[styles.card, {
                                borderLeftColor: Macro.work_green,
                                borderLeftWidth: 5,
                                borderStyle: 'solid'
                            }]}>
                            <Text style={styles.title}>订单中心</Text>
                            <Flex style={styles.line} />
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.orderUnRead == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('orderlist', {
                                        'data': {
                                            'type': '0',
                                            title: '待查阅'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.orderUnRead}</Text>
                                        <Text style={styles.bottom}>待查阅</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('orderlist', {
                                    'data': {
                                        'type': '1',
                                        title: '待回复'
                                    }
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.orderUnReply}</Text>
                                        <Text style={styles.bottom}>待回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('orderlist', {
                                    'data': {
                                        'type': '2',
                                        title: '已回复'
                                    }
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
                                        title: '已关闭'
                                    }
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

    left: {
        flex: 1,
        paddingTop: 30
    },

    title: {
        paddingTop: 14.67,
        textAlign: 'left',
        color: '#3E3E3E',
        fontSize: 16,
        paddingBottom: 12.67,
        marginLeft: 20,
        marginRight: 20
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30,
        backgroundColor: '#E0E0E0',
        height: 1
    },
    top: {
        paddingTop: 20,
        color: Macro.work_blue, //'#74BAF1',
        fontSize: 16,
        paddingBottom: 3
    },
    bottom: {
        color: '#404145',//'#333'
        fontSize: 16,
        paddingBottom: 20
    },
    button: {
        color: '#2C2C2C',
        fontSize: 16,
        paddingTop: 4
    },
    buttonInfo: {
        color: Macro.color_FA3951,
        fontSize: 16
    },
    card: {
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: { h: 10, w: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.8
    },
    blue: {
        borderLeftColor: Macro.color_4d8fcc,
        borderLeftWidth: 8,
        borderStyle: 'solid'
    },
    orange: {
        borderLeftColor: Macro.color_f39d39,
        borderLeftWidth: 8,
        borderStyle: 'solid'
    }
});

