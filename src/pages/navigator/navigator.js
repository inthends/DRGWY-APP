//统计
import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

import BasePage from '../base/base';
import { Flex } from '@ant-design/react-native';
import LoadImage from '../../components/load-image';
import CommonView from '../../components/CommonView';
import ScreenUtil from '../../utils/screen-util';
import Macro from '../../utils/macro';
import MyPopover from '../../components/my-popover';
import NavigatorService from './navigator-service';

export default class NavigatorPage extends BasePage {

  static navigationOptions = ({ navigation }) => {
    return {
      title: '统计',
      headerForceInset: this.headerForceInset,
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center'
      }
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      showLoading: true,
      refreshing: false,
      serverdata: {},
      workdata: {},
      servertime: '全部',
      worktime: '全部'
    };
  }

  servertimeChange = (servertime) => {
    this.setState({
      servertime
    }, () => {
      NavigatorService.serverStatistics(this.state.servertime, this.state.showLoading).
      then(serverdata => {
        this.setState({
          serverdata,
          showLoading: false
        });
      });
    });
  };


  worktimeChange = (worktime) => {
    this.setState({
      worktime
    }, () => {
      NavigatorService.workStatistics(this.state.worktime, this.state.showLoading).
      then(workdata => {
        this.setState({
          workdata,
          showLoading: false
        });
      });
    });
  };

  componentDidMount() {
    this.viewDidAppear = this.props.navigation.addListener(
      'didFocus',
      (obj) => {
        //刷新
        NavigatorService.serverStatistics(this.state.servertime, this.state.showLoading).
          then(serverdata => {
            this.setState({
              serverdata,
              showLoading: false
            });
          });

        NavigatorService.workStatistics(this.state.worktime, this.state.showLoading).
          then(workdata => {
            this.setState({
              workdata,
              showLoading: false
            });
          });
      }
    );
  }

  componentWillUnmount() {
    this.viewDidAppear.remove();
  }

  render() { 
    const { serverdata, workdata } = this.state;
    return (
      <CommonView style={{ flex: 1 }}>
        <ScrollView
        //style={{ flex: 1 }}
        >
          <Flex direction={'column'} align={'start'} style={styles.cell}>
            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
              <Text style={styles.title}>服务单</Text>
              <MyPopover onChange={this.servertimeChange}
                titles={['全部', '今日', '本周', '本月', '上月', '本年']}
                visible={true} />
            </Flex>
            <Flex>
              <TouchableWithoutFeedback onPress={() => {
                if (serverdata.totalserver == 0) {
                  return;
                }
                this.props.navigation.push('fuwulist', {
                  'data': {
                    type: 'all',
                    title: '服务单列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top1}>{serverdata.totalserver}</Text>
                  <Text style={styles.bottom}>总数</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => {
                if (serverdata.unfinishserver == 0) {
                  return;
                }
                this.props.navigation.push('fuwulist', {
                  'data': {
                    type: 'unfinish',
                    title: '待闭单列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top1}>{serverdata.unfinishserver}</Text>
                  <Text style={styles.bottom}>待闭单</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => {
                if (serverdata.finishserver == 0) {
                  return;
                }
                this.props.navigation.push('fuwulist', {
                  'data': {
                    type: 'finish',
                    title: '已闭单列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top1}>{serverdata.finishserver}</Text>
                  <Text style={styles.bottom}>已闭单</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <Flex direction='column' style={{ width: '25%' }}>
                <Text style={styles.toppercent}>{serverdata.finishpercent}</Text>
                <Text style={styles.bottom}>闭单率</Text>
              </Flex>
            </Flex>
            <Flex>
              <TouchableWithoutFeedback onPress={() => {
                if (serverdata.visitserver == 0) {
                  return;
                }
                this.props.navigation.push('fuwulist', {
                  'data': {
                    type: 'visit',
                    title: '已回访列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top}>{serverdata.visitserver}</Text>
                  <Text style={styles.bottom}>已回访</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => {
                if (serverdata.visitunsatisfied == 0) {
                  return;
                }
                this.props.navigation.push('fuwulist', {
                  'data': {
                    type: 'unsatisfied',
                    title: '不满意列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top}>{serverdata.visitunsatisfied}</Text>
                  <Text style={styles.bottom}>不满意</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => {
                if (serverdata.visitsatisfied == 0) {
                  return;
                }
                this.props.navigation.push('fuwulist', {
                  'data': {
                    type: 'satisfied',
                    title: '满意列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top}>{serverdata.visitsatisfied}</Text>
                  <Text style={styles.bottom}>满意</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <Flex direction='column' style={{ width: '25%' }}>
                <Text style={styles.toppercent}>{serverdata.visitpercent}</Text>
                <Text style={styles.bottom}>满意率</Text>
              </Flex>
            </Flex>
          </Flex>

          <Flex direction={'column'} align={'start'} style={styles.cell}> 
            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
              <Text style={styles.title}>工单</Text>
              <MyPopover onChange={this.worktimeChange}
                titles={['全部', '今日', '本周', '本月', '上月', '本年']}
                visible={true} />
            </Flex> 
            <Flex>
              <TouchableWithoutFeedback onPress={() => {
                if (workdata.totalwork == 0) {
                  return;
                }
                this.props.navigation.push('weixiulist', {
                  'data': {
                    type: 'all',
                    //hiddenHeader: false,
                    title: '工单列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top1}>{workdata.totalwork}</Text>
                  <Text style={styles.bottom}>总数</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => {
                if (workdata.unfinishwork == 0) {
                  return;
                }
                this.props.navigation.push('weixiulist', {
                  'data': {
                    type: 'unfinish', 
                    title: '待完成列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top1}>{workdata.unfinishwork}</Text>
                  <Text style={styles.bottom}>待完成</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => {
                if (workdata.finishwork == 0) {
                  return;
                }
                this.props.navigation.push('weixiulist', {
                  'data': {
                    type: 'finish',
                    title: '已完成列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top1}>{workdata.finishwork}</Text>
                  <Text style={styles.bottom}>已完成</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <Flex direction='column' style={{ width: '25%' }}>
                <Text style={styles.toppercent}>{workdata.finishworkpercent}</Text>
                <Text style={styles.bottom}>完成率</Text>
              </Flex>
            </Flex>
            <Flex>
              <TouchableWithoutFeedback onPress={() => {
                if (workdata.checkwork == 0) {
                  return;
                }
                this.props.navigation.push('weixiulist', {
                  'data': {
                    type: 'check', 
                    title: '已检验列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top}>{workdata.checkwork}</Text>
                  <Text style={styles.bottom}>已检验</Text>
                </Flex>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={() => {
                if (workdata.unqualifiedwork == 0) {
                  return;
                }
                this.props.navigation.push('weixiulist', {
                  'data': {
                    type: 'unqualified',
                    title: '不合格列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top}>{workdata.unqualifiedwork}</Text>
                  <Text style={styles.bottom}>不合格</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => {
                if (workdata.qualifiedwork == 0) {
                  return;
                }
                this.props.navigation.push('weixiulist', {
                  'data': {
                    type: 'qualified',
                    title: '合格列表'
                  }
                })
              }}>
                <Flex direction='column' style={{ width: '25%' }}>
                  <Text style={styles.top}>{workdata.qualifiedwork}</Text>
                  <Text style={styles.bottom}>合格</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <Flex direction='column' style={{ width: '25%' }}>
                <Text style={styles.toppercent}>{workdata.qualifiedpercent}</Text>
                <Text style={styles.bottom}>合格率</Text>
              </Flex>
            </Flex>
            {/* <Flex style={styles.line} /> */}
          </Flex>

          <Flex direction={'column'} align={'start'} style={styles.cellBotton}>
            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
              <Text style={styles.title2}>分析报表</Text>
            </Flex>
            <Flex justify={'between'} style={styles.cellContnent}>
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.push('collection')}
              >
                <Flex style={styles.left}>
                  <LoadImage
                    style={{ width: 22, height: 22 }}
                    defaultImg={require('../../static/images/navigator/shoujiaolv.png')}
                  />
                  <Text style={styles.content}>收缴率</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.push('zijinliu')}
              >
                <Flex style={styles.right}>
                  <LoadImage
                    style={{ width: 20, height: 22 }}
                    defaultImg={require('../../static/images/navigator/zijinliu.png')}
                  />
                  <Text style={styles.content}>资金流</Text>
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>
            <Flex justify={'between'} style={styles.cellContnent}>
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.push('qianfei')}
              >
                <Flex style={styles.left}>
                  <LoadImage
                    style={{ width: 20, height: 22 }}
                    defaultImg={require('../../static/images/navigator/zlfx.png')}
                  />
                  <Text style={styles.content}>账龄分析</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.push('weixiu_s')}
              >
                <Flex style={styles.right}>
                  <LoadImage
                    style={{ width: 20, height: 20 }}
                    defaultImg={require('../../static/images/navigator/wanchenglv.png')}
                  />
                  <Text style={styles.content}>维修完成率</Text>
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>

            <Flex justify={'between'} style={styles.cellContnent}>
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.push('tousu_s')}
              >
                <Flex style={styles.left}>
                  <LoadImage
                    style={{ width: 20, height: 22 }}
                    defaultImg={require('../../static/images/navigator/tousu.png')}
                  />
                  <Text style={styles.content}>投诉完成率</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.push('huifang_s')}>
                <Flex style={styles.right}>
                  <LoadImage
                    style={{ width: 20, height: 22 }}
                    defaultImg={require('../../static/images/navigator/huifang.png')}
                  />
                  <Text style={styles.content}>回访满意</Text>
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>
          </Flex>

          {/*废弃
          <Flex direction={'column'} align={'start'} style={styles.cell}>
            <Flex
              style={{
                paddingTop: 3,
                paddingBottom: 3
              }}>
              <Text style={styles.title}>物业查询</Text>
            </Flex>  
             <Flex justify={'between'} style={styles.cellContnent}>
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('louPan')}
              >
                <Flex style={styles.left}>
                <Icon
                    name="home"
                    size={20}
                    color={Macro.work_blue}
                  />
                  <Text style={styles.content}>房产资料</Text>
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>

            <Flex justify={'between'} style={styles.cellContnent}>
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.push('shebeiList')}
              >
                <Flex style={styles.left}>
                  <Icon
                    name="desktop"
                    size={24}
                    color={Macro.work_blue}
                  />
                  <Text style={styles.content}>设备资料</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.push('assets')}
              >
                <Flex style={styles.right}>
                  <Icon
                    name="laptop"
                    size={24}
                    color={Macro.work_green}
                  />
                  <Text style={styles.content}>固定资产</Text>
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>
            <Flex style={styles.line} />
          </Flex> */}

        </ScrollView>
      </CommonView>
    );
  }
}

const styles = StyleSheet.create({

  every: {
    width: '100%'
  },

  top1: {
    paddingTop: 15,
    paddingBottom: 5,
    color: Macro.work_blue,
    fontSize: 16
  },

  toppercent: {
    paddingTop: 15,
    color: Macro.work_green,
    fontSize: 16
  },

  top: {
    paddingTop: 10,
    paddingBottom: 5,
    color: Macro.work_blue,
    fontSize: 16
  },

  bottom: {
    color: '#404145',
    fontSize: 16,
    //paddingBottom: 10
  },
  cell: {
    marginTop: 10,
    marginLeft: 15,
    //add new 
    marginRight: 15
  },
  cellBotton: {
    marginTop: 15,
    marginLeft: 15,
    //add new 
    marginRight: 15,
    marginBottom: 20
  }, 
  title: {
    color: '#000000',
    fontSize: 16,
    paddingLeft: 6
  },

  title2: {
    color: '#000000',
    fontSize: 16,
    paddingLeft: 6,
    paddingBottom: 10
  },

  cellContnent: {
    marginLeft: 30,
    marginRight: 30
  },
  content: {
    color: '#404145',
    fontSize: 16,
    paddingLeft: 15
  },
  left: {
    flex: 1,
    paddingTop: 30
  },
  right: {
    flex: 1,
    paddingLeft: 25,
    paddingTop: 30
  },
  // line: {
  //   marginTop: 20,
  //   marginBottom: 10,
  //   marginRight: 15,
  //   width: ScreenUtil.deviceWidth() - 30,
  //   backgroundColor: '#E0E0E0',
  //   height: 0.5
  // }
});
