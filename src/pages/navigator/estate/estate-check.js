import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    ActivityIndicator
    //Alert
} from 'react-native';
import { Flex, Icon, Button, Modal } from '@ant-design/react-native';
import BasePage from '../../base/base';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
//import common from '../../../utils/common';
import ScrollTitle from '../../../components/scroll-title';
import MyPopover from '../../../components/my-popover';
import service from '../statistics-service';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import { DrawerType } from '../../../utils/store/action-types/action-types';
import { saveSelectDrawerType } from '../../../utils/store/actions/actions';
import MyPopoverRole from '../../../components/my-popover-role';
import WorkService from '../../work/work-service';
import ActionPopover from '../../../components/action-popover';
import UDToast from '../../../utils/UDToast';

class EstateCheckPage extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '检查单',
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

            roles: [],
            showAdd: true,//默认弹出选择检查组界面
            selectBuilding: {},//默认为空，防止别地方选择了机构

            //ym: common.getYM('2020-01'),
            billType: '我的',
            billStatus: -1,
            //time: common.getCurrentYearAndMonth(),
            time: '全部',
            selectBuilding: this.props.selectBuilding,
            checkRole: '',//检查的角色
            checkRoleId: '',
            selectedId: ''
        };
    }


    componentDidMount() {

        //加载有现场检查权限的角色
        WorkService.getCheckRoles().then(roles => {
            this.setState({
                roles
            });
            // if (roles.length > 0) {
            //     this.setState({ checkRole: roles[0].name, checkRoleId: roles[0].id });
            // }
        });

        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.props.saveSelectDrawerType(DrawerType.organize);
                this.loadData();
            }
        );

        this.viewDidDisappear = this.props.navigation.addListener(
            'didBlur',
            (obj) => {
                this.props.saveSelectDrawerType(DrawerType.organize);
            }
        );
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    // componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
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
        if (this.state.loading || (!isRefreshing && !this.state.hasMore))  {
            this.setState({ loading: false, refreshing: false });
            return;
        }
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const { data,billStatus, selectBuilding, billType, time, pageIndex, pageSize } = this.state;
        let organizeId;
        if (selectBuilding) {
            //treeType = selectBuilding.type;
            organizeId = selectBuilding.key;
        }
        // let startTime = common.getMonthFirstDay(time);
        // let endTime = common.getMonthLastDay(time);
        service.checkList(
            currentPage,
            pageSize,
            billStatus,
            billType,
            organizeId,
            time).then(res => {
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
                        if (!acc.some(item => item.billId === current.billId)) {
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


    deleteDetail = (id) => {
        // Alert.alert(//ios下删除弹出确认框会卡死 
        //     '请确认',
        //     '是否删除？',
        //     [
        //         {
        //             text: '取消',
        //             onPress: () => {
        //             },
        //             style: 'cancel',
        //         },
        //         {
        //             text: '确定',
        //             onPress: () => {
        //                 WorkService.deleteCheck(id).then(res => {
        //                     this.loadData();
        //                 });
        //             },
        //         },
        //     ],
        //     { cancelable: false }
        // );  
        Modal.alert('请确认', '是否删除？',
            [
                {
                    text: '取消', onPress: () => {
                    }, style: 'cancel'
                },
                {
                    text: '确定', onPress: () => {
                        WorkService.deleteCheck(id).then(res => {
                            this.loadData();
                        });
                    }
                }
            ]
        )
    };

    //闭单
    closeDetail = (id) => {
        WorkService.checkInspect(id).then(res => {
            if (res == true) {
                Modal.alert('请确认', '还有工单未完成，您确定闭单么？',
                    [
                        {
                            text: '取消', onPress: () => {
                            }, style: 'cancel'
                        },
                        {
                            text: '确定', onPress: () => {
                                WorkService.closeCheck(id).then(res => {
                                    this.loadData();
                                });
                            }
                        }
                    ]
                )

            } else {
                Modal.alert('请确认', '是否闭单？',
                    [
                        {
                            text: '取消', onPress: () => {
                            }, style: 'cancel'
                        },
                        {
                            text: '确定', onPress: () => {
                                WorkService.closeCheck(id).then(res => {
                                    this.loadData();
                                });
                            }
                        }
                    ]
                )
            }
        });
    };


    modifyData = (id) => {
        this.props.navigation.push('checkModify', {
            data: {
                id: id,
                checkRole: this.state.checkRole,
                checkRoleId: this.state.checkRoleId
            }
        })
    }

    _renderItem = ({ item, index }) => {

        return (
            <TouchableWithoutFeedback onPress={() => {
                //选中了，点击取消
                if (this.state.selectedId != '' && this.state.selectedId == item.billId) {
                    this.setState({
                        selectedId: ''
                    });
                    return;
                }
                this.setState({
                    selectedId: item.id
                });
                this.props.navigation.push('checkDetail', { id: item.billId });
            }}>
                <Flex direction='column' align={'start'}
                    //style={[styles.card, index % 2 == 0 ? styles.blue : styles.orange]}
                    style={[styles.card, this.state.selectedId == item.billId ? styles.orange : styles.blue]}
                >
                    <Flex justify='between' style={{ width: '100%' }}>
                        <Text style={styles.title}>{item.billCode} {item.statusName}</Text>
                        {
                            item.statusName == '待评审' ?
                                <ActionPopover
                                    textStyle={{ fontSize: 14 }}
                                    hiddenImage={true}
                                    titles={['修改', '删除']}
                                    visible={true}
                                    onChange={(title) => {
                                        if (title === '修改') {
                                            this.modifyData(item.billId);
                                        } else {
                                            this.deleteDetail(item.billId);
                                        }
                                    }}
                                />
                                : (item.statusName == '待闭单' ?
                                    <TouchableOpacity onPress={() => this.closeDetail(item.billId)}>
                                        <Text style={{ color: Macro.work_blue, paddingRight: 15 }}>闭单</Text>
                                    </TouchableOpacity>
                                    : null)

                        }
                    </Flex>
                    <Flex style={styles.line} />
                    <Flex align={'start'} direction={'column'}>
                        <Text style={{
                            paddingLeft: 20,
                            paddingTop: 10,
                            paddingRight: 10,
                            paddingBottom: 10,
                            color: '#666',
                        }}>{item.memo}</Text>
                        <Flex justify='between'
                            style={{ width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>检查人：{item.organizeName} {item.departmentName} {item.checkUserName} {item.postName}</Text>
                            <Text>{item.billDate}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>

        );
    };

    statusChange = (title) => {
        let billStatus;
        switch (title) {
            case '待评审': {
                billStatus = 0;
                break;
            }
            case '待闭单': {
                billStatus = 1;
                break;
            }
            case '已闭单': {
                billStatus = 2;
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
        const { data, refreshing, total, roles, checkRole, checkRoleId } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollTitle onChange={this.billType} titles={['我的', '全部']} />
                {/*<Tabs tabs={tabs2} initialPage={1} tabBarPosition="top">*/}
                {/*    {renderContent}*/}
                {/*</Tabs>*/}
                <Flex justify={'between'} style={{ paddingLeft: 15, marginTop: 15, paddingRight: 15, height: 30 }}>
                    <MyPopover onChange={this.statusChange}
                        titles={['全部', '待评审', '待闭单', '已闭单']}
                        visible={true} />
                    <MyPopover onChange={this.timeChange}
                        //titles={ym} 
                        titles={['全部', '今日', '本周', '本月', '上月', '本年']}
                        visible={true} />
                </Flex>

                <FlatList
                    data={data}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.billId}
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

                <Flex justify={'center'}>
                    <Button
                        onPress={() =>
                            this.props.navigation.push('checkModify', {
                                data: {
                                    checkRole: checkRole,
                                    checkRoleId: checkRoleId
                                }
                            })
                        }
                        type={'primary'}
                        activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                            width: 220,
                            marginTop: 10,
                            marginBottom: 10,
                            backgroundColor: Macro.work_blue,
                            height: 40
                        }}>开始检查</Button>
                </Flex>

                {this.state.showAdd && (
                    <View style={styles.mengceng}>
                        <Flex direction={'column'} justify={'center'} align={'center'}
                            style={{ flex: 1, padding: 25, backgroundColor: 'rgba(178,178,178,0.5)' }}>
                            <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                <CommonView style={{ height: 50, width: 220 }}>
                                    <Flex style={[styles.every]} justify='between'>
                                        <Text style={styles.left}>检查组：</Text>
                                        <MyPopoverRole
                                            onChange={(item) => {
                                                this.setState({ checkRole: item.name, checkRoleId: item.id });
                                            }}
                                            data={roles}
                                            visible={true} />
                                    </Flex>
                                </CommonView>

                                <Flex style={{ marginTop: 10 }}>
                                    <Button
                                        type={'primary'}
                                        onPress={() => {
                                            if (this.state.checkRole == '') {
                                                return;
                                            }
                                            this.setState({ showAdd: false });
                                            this.loadData();
                                        }}
                                        activeStyle={{ backgroundColor: Macro.work_blue }}
                                        style={{
                                            width: 110,
                                            backgroundColor: Macro.work_blue,
                                            height: 35
                                        }}>确认</Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </View>
                )}

            </CommonView>
        );
    }
}

const styles = StyleSheet.create({

    // container: {
    //     alignItems: 'center',
    //     justifyContent: 'center'
    // },

    every: {
        //fontSize: 16,
        color: '#666',
        marginLeft: 7,
        marginRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    left: {
        fontSize: 16,
        color: '#666'
    },
    mengceng: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },

    list: {
        backgroundColor: Macro.color_white,
        //margin: 10
        marginTop: 10, marginLeft: 10, marginRight: 10
    },
    title: {
        paddingTop: 15,
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20
    },
    title2: {
        paddingTop: 15,
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
        borderLeftWidth: 5,
    },
    orange: {
        borderLeftColor: Macro.work_orange,
        borderLeftWidth: 5,
    },
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding || {}
    };
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveSelectDrawerType: (item) => {
            dispatch(saveSelectDrawerType(item));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EstateCheckPage);
