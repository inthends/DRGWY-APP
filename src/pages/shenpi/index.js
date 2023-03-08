import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Flex, Icon } from '@ant-design/react-native';
import { connect } from 'react-redux';
import ScreenUtil from '../../utils/screen-util';
import Macro from '../../utils/macro';
import BasePage from '../base/base';
import Service from './service';
import NoDataView from '../../components/no-data-view';
import { saveSelectDrawerType } from '../../utils/store/actions/actions';
import { DrawerType } from '../../utils/store/action-types/action-types';

class ContactDetail extends BasePage {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '审批',
      headerRight: (
        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
          <Icon name="bars" style={{ marginRight: 15 }} color="black" />
        </TouchableWithoutFeedback>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isCompleted: false,
      activeSections: [],
      selectTask: this.props.selectTask || {},
      refreshing: false,
      dataInfo: {},
      pageIndex: 1,
    };
    this.onChange = (activeSections) => {
      this.setState({ activeSections });
    };
  }

  componentDidMount() {
    this.onRefresh();
    this.viewDidAppear = this.props.navigation.addListener(
      'didFocus',
      (obj) => {
        this.props.saveSelectDrawerType(DrawerType.task);
      },
    );
    this.viewDidDisappear = this.props.navigation.addListener(
      'didBlur',
      (obj) => {
        this.props.saveSelectDrawerType(DrawerType.building);
      },
    );
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const selectTask = this.state.selectTask;
    const nextSelectTask = nextProps.selectTask;
    if (
      !(selectTask && nextSelectTask && selectTask.key === nextSelectTask.key)
    ) {
      this.setState(
        {
          selectTask: nextSelectTask,
        },
        () => {
          this.onRefresh();
        },
      );
    }
  }

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
        pageIndex: 1,
      },
      () => {
        this.getList();
      },
    );
  };

  getList = () => {
    const { selectTask = {} } = this.props;
    Service.getFlowTask({
      isCompleted: this.state.isCompleted,
      pagination: this.state.pageIndex,
      code: selectTask.value || '',
      pageSize: 10,
    }).then((dataInfo) => {
      if (dataInfo.pageIndex > 1) {
        const { data: oldData = [] } = this.state.dataInfo || {};
        const { data = [] } = dataInfo || {};
        dataInfo = {
          ...dataInfo,
          data: [...oldData, ...data],
        };
      }
      this.setState({
        dataInfo,
        refreshing: false,
      });
    });
  };
  loadMore = () => {
    const { data, total, pageIndex } = this.state.dataInfo;

    //console.log('loadmore', this.canAction);
    if (!this.canAction && data.length < total) {
      // if (data.length < total) {
      this.canAction = true;
      this.setState(
        {
          refreshing: true,
          pageIndex: pageIndex + 1,
        },
        () => {
          this.getList();
        },
      );
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

  render() {
    const { isCompleted, dataInfo = {}, type } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Flex
          style={[
            {
              paddingTop: 30,
              width: ScreenUtil.deviceWidth() - 30,
              marginLeft: 15,
            },
            ScreenUtil.borderBottom(),
          ]}
          justify="around"
        >
          <TouchableWithoutFeedback
            onPress={() =>
              this.setState(
                {
                  isCompleted: false,
                },
                () => {
                  this.onRefresh();
                },
              )
            }
          >
            <Flex direction="column">
              <Icon
                name="database"
                size={30}
                color={isCompleted ? '#333' : Macro.work_blue}
              />
              <Text
                style={[
                  styles.bottom,
                  { color: isCompleted ? '#333' : Macro.work_blue },
                ]}
              >
                待办任务
              </Text>
            </Flex>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() =>
              this.setState(
                {
                  isCompleted: true,
                },
                () => {
                  this.onRefresh();
                },
              )
            }
          >
            <Flex direction="column">
              <Icon
                name="file-zip"
                size={30}
                color={isCompleted ? Macro.work_blue : '#333'}
              />
              <Text
                style={[
                  styles.bottom,
                  { color: isCompleted ? Macro.work_blue : '#333' },
                ]}
              >
                已办任务
              </Text>
            </Flex>
          </TouchableWithoutFeedback>
        </Flex>
        <FlatList
          data={dataInfo.data || []}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                let url = '';

                switch (item.code) {
                  case '1026': {
                    url = 'fukuan';
                    break;
                  }
                  case '1025': {
                    url = 'jianmian';
                    break;
                  }
                  case '1006': {
                    url = 'songshen';
                    break;
                  }
                  case '1002':
                  case '1005': {
                    url = 'chuzunew';
                    break;
                  }

                  case '1004': {
                    url = 'chuzuchange';
                    break;
                  }

                  case '1003': {
                    url = 'chuzutui';
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
                  case '1020': {
                    url = 'zulinplan';
                    break;
                  }
                  case '1011': {
                    url = 'caigou';
                    break;
                  }
                  case '1027': {
                    url = 'baoxiao';
                    break;
                  }
                }
                this.props.navigation.push(url, {
                  data: item,
                  refresh: this.onRefresh,
                });
              }}
            >
              <View
                style={[
                  ScreenUtil.border(),
                  { marginHorizontal: 15, marginTop: 15 },
                ]}
              >
                <Flex
                  style={[styles.every, ScreenUtil.borderBottom()]}
                  justify="between"
                >
                  <Text style={styles.left}>{item.flowName}</Text>
                  {item.note && (
                    <Text style={[styles.right, styles.special]}>
                      {item.note}
                    </Text>
                  )}
                </Flex>
                <Flex
                  style={[styles.every, ScreenUtil.borderBottom()]}
                  justify="between"
                >
                  <Text style={styles.left}>{item.title}</Text>
                </Flex>
                <Flex
                  style={[styles.every, ScreenUtil.borderBottom()]}
                  justify="between"
                >
                  <Text style={styles.left}>发送人：{item.senderName}</Text>
                  <Text style={styles.left}>{item.receiveTime}</Text>
                </Flex>
              </View>
            </TouchableWithoutFeedback>
          )}
          // style={styles.list}
          keyExtractor={(item, index) => item.id}
          refreshing={this.state.refreshing}
          onRefresh={() => this.onRefresh()}
          onEndReached={() => this.loadMore()}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => (this.canAction = false)}
          ListEmptyComponent={<NoDataView />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  all: {
    backgroundColor: Macro.color_white,
  },
  content: {
    backgroundColor: Macro.color_white,
    paddingLeft: 15,
    paddingRight: 20,
  },

  every: {
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  every2: {
    marginLeft: 15,
    marginRight: 15,

    paddingBottom: 5,
  },
  left: {
    fontSize: 14,
  },
  right: {
    color: '#666',
  },
  desc: {
    padding: 15,
    paddingBottom: 40,
  },
  ii: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
    backgroundColor: '#999',
    borderRadius: 6,
    marginBottom: 20,
  },
  word: {
    color: 'white',
    fontSize: 16,
  },
  bottom: {
    color: '#333',
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  special: {
    borderRadius: 4,
    backgroundColor: 'yellow',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    overflow: 'hidden',
  },
});

const mapStateToProps = ({ buildingReducer }) => {
  return {
    selectTask: buildingReducer.selectTask || {},
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveSelectDrawerType: (item) => {
      dispatch(saveSelectDrawerType(item));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetail);
