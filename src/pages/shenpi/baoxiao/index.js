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
import WorkService from '../../work/work-service';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowLine from '../components/show-line';
import ShowText from '../components/show-text';
import ShowTextWithRight from '../components/show-text-with-right';
import CompanyDetail from '../components/company-detail';
import service from '../service';
import common from '../../../utils/common';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';
import ShowRecord from '../components/show-record';
import ShowMingXiBaoXiao from '../components/show-mingxi-baoxiao';

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
      this.setState({
        detail,
      });
    });
    service.getApproveLog(instanceId).then((records) => { 
      this.setState({
        records,
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
    const { list = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ padding: 15, paddingBottom: 30 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="报销单号" title={detail.billCode} />

            <ShowText word="机构" title={detail.organizeName} />

            <ShowText word="部门" title={detail.departmentName} />

            <ShowTextWithRight
              word="发起人"
              title={detail.createUserName}
              right={detail.date}
            />
            <ShowText word="报销类型" title={detail.billType} />
            <ShowText word="报销金额" title={detail.totalAmount} />
            <ShowText word="报销说明" title={(detail.memo || '').trim()} />
          </Flex>

          <ShowActions
            isSpecial={true}
            state={this.state}
            click={() => {
              const refresh = common.getValueFromProps(this.props, 'refresh');
              refresh && refresh();
              this.props.navigation.goBack();
            }}
          />
          <ShowFiles files={detail.files } onPress={
            (fileStr)=>{
              this.props.navigation.navigate('webPage',{
                data: fileStr,
              });
            }
          }/>
          <ShowRecord records={records} />
          <ShowMingXiBaoXiao list={list} />
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
