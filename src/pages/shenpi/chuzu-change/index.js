import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import Macro from '../../../utils/macro';
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
    const id = common.getValueFromProps(props, 'id');
    this.state = {
      id,
      detail: {},
      records: []
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

  render() {
    const {
      detail = {},
      records = [],
      customer = {},
      hetong = {},
    } = this.state;

    const { prices = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{
          flex: 1, padding: 10//滚动条到底 
        }}>
          <ShowTitle title="基础信息" />
          {detail.operationType === '变更客户' && (
            <Flex style={styles.card} direction="column" align="start">
              <ShowText
                fixedWidth={80}
                word="变更类型"
                title={detail.operationType}
              />
              <ShowText
                fixedWidth={80}
                word="项目"
                title={detail.organizeName}
              />
              <ShowText
                word="合同号"
                fixedWidth={80}
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
              <ShowText fixedWidth={80} word="租期" title={detail.date} />

              <ShowText
                word="原客户名称"
                fixedWidth={80}
                title={detail.oldCustomer}
                onClick={() => {
                  service
                    .getCustomerEntity(detail.oldCustomerId)
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
              <ShowText
                word="新客户名称"
                fixedWidth={80}
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

              <ShowText
                fixedWidth={80}
                word="变更说明"
                title={(detail.memo || '').trim()}
              />
            </Flex>
          )}

          {detail.operationType === '变更租期' && (
            <Flex style={styles.card} direction="column" align="start">
              <ShowText word="变更类型" title={detail.operationType} />
              <ShowText word="项目" title={detail.organizeName} />
              <ShowText word="合同号" title={detail.no} />
              <ShowText word="原租期" title={detail.oldDate} />

              <ShowText
                word="新租期"
                title="2022-04-01至2024-03-31"
                wordColor={Macro.work_orange}
                titleColor={Macro.work_orange}
                rightColor={Macro.work_orange}
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

              <ShowText word="合同金额" title={detail.totalAmount} />
              <ShowText word="租赁面积" title={detail.totalArea} />
              <ShowText word="租赁房产" title={detail.houseName} />
              <ShowText
                word="变更说明"
                title={(detail.memo || '').trim()}
                wordColor={Macro.work_orange}
              />
            </Flex>
          )}

          {detail.operationType === '变更房产' && (
            <Flex style={styles.card} direction="column" align="start">
              <ShowText fixedWidth={80} word="变更类型" title="变更房产" />
              <ShowText
                fixedWidth={80}
                word="项目"
                title={detail.organizeName}
              />
              <ShowText fixedWidth={80} word="合同号" title={detail.no} />
              <ShowText fixedWidth={80} word="原租期" title={detail.date} />

              <ShowText
                fixedWidth={80}
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

              <ShowText
                fixedWidth={80}
                word="合同金额"
                title={detail.totalAmount}
              />
              <ShowText
                fixedWidth={80}
                word="原租赁面积"
                title={detail.oldTotalArea}
              />
              <ShowText
                fixedWidth={80}
                word="新租赁面积"
                title={detail.newTotalArea}
                wordColor={Macro.work_orange}
                titleColor={Macro.work_orange}
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
              <ShowText
                fixedWidth={80}
                word="原租赁房产"
                title={detail.oldHouseName}
              />
              <ShowText
                fixedWidth={80}
                word="新租赁房产"
                title={detail.newHouseName}
                wordColor={Macro.work_orange}
                titleColor={Macro.work_orange}
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
              <ShowText
                word="变更说明"
                title={(detail.memo || '').trim()}
                fixedWidth={80}
                wordColor={Macro.work_orange}
              />
            </Flex>
          )}

          {
            detail.operationType != '变更客户' && (
              <ShowPrices prices={prices} />
            )
          }

          <ShowActions
            state={this.state}
            click={() => {
              const refresh = common.getValueFromProps(this.props, 'refresh');
              refresh && refresh();
              this.props.navigation.goBack();
            }}
          />
          <ShowFiles files={detail.files || []} />
          <ShowRecord records={records} />
        </ScrollView>
        <CompanyDetail
          customer={customer}
          ref={(ref) => (this.companyDetailRef = ref)}
        />
        <HeTongDetail
          hetong={hetong}
          ref={(ref) => (this.hetongDetailRef = ref)}
        />
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
