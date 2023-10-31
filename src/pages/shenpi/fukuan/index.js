//导航里面点击的服务单详情
import React from 'react';
import { Flex, Icon, Modal, Button, TextareaItem } from '@ant-design/react-native';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import BasePage from '../../base/base';
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowText from '../components/show-text';
import ShowTextWithRight from '../components/show-text-with-right';
import ShowRecord from '../components/show-record';
import common from '../../../utils/common';
import ShowActions from '../components/show-actions';
import service from '../service';
import ShowMingXi from '../components/show-mingxi';
import UDToast from '../../../utils/UDToast';
import ShowReviews from '../components/show-reviews';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    var isCompleted = navigation.getParam('isCompleted');
    return {
      title: isCompleted ? '付款单详情' : '付款单审批',
      headerForceInset: this.headerForceInset,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" style={{ width: 30, marginLeft: 15 }} />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    const id = common.getValueFromProps(props );
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
    const { detail = {}, records = [], reviews = [] } = this.state;
    const { list = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="付款单号" title={detail.billCode} />
            <ShowText word="付款对象" title={detail.customerName} />
            <ShowText word="相关房产" title={detail.allName} />
            <ShowTextWithRight
              word="经办人"
              title={detail.createUserName}
              right={detail.billDate}
            />
            <ShowText word="付款金额" title={detail.payAmount} />
            <ShowText word="付款说明" title={(detail.memo || '').trim()} />
          </Flex>
          <ShowMingXi list={list} open={true} />
          <ShowReviews reviews={reviews}
            onClick={(id) => this.setState({
              replyVisible: true,
              memo: '',
              messageId: id
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
                  <TextareaItem
                    style={{
                      width: ScreenUtil.deviceWidth() - 150
                    }}
                    placeholder={'请输入'}
                    rows={6}
                    onChange={memo => this.setState({ memo })}
                    value={this.state.memo}
                  />
                  <Button
                    style={{
                      width: '100%',
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
      </CommonView>
    );
  }
}

const styles = StyleSheet.create({
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
