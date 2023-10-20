//导航里面点击的服务单详情
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import BasePage from '../../base/base';
import { Icon } from '@ant-design/react-native';
import { Flex } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import Macro from '../../../utils/macro';
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
      hetong = {},
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

        {/* <CompanyDetail customer={customer} ref={(ref) => (this.companyDetailRef = ref)} /> */}
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
