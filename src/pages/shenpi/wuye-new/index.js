
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native'; 
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowText from '../components/show-text';
import CompanyDetail from '../components/company-detail';
import common from '../../../utils/common';
import service from '../service';
import ShowPrices from '../components/show-prices';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';
import ShowRecord from '../components/show-record';
import ShowMingXi from '../components/show-mingxi';

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    //是否完成
    var isCompleted = navigation.getParam('isCompleted');
    return {
      title: isCompleted ? '物业合同详情' : '物业合同审批',
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
    const { detail = {}, records = [], customer = {} } = this.state;
    const { prices = [], fees: list = [] } = detail;
    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="项目" title={detail.organizeName} />
            <ShowText word="合同号" title={detail.no} />
            <ShowText word="合同期限" title={detail.date} />
            <ShowText word="付款方式" title={detail.payType} />
            <ShowText word="客户名称" title={detail.customer} />
            <ShowText word="合同金额" title={detail.totalAmount} />
            <ShowText word="合同面积" title={detail.totalArea} />
            <ShowText word="合同房产" title={detail.houseName} />
            <ShowText word="其他条款" title={(detail.memo || '').trim()} />
          </Flex>
          <ShowPrices prices={prices} />
          <ShowMingXi list={list} />

          <ShowActions
            state={this.state}
            click={() => {
              const refresh = common.getValueFromProps(this.props, 'refresh');
              refresh && refresh();
              this.props.navigation.goBack();
            }}
          />
          <ShowFiles files={detail.files || []} onPress={
            (fileStr) => {
              this.props.navigation.navigate('webPage', {
                data: fileStr,
              });
            }
          } />
          <ShowRecord records={records} />

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
