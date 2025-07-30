import React from 'react';
import {
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import BasePage from '../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
import NoDataView from '../../components/no-data-view';
import CommonView from '../../components/CommonView';
import MineService from './mine-service';
import UDToast from '../../utils/UDToast';

//积分明细，按月统计
export default class ScoreListPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '积分统计',
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
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            data: [],
            refreshing: false,//刷新
            loading: false,//加载完成 
            hasMore: true//更多
        };
    }

    componentDidMount() {
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


    loadData = (isRefreshing = false) => {
        if (this.state.loading || (!isRefreshing && !this.state.hasMore)) return;
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const { pageIndex, pageSize } = this.state;
        MineService.getRepairScoreList(currentPage, pageSize).then(res => {
            if (isRefreshing) {
                this.setState({
                    data: res.data,
                    pageIndex: 2,
                    total: res.total
                });
            }
            else {
                this.setState({
                    data: [...this.state.data, ...res.data],
                    pageIndex: pageIndex + 1,
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

    _renderItem = ({ item, index }) => {
        return (
            <Flex direction='column' align={'start'}
                style={[styles.card, index % 2 == 0 ? styles.blue : styles.orange]}>
                <Flex justify='between' style={{ width: '100%' }}>
                    <Text style={styles.title}>{item.date}</Text>
                    <Text style={styles.right}>合计：{item.totalscore}</Text>
                </Flex>
                <Flex style={styles.line} />
                <Flex align={'start'} direction={'column'}>
                    <Flex justify='between'
                        style={{ width: '100%', paddingBottom: 10, paddingTop: 5, paddingLeft: 20, paddingRight: 20 }}>
                        <Text>接单积分：{item.score}，协助增援积分：{item.pscore}</Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    };

    renderFooter = () => {
        if (!this.state.hasMore && this.state.data.length > 0) {
            return <Text>没有更多数据了</Text>;
        }

        return this.state.loading ? <ActivityIndicator /> : null;
    };

    render() {
        const { data, refreshing, total } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.date}
                    onEndReachedThreshold={0.1}
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
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    title: {
        paddingTop: 15,
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20
    },
    right: {
        color: '#404145',
        fontSize: 16,
        paddingRight: 20
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
    }

}); 