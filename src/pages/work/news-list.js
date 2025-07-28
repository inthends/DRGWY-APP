import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';
import BasePage from '../base/base';
import Macro from '../../utils/macro';
import WorkService from './work-service';
import NoDataView from '../../components/no-data-view';
import { Flex, Icon } from '@ant-design/react-native';
import ListHeader from '../../components/list-news-header';

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
            status: 0,
            dataInfo: {
                data: [],
            },
            refreshing: true,
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

    getList = (showLoading = true) => {
        WorkService.getNewsList(this.state.status, this.state.pageIndex, this.state.pageSize, showLoading).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data],
                };
            }
            this.setState({
                dataInfo: dataInfo,
                refreshing: false,
                pageIndex: dataInfo.pageIndex
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
        if (this.canLoadMore && data.length < total) {
            this.canLoadMore = false;
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1
            }, () => {
                this.getList();
                this.setState({ pageSize: (pageIndex + 1) * 10 });
            });
        }
    };

    _renderItem = ({ item, index }) => {
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
        const { dataInfo, status } = this.state;
        return (
            <View style={styles.content}>
                <ListHeader status={status}
                    onChange={(status) => this.setState({ status }, () => {
                        this.onRefresh();
                    })} />
                <FlatList
                    data={dataInfo.data}
                    // ListHeaderComponent={}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.id + 'cell'}
                    //必须
                    onEndReachedThreshold={0.1}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}//下拉刷新
                    onEndReached={this.loadMore}//底部往下拉翻页
                    onMomentumScrollBegin={() => this.canLoadMore = true}
                    ListEmptyComponent={<NoDataView />}
                />
                <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {dataInfo.data.length}, 共 {dataInfo.total} 条</Text>

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
