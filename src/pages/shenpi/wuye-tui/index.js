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

export default class EfuwuDetailPage extends BasePage {
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
    const { receiveList = [], payList = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{flex: 1, padding: 10}}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="项目" title={detail.organizeName} />
            <ShowText word="合同号" title={detail.no} />
            <ShowText word="合同期限" title={detail.date} />
            <ShowText word="客户名称" title={detail.customer} />
            <ShowText word="合同金额" title={detail.totalAmount} />
            <ShowText word="合同面积" title={detail.totalArea} />
            <ShowText word="合同房产" title={detail.houseName} />
            <ShowLine />
            <ShowText
              word="解约日期"
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
              word="解约说明"
              title={(detail.withdrawalMemo || '').trim()}
              wordColor={Macro.work_orange}
              titleColor={Macro.work_orange}
              pointColor={Macro.work_orange}
              onClick={() => { }}
            />
          </Flex>

          <ShowMingXi title="合同未收" list={receiveList} />
          <ShowMingXi title="合同未退" list={payList} />

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
        <HeTongDetail
          hetong={hetong}
          ref={(ref) => (this.hetongDetailRef = ref)}
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
