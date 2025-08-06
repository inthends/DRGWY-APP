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
import ListHeader from '../../../components/list-servicedesk-header';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import WorkService from '../work-service';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import MyPopover from '../../../components/my-popover';
import UDToast from '../../../utils/UDToast';

//待完成服务单列表
class ServicedeskUnFinishListPage extends BasePage {
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
        const type = common.getValueFromProps(this.props).type;
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            data: [],
            refreshing: false,//刷新
            loading: false,//加载完成 
            hasMore: true,//更多

            type,
            time: '全部',
            selectedId: ''
        };
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.loadData();
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

    loadData = (isRefreshing = false) => {
        if (this.state.loading || (!isRefreshing && !this.state.hasMore))  {
            this.setState({ loading: false, refreshing: false });
            return;
        }
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const {data, type, time, pageIndex, pageSize } = this.state;
        WorkService.servicedeskUnFinishList(type, time, pageIndex, pageSize).then(res => {
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
                this.props.navigation.navigate('service', { id: item.id });
            }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, this.state.selectedId == item.id ? styles.orange : styles.blue]}>
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
                        <Text
                            style={{
                                lineHeight: 20,
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingBottom: 10,
                                color: '#666'
                            }}>{item.contents}</Text>
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

    renderFooter = () => {
        if (!this.state.hasMore && this.state.data.length > 0) {
            return <Text style={{ fontSize: 14, alignSelf: 'center' }}>没有更多数据了</Text>;
        } 
        return this.state.loading ? <ActivityIndicator /> : null;
    };

    render() {
        const { data, total, refreshing, type } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ListHeader type={type} onChange={(type) => this.setState({ type }, () => {
                    this.onRefresh();
                })} />
                <Flex justify={'between'} style={{ paddingLeft: 15, marginTop: 15, paddingRight: 15, height: 30 }}>
                    <MyPopover onChange={this.timeChange}
                        titles={['全部', '今日', '本周', '本月', '上月', '本年']}
                        visible={true} />
                </Flex>
                <FlatList
                    data={data}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.id}
                    //必须
                    onEndReachedThreshold={0.1}
                    refreshing={this.state.refreshing}//在等待加载新数据时将此属性设为 true，列表就会显示出一个正在加载的符号
                    onRefresh={this.onRefresh}//下拉刷新
                    onEndReached={this.loadMore}//底部往下拉翻页 
                    ListFooterComponent={this.renderFooter}
                    //onMomentumScrollBegin={() => this.canLoadMore = true}
                    //防止上拉加载更多onReached被触发两次，造成重复请求资源，性能浪费
                    //开始滑动，当第一次触发完毕之后，将这个flag设置为false，避免重复去执行我们需要做的action操作
                    //onMomentumScrollEnd={() => this.canLoadMore = true}//结束滑动
                    //onScrollBeginDrag={() => this.canLoadMore = false}//开始拖拽的时候
                    //onScrollEndDrag={() => this.canLoadMore = true}//结束拖拽的时候 
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
        selectBuilding: buildingReducer.selectBuilding
    };
};
export default connect(mapStateToProps)(ServicedeskUnFinishListPage);
