//导航里面点击的服务单详情
import React from 'react';
import { Flex, Icon, Modal, Button, TextareaItem } from '@ant-design/react-native';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import BasePage from '../../base/base';
import ScreenUtil from '../../../utils/screen-util';
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowLine from '../components/show-line';
import ShowText from '../components/show-text';
import HeTongDetail from '../components/he-tong-detail';
import common from '../../../utils/common';
import service from '../service';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';
import ShowRecord from '../components/show-record';
import ShowMingXi from '../components/show-mingxi';
import UDToast from '../../../utils/UDToast';
import ShowReviews from '../components/show-reviews';
import Macro from '../../../utils/macro';

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    //是否完成
    var isCompleted = navigation.getParam('isCompleted');
    return {
      title: isCompleted ? '合同退租详情' : '合同退租审批',
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
    const id = common.getValueFromProps(props, 'id');
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
    const {
      detail = {},
      records = [],
      hetong = {},
      reviews = []
    } = this.state;
    const { receiveList = [], payList = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="项目" title={detail.organizeName} />
            <ShowText
              word="合同号"
              title={detail.no}
            // onClick={() => {
            //   service.getContractEntity(detail.contractId).then((hetong) => {
            //     this.setState(
            //       {
            //         hetong,
            //       },
            //       () => {
            //         this.hetongDetailRef.showModal();
            //       },
            //     );
            //   });
            // }}
            />
            <ShowText word="租期" title={detail.date} />
            <ShowText word="客户名称" title={detail.customer} />
            <ShowText word="合同金额" title={detail.totalAmount} />
            <ShowText word="租赁面积" title={detail.totalArea} />
            <ShowText word="租赁房产" title={detail.houseName} />

            <ShowLine />
            <ShowText
              word="退租类型"
              title={detail.withdrawal}
              wordColor={Macro.work_orange}
              titleColor={Macro.work_orange}
              pointColor={Macro.work_orange}
              onClick={() => { }}
            />
            <ShowText
              word="退租日期"
              title={detail.withdrawalDate}
              wordColor={Macro.work_orange}
              titleColor={Macro.work_orange}
              pointColor={Macro.work_orange}
              onClick={() => { }}
            />
            <ShowText
              word="经办人"
              title={detail.createUserName}
              wordColor={Macro.work_orange}
              titleColor={Macro.work_orange}
              pointColor={Macro.work_orange}
              onClick={() => { }}
            />

            <ShowText
              word="退租说明"
              title={(detail.memo || '').trim()}
              wordColor={Macro.work_orange}
              titleColor={Macro.work_orange}
              pointColor={Macro.work_orange}
              onClick={() => { }}
            />
          </Flex>

          <ShowMingXi title="合同未收" list={receiveList} />
          <ShowMingXi title="合同未退" list={payList} />
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

        {/* <CompanyDetail customer={customer} ref={(ref) => (this.companyDetailRef = ref)} /> */}
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
