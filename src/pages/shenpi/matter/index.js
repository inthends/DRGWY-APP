//事项申请
import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon, Modal, Button, TextareaItem } from '@ant-design/react-native';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowText from '../components/show-text';
import ShowTextWithRight from '../components/show-text-with-right';
import service from '../service';
import common from '../../../utils/common';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';
import ShowRecord from '../components/show-record';
import ShowReviews from '../components/show-reviews'; 
import UDToast from '../../../utils/UDToast';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
//import AddReview from '../components/add-review'; 

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    //是否完成
    var isCompleted = navigation.getParam('isCompleted');
    return {
      // title: navigation.getParam('data')
      //   ? navigation.getParam('data').codeName
      //   : '',
      title: isCompleted ? '事项详情' : '事项审批',
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
    const {
      detail = {},
      records = [],
      reviews = [],
      //flowUsers
    } = this.state;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="单号" title={detail.billCode} />
            <ShowText word="机构" title={detail.organizeName} />
            <ShowText word="部门" title={detail.departmentName} />
            <ShowTextWithRight
              word="申报人"
              title={detail.applyUser}
              right={detail.date}
            />
            <ShowText word="事项类别" title={detail.matterType} />
            <ShowText word="事项说明" title={detail.memo} />
          </Flex>
          <ShowFiles files={detail.files} onPress={
            (fileStr) => {
              this.props.navigation.navigate('webPage', {
                data: fileStr,
              });
            }
          } />

          <ShowReviews reviews={reviews}
            // onAddClick={() => this.setState({
            //   addVisible: true
            // })}
            onClick={(id) => this.setState({
              replyVisible: true,
              memo: '',
              messageId: id
            })} />

          <ShowRecord records={records} />
          <ShowActions
            isSpecial={true}
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

        {/* <Modal
          //弹出沟通页面
          transparent
          onClose={() => this.setState({ addVisible: false })}
          onRequestClose={() => this.setState({ addVisible: false })}
          maskClosable
          visible={this.state.addVisible}>
          <Flex justify={'center'} align={'center'}>
            <AddReview />
          </Flex>
        </Modal> */}

      </CommonView>
    );
  }
}

const styles = StyleSheet.create({
  // area: {  
  //   width: ScreenUtil.deviceWidth() - 150,
  // borderStyle: 'solid',
  // borderColor: '#F3F4F2',
  // borderWidth: 1,
  // borderRadius: 5
  //}, 
  card: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    borderColor: '#eee',
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 5,
    marginBottom: 15
  }
});
