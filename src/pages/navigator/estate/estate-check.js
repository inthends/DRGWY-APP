import React from 'react';
import {
    //View,
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
            selectBuilding: {},//默认为空，防止别地方选择了机构
            pageIndex: 1,
            dataInfo: {
                data: [],
            },
            refreshing: false,
            //ym: common.getYM('2020-01'),
            billType: '全部',
            billStatus: -1,
            //time: common.getCurrentYearAndMonth(),
            time: '全部',
            selectBuilding: this.props.selectBuilding
        };
    }

    componentDidMount() {
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
                        data: [...this.state.dataInfo.data, ...dataInfo.data],
                    };
                }
                this.setState({
                    dataInfo: dataInfo,
                    refreshing: false
                    //canLoadMore: true,
                }, () => {
                });
            }).catch(err => this.setState({ refreshing: false }));
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
        // if (!this.state.canLoadMore) {
        //     return;
        // }
        if (this.canAction && data.length < total) {
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1,
                // canLoadMore: false,
            }, () => {
                this.getList();
            });
        }
    };

    _renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.navigation.push('checkDetail', { data: item.billId });
            }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, index === 0 ? styles.blue : styles.orange]}>
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
        const { dataInfo } = this.state;
        return (
            // <View style={{ flex: 1 }}>
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
                    onEndReached={() => this.loadMore()}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => this.canAction = true}
                    onMomentumScrollEnd={() => this.canAction = false}
                    ListEmptyComponent={<NoDataView />}
                />

                {/* <TouchableWithoutFeedback onPress={() => this.props.navigation.push('checkAdd')}>
                        <Flex justify={'center'} style={[styles.ii, {
                            width: '80%',
                            marginLeft: '10%',
                            marginRight: '10%',
                            marginBottom: 20
                        }, { backgroundColor: Macro.work_blue }]}>
                            <Text style={styles.word}>开始检查</Text>
                        </Flex>
                    </TouchableWithoutFeedback> */}

                <Flex justify={'center'}>
                    <Button
                        onPress={() => this.props.navigation.push('checkAdd')}
                        type={'primary'}
                        activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                            width: 200,
                            marginBottom: 20,
                            backgroundColor: Macro.work_blue,
                            height: 40
                        }}>开始检查</Button>
                </Flex>
            </CommonView>

            // </View>
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
    ii: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
        backgroundColor: '#999',
        borderRadius: 6
    },
    word: {
        color: 'white',
        fontSize: 16
    }
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
