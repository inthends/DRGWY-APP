import React, { Fragment } from 'react';
import { View, StyleSheet, FlatList, NativeModules, Alert, Linking } from 'react-native';
import BasePage from '../base/base';
import BuildingHeader from '../../components/building/building-header';
import BuildingCell from '../../components/building/build-cell';
import Macro from '../../utils/macro';
import BuildingService from './building_service';
import { connect } from 'react-redux';
import NoDataView from '../../components/no-data-view';
import CommonView from '../../components/CommonView';
import { saveUser,saveXunJian } from '../../utils/store/actions/actions';
import JPush from 'jpush-react-native';
import {
    upgrade,
    addDownListener,
    checkUpdate,
} from 'rn-app-upgrade';
import UDToast from '../../utils/UDToast';
import common from '../../utils/common';
import api from '../../utils/api';
import NavigatorService from '../navigator/navigator-service';
import XunJianService from '../navigator/xunjian/xunjian-service';
import HomePage from '../home/home';

class BuildingPage extends BasePage {
    // static navigationOptions = ({navigation}) => {
    //
    //     console.log(1, navigation);
    //     return {
    //         tabBarVisible: false,
    //     };
    // };

    constructor(props) {
        super(props);
        this.selectBuilding = {
            key: null,
        };
        this.state = {
            count: 0,
            showTabbar: true,
            pageIndex: 1,
            statistics: {},
            dataInfo: {
                data: [],
            },
            refreshing: true,
        };

        addDownListener((progress) => {
            if (100 - progress <= 0.0001) {
                UDToast.hiddenLoading(this.loading);
                return;
            }
            this.loading = UDToast.showLoading('正在下载，已完成：' + progress + '%');
        });

    }



    componentDidMount() {

        if (!common.isIOS()) {

            NativeModules.LHNToast.getVersionCode((version, isYse, isLKL, brandName,aa,bb) => {
                console.log(aa,bb,11)
                api.getData('/api/Mobile/GetVersion', { isYse, isLKL, brandName }, true).then(res => { 
                    let netVersion = common.handlerVersionString(res.appVersionName);
                    let localVersion = common.handlerVersionString(version);
                    // console.log(netVersion);
                    // console.log(localVersion);
                    if (netVersion > localVersion) {
                        Alert.alert(
                            '发现有新版本',
                            '是否更新？',
                            [
                                {
                                    text: '取消',
                                    onPress: () => this.initUI(),
                                    style: 'cancel',
                                },
                                {
                                    text: '确定',
                                    onPress: () => {
                                        upgrade(res.versionFile);
                                    },
                                },
                            ],
                            { cancelable: false },
                        );

                    } else {
                        this.initUI();
                    }
                }).catch(() => {
                    this.initUI();
                });

            });

        } else {
            this.initUI();
            // NativeModules.LHNToast.getVersionCode((err, version) => {
            //     checkUpdate(common.appId(), version).then(IOSUpdateInfo => {
            //         if (IOSUpdateInfo.code === 1) {
            //             Alert.alert(
            //                 '发现有新版本',
            //                 '是否更新？',
            //                 [
            //                     {
            //                         text: '取消',
            //                         onPress: () => console.log('Cancel Pressed'),
            //                         style: 'cancel',
            //                     },
            //                     {
            //                         text: '确定',
            //                         onPress: () => {
            //                             if (Linking.canOpenURL('https://itunes.apple.com/app/id' + common.appId())) {
            //                                 Linking.openURL('https://itunes.apple.com/app/id' + common.appId());
            //                             }
            //                         },
            //                     },
            //                 ],
            //                 {cancelable: false},
            //             );
            //
            //         }
            //     });
            // });

        }
    }


    initUI() {

        BuildingService.getUserInfo().then(res => {
            this.props.saveUser(res);
        });

        this.onRefresh();
        // this.viewDidAppear = this.props.navigation.addListener(
        //     'didFocus',
        //     (obj) => {
        //         if (obj.state.params) {
        //             let address = obj.state.params;
        //
        //         }
        //     },
        // );
    }

    componentWillUnmount(): void {
        // this.viewDidAppear.remove();
    }

    getInitData = () => {
        BuildingService.getStatisticsTotal(this.selectBuilding.key).then(res => {
            if (res && res.length > 0) {
                this.setState({ statistics: res[0] });
            }
        });
    };

    getList = (showLoading = true) => {
        BuildingService.getStatistics(this.state.pageIndex, this.selectBuilding.key, showLoading).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data],
                };
            }
            this.setState({
                dataInfo: dataInfo,
                refreshing: false,
                pageIndex: dataInfo.pageIndex,
            }, () => {
                //console.log(this.state.dataInfo.data);
            });
        });
    };


    openDrawer = () => {
        this.drawer && this.drawer.openDrawer();
    };
    onRefresh = () => {
        this.getInitData();
        this.setState({
            refreshing: true,
            pageIndex: 1,
        }, () => {
            this.getList();
        });
    };
    loadMore = () => {
        const { data, total, pageIndex } = this.state.dataInfo;
        //console.log('loadmore', this.canAction);
        if (!this.canAction && data.length < total) {
            // if (data.length < total) {
            this.canAction = true;
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1,
            }, () => {
                this.getList();
            });
        }
        // if (data.length < total) {
        //     this.setState({
        //         refreshing: true,
        //         pageIndex: pageIndex + 1,
        //     }, () => {
        //         this.getList();
        //     });
        // }
    };

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        //console.log(112233445566, nextProps);
        if (!(this.selectBuilding && nextProps.selectBuilding && (this.selectBuilding.key === nextProps.selectBuilding.key))) {
            this.selectBuilding = nextProps.selectBuilding;
            this.onRefresh();
        }
    }


    render() {
        const { statistics, dataInfo } = this.state;
        return (
            <View style={styles.all}>
                <CommonView style={{ flex: 1 }}>
                    <View style={styles.content}>
                        <BuildingHeader title={this.selectBuilding.title} statistics={statistics}
                            openDrawer={this.openDrawer} {...this.props} />
                        <FlatList
                            data={dataInfo.data}
                            // ListHeaderComponent={}
                            renderItem={({ item }) => <BuildingCell nextRouteName='Buildings' {...this.props} item={item} />}
                            style={styles.list}
                            keyExtractor={(item, index) => item.id}
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                            onEndReached={() => this.loadMore()}
                            onEndReachedThreshold={0.1}
                            onMomentumScrollBegin={() => this.canAction = false}
                            ListEmptyComponent={<NoDataView />}
                        />
                    </View>

                </CommonView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_sky_dark,
        flex: 1,
    },
    content: {
        backgroundColor: Macro.color_white,
        flex: 1,


    },
    list: {
        backgroundColor: Macro.color_white,
        flex: 1,
    },
});

const mapStateToProps = ({buildingReducer,memberReducer}) => {
    const user = memberReducer.user || {};

    return {
        selectBuilding: buildingReducer.selectBuilding || {},
        user: {
            ...user,
            id: user.userId,
        },
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        saveUser(user) {
            dispatch(saveUser(user));
        },
        saveXunjian(data) {
            dispatch(saveXunJian(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildingPage);
