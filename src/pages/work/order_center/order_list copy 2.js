import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import { StyleSheet, FlatList, Text, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import CommonView from '../../../components/CommonView';
import common from '../../../utils/common';
import OrderService from './order-service';
import NoDataView from '../../../components/no-data-view';
import Macro from '../../../utils/macro';
//let screen_width = ScreenUtil.deviceWidth()
export default class OrderlistPage extends BasePage {
    static navigationOptions = ({ navigation }) => {

        return {
            tabBarVisible: false,
            title: navigation.state.params.data.title ?? '订单列表',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            ...(common.getValueFromProps(this.props)),
            dataInfo: {},
            pageIndex: 1,
            pageSize: 10,
            refreshing: true
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = (isRefreshing = false) => {
        if (this.state.loading || (!isRefreshing && !this.state.hasMore)) return;
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const {data, type, pageIndex, pageSize } = this.state;
        OrderService.getOrderDatas(type, currentPage, pageSize).then(res => {
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

    //传入status  待查阅0，待回复1，已回复2，已关闭-1
    /*
allName: "大象城/第01栋/第01层/1-102"
billCode: "DXCNo202303140003"
billDate: "2023-03-14 21:16:58"
createDate: "2023-03-14 21:16:58"
createUserId: "fcf03321-a8bc-4f6a-b4aa-24d040748a4a"
createUserName: "15295507559"
customer: "朱信保"
id: "f65ff2c2-a43c-41ed-bc38-c48cc2ff3e43"
linkId: null
memo: "2023-03-14 00:00"
modifyDate: null
modifyUserId: null
modifyUserName: null
otherId: null
phoneNum: "15295507559"
roomId: "936668d7-5a3f-4b2e-bc44-0ef9198d1ac5"
rowIndex: 1
status: 0
type: "预约看房"
*/

    _renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                switch (item.status) {
                    case 0: {
                        this.props.navigation.navigate('paidan', { data: item });
                        break;
                    }
                    case 1: {
                        this.props.navigation.navigate('jiedan', { data: item });
                        break;
                    }
                    default:
                        break;
                }

            }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, index % 2 == 0 ? styles.blue : styles.orange]}>
                    <Flex justify='between' style={{ width: '100%' }}>
                        <Text style={styles.title}>{item.type ?? ''}</Text>
                        <Text style={styles.aaa}>{item.createDate ?? ''}</Text>
                    </Flex>
                    <Flex style={styles.line} />
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                            style={{ width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>{item.billCode}</Text>
                            {/* <TouchableWithoutFeedback
                                onPress={() => common.call('666')}>
                                <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} 
                                style={{width: 16, height: 16}}/></Flex>
                            </TouchableWithoutFeedback> */}
                        </Flex>
                        <Text style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 40,
                            color: '#666',
                        }}>{item.allName + ' ' + item.billDate}</Text>
                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    renderFooter = () => {
        if (!this.state.hasMore && this.state.data.length > 0) {
            return <Text style={{ fontSize: 14, alignSelf: 'center' }}>没有更多数据了</Text>;
        }

        return this.state.loading ? <ActivityIndicator /> : null;
    };

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { data, refreshing } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <FlatList
                    data={dataInfo.data}
                    // ListHeaderComponent={}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.id}
                    //必须
                    onEndReachedThreshold={0.1}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}//下拉刷新
                    onEndReached={this.loadMore}//底部往下拉翻页
                    //onMomentumScrollBegin={() => this.canLoadMore = true}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={<NoDataView />}
                /> 
            </CommonView>

        );
    }
}

const styles = StyleSheet.create({


    list: {
        backgroundColor: Macro.color_white,
        margin: 15,
    },
    title: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20,
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
    },
});
