
import React from 'react';
import { Flex, Icon, Modal, Button, TextareaItem } from '@ant-design/react-native';
import { Text, View, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';  
import BasePage from '../../base/base';  
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowLine from '../components/show-line';
import ShowText from '../components/show-text';
import ShowTextWithRight from '../components/show-text-with-right';
import common from '../../../utils/common';
import service from '../service';
import ShowRecord from '../components/show-record';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';
import UDToast from '../../../utils/UDToast';
import ShowReviews from '../components/show-reviews';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    var isCompleted = navigation.getParam('isCompleted');
    return {
      title: isCompleted ? '减免单详情' : '减免单审批',
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
            <ShowText word="减免单号" title={detail.billCode} />
            <ShowTextWithRight
              word="经办人"
              title={detail.createUserName}
              right={detail.billDate}
            />
            <ShowText word="折扣金额" title={detail.reductionSumAmount} />
            <ShowText word="折扣说明" title={(detail.memo || '').trim()} />
          </Flex>

          <ShowTitle title="明细" />
          <Flex style={styles.card} direction="column" align="start">
            {list.map((item, index) => (
              <View key={index}>
                <Flex>
                  <Text style={[styles.txt, styles.txt2]}>{item.allName}</Text>
                </Flex>
                <Flex justify="between" style={{ width: '100%' }}>
                  <Text style={styles.txt}>{item.feeName} </Text>
                  <Text style={styles.txt}>{item.amount} </Text>
                  <Text style={styles.txt}>{item.lastAmount}</Text>
                </Flex>
                <Text style={[styles.txt, { marginTop: -6 }]}>{item.date}</Text>
                {index < list.length - 1 && <ShowLine />}
              </View>
            ))}
          </Flex>
          <ShowFiles files={detail.files || []} onPress={
            (fileStr) => {
              this.props.navigation.navigate('webPage', {
                data: fileStr,
              });
            }
          } />
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
  },
  txt: {
    fontSize: 14,
    paddingBottom: 10,
  },
  txt2: {
    color: Macro.work_blue,
  },
});
