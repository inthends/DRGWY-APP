import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import { StyleSheet, FlatList, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import CommonView from '../../../components/CommonView';
import common from '../../../utils/common';
import OrderService from './order-service';
import NoDataView from '../../../components/no-data-view';
import Macro from '../../../utils/macro';
// import LoadImage from '../../../components/load-image';
// let screen_width = ScreenUtil.deviceWidth()

export default class OrderlistPage extends BasePage {
    static navigationOptions = ({ navigation }) => {

        //废弃
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
            refreshing: true,
            selectedId:''
        };
    }

    componentDidMount() {
        this.onRefresh();
    }

    getList = () => {
        const { type, pageIndex, pageSize } = this.state;
        OrderService.getOrderDatas(type, pageIndex, pageSize).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data]
                };
            }
            this.setState({
                dataInfo: dataInfo,
                pageIndex: dataInfo.pageIndex,
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

    //传入status  待查阅0，待回复1，已回复2，已关闭-1
    _renderItem = ({ item, index }) => {
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
                this.props.navigation.navigate('orderDetail', { data: item });
            }}>
                <Flex direction='column' align={'start'}
                     style={[styles.card, this.state.selectedId == item.id ? styles.orange : styles.blue]}>
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
                                onPress={() => common.call(item.phoneNum)}>
                                <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{ width: 20, height: 20 }} /></Flex>
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


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { dataInfo, type } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <FlatList
                    data={dataInfo.data}
                    // ListHeaderComponent={}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item, index) => item.id}
                    //必须
                    onEndReachedThreshold={0.1}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}//下拉刷新
                    onEndReached={this.loadMore}//底部往下拉翻页
                    onMomentumScrollBegin={() => this.canLoadMore = true}
                    ListEmptyComponent={<NoDataView />}
                />
                <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {dataInfo.data.length}, 共 {dataInfo.total} 条</Text>
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
