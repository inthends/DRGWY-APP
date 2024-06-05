import React from 'react';
import {
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../base/base';
import { Button, Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
import ListQDHeader from '../../../components/list-qd-header';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import WorkService from '../work-service';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import MyPopover from '../../../components/my-popover';
import UDToast from '../../../utils/UDToast';

class TaskQDListPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: navigation.getParam('data') ? navigation.getParam('data').title : '',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
            // headerRight: (
            //     <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
            //         <Icon name='bars' style={{ marginRight: 15 }} color="black" />
            //     </TouchableWithoutFeedback>
            // ),
        };
    };

    constructor(props) {
        super(props);
        this.selectBuilding = {
            key: null
        };
        // let pageParames = common.getValueFromProps(this.props); 
        // const type = common.getValueFromProps(this.props).type;
        // const overdue = common.getValueFromProps(this.props).overdue;
        //const hiddenHeader = common.getValueFromProps(this.props).hiddenHeader; 
        this.state = {
            pageIndex: 1,
            dataInfo: {
                data: []
            },
            todo: 0,
            //hiddenHeader,
            refreshing: false,
            visible: false,
            emergencyLevel: '全部',
            time: '全部'
            //repairMajors: []//维修专业
        };
    }

    componentDidMount() {

        //获取维修专业
        // WorkService.getCommonItems('RepairMajor').then(res => {
        //     if (res.length > 0) {
        //         this.setState({
        //             repairMajors: ['全部', ...res.map(item => item.title)]
        //         });
        //     }
        // });

        //获取已经派单数量
        // const { repairMajor, time } = this.state;
        // WorkService.workDispatchCount(repairMajor, time).then(count => {
        //     this.setState({ count });
        // });

        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.onRefresh();
            }
        );
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({ selectBuilding: nextProps.selectBuilding }, () => {
                this.onRefresh();
            });
        }
    }

    getList = () => {
        const { emergencyLevel, todo, time, pageIndex } = this.state;
        WorkService.workQDList(todo, emergencyLevel, time, pageIndex).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data],
                };
            }
            this.setState({
                dataInfo: dataInfo,
                refreshing: false
            }, () => {
            });
        }).catch(err => this.setState({ refreshing: false }));
    };

    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1
        }, () => {
            this.getList();
        });
    };

    loadMore = () => {
        const { data, total, pageIndex } = this.state.dataInfo;
        if (this.canAction && data.length < total) {
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1
            }, () => {
                this.getList();
            });
        }
    };

    //抢单
    qd = (id) => {
        WorkService.qdRepair(id).then(res => {
            if (res.flag == true) {
                UDToast.showInfo('抢单成功');
            } else {
                UDToast.showInfo('抢单失败，' + res.msg);
            }

            this.onRefresh();
        });
    };

    _renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                switch (item.statusName) {
                    case '待派单': {
                        this.props.navigation.navigate('weixiuView', { data: item.id });
                        break;
                    }
                    case '待接单': {
                        this.props.navigation.navigate('jiedan', { data: item.id });
                        break;
                    }
                    case '待开工': {
                        this.props.navigation.navigate('kaigong', { data: item.id });
                        break;
                    }
                    case '待完成': {
                        this.props.navigation.navigate('wancheng', { data: item.id });
                        break;
                    }
                    case '待检验': {
                        this.props.navigation.navigate('jianyan', { data: item.id });
                        break;
                    }
                    case '待回访': {
                        this.props.navigation.navigate('huifang', { data: item.id });
                        break;
                    }
                    case '待协助': {
                        this.props.navigation.navigate('assist', { data: item.id });
                        break;
                    }
                    default:
                        break;
                }
            }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, index === 0 ? styles.blue : styles.orange]}>
                    <Flex justify='between' style={{ width: '100%' }}>
                        <Text style={styles.title}>{item.billCode}</Text>
                        <Text style={styles.aaa}>{item.statusName}</Text>
                    </Flex>
                    <Flex style={styles.line} />
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                            style={{ width: '100%', paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>{item.address} {item.contactName}</Text>
                            <TouchableWithoutFeedback
                                onPress={() => common.call(item.contactLink || item.contactPhone)}>
                                <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{ width: 15, height: 15 }} /></Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        
                        <Flex justify='between'
                            style={{ width: '100%', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>所属区域：{item.repairArea}，是否有偿：{item.isPaid}</Text>
                        </Flex>

                        <Flex justify='between'
                            style={{ width: '100%', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>紧急：{item.emergencyLevel}，重要：{item.importance}，专业：{item.repairMajor}</Text>
                        </Flex>
                       
                        <Text style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 20,
                            color: '#666'
                        }}>{item.repairContent || item.contents}</Text>
                        <Flex justify='between'
                            style={{ width: '100%', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>{item.billDate}</Text>
                            {item.statusName == '待派单' ?
                                <Button type='primary'
                                    onPress={() => this.qd(item.id)}
                                    activeStyle={{ backgroundColor: Macro.work_blue }}
                                    style={{
                                        width: 70,
                                        backgroundColor: Macro.work_blue,
                                        height: 30
                                    }}>抢单</Button> : null}
                        </Flex>

                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    typeChange = (repairMajor) => {
        this.setState({
            repairMajor,
            pageIndex: 1
        }, () => {
            this.onRefresh();
        });
    }

    timeChange = (time) => {
        this.setState({
            time,
            pageIndex: 1
        }, () => {
            this.onRefresh();
        });
    };

    render() {
        const { dataInfo, todo } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ListQDHeader todo={todo}
                    onChange={(todo) => this.setState({ todo }, () => {
                        this.onRefresh();
                    })} />

                <Flex justify={'between'} style={{ paddingLeft: 15, marginTop: 15, paddingRight: 15, height: 30 }}>
                    <MyPopover onChange={this.typeChange}
                        titles={['全部', '非常紧急', '紧急', '一般']}
                        visible={true} />
                    <MyPopover onChange={this.timeChange}
                        titles={['全部', '今日', '本周', '本月', '上月', '本年']}
                        visible={true} />
                </Flex>
                <FlatList
                    data={dataInfo.data}
                    // ListHeaderComponent={}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.id}
                    // refreshing={this.state.refreshing}
                    // onRefresh={() => this.onRefresh()}
                    onEndReached={() => this.loadMore()}
                    onEndReachedThreshold={0}
                    onScrollBeginDrag={() => this.canAction = true}
                    onScrollEndDrag={() => this.canAction = false}
                    onMomentumScrollBegin={() => this.canAction = true}
                    onMomentumScrollEnd={() => this.canAction = false}
                    ListEmptyComponent={<NoDataView />}
                />
            </CommonView>

        );
    }
}

const styles = StyleSheet.create({

    list: {
        backgroundColor: Macro.color_white,
        margin: 15
    },
    title: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20
    },

    line: {
        width: ScreenUtil.deviceWidth() - 30 - 15 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1
    },

    card: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#c8c8c8',
        borderBottomColor: '#c8c8c8',
        borderRightColor: '#c8c8c8',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: { h: 10, w: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.8
    },
    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5
    },
    orange: {
        borderLeftColor: '#F7A51E',
        borderLeftWidth: 5
    },
    aaa: {
        paddingRight: 20
    }
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(TaskQDListPage);
