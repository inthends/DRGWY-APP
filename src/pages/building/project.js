import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  NativeModules,
  Alert
} from 'react-native';
import BasePage from '../base/base';
import BuildingHeader from '../../components/building/building-header';
import BuildingCell from '../../components/building/build-cell'; 
import Macro from '../../utils/macro';
import BuildingService from './building_service';
import { connect } from 'react-redux';
import NoDataView from '../../components/no-data-view';
import CommonView from '../../components/CommonView';
import { saveUser, saveXunJian } from '../../utils/store/actions/actions';
//import JPush from 'jpush-react-native';
import {
  upgrade,
  addDownListener
  //checkUpdate,
} from 'rn-app-upgrade';
import UDToast from '../../utils/UDToast';
import common from '../../utils/common';
import api from '../../utils/api';
// import XunJianService from '../navigator/xunjian/xunjian-service';
// import HomePage from '../home/home';
import { saveSelectBuilding, saveSelectDrawerType } from '../../utils/store/actions/actions';
import { DrawerType } from '../../utils/store/action-types/action-types';

class ProjectPage extends BasePage {
  constructor(props) {
    super(props);
    this.selectBuilding = {
      key: null
    };
    this.state = {
      pageIndex: 1,
      dataInfo: {
        data: []
      },
      statistics: {},
      refreshing: true
      //btnText: '搜索',
      //keyword: ''
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
    //安卓更新
    if (!common.isAndroid() === false) {
      NativeModules.LHNToast.getVersionCode(
        (version, isYse, isLKL, brandName) => {
          api.getData('/api/Mobile/GetVersion', { isYse, isLKL, brandName }, false)
            .then((res) => {
              let netVersion = common.handlerVersionString(res.appVersionName);
              let localVersion = common.handlerVersionString(version);
              if (netVersion > localVersion) {
                Alert.alert(
                  '发现有新版本',
                  '是否更新？',
                  [
                    {
                      text: '取消',
                      onPress: () => this.initUI(),
                      style: 'cancel'
                    },
                    {
                      text: '确定',
                      onPress: () => {
                        upgrade(res.versionFile);
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }
 
              // else {
              //   this.initUI();
              // }

            })
            .catch(() => {
              //this.initUI();
            });
        },
      );
    }
      // else {
      //  this.initUI();
      //废弃
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
      //}


    this.viewDidAppear = this.props.navigation.addListener(
      'didFocus',//加载当前页面时候调用一次
      (obj) => {
        this.props.saveBuilding({});//加载页面清除别的页面选中的数据
        this.props.saveSelectDrawerType(DrawerType.organize);
        this.initUI();
      }
    );

    // this.viewDidDisappear = this.props.navigation.addListener(
    //   'didBlur',//离开当前页面调用一次
    //   (obj) => {
    //     this.props.saveSelectDrawerType(DrawerType.organize);
    //   }
    // );

  }

  initUI() {
    BuildingService.getUserInfo().then((res) => {
      this.props.saveUser(res);
    });
    this.onRefresh();
    // this.viewDidAppear = this.props.navigation.addListener(
    //     'didFocus',
    //     (obj) => {
    //         if (obj.state.params) {
    //             let address = obj.state.params;
    //         }
    //     }
    // );
  }

  componentWillUnmount() {
    this.viewDidAppear.remove();
  }
 
  initData = () => {
    BuildingService.getStatisticsTotal(this.selectBuilding.key).then((res) => {
      if (res && res.length > 0) {
        this.setState({ statistics: res[0] });
      }
    });
  };

  getList = () => {
    BuildingService.getStatistics(
      this.state.pageIndex,
      this.selectBuilding.key
    ).then((dataInfo) => {
      if (dataInfo.pageIndex > 1) {
        dataInfo = {
          ...dataInfo,
          data: [...this.state.dataInfo.data, ...dataInfo.data]
        };
      }
      this.setState(
        {
          dataInfo: dataInfo,
          refreshing: false,
          pageIndex: dataInfo.pageIndex
        },
        () => { }
      );
    }).catch(err => this.setState({ refreshing: false }));
  };

  //打开机构
  // openDrawer = (type) => { 
  //   this.drawer && this.drawer.openDrawer(type);
  // };

  onRefresh = () => { 
    this.setState(
      {
        refreshing: true,
        pageIndex: 1
      },
      () => {
        this.getList();
      }
    );
     this.initData();
  };

  loadMore = () => {
    const { data, total, pageIndex } = this.state.dataInfo;
    if (this.canLoadMore && data.length < total) {
      this.canLoadMore = false;
      this.setState(
        {
          refreshing: true,
          pageIndex: pageIndex + 1
        },
        () => {
          this.getList();
        }
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      !(
        this.selectBuilding &&
        nextProps.selectBuilding &&
        this.selectBuilding.key === nextProps.selectBuilding.key
      )
    ) {
      this.selectBuilding = nextProps.selectBuilding;
      this.onRefresh();
    }
  } 

  // search = () => {
  //   Keyboard.dismiss();
  //   this.getList();
  //   this.setState({ btnText: '取消' });
  // };

  // clear = () => {
  //   const { btnText } = this.state;
  //   Keyboard.dismiss();
  //   if (btnText == '搜索') {
  //     this.getList();
  //     this.setState({ btnText: '取消' });
  //   } else {
  //     this.setState({
  //       keyword: ''//必须要设置值，再调用方法，否则数据没有更新
  //     }, () => {
  //       this.getList();
  //       this.setState({ btnText: '搜索' });
  //     });
  //   }
  // };


  render() {
    const { statistics, dataInfo } = this.state;
    return (
      <View style={styles.all}>
        <CommonView style={{ flex: 1 }}>
          <View style={styles.content}>
            <BuildingHeader
              title={this.selectBuilding.title}
              statistics={statistics}
              //openDrawer={this.openDrawer}
              {...this.props}
            /> 
            {/* <SearchBar
              placeholder="搜索房号或客户"
              showCancelButton
              cancelText={btnText}
              value={this.state.keyword}
              onChange={keyword => {
                this.setState({ keyword });
                if (keyword)
                  this.setState({ showCancelButton: true });
              }}
              onSubmit={() => this.search()}
              onCancel={() => this.clear()}
            /> */} 
            <FlatList
              data={dataInfo.data}
              //ListHeaderComponent={}
              renderItem={({ item }) => (
                <BuildingCell
                  nextRouteName="Buildings"
                  {...this.props}
                  item={item}
                />
              )}
              style={styles.list}
              keyExtractor={(item) => item.id}
              //必须
              onEndReachedThreshold={0.1}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}//下拉刷新
              onEndReached={this.loadMore}//底部往下拉翻页
              onMomentumScrollBegin={() => this.canLoadMore = true}
              ListEmptyComponent={<NoDataView />}
            />
            {/* <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {dataInfo.data.length}, 共 {dataInfo.total} 条</Text> */}
          </View>
        </CommonView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  all: {
    backgroundColor: Macro.color_sky_dark,
    flex: 1
  },
  content: {
    backgroundColor: Macro.color_white,
    flex: 1
  },
  list: {
    backgroundColor: Macro.color_white,
    flex: 1
  }
});

const mapStateToProps = ({ buildingReducer, memberReducer }) => {
  const user = memberReducer.user || {};
  return {
    selectBuilding: buildingReducer.selectBuilding || {},
    user: {
      ...user,
      id: user.userId
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveUser(user) {
      dispatch(saveUser(user));
    },
    saveXunjian(data) {
      dispatch(saveXunJian(data));
    },
    saveBuilding: (item) => {
      dispatch(saveSelectBuilding(item));
    },
    saveSelectDrawerType: (item) => {
      dispatch(saveSelectDrawerType(item));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
