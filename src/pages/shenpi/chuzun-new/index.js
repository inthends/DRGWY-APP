//导航里面点击的服务单详情
import React, { Fragment } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import BasePage from '../../base/base';
import { Icon } from '@ant-design/react-native';
import { Flex, TextareaItem } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import UDToast from '../../../utils/UDToast';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowLine from '../components/show-line';
import ShowText from '../components/show-text';
import ShowTextWithRight from '../components/show-text-with-right';
import CompanyDetail from '../components/company-detail';
import service from '../service';
import ShowMingXi from '../components/show-mingxi';
import ShowActions from '../components/show-actions';
import common from '../../../utils/common';
import ShowRecord from '../components/show-record';
import ShowFiles from '../components/show-files';
import ShowPrices from '../components/show-prices';

export default class EfuwuDetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('data')
        ? navigation.getParam('data').codeName
        : '',
      headerForceInset:this.headerForceInset,
            headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" style={{ width: 30, marginLeft: 15 }} />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    const item = common.getValueFromProps(props) || {};
    const { id, instanceId } = item;
    this.state = {
      item,
      id,
      instanceId,
      detail: {},
      records: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { id, instanceId } = this.state;
    service.getFlowData(id).then((detail) => {
      console.log('detail', detail);

      this.setState({
        detail,
      });
    });
    service.getApproveLog(instanceId).then((records) => {
      console.log('log', records);
      this.setState({
        records,
      });
    });
  };

  render() {
    const { detail = {}, records = [], customer = {} } = this.state;
    const { prices = [], fees: list = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ padding: 15, paddingBottom: 30 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="项目" title={detail.organizeName} />
            <ShowText word="合同号" title={detail.no} />
            <ShowText word="租期" title={detail.date} />
            <ShowText word="付款方式" title={detail.payType} />
            <ShowText word="签约人" title={detail.signer} />
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
            <ShowText word="其他条款" title={(detail.memo || '').trim()} />
          </Flex>

          <ShowPrices prices={prices} />
          <ShowActions
            state={this.state}
            click={() => {
              const refresh = common.getValueFromProps(this.props, 'refresh');
              refresh && refresh();
              this.props.navigation.goBack();
            }}
          />
          <ShowFiles files={detail.files || []} onPress={
            (fileStr)=>{
              this.props.navigation.navigate('webPage',{
                data: fileStr,
              });
            }
          }/>
          <ShowRecord records={records} />
          <ShowMingXi list={list} />
        </ScrollView>
        <CompanyDetail
          customer={customer}
          ref={(ref) => (this.companyDetailRef = ref)}
        />
      </CommonView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#F3F4F2',
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

    paddingBottom: 10,
  },
  left: {
    fontSize: 14,
    color: '#666',
  },
  right: {},
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
  textarea: {
    marginTop: 5,
    borderStyle: 'solid',
    borderColor: '#F3F4F2',
    borderWidth: 1,
    borderRadius: 5,
  },

  fixedWidth: {
    width: 60,
  },
  txt2: {
    color: Macro.work_blue,
  },
});
