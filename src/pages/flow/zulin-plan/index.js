import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon, Modal, Button, TextareaItem } from '@ant-design/react-native';
import {
  ScrollView, Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Keyboard
} from 'react-native';
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowText from '../components/show-text';
import common from '../../../utils/common';
import service from '../service';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';
import ShowRecord from '../components/show-record';
import ShowMingXi2 from '../components/show-mingxi2';
import UDToast from '../../../utils/UDToast';
import AddReview from '../components/add-review';
import ShowReviews from '../components/show-reviews';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import ShowLine from '../components/show-line';

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    //是否完成
    var isCompleted = navigation.getParam('isCompleted');
    return {
      title: isCompleted ? '租赁规划详情' : '租赁规划审批',
      headerForceInset: this.headerForceInset,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" style={{ width: 30, marginLeft: 15 }} />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    let id = common.getValueFromProps(props, 'id');
    this.state = {
      id,
      detail: {},
      records: [],
      reviews: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { id } = this.state;
    service.getFlowData(id).then((detail) => {
      // const { setParams } = this.props.navigation;
      // setParams({ title: detail.statusName }); 
      this.setState({
        detail
      });
    });
    service.getApproveLog(id).then((records) => {
      this.setState({
        records
      });
    });
    //评审记录
    service.getReviews(id).then(res => {
      this.setState({
        reviews: res
      });
    });
  };

  //回复
  reply = () => {
    const { id, messageId, memo } = this.state;
    if (!memo) {
      UDToast.showError('请输入回复内容');
      return;
    }
    let params = {
      messageId: messageId,
      memo: memo,
    };
    service.saveReply(params).then(res => {
      UDToast.showInfo('回复成功');
      this.setState({ replyVisible: false, memo: '', messageId: '' });
      //刷新评审记录
      service.getReviews(id).then(res => {
        this.setState({
          reviews: res
        });
      });
    });
  };

  render() {
    const {
      item = {},//咨询信息
      detail = {},
      records = [],
      reviews = []
    } = this.state;
    const { list = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="所属项目" title={detail.organizeName} />
            <ShowLine />
            <ShowText word="规划单号" title={detail.billCode} />
            <ShowLine />
            <ShowText word="规划费项" title={detail.feeName} />
            <ShowLine />
            <ShowText word="规划期限" title={detail.billDate} />
            <ShowLine />
            <ShowText word="发起人" title={detail.createUserName} />
            <ShowLine />
            <Text>
              {detail.memo}{"\n"}
            </Text>
          </Flex>
          <ShowMingXi2 list={list} />
          <ShowFiles files={detail.files || []} onPress={
            (fileStr) => {
              this.props.navigation.navigate('webPage', {
                data: fileStr
              });
            }
          } /> 
          <ShowReviews reviews={reviews}
            onAddClick={() => this.setState({
              addVisible: true
            })}
            onReplyClick={(item) => this.setState({
              replyVisible: true,
              memo: '',
              item: item,
              messageId: item.id
            })} />

          <ShowRecord records={records} />
          <ShowActions
            state={this.state}
            click={() => {
              const refresh = common.getValueFromProps(this.props, 'refresh');
              refresh && refresh();
              this.props.navigation.goBack();
            }}
          />
        </ScrollView>

        <Modal
          //弹出回复页面
          transparent
          onClose={() => this.setState({ replyVisible: false })}
          onRequestClose={() => this.setState({ replyVisible: false })}
          maskClosable
          visible={this.state.replyVisible}>
          <Flex justify={'center'} align={'center'}>
            <View style={{ flex: 1, width: '100%' }}>
              <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
              }}>
                <Flex direction={'column'}>
                  <Flex align={'center'} style={{ width: '100%' }}>
                    <Text style={styles.txt}>
                      {item.author}
                    </Text>
                  </Flex>
                  <Flex align={'center'} style={{ width: '100%' }}>
                    <Text style={styles.txt}>
                      时间：{item.datetime}
                    </Text>
                  </Flex>
                  <Flex align={'center'} style={{ width: '100%' }}>
                    <Text style={styles.txt}>
                      内容：{item.content}
                    </Text>
                  </Flex>
                  <Flex align={'center'} style={{ width: '100%' }} >
                    <TextareaItem
                      maxLength={500}
                      style={{
                        width: ScreenUtil.deviceWidth() - 150,
                        fontSize: 14
                      }}
                      placeholder={'请输入'}
                      rows={6}
                      onChange={memo => this.setState({ memo })}
                      value={this.state.memo}
                    />
                  </Flex>
                  <Button
                    style={{
                      width: 110,
                      marginTop: 10,
                      backgroundColor: Macro.work_blue
                    }}
                    type="primary"
                    onPress={this.reply}>确定</Button>
                </Flex>
              </TouchableWithoutFeedback>
            </View>
          </Flex>
        </Modal>

        <Modal
          //弹出沟通页面
          transparent
          onClose={() => this.setState({ addVisible: false })}
          onRequestClose={() => this.setState({ addVisible: false })}
          maskClosable
          visible={this.state.addVisible}>
          <Flex justify={'center'} align={'center'}>
            <AddReview
              taskId={this.state.id}
              users={detail.users}
              onClose={() => {
                this.setState({ addVisible: false });
                //刷新评审记录
                service.getReviews(this.state.id).then(res => {
                  this.setState({
                    reviews: res
                  });
                });
              }}
            />
          </Flex>
        </Modal>
      </CommonView>
    );
  }
}

const styles = StyleSheet.create({
  txt: {
    fontSize: 14,
    paddingBottom: 10,
  },
  text: {
    fontSize: 14
  },
  word: {
    color: 'white',
    fontSize: 16,
  },
  card: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    borderColor: '#eee',
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 5,
    marginBottom: 15,
  }
});
