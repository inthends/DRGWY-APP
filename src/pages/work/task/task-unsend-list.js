import React from 'react';
import {
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import WorkService from '../work-service';
import ListHeader from '../../../components/list-unsend-header';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import MyPopover from '../../../components/my-popover';
import UDToast from '../../../utils/UDToast';

//待派单列表
class TaskUnSendListPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: navigation.getParam('data') ? navigation.getParam('data').title : '',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);
        this.selectBuilding = {
            key: null
        };
        //const type = common.getValueFromProps(this.props).type;
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            data: [],
            refreshing: false,//刷新
            loading: false,//加载完成 
            hasMore: true,//更多 
            type: -1,//待派单类型
            time: '全部',
            selectPerson: null,
            selectedId: ''
        };
    }

    //必须，刷新数据
    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.loadData();
            }
        );
    }

    //必须
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

    loadData = (isRefreshing = false) => {
        if (this.state.loading || (!isRefreshing && !this.state.hasMore))  {
            this.setState({ loading: false, refreshing: false });
            return;
        }
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const { data,type, time, selectPerson, pageIndex, pageSize } = this.state;
        let senderId = selectPerson ? selectPerson.id : '';
        WorkService.workUnSendList(type, time, senderId, currentPage, pageSize).then(res => {
            if (isRefreshing) {
                this.setState({
                    data: res.data,
                    pageIndex: 2,
                    total: res.total
                });
            }
            else {
                 //合并并去重 使用 reduce
                const combinedUniqueArray = [...data, ...res.data].reduce((acc, current) => {
                    if (!acc.some(item => item.id === current.id)) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                this.setState({
                    data: combinedUniqueArray,
                    pageIndex: pageIndex,
                    hasMore: pageIndex * pageSize < res.total ? true : false,
                    total: res.total
                });
            }
        }).catch(err => UDToast.showError(err)
        ).finally(() => this.setState({ loading: false, refreshing: false }))
    };

    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1
        }, () => {
            this.loadData(true);
        });
    };

       //加载更多
    loadMore = () => {
        if (this.state.loading) return;//防止快速滚动，产生抖动，多次调用
        const { pageIndex } = this.state;
        this.setState({
            pageIndex: pageIndex + 1
        }, () => {
            this.loadData();
        });
    };

    _renderItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                //选中了，点击取消
                if (this.state.selectedId != '' && this.state.selectedId == item.id) {
                    this.setState({
                        selectedId: ''
                    });
                    return;
                }
                this.setState({
                    selectedId: item.id
                });

                switch (item.statusName) {
                    case '待派单': {
                        this.props.navigation.navigate('paidan', { id: item.id });
                        break;
                    }
                    case '待接单': {
                        this.props.navigation.navigate('jiedan', { id: item.id });
                        break;
                    }
                    case '已暂停':
                    case '待开工': {
                        this.props.navigation.navigate('kaigong', { id: item.id });
                        break;
                    }
                    case '待完成': {
                        this.props.navigation.navigate('wancheng', { id: item.id });
                        break;
                    }
                    case '待检验': {
                        this.props.navigation.navigate('jianyan', { id: item.id });
                        break;
                    }
                    case '待协助':
                        {
                            this.props.navigation.navigate('assist', { id: item.id });
                            break;
                        }
                    case '待审核': {
                        this.props.navigation.navigate('approve', { id: item.id });
                        break;
                    }
                    default:
                        break;
                }
            }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, this.state.selectedId == item.id ? styles.orange : styles.blue]}
                >
                    <Flex justify='between' style={{ width: '100%' }}>
                        <Text style={styles.title}>{item.billCode}</Text>
                        <Text style={styles.aaa}>{item.statusName}</Text>
                    </Flex>
                    <Flex style={styles.line} />
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                            style={{ width: '100%', paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text style={{ lineHeight: 20 }}>{item.address} {item.contactName}</Text>
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
                            <Text>紧急程度：{item.emergencyLevel}，重要程度：{item.importance}</Text>
                        </Flex>
                        <Flex justify='between'
                            style={{ width: '100%', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>维修专业：{item.repairMajor}，积分：{item.score}</Text>
                        </Flex>
                        <Flex justify='between'
                            style={{ width: '100%', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>是否允许抢单：{item.isQD == 1 ? '是' : '否'}，单据来源：{item.sourceType}</Text>
                        </Flex>
                        <Text numberOfLines={2}
                            style={{
                                lineHeight: 20,
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingBottom: 10,
                                color: '#666'
                            }}
                        >{item.repairContent || item.contents}</Text>
                        <Flex justify='between'
                            style={{ width: '100%', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>{item.billDate}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    timeChange = (time) => {
        this.setState({
            time,
            pageIndex: 1
        }, () => {
            this.onRefresh();
        });
    };

    onSelectPerson = ({ selectItem }) => {
        this.setState({
            selectPerson: selectItem
        })
    }

    renderFooter = () => {
        if (!this.state.hasMore && this.state.data.length > 0) {
            return <Text style={{ fontSize: 14, alignSelf: 'center' }}>没有更多数据了</Text>;
        }
        return this.state.loading ? <ActivityIndicator /> : null;
    };

    render() {
        const { data, total, refreshing, type, selectPerson } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ListHeader type={type} onChange={(type) => this.setState({ type }, () => {
                    this.onRefresh();
                })} />
                <Flex justify={'between'} style={{ paddingLeft: 15, marginTop: 15, paddingRight: 15, height: 30 }}>
                    <MyPopover onChange={this.timeChange}
                        titles={['全部', '今日', '本周', '本月', '上月', '本年']}
                        visible={true} />
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('selectRolePerson', {
                            moduleId: 'Repair',
                            enCode: 'dispatch',
                            onSelect: this.onSelectPerson
                        })}>
                        <Flex justify='between' style={{
                            paddingTop: 15,
                            paddingBottom: 15,
                            marginLeft: 10,
                            marginRight: 10
                        }}>
                            <Text style={[selectPerson ? { fontSize: 16, color: '#404145' } :
                                { color: '#666' }]}>{selectPerson ? selectPerson.name : "请选择派单人"}</Text>
                            <LoadImage style={{ width: 6, height: 11, marginLeft: 8 }}
                                defaultImg={require('../../../static/images/address/right.png')} />
                        </Flex>
                    </TouchableWithoutFeedback>
                </Flex>

                <FlatList
                    data={data}
                    // ListHeaderComponent={}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.id}
                    //必须
                    onEndReachedThreshold={0.2}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}//下拉刷新
                    onEndReached={this.loadMore}//底部往下拉翻页
                    //onMomentumScrollBegin={() => this.canLoadMore = true} 
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={<NoDataView />}
                />
                <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {data.length}, 共 {total} 条</Text>
            </CommonView>

        );
    }
}

const styles = StyleSheet.create({

    list: {
        backgroundColor: Macro.color_white,
        //margin: 15
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
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
export default connect(mapStateToProps)(TaskUnSendListPage);
