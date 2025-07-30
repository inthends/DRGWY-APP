import React from 'react';
import {
    View, StyleSheet, FlatList,
    TouchableOpacity, TouchableWithoutFeedback, Text,
    ActivityIndicator
} from 'react-native';
import BasePage from '../base/base';
import Macro from '../../utils/macro';
import WorkService from './work-service';
import NoDataView from '../../components/no-data-view';
import { Flex, Icon } from '@ant-design/react-native';
import ListHeader from '../../components/list-news-header';
import UDToast from '../../utils/UDToast';

class NewsList extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '消息列表',
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
        // this.selectBuilding = {
        //     key: null,
        // };
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            data: [],
            refreshing: false,//刷新
            loading: false,//加载完成 
            hasMore: true,//更多

            selectedId: ''
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
        const { status, pageIndex, pageSize } = this.state;
        WorkService.getNewsList(status, currentPage, pageSize).then(res => {
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

    renderFooter = () => {
        if (!this.state.hasMore && this.state.data.length > 0) {
            return <Text>没有更多数据了</Text>;
        } 
        return this.state.loading ? <ActivityIndicator /> : null;
    };

    _renderItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback key={item.id}
                onPress={() => {
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
                    WorkService.readNews(item.id);
                    const { appUrlName, linkId } = item;
                    // const d = {
                    //     ...item,
                    //     id: item.linkId
                    // }; 
                    // switch (type) { 
                    //     case 98: //评审回复
                    //     case 99: //催办消息
                    //         {
                    //             //跳转到待审批
                    //             this.props.navigation.navigate('flow');
                    //             break;
                    //         }
                    // }
                    this.props.navigation.navigate(appUrlName, { id: linkId });
                }}>

                <Flex direction='column' align={'start'}
                    style={[styles.card, this.state.selectedId == item.id ? styles.orange : styles.blue]}>
                    <Flex justify='between' style={{ width: '100%' }}>
                        <Text style={styles.title}>{item.title}</Text>
                        {/* <Text style={item.isRead === 0 ? styles.unread : styles.read}>{item.isRead ? '已读' : '未读'}</Text> */}
                        <Text style={styles.read}>{item.sendUserName} {item.sdtime}</Text>
                    </Flex>
                    <Flex style={styles.line} />
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                            style={{
                                width: '100%',
                                paddingTop: 10//, paddingLeft: 20, paddingRight: 20
                            }}
                        >
                            <Text style={{
                                lineHeight: 20,
                                color: '#666',
                                fontSize: 15
                            }}>{item.contents}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    render() {
        const { data, refreshing, total, status } = this.state;
        return (
            <View style={styles.content}>
                <ListHeader status={status}
                    onChange={(status) => this.setState({ status }, () => {
                        this.onRefresh();
                    })} />
                <FlatList
                    data={data}
                    // ListHeaderComponent={}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.id + 'cell'}
                    //必须
                    onEndReachedThreshold={0.1}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}//下拉刷新
                    onEndReached={this.loadMore}//底部往下拉翻页
                    //onMomentumScrollBegin={() => this.canLoadMore = true}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={<NoDataView />}
                />
                <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {data.length}, 共 {total} 条</Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({

    content: {
        backgroundColor: Macro.color_white,
        flex: 1
    },
    list: {
        backgroundColor: Macro.color_white,
        margin: 15
    },
    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5
    },

    orange: {
        borderLeftColor: Macro.work_orange,
        borderLeftWidth: 5,
    },

    title: {
        color: '#404145',
        fontSize: 16
    },
    unread: {
        color: 'red',
        fontSize: 16
    },
    read: {
        color: '#666',
        fontSize: 15
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
        shadowOpacity: 0.8,
        padding: 15
    }
});
export default NewsList;
