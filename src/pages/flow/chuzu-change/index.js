import React from 'react';
import { Flex, Icon, Modal, Button, TextareaItem } from '@ant-design/react-native';
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import BasePage from '../../base/base';
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowText from '../components/show-text';
import CompanyDetail from '../components/company-detail';
import HeTongDetail from '../components/he-tong-detail';
import service from '../service';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';
import ShowRecord from '../components/show-record';
import common from '../../../utils/common';
import ShowPrices from '../components/show-prices';
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
      title: isCompleted ? '合同变更详情' : '合同变更审批',
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
      customer = {},
      hetong = {},
      reviews = []
    } = this.state;

    const { prices = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{
          flex: 1, padding: 10//滚动条到底 
        }}>
          <ShowTitle title="基础信息" />
          {detail.operationType === '变更客户' && (
            <Flex   direction="column" align="start">
              <ShowText
                word="变更类型"
                title={detail.operationType}
              />
              <ShowLine />
              <ShowText
                word="合同号"
                title={detail.no}
                onClick={() => {
                  service.getContractEntity(detail.oldFormId).then((hetong) => {
                    this.setState(
                      {
                        hetong,
                      },
                      () => {
                        this.hetongDetailRef.showModal();
                      },
                    );
                  });
                }}
              />
              <ShowLine />
              <ShowText word="租期" title={detail.date} />
              <ShowLine />
              <ShowText
                word="所属项目"
                title={detail.organizeName}
              />
              <ShowLine />
              <ShowText
                word="原客户名称"
                title={detail.oldCustomer}
                onClick={() => {
                  service.getCustomerEntity(detail.oldCustomerId)
                    .then((customer) => {
                      this.setState(
                        {
                          customer,
                        },
                        () => {
                          this.companyDetailRef.showModal();
                        },
                      );
                    });
                }}
              />
              <ShowLine />
              <ShowText
                word="新客户名称"
                title={detail.newCustomer}
                onClick={() => {
                  service
                    .getCustomerEntity(detail.newCustomerId)
                    .then((customer) => {
                      this.setState(
                        {
                          customer,
                        },
                        () => {
                          this.companyDetailRef.showModal();
                        },
                      );
                    });
                }}
              />
              <ShowLine />
              <ShowText
                word="变更说明"
                title={(detail.memo || '').trim()}
              />
            </Flex>
          )}

          {detail.operationType === '变更租期' && (
            <Flex   direction="column" align="start">
              <ShowText word="变更类型" title={detail.operationType} />
              <ShowLine />
              <ShowText word="合同号" title={detail.no} />
              <ShowLine />
              <ShowText word="原租期" title={detail.oldDate} />
              <ShowLine />
              <ShowText
                word="新租期"
                title={detail.newDate}
                // wordColor={Macro.work_blue}
                // titleColor={Macro.work_blue}
                // rightColor={Macro.work_blue}
                onClick={() => {
                  service.getContractEntity(detail.oldFormId).then((hetong) => {
                    this.setState(
                      {
                        hetong,
                      },
                      () => {
                        this.hetongDetailRef.showModal();
                      },
                    );
                  });
                }}
              />
              <ShowLine />
              <ShowText
                word="客户名称"
                title={detail.customer}
                onClick={() => {
                  service
                    .getCustomerEntity(detail.customerId)
                    .then((customer) => {
                      this.setState(
                        {
                          customer,
                        },
                        () => {
                          this.companyDetailRef.showModal();
                        },
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
              <ShowText word="租赁房产" title={detail.houseName} />
              <ShowLine />
              <ShowText
                word="变更说明"
                title={(detail.memo || '').trim()}
              //wordColor={Macro.work_orange}
              />
            </Flex>
          )}

          {detail.operationType === '变更房产' && (
            <Flex  direction="column" align="start">
              <ShowText word="变更类型" title="变更房产" />
              <ShowLine />
              <ShowText word="合同号" title={detail.no} />
              <ShowLine />
              <ShowText
                word="所属项目"
                title={detail.organizeName}
              />
              <ShowLine />
              <ShowText word="原租期" title={detail.date} />
              <ShowLine />
              <ShowText
                word="客户名称"
                title={detail.customer}
                onClick={() => {
                  service
                    .getCustomerEntity(detail.customerId)
                    .then((customer) => {
                      this.setState(
                        {
                          customer,
                        },
                        () => {
                          this.companyDetailRef.showModal();
                        },
                      );
                    });
                }}
              />
              <ShowLine />
              <ShowText word="签约面积" title={detail.signArea} />
              <ShowLine />
              <ShowText
                word="合同金额"
                title={detail.totalAmount}
              />
              <ShowLine />
              <ShowText
                word="原租赁面积"
                title={detail.oldTotalArea}
              />
              <ShowLine />
              <ShowText
                word="新租赁面积"
                title={detail.newTotalArea}
                wordColor={Macro.work_blue}
                titleColor={Macro.work_blue}
                onClick={() => {
                  service.getContractEntity(detail.oldFormId).then((hetong) => {
                    this.setState(
                      {
                        hetong,
                      },
                      () => {
                        this.hetongDetailRef.showModal();
                      },
                    );
                  });
                }}
              />
              <ShowLine />
              <ShowText
                word="原租赁房产"
                title={detail.oldHouseName}
              />
              <ShowLine />
              <ShowText
                word="新租赁房产"
                title={detail.newHouseName}
                // wordColor={Macro.work_blue}
                // titleColor={Macro.work_blue}
                onClick={() => {
                  service.getContractEntity(detail.oldFormId).then((hetong) => {
                    this.setState(
                      {
                        hetong,
                      },
                      () => {
                        this.hetongDetailRef.showModal();
                      },
                    );
                  });
                }}
              />
              <ShowLine />
              <ShowText
                word="变更说明"
                title={(detail.memo || '').trim()}
              //wordColor={Macro.work_blue}
              />
            </Flex>
          )}
          {
            detail.operationType != '变更客户' && (
              <ShowPrices prices={prices} />
            )
          }
          {/* <ShowFiles files={detail.files || []} /> */}
          <ShowFiles files={detail.files || []} onPress={
            (fileStr) => {
              this.props.navigation.navigate('webPage', {
                data: fileStr,
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
                      width: 130,
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
