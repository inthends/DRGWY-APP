import React, { Fragment } from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Platform
} from 'react-native';
import BasePage from '../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import WorkService from './work-service';
import Macro from '../../utils/macro';
import CommonView from '../../components/CommonView';
import JPush from 'jpush-react-native';
import { connect } from 'react-redux';
import { saveSelectBuilding, saveSelectDrawerType } from '../../utils/store/actions/actions';
import { DrawerType } from '../../utils/store/action-types/action-types';

// export default class WorkPage extends BasePage {

class WorkPage extends BasePage {

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
                    <TouchableWithoutFeedback onPress={() => navigation.push('addWork')}>
                        <Flex direction='column' style={{ marginLeft: 20 }}>
                            <LoadImage defaultImg={require('../../static/images/paiyipai.png')}
                                style={{ width: 22, height: 18 }} />
                            <Text style={styles.button}>拍一拍</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                    {/* <TouchableWithoutFeedback onPress={() => {
                        // navigation.push('scanonly', {
                        //     data: {
                        //         callBack: (id) => {
                        //             navigation.navigate('visit', { data: id });
                        //         }
                        //     }
                        // });
                        //navigation.push('visit');
                    } 
                    }>
                        <Flex direction='column' style={{ marginLeft: 20 }}>
                            <LoadImage defaultImg={require('../../static/images/scan2.png')}
                                style={{ width: 20, height: 19 }} />
                            <Text style={styles.button}>扫一扫</Text>
                        </Flex>
                    </TouchableWithoutFeedback> */}

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
            refreshing: false,
            data: {},
            news: '0',
            isGrab: false,//是否启用抢单
            authList: []//模块权限
        };
    }

    componentDidMount() {
        //获取模块权限 
        WorkService.getModuleList().then(authList => {
            this.setState({ authList });
        });

        //获取系统参数
        WorkService.getSetting('isGrab').then((res) => {
            this.setState({ isGrab: res });
        });

        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {

                this.props.saveBuilding({});//加载页面清除别的页面选中的数据
                this.props.saveSelectDrawerType(DrawerType.building);

                //刷新
                WorkService.workData(this.state.showLoading).then(data => {
                    this.setState({
                        data,
                        showLoading: false
                    });
                });

                WorkService.unreadCount().then(news => {
                    this.props.navigation.setParams({ news });
                    if (Platform.OS === "ios") {
                        //设置苹果角标
                        JPush.setBadge({
                            badge: news,
                            appBadge: news
                        });
                    }
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
        const { data, authList, isGrab } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#efefef' }}>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.getData()}
                    />
                }>
                    <Flex direction={'column'} style={{ padding: 10, paddingTop: 10 }}>
                        <Flex direction='column' align={'start'}
                            style={[styles.card, { borderLeftColor: Macro.work_red, borderLeftWidth: 5 }]}>
                            <Text style={styles.title}>常用功能</Text>
                            <Flex style={styles.line} />
                            <Flex>
                                <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.navigate('feeHouse')}
                                >
                                    <Flex direction='column' style={{ width: '33%' }}>
                                        <Flex style={{ paddingTop: 15, paddingBottom: 5 }}>
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
                                    <Flex direction='column' style={{ width: '33%' }}>
                                        <Flex style={{ paddingTop: 15, paddingBottom: 5 }}>
                                            <LoadImage
                                                style={{ width: 22, height: 22 }}
                                                defaultImg={require('../../static/images/navigator/zonghexunjian.png')}
                                            />
                                        </Flex>
                                        <Text style={styles.bottom}>综合巡检</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                {authList.some(item => item == 'Inspect') ?
                                    <TouchableWithoutFeedback
                                        onPress={() => this.props.navigation.push('check')}
                                    >
                                        <Flex direction='column' style={{ width: '33%' }}>
                                            <Flex style={{ paddingTop: 15, paddingBottom: 5 }}>
                                                <Icon
                                                    name="flag"
                                                    size={22}
                                                    color={Macro.color_sky}
                                                />
                                            </Flex>
                                            <Text style={styles.bottom}>现场检查</Text>
                                        </Flex>
                                    </TouchableWithoutFeedback> : null}
                            </Flex>
                            <Flex>
                                {/* <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.push('chaobiao')}>
                                    <Flex direction='column' style={{ width: '33%' }}>
                                        <Flex style={{ paddingTop: 10, paddingBottom: 5 }}>
                                            <Icon
                                                name="form"
                                                size={22}
                                                color={Macro.work_orange}
                                            />
                                        </Flex>
                                        <Text style={styles.bottom}>移动抄表</Text>
                                    </Flex>
                                </TouchableWithoutFeedback> */}

                                <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.push('visit')}>
                                    <Flex direction='column' style={{ width: '33%' }}>
                                        <Flex style={{ paddingTop: 10, paddingBottom: 5 }}>
                                            <Icon
                                                name="form"
                                                size={22}
                                                color={Macro.work_orange}
                                            />
                                        </Flex>
                                        <Text style={styles.bottom}>访客登记</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.push('shebeiList')}>
                                    <Flex direction='column' style={{ width: '33%' }}>
                                        <Flex style={{ paddingTop: 10, paddingBottom: 5 }}>
                                            <Icon
                                                name="desktop"
                                                size={22}
                                                color={Macro.work_blue}
                                            />
                                        </Flex>
                                        <Text style={styles.bottom}>设备资料</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.push('assets')}>
                                    <Flex direction='column' style={{ width: '33%' }}>
                                        <Flex style={{ paddingTop: 10, paddingBottom: 5 }}>
                                            <Icon
                                                name="laptop"
                                                size={22}
                                                color={Macro.work_green}
                                            />
                                        </Flex>
                                        <Text style={styles.bottom}>固定资产</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </Flex>

                        <Flex direction='column' align={'start'}
                            style={[styles.card, {
                                borderLeftColor: Macro.work_green,
                                borderLeftWidth: 5,
                                borderStyle: 'solid'
                            }]}>
                            <Flex>
                                <Text style={styles.title}>服务单</Text>
                            </Flex>
                            <Flex style={styles.line} />
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.pendingreply == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('servicedesk', {
                                        'data': {
                                            type: 0,
                                            hiddenHeader: false,
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
                                    this.props.navigation.push('servicedeskDone', {
                                        'data': {
                                            type: 0,
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
                                    if (data.servicetodo == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('servicedeskunfinish', {
                                        'data': {
                                            title: '待处理列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.servicetodo}</Text>
                                        <Text style={styles.bottom}>待处理</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.servicedo == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('servicedeskDone', {
                                        'data': {
                                            type: 1,
                                            hiddenHeader: true,
                                            title: '已处理列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.servicedo}</Text>
                                        <Text style={styles.bottom}>已处理</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>

                            <Flex>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.tobevisit == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('servicedesk', {
                                        'data': {
                                            type: 3,
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
                                    if (data.tobevisitdo == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('servicedeskDone', {
                                        'data': {
                                            type: 5,
                                            title: '已回访列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.tobevisitdo}</Text>
                                        <Text style={styles.bottom}>已回访</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.testdo == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('servicedeskDone', {
                                        'data': {
                                            type: 6,
                                            title: '已检验列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.testdo}</Text>
                                        <Text style={styles.bottom}>已检验</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.servicefile == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('servicedeskDone', {
                                        'data': {
                                            type: 7,
                                            title: '已闭单列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.servicefile}</Text>
                                        <Text style={styles.bottom}>已闭单</Text>
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
                                <Text style={styles.title}>工单</Text>
                                {isGrab == true ?
                                    <TouchableWithoutFeedback onPress={() =>
                                        this.props.navigation.push('taskqd')
                                    }>
                                        <Text style={{ fontSize: 16, color: Macro.work_red, textAlign: 'right' }}>待抢工单({data.unqd})</Text>
                                    </TouchableWithoutFeedback> : null}
                            </Flex>
                            <Flex style={styles.line} />

                            <Flex>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.todo == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('taskunsend', {
                                        'data': {
                                            type: '1',
                                            title: '待派单列表'
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
                                    this.props.navigation.push('taskdone', {
                                        'data': {
                                            type: '2',
                                            title: '已派单列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.mydo}</Text>
                                        <Text style={styles.bottom}>已派单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.myrefuse == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('taskdone', {
                                        'data': {
                                            type: '9',
                                            title: '已驳回列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.myrefuse}</Text>
                                        <Text style={styles.bottom}>已驳回</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.going == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('task', {
                                        'data': {
                                            type: '2',
                                            title: '待接单列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.going}</Text>
                                        <Text style={styles.bottom}>待接单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>

                            <Flex>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.receivedone == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('taskdone', {
                                        'data': {
                                            type: '3',
                                            title: '已接单列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.receivedone}</Text>
                                        <Text style={styles.bottom}>已接单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.assist == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('task', {
                                        'data': {
                                            type: 'assist',
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
                                    this.props.navigation.push('taskunfinish', {
                                        'data': {
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
                                    if (data.stop == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('task', {
                                        'data': {
                                            type: '0',
                                            hiddenHeader: true,
                                            title: '已暂停列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.stop}</Text>
                                        <Text style={styles.bottom}>已暂停</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>

                            <Flex>
                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.finish == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('taskfinish', {
                                        'data': {
                                            title: '已完成列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.finish}</Text>
                                        <Text style={styles.bottom}>已完成</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.nottest == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('task', {
                                        'data': {
                                            type: '6',
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

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.unapprove == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('task', {
                                        'data': {
                                            type: '7',
                                            hiddenHeader: true,
                                            title: '待审核列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.unapprove}</Text>
                                        <Text style={styles.bottom}>待审核</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => {
                                    if (data.approve == 0) {
                                        return;
                                    }
                                    this.props.navigation.push('taskdone', {
                                        'data': {
                                            type: '8',
                                            hiddenHeader: true,
                                            title: '已审核列表'
                                        }
                                    })
                                }}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.approve}</Text>
                                        <Text style={styles.bottom}>已审核</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </Flex>

                        {/* <Flex direction='column' align={'start'}
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
                                        data: {
                                            type: '0',
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
                                    data: {
                                        type: '1',
                                        title: '待回复'
                                    }
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.orderUnReply}</Text>
                                        <Text style={styles.bottom}>待回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('orderlist', {
                                    data: {
                                        type: '2',
                                        title: '已回复'
                                    }
                                })}>
                                    <Flex direction='column' style={{ width: '25%' }}>
                                        <Text style={styles.top}>{data.orderReply}</Text>
                                        <Text style={styles.bottom}>已回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('orderlist', {
                                    data: {
                                        type: '-1',
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
                        </Flex> */}

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
        paddingTop: 10,
        color: Macro.work_blue,
        fontSize: 16,
        paddingBottom: 3
    },
    bottom: {
        color: '#404145',//'#333'
        fontSize: 16,
        paddingBottom: 10
    },
    qd: {
        color: Macro.work_red,
        fontSize: 16,
        paddingBottom: 20
    },
    topqd: {
        paddingTop: 20,
        color: Macro.work_red,
        fontSize: 16,
        paddingBottom: 3
    },
    button: {
        color: '#2C2C2C',
        fontSize: 16,
        paddingTop: 4
    },
    buttonInfo: {
        color: 'red',
        fontSize: 16
    },
    card: {
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: { h: 10, w: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.8
    }
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding || {}
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveBuilding: (item) => {
            dispatch(saveSelectBuilding(item));
        },
        saveSelectDrawerType: (item) => {
            dispatch(saveSelectDrawerType(item));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkPage);