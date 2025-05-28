import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon, Modal, Button, TextareaItem } from '@ant-design/react-native';
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowLine from '../components/show-line';
import ShowText from '../components/show-text';
import CompanyDetail from '../components/company-detail';
import HeTongDetail from '../components/he-tong-detail';
import common from '../../../utils/common';
import service from '../service';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';
import ShowRecord from '../components/show-record';
import ShowMingXi from '../components/show-mingxi';
import UDToast from '../../../utils/UDToast';
import AddReview from '../components/add-review';
import ShowReviews from '../components/show-reviews';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    //是否完成
    var isCompleted = navigation.getParam('isCompleted');
    return {
      title: isCompleted ? '物业合同解约详情' : '物业合同解约审批',
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
      this.setState({
        detail
      });
    });
    service.getApproveLog(id).then((records) => {
      this.setState({
        records
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
    //评审记录
    service.getReviews(id).then(res => {
      this.setState({
        reviews: res
      });
    });
  };

  render() {
    const {
      item = {},//咨询信息
      detail = {},
      records = [],
      customer = {},
      hetong = {},
      reviews = []
    } = this.state;
    const { receiveList = [], payList = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="合同号" title={detail.no} />
            <ShowLine />
            <ShowText word="合同期限" title={detail.date} />
            <ShowLine />
            <ShowText
              word="客户名称"
              title={detail.customer}
              onClick={() => {
                service.getCustomerEntity(detail.customerId)
                  .then((customer) => {
                    this.setState(
                      {
                        customer
                      },
                      () => {
                        this.companyDetailRef.showModal();
                      }
                    );
                  });
              }}
            />
            <ShowLine />
            <ShowText word="签约面积" title={detail.signArea} />
            <ShowLine />
            <ShowText word="合同金额" title={detail.totalAmount} />
            <ShowLine />
            <ShowText word="所属项目" title={detail.organizeName} />
            <ShowLine />
            <ShowText word="合同房产" title={detail.houseName} />
            <ShowLine />
            <ShowText
              word="解约日期"
              title={detail.withdrawalDate}
              wordColor={Macro.work_blue}
              titleColor={Macro.work_blue}
              pointColor={Macro.work_blue}
              onClick={() => { }}
            />
            <ShowLine />
            <ShowText
              word="经办人"
              title={detail.createUserName}
              wordColor={Macro.work_blue}
              titleColor={Macro.work_blue}
              pointColor={Macro.work_blue}
              onClick={() => { }}
            />
            <ShowLine />
            <ShowText
              word="解约说明"
              title={(detail.withdrawalMemo || '').trim()}
              wordColor={Macro.work_blue}
              titleColor={Macro.work_blue}
              pointColor={Macro.work_blue}
              onClick={() => { }}
            />
          </Flex>
          <ShowMingXi title="合同未收" list={receiveList} />
          <ShowMingXi title="合同未退" list={payList} />
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
        <CompanyDetail
          customer={customer}
          ref={(ref) => (this.companyDetailRef = ref)}
        />
        <HeTongDetail
          hetong={hetong}
          ref={(ref) => (this.hetongDetailRef = ref)}
        /> 
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
