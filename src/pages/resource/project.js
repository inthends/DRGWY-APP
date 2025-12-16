import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  NativeModules,
  Alert,
  Keyboard
} from 'react-native';
import { SearchBar } from '@ant-design/react-native';
import BasePage from '../base/base';
import Header from '../../components/project/header';
import Item from '../../components/project/item';
import UnitItem from '../../components/project/unit-item';
import Macro from '../../utils/macro';
import Service from './resource-service';
import { connect } from 'react-redux';
import NoDataView from '../../components/no-data-view';
import CommonView from '../../components/CommonView';
import { saveUser, saveXunJian } from '../../utils/store/actions/actions';
import {
  upgrade,
  addDownListener
} from 'rn-app-upgrade';
import UDToast from '../../utils/UDToast';
import common from '../../utils/common';
import api from '../../utils/api';
import { saveSelectBuilding, saveSelectDrawerType } from '../../utils/store/actions/actions';
import { DrawerType } from '../../utils/store/action-types/action-types';

class ProjectPage extends BasePage {
  constructor(props) {
    super(props);
    this.selectBuilding = {
      key: null
    };
    this.state = {
      statistics: {},


      pageIndex: 1,
      pageSize: 10,
      data: [],
      refreshing: false,//刷新
      loading: false,//加载完成 
      hasMore: true,//更多



      btnText: '搜索',
      keyword: '',
      pageIndex2: 1,
      pageSize2: 10,
      refreshing2: false,//刷新
      loading2: false,//加载完成 
      hasMore2: true,//更多
      data2: []//搜索结果
    };

    addDownListener((progress) => {
      if (100 - progress <= 0.0001) {
        UDToast.hiddenLoading(this.downloading);
        return;
      }
      this.downloading = UDToast.showLoading('正在下载，已完成：' + progress + '%');
    });
  }

  componentDidMount() {
    //安卓更新
    if (common.isAndroid() === true) {
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
                      //onPress: () => this.initUI(),
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
    //用户信息
    Service.getUserInfo().then((res) => {
      this.props.saveUser(res);
    });
    this.loadTotal();
    this.loadData();
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

  loadTotal = () => {
    Service.getStatisticsTotal(this.selectBuilding.key).then((res) => {
      if (res && res.length > 0) {
        this.setState({ statistics: res[0] });
      }
    });
  };

  //加载数据
  loadData = (isReload = false) => {//是否重新加载
    //加载中，且不是刷新，没有更多
    if (this.state.loading || (!isReload && !this.state.hasMore)) {
      this.setState({ loading: false, refreshing: false });
      return;
    }
    const currentPage = isReload ? 1 : this.state.pageIndex;
    this.setState({ loading: true });
    const { data, pageSize } = this.state;
    Service.getStatistics(
      currentPage,
      pageSize,
      this.selectBuilding.key
    ).then(res => {
      if (isReload) {
        this.setState({
          data: res.data,
          pageIndex: 2
        });
      }
      else {
        const combinedUniqueArray = [...data, ...res.data].reduce((acc, current) => {
          if (!acc.some(item => item.id === current.id)) {
            acc.push(current);
          }
          return acc;
        }, []);

        this.setState({
          data: combinedUniqueArray,
          pageIndex: currentPage,
          hasMore: currentPage * pageSize < res.total ? true : false
        });
      }
    }).catch(err => UDToast.showError(err)
    ).finally(() => this.setState({ loading: false, refreshing: false }))
  };

  //打开机构
  // openDrawer = (type) => { 
  //   this.drawer && this.drawer.openDrawer(type);
  // };

  onRefresh = () => {
    this.setState(
      {
        refreshing: true
        //pageIndex: 1
      },
      () => {
        this.loadData(true);
      }
    );
    this.loadTotal();
  };

  //加载更多
  loadMore = () => {
    if (this.state.loading) return;//防止快速滚动，产生抖动，多次调用
    const { pageIndex } = this.state;
    this.setState({
      pageIndex: pageIndex + 1
    }, () => {
      this.loadData();
    });
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
      this.onRefresh();//刷新
    }
  }



  search = () => {
    const { keyword } = this.state;
    if (keyword == '') {
      return;
    }
    Keyboard.dismiss();
    this.searchData(true);
    this.setState({ btnText: '取消' });//直接搜索房产 

  };

  clear = () => {
    const { btnText, keyword } = this.state;
    if (keyword == '') {
      return;
    }
    Keyboard.dismiss();
    if (btnText == '搜索') {
      this.searchData(true);
      this.setState({ btnText: '取消' });
    } else {
      this.setState({
        keyword: '',//必须要设置值，再调用方法，否则数据没有更新
        data2: []
      }, () => { 
        this.setState({ btnText: '搜索' });
      });
    }
  };

  onSearchRefresh = () => {
    this.setState(
      {
        refreshing2: true
      },
      () => {
        this.searchData(true);
      }
    );
  };

  //加载更多
  loadSearchMore = () => {
    if (this.state.loading2) return;//防止快速滚动，产生抖动，多次调用
    const { pageIndex2 } = this.state;
    this.setState({
      pageIndex2: pageIndex2 + 1
    }, () => {
      this.searchData();
    });
  };

  //搜索房产
  searchData = (isReload = false) => {
    //加载中，且不是刷新，没有更多
    if (this.state.loading2 || (!isReload && !this.state.hasMore2)) {
      this.setState({ loading2: false, refreshing2: false });
      return;
    }
    const currentPage = isReload ? 1 : this.state.pageIndex2;
    this.setState({ loading2: true });
    const { data2, pageSize2, keyword } = this.state;
    Service.searchUnit(
      keyword,
      currentPage,
      pageSize2,
      this.selectBuilding.key
    ).then(res => {
      if (isReload) {
        this.setState({
          data2: res.data,
          pageIndex2: 2
        });
      }
      else {
        const combinedUniqueArray = [...data2, ...res.data].reduce((acc, current) => {
          if (!acc.some(item => item.id === current.id)) {
            acc.push(current);
          }
          return acc;
        }, []);

        this.setState({
          data2: combinedUniqueArray,
          pageIndex2: currentPage,
          hasMore2: currentPage * pageSize2 < res.total ? true : false
        });
      }
    }).catch(err => UDToast.showError(err))
      .finally(() => this.setState({ loading2: false, refreshing2: false }))
  };


  render() {
    const { statistics, data, refreshing, btnText, data2, refreshing2 } = this.state;
    return (
      <View style={styles.all}>
        <CommonView style={{ flex: 1 }}>
          <View style={styles.content}>
            <Header
              title={this.selectBuilding.title}
              statistics={statistics}
              //openDrawer={this.openDrawer}
              {...this.props}
            />

            <SearchBar
              placeholder="搜索房号"
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
            />

            {data2.length == 0 ?
              <FlatList
                data={data}
                //ListHeaderComponent={}
                renderItem={({ item }) => (
                  <Item
                    nextRouteName="Buildings"
                    {...this.props}
                    item={item}
                  />
                )}
                style={styles.list}
                keyExtractor={(item) => item.id}
                //必须
                onEndReachedThreshold={0.2}
                refreshing={refreshing}
                onRefresh={this.onRefresh}//下拉刷新
                onEndReached={this.loadMore}//底部往下拉翻页
                //onMomentumScrollBegin={() => this.canLoadMore = true}
                //ListFooterComponent={this.renderFooter}
                ListEmptyComponent={<NoDataView />}
              /> :
              <FlatList
                data={data2}
                renderItem={({ item }) => (
                  <UnitItem
                    {...this.props}
                    item={item}
                  />
                )}
                style={styles.list}
                keyExtractor={(item) => item.id}
                //必须
                onEndReachedThreshold={0.2}
                refreshing={refreshing2}
                onRefresh={this.onSearchRefresh}//下拉刷新
                onEndReached={this.loadSearchMore}//底部往下拉翻页 
                ListEmptyComponent={<NoDataView />}
              />
            }
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
