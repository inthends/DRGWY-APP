import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Flex, Icon } from '@ant-design/react-native';
import { connect } from 'react-redux';
import ScreenUtil from '../../utils/screen-util';
import Macro from '../../utils/macro';
import BasePage from '../base/base';
import Service from './service';
import NoDataView from '../../components/no-data-view';
import { saveSelectBuilding, saveSelectDrawerType } from '../../utils/store/actions/actions';
import { DrawerType } from '../../utils/store/action-types/action-types';
import UDToast from '../../utils/UDToast';


class ApprovePage extends BasePage {

  static navigationOptions = ({ navigation }) => {
    return {
      title: '审批',
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center'
      },
      headerForceInset: this.headerForceInset,
      headerRight: (
        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
          <Icon name="bars" style={{ marginRight: 15 }} color="black" />
        </TouchableWithoutFeedback>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      //isCompleted: false,
      taskType: 1,//页签类型
      activeSections: [],
      selectBuilding: this.props.selectBuilding || {},

      pageIndex: 1,
      pageSize: 10,
      total: 0,
      data: [],
      refreshing: false,//刷新
      loading: false,//加载完成 
      hasMore: true,//更多

      todo: 0,
      read: 0,
      done: 0
    };

    this.onChange = (activeSections) => {
      this.setState({ activeSections });
    };
  }

  componentDidMount() {
    this.viewDidAppear = this.props.navigation.addListener(
      'didFocus',
      (obj) => {
        this.props.saveBuilding({});//加载页面清除别的页面选中的数据
        this.props.saveSelectDrawerType(DrawerType.task);
        this.onRefresh();
      },
    );
  }

  componentWillUnmount() {
    this.viewDidAppear.remove();
  }

  componentWillReceiveProps(nextProps) {
    const selectBuilding = this.state.selectBuilding;
    const nextSelectTask = nextProps.selectBuilding;
    if (
      !(selectBuilding && nextSelectTask && selectBuilding.key === nextSelectTask.key)
    ) {
      this.setState(
        {
          selectBuilding: nextSelectTask
        },
        () => {
          this.onRefresh();
        }
      );
    }
  }

  onRefresh = () => {
    this.getCounts();
    this.setState(
      {
        refreshing: true,
        pageIndex: 1
      },
      () => {
        this.loadData(true);
      }
    );
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

  getCounts = () => {
    const { selectBuilding = {} } = this.props;
    Service.getCounts({
      code: selectBuilding.value || ''
    }).then((res) => {
      this.setState({ todo: res.todo, read: res.read, done: res.done });
    });
  };

  //加载数据
  loadData = (isRefreshing = false) => {
    if (this.state.loading || (!isRefreshing && !this.state.hasMore)) return;
    const currentPage = isRefreshing ? 1 : this.state.pageIndex;
    this.setState({ loading: true });
    const { taskType, pageIndex, pageSize } = this.state;
    const { selectBuilding = {} } = this.props;
    Service.getFlowTask({
      taskType: taskType,
      pageIndex: currentPage,
      pageSize: pageSize,
      code: selectBuilding.value || ''
    }).then(res => {
      if (isRefreshing) {
        this.setState({
          data: res.data,
          pageIndex: 2,
          total: res.total
        });
      }
      else {
        this.setState({
          data: [...this.state.data, ...res.data],
          pageIndex: pageIndex + 1,
          hasMore: pageIndex * pageSize < res.total ? true : false,
          total: res.total
        });
      }
    }).catch(err => UDToast.showError(err)
    ).finally(() => this.setState({ loading: false, refreshing: false }))
  };

  openUrl = (code, id) => {
    let url = '';
    switch (code) {
      case '1006': {
        url = 'songshen';//送审单
        break;
      }

      case '1025': {
        url = 'jianmian';//减免
        break;
      }

      case '1026': {
        url = 'fukuan';//付款单
        break;
      }

      case '1002':
      case '1005': {
        url = 'chuzunew';//出租合同
        break;
      }

      case '1004': {
        url = 'chuzuchange';//合同变更
        break;
      }

      case '1003': {
        url = 'chuzutui';//合同退租
        break;
      }

      //行政合同
      case '1007':
      case '1008':
      case '1009': {
        url = 'admincontract';
        break;
      }

      case '1013':
      case '1016': {
        url = 'wuyenew';
        break;
      }

      case '1014': {
        url = 'wuyetui';
        break;
      }

      case '1015': {
        url = 'wuyechange';//物业合同变更
        break;
      }

      case '1020': {
        url = 'zulinplan';//规划单审批
        break;
      }

      case '1011': {
        url = 'caigou';//采购单
        break;
      }

      case '1027': {
        url = 'baoxiao';//报销单
        break;
      }

      case '1035': {
        url = 'matter';//事项申请
        break;
      }

      case '1037': {
        url = 'task';//任务单
        break;
      }

      case '1039': {
        url = 'budgetchange';
        break;
      }

      case '1038': {
        url = 'settlement';
        break;
      }

      case '1036': {
        url = 'inquiry';
        break;
      }

      case '1033': {
        url = 'budget';
        break;
      }

      case '1032': {
        url = 'question';
        break;
      }

      case '1031': {
        url = 'goodsout';
        break;
      }

      case '1012': {
        url = 'merchants';
        break;
      }

      case '1010': {
        url = 'assistance';//协办单
        break;
      }
    }
    const { taskType } = this.state;
    //传递参数
    this.props.navigation.push(url, {
      id: id,
      isCompleted: taskType == 3 ? true : false,
      refresh: this.onRefresh
    });
  }

  renderFooter = () => {
    if (!this.state.hasMore && this.state.data.length > 0) {
      return <Text>没有更多数据了</Text>;
    }

    return this.state.loading ? <ActivityIndicator /> : null;
  };

  render() {
    const { todo, read, done, taskType, data, refreshing, total } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Flex
          style={[
            {
              width: ScreenUtil.deviceWidth() - 20,
              paddingTop: 10,
              paddingBottom: 10,
              marginLeft: 10,
              marginLeft: 10,
            },
            ScreenUtil.borderBottom()
          ]}
          justify="around"
        >
          <TouchableWithoutFeedback
            onPress={() =>
              this.setState(
                {
                  taskType: 1
                },
                () => {
                  this.onRefresh();
                }
              )
            }
          >
            <Flex direction="column">
              <Icon
                name="form"
                size={30}
                color={taskType == 1 ? Macro.work_blue : '#333'}
              />
              <Text
                style={[
                  styles.bottom,
                  { color: taskType == 1 ? Macro.work_blue : '#333' },
                ]}
              >
                待办 ({todo})
              </Text>
            </Flex>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() =>
              this.setState(
                {
                  taskType: 2
                },
                () => {
                  this.onRefresh();
                }
              )
            }
          >
            <Flex direction="column">
              <Icon
                name="eye"
                size={30}
                color={taskType == 2 ? Macro.work_blue : '#333'}
              />
              <Text
                style={[
                  styles.bottom,
                  { color: taskType == 2 ? Macro.work_blue : '#333' },
                ]}
              >
                待查阅 ({read})
              </Text>
            </Flex>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() =>
              this.setState(
                {
                  taskType: 3,
                },
                () => {
                  this.onRefresh();
                }
              )
            }
          >
            <Flex direction="column">
              <Icon
                name="check-square"
                size={30}
                color={taskType == 3 ? Macro.work_blue : '#333'}
              />
              <Text
                style={[
                  styles.bottom,
                  { color: taskType == 3 ? Macro.work_blue : '#333' },
                ]}
              >
                已办 ({done})
              </Text>
            </Flex>
          </TouchableWithoutFeedback>
        </Flex>

        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => { this.openUrl(item.code, item.id) }}
            >
              <View
                style={[
                  ScreenUtil.border(),
                  { marginHorizontal: 10, marginTop: 10 }
                ]}
              >
                <Flex
                  style={[styles.every, ScreenUtil.borderBottom()]}
                  justify="between"
                >
                  <Text style={styles.title}>{item.flowName}</Text>
                  {/* {item.note && ( */}
                  <Text style={styles.note}>
                    {item.note}
                  </Text>
                  {/* )} */}
                </Flex>
                <Flex
                  style={[styles.every, ScreenUtil.borderBottom()]}
                  justify="between"
                >
                  <Text
                    style={{
                      height: 50
                    }}
                    numberOfLines={3}
                    ellipsizeMode='tail'
                  >{item.title}</Text>
                </Flex>
                <Flex
                  //style={[styles.every, ScreenUtil.borderBottom()]}
                  style={styles.every}
                  justify="between"
                >
                  <Text style={styles.txt}>发送人：{item.senderName}</Text>
                  <Text style={styles.txt}>{item.receiveTime}</Text>
                </Flex>
              </View>
            </TouchableWithoutFeedback>
          )}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    //height: ScreenUtil.contentHeightWithNoTabbar()
    marginBottom: 10
  },

  every: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10
  },

  title: {
    color: Macro.work_blue,
    fontSize: 16
  },

  txt: {
    color: '#404145',
    fontSize: 14
  },

  note: {
    borderRadius: 4,
    //backgroundColor:'yellow',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    overflow: 'hidden',
    //add new
    color: '#404145',
    fontSize: 16
  }
});

const mapStateToProps = ({ buildingReducer }) => {
  return {
    selectBuilding: buildingReducer.selectBuilding || {}
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

export default connect(mapStateToProps, mapDispatchToProps)(ApprovePage);
