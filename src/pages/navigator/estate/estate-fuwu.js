import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import ScrollTitle from '../../../components/scroll-title';
import MyPopover from '../../../components/my-popover';
import NavigatorService from '../navigator-service';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';

//统计页面服务单列表，仅查看
class EstateFuwuPage extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            //title: '服务单',
            title: navigation.getParam('data') ? navigation.getParam('data').title : '',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                    <Icon name='bars' style={{ marginRight: 15 }} color="black" />
                </TouchableWithoutFeedback>
            )
        };
    };

    constructor(props) {
        super(props);
        this.selectBuilding = {
            key: null,
        };
        //列表类型
        const type = common.getValueFromProps(this.props).type;
        this.state = {
            type,
            pageIndex: 1,
            dataInfo: {
                data: [],
            },
            refreshing: false,
            billType: '全部',
            billStatus: -1,
            time: '全部',
            selectBuilding: this.props.selectBuilding
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
        const { type, billStatus, selectBuilding, billType, time } = this.state;
        let organizeId;
        if (selectBuilding) {
            treeType = selectBuilding.type;
            organizeId = selectBuilding.key;
        }

        NavigatorService.serviceList(
            this.state.pageIndex,
            type,
            billStatus,
            organizeId,
            billType,
            time)
            .then(dataInfo => {
                if (dataInfo.pageIndex > 1) {
                    dataInfo = {
                        ...dataInfo,
                        data: [...this.state.dataInfo.data, ...dataInfo.data],
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
            });
        }
    };

    _renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                //this.props.navigation.push('serverDeskView', { data: item.id, type: this.state.billType });
                this.props.navigation.navigate('serverDeskView', { id: item.id });
            }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, index % 2 == 0 ? styles.blue : styles.orange]}>
                    <Flex justify='between' style={{ width: '100%' }}>
                        <Text style={styles.title}>{item.billCode}</Text>
                        <Text style={styles.title2}>{item.billType}</Text>
                    </Flex>
                    <Flex style={styles.line} />
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                            style={{ width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
                            <Text style={{ lineHeight: 20 }}>{item.address} </Text>
                            <Text>{item.statusName}</Text>
                        </Flex>
                        <Text
                            // numberOfLines={3}
                            // ellipsizeMode='tail'
                            style={{
                                lineHeight: 20,
                                height: 60,
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingBottom: 20,
                                color: '#666'
                            }}>
                            {item.contents}
                            {/* {"\n"} */}
                        </Text>
                        <Flex justify='between'
                            style={{ width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>{item.contactName} {item.billDate}</Text>
                            <TouchableWithoutFeedback onPress={() => common.call(item.contactPhone)}>
                                <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{ width: 20, height: 20 }} /></Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    statusChange = (title) => {
        let billStatus;
        switch (title) {
            case '待处理': {
                billStatus = 1;
                break;
            }
            case '待完成': {
                billStatus = 2;
                break;
            }
            case '待回访': {
                billStatus = 3;
                break;
            }
            case '待检验': {
                billStatus = 4;
                break;
            }
            case '已回访': {
                billStatus = 5;
                break;
            }
            case '已检验': {
                billStatus = 6;
                break;
            }
            case '已闭单': {
                billStatus = 7;
                break;
            }
            default: {
                //已作废
                billStatus = -1;
                break;
            }
        }
        this.setState({
            billStatus,
            pageIndex: 1
        }, () => {
            this.onRefresh();
        });

    };
    timeChange = (time) => {
        this.setState({
            time,
            pageIndex: 1
        }, () => {
            this.onRefresh();
        });
    };

    billType = (billType) => {
        this.setState({
            billType,
            pageIndex: 1
        }, () => {
            this.onRefresh();
        });
    };

    render() {
        const { type, dataInfo } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <CommonView style={{ flex: 1 }}>
                    <ScrollTitle onChange={this.billType} titles={['全部', '报修', '投诉', '咨询', '建议']} />
                    <Flex justify={'between'} style={{ paddingLeft: 15, marginTop: 15, paddingRight: 15, height: 30 }}>
                        {type == 'all' ?
                            <MyPopover onChange={this.statusChange}
                                titles={['全部', '待处理', '待完成', '待回访', '待检验', '已回访', '已检验', '已闭单', '已作废']}
                                visible={true} /> : null}

                        <MyPopover onChange={this.timeChange}
                            titles={['全部', '今日', '本周', '本月', '上月', '本年']}
                            visible={true} />
                    </Flex>
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
            </View>

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
        marginRight: 20
    },
    title2: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10,
        marginRight: 20
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30 - 15 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1
    },
    top: {
        paddingTop: 20,
        color: '#000',
        fontSize: 16,
        paddingBottom: 15
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
        borderLeftColor: Macro.work_orange,
        borderLeftWidth: 5
    }
});
const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(EstateFuwuPage);
