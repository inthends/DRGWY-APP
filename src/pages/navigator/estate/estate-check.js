import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList
} from 'react-native';
import { Flex, Icon, Button } from '@ant-design/react-native';
import BasePage from '../../base/base';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
//import common from '../../../utils/common';
import ScrollTitle from '../../../components/scroll-title';
import MyPopover from '../../../components/my-popover';
import NavigatorService from '../navigator-service';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import { DrawerType } from '../../../utils/store/action-types/action-types';
import { saveSelectDrawerType } from '../../../utils/store/actions/actions';
import MyPopoverRight from '../../../components/my-popover-right';
import WorkService from '../../work/work-service';

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
            roles: [],
            showAdd: true,//默认弹出选择检查组界面
            selectBuilding: {},//默认为空，防止别地方选择了机构
            pageIndex: 1,
            dataInfo: {
                data: [],
            },
            refreshing: false,
            //ym: common.getYM('2020-01'),
            billType: '我的',
            billStatus: -1,
            //time: common.getCurrentYearAndMonth(),
            time: '全部',
            selectBuilding: this.props.selectBuilding,
            checkRole: '',//检查的角色
            checkRoleId: ''
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
                this.props.saveSelectDrawerType(DrawerType.department);
                this.onRefresh();
            }
        );

        this.viewDidDisappear = this.props.navigation.addListener(
            'didBlur',
            (obj) => {
                this.props.saveSelectDrawerType(DrawerType.building);
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
        const { billStatus, selectBuilding, billType, time } = this.state;
        let organizeId;
        if (selectBuilding) {
            //treeType = selectBuilding.type;
            organizeId = selectBuilding.key;
        }
        // let startTime = common.getMonthFirstDay(time);
        // let endTime = common.getMonthLastDay(time);
        NavigatorService.checkList(
            this.state.pageIndex,
            billStatus,
            billType,
            organizeId,
            time).then(dataInfo => {
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
                    //canLoadMore: true,
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
                // canLoadMore: false,
            }, () => {
                this.getList();
            });
        }
    };

    _renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.navigation.push('checkDetail', { id: item.billId });
            }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, index % 2 == 0 ? styles.blue : styles.orange]}>
                    <Flex justify='between' style={{ width: '100%' }}>
                        <Text style={styles.title}>{item.billCode}</Text>
                        <Text style={styles.title2}>{item.statusName}</Text>
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
            this.onRefresh();
        });

    };
    timeChange = (time) => {
        this.setState({
            time,
            pageIndex: 1,
        }, () => {
            this.onRefresh();
        });
    };
    billType = (billType) => {
        this.setState({
            billType,
            pageIndex: 1,
        }, () => {
            this.onRefresh();
        });
    };

    render() {
        const { dataInfo, roles, checkRole, checkRoleId } = this.state;
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
                    data={dataInfo.data}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.billId}
                    //必须
                    onEndReachedThreshold={0.1}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}//下拉刷新
                    onEndReached={this.loadMore}//底部往下拉翻页
                    onMomentumScrollBegin={() => this.canLoadMore = true}
                    ListEmptyComponent={<NoDataView />}
                />
                <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {dataInfo.data.length}, 共 {dataInfo.total} 条</Text>

                <Flex justify={'center'}>
                    <Button
                        onPress={() =>
                            this.props.navigation.push('checkAdd', {
                                data: {
                                    checkRole: checkRole,
                                    checkRoleId: checkRoleId
                                }
                            })
                        }
                        type={'primary'}
                        activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                            width: 220,
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
                                        <MyPopoverRight
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
                                            //alert('this.state.checkRole:'+ this.state.checkRole); 
                                            if (this.state.checkRole == '') {
                                                return;
                                            }

                                            this.setState({ showAdd: false });
                                            this.onRefresh();
                                        }}
                                        activeStyle={{ backgroundColor: Macro.work_blue }}
                                        style={{
                                            width: 130,
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
        selectBuilding: buildingReducer.selectBuilding
    };
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveSelectDrawerType: (item) => {
            dispatch(saveSelectDrawerType(item));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EstateCheckPage);
