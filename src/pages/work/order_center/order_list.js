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
import LoadImage from '../../../components/load-image';

let screen_width = ScreenUtil.deviceWidth()

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
            refreshing: false
        };
    }

    componentDidMount() {
        this.onRefresh()
    }

    getList = () => {
        const { type, pageIndex } = this.state;
        OrderService.getOrderDatas(type, pageIndex).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data],
                };
            }
            this.setState({
                dataInfo: dataInfo,
                refreshing: false,
            }, () => {
            });
        });
    };

    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1,
        }, () => {
            this.getList();
        });
    };
    loadMore = () => {
        const { data, total, pageIndex } = this.state.dataInfo;
        if (this.canAction && data.length < total) {
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1,
            }, () => {
                this.getList();
            });
        }
    };
    //传入status  待查阅0，待回复1，已回复2，已关闭-1
    _renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.navigation.navigate('orderDetail', { data: item });

            }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, index === 0 ? styles.blue : styles.orange]}>
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
                    // refreshing={this.state.refreshing}
                    // onRefresh={() => this.onRefresh()}
                    // onEndReached={() => this.loadMore()}
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
    all: {
        backgroundColor: Macro.color_sky,
        flex: 1,
    },
    content: {
        backgroundColor: Macro.color_white,
        flex: 1,


    },
    list: {
        backgroundColor: Macro.color_white,
        margin: 15,
    },
    title: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#333',
        fontSize: 16,
        paddingBottom: 10,
        //
        marginLeft: 20,
        marginRight: 20,

        // width: ,
    },
    title2: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#333',
        fontSize: 16,
        paddingBottom: 10,
        //

        marginRight: 20,

        // width: ,
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30 - 15 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1,
    },
    top: {
        paddingTop: 20,
        color: '#000',
        fontSize: 16,
        paddingBottom: 15,
    },
    bottom: {
        color: '#868688',
        fontSize: 16,
        paddingBottom: 20,
    },
    button: {
        color: '#868688',
        fontSize: 16,
        paddingTop: 10,
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
    },
    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5,
    },
    orange: {
        borderLeftColor: '#F7A51E',
        borderLeftWidth: 5,
    },
    aaa: {
        paddingRight: 20,
    },
});
