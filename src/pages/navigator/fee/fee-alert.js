import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import common from '../../../utils/common';
import WorkService from '../../work/work-service';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import moment from 'moment';

//仅查看
export default class FeeAlertDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '欠费详情',
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
        let id = common.getValueFromProps(this.props, 'id');
        this.state = {
            id,
            detail: {},
            //费用明细
            pageIndex: 1,
             pageSize: 10,
            refreshing: false,
            dataInfo: {
                data: []
            }
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { id } = this.state;
        WorkService.getCustomerInfo(id).then(detail => {
            this.setState({
                detail
            });
            this.getList();
        });
    };


    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1
        }, () => {
            this.getList();
        });
    };

    //欠费明细
    getList = () => {
        const { id,pageIndex,pageSize } = this.state;
        WorkService.alertFeeList( pageIndex,pageSize, id).then(dataInfo => {
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
            <Flex
                direction='column' align={'start'}
                style={[styles.card, index % 2 == 0 ? styles.blue : styles.orange]}>
                <Flex justify='between' style={{ width: '100%' }}>
                    <Text style={styles.title}>{item.allName}</Text>
                </Flex>
                <Flex style={styles.line} />
                <Flex align={'start'} direction={'column'}>
                    <Flex justify='between'
                        style={{ width: '100%', paddingTop: 10, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={{ lineHeight: 20 }}>{item.feeName}：{item.amount}</Text>
                    </Flex>
                    <Flex justify='between'
                        style={{ width: '100%', paddingTop: 5, paddingBottom: 10, paddingLeft: 15, paddingRight: 10 }}>
                        {item.beginDate ?
                            <Text>{moment(item.beginDate).format('YYYY-MM-DD') + '至' + moment(item.endDate).format('YYYY-MM-DD')}</Text> : null
                        }
                        <Text style={styles.statusred}>逾期：{item.arrearsDays}天</Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    };

    render() {
        const { detail, dataInfo } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.fontSize}>{detail.name}</Text>
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.fontSize}>联系人：{detail.linkMan}</Text>
                        <Text style={styles.fontSize}>{detail.linkPhoneNum}</Text>
                    </Flex>
                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.fontSize}>费用明细</Text>
                    </Flex>
                    <FlatList
                        data={dataInfo.data}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item) => 'flatList' + item.id}
                        //必须
                        onEndReachedThreshold={0.1}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}//下拉刷新
                        onEndReached={this.loadMore}//底部往下拉翻页
                        onMomentumScrollBegin={() => this.canLoadMore = true}
                    />

                </ScrollView>
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

    card: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#c8c8c8',
        borderBottomColor: '#c8c8c8',
        borderRightColor: '#c8c8c8',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: { h: 10, w: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.8
    },

    fontSize: {
        color: '#404145',
        fontSize: 15
    },

    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5,
    },

    orange: {
        borderLeftColor: Macro.work_orange,
        borderLeftWidth: 5,
    },

    title: {
        paddingTop: 10,
        color: '#404145',
        fontSize: 14,
        paddingBottom: 5,
        marginLeft: 15,
        marginRight: 15
    },

    statusred: { 
        marginRight: 5, 
        color: Macro.work_red
    },

    line: {
        width: ScreenUtil.deviceWidth() - 30 - 10 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1
    },

    every: {
        fontSize: 16,
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 10,
        paddingBottom: 10
    },
    every2: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 10,
        paddingBottom: 10
    },

});
