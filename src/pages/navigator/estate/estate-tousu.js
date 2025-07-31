import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    ActivityIndicator
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
//import ListHeader from '../../../components/list-header';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import ScrollTitle from '../../../components/scroll-title';
import MyPopover from '../../../components/my-popover';
import service from '../navigator-service';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import { saveSelectBuilding, saveSelectDrawerType } from '../../../utils/store/actions/actions';
import { DrawerType } from '../../../utils/store/action-types/action-types';
import UDToast from '../../../utils/UDToast';

class EstateTousuPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '投诉单',
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
            key: null
        };

        this.state = {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            data: [],
            refreshing: false,//刷新
            loading: false,//加载完成 
            hasMore: true,//更多

            //ym: common.getYM('2020-01'),
            billStatus: -1,
            //canLoadMore: true,
            //time: common.getCurrentYearAndMonth(),
            time: '全部',
            selectBuilding: this.props.selectBuilding || {},
            selectedId: ''
        };
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.props.saveBuilding({});//加载页面清除别的页面选中的数据
                this.props.saveSelectDrawerType(DrawerType.building);
                this.loadData();
            }
        );
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;

        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({ selectBuilding: nextProps.selectBuilding }, () => {
                this.onRefresh();
            });
        }
    }

    loadData = (isRefreshing = false) => {
        /*
        pageIndex, billStatus, treeType, organizeId, billType, startTime, endTime
         */
        if (this.state.loading || (!isRefreshing && !this.state.hasMore)) return;
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const { data, selectBuilding, time, pageIndex, pageSize } = this.state;
        let treeType;
        let organizeId;
        if (selectBuilding) {
            treeType = selectBuilding.type;
            organizeId = selectBuilding.key;
        }
        // let startTime = common.getMonthFirstDay(time);
        // let endTime = common.getMonthLastDay(time);

        service.tousuList(currentPage, pageSize, billStatus, treeType, organizeId, '', time).
            then(res => {
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
                this.props.navigation.navigate('tousuD', { id: item.id });
            }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, this.state.selectedId == item.id ? styles.orange : styles.blue]}>
                    <Flex justify='between' style={{ width: '100%' }}>
                        <Text style={styles.title}>{item.billCode}</Text>
                        <Text style={styles.title2}>{item.statusName}</Text>
                    </Flex>
                    <Flex style={styles.line} />
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                            style={{ width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>{item.complaintAddress}  {item.complaintUser}</Text>
                            <TouchableWithoutFeedback onPress={() => common.call(item.complaintLink)}>
                                <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{ width: 15, height: 15 }} /></Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Text style={{
                            lineHeight: 20,
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 40,
                            color: '#666',
                        }}>{item.contents}</Text>
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
            case '待审核': {
                billStatus = 4;
                break;
            }
            case '已审核': {
                billStatus = 5;
                break;
            }
            default: {
                billStatus = -1;
                break;
            }
        }
        this.setState({
            billStatus,
            pageIndex: 1
        }, () => {
            this.loadData();
        });

    };
    timeChange = (time) => {
        this.setState({
            time,
            pageIndex: 1
        }, () => {
            this.loadData();
        });

    };
    billType = (billType) => {
        this.setState({
            billType,
            pageIndex: 1
        }, () => {
            this.loadData();
        });
    };

    renderFooter = () => {
        if (!this.state.hasMore && this.state.data.length > 0) {
            return <Text style={{ fontSize: 14, alignSelf: 'center' }}>没有更多数据了</Text>;
        }

        return this.state.loading ? <ActivityIndicator /> : null;
    };

    render() {
        const { data, total, refreshing } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <CommonView style={{ flex: 1 }}>
                    <ScrollTitle onChange={this.statusChange} titles={['全部', '待处理', '待完成', '待回访', '待审核', '已审核']} />
                    {/*<Tabs tabs={tabs2} initialPage={1} tabBarPosition="top">*/}
                    {/*    {renderContent}*/}
                    {/*</Tabs>*/}
                    <Flex justify={'between'} style={{ marginTop: 15, paddingRight: 15, height: 30 }}>
                        <Flex />
                        <MyPopover onChange={this.timeChange}
                            //titles={ym} 
                            titles={['全部', '今日', '本周', '本月', '上月', '本年']}
                            visible={true} />
                    </Flex>

                    <FlatList
                        data={data}
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
                    <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {data.length}, 共 {total} 条</Text>
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
        marginRight: 20,
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
    },

});
const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveBuilding: (item) => {
            dispatch(saveSelectBuilding(item));
        },
        saveSelectDrawerType: (item) => {
            dispatch(saveSelectDrawerType(item));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EstateTousuPage);
