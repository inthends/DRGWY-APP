//导航里面点击的服务单详情
import React  from 'react';
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
import service from '../service';
import common from '../../../utils/common';
import ShowActions from '../components/show-actions'; 
import ShowRecord from '../components/show-record';
import ShowMingXiCaiGou from '../components/show-mingxi-caigou';

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
     //是否完成
     var isCompleted = navigation.getParam('isCompleted');
    return {
      // title: navigation.getParam('data')
      //   ? navigation.getParam('data').codeName
      //   : '',
      title: isCompleted ? '采购单详情' : '采购单审批',
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
    const { detail = {}, records = [] } = this.state;
    let { list = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="采购单号" title={detail.billCode} />
            <ShowText word="机构" title={detail.organizeName} /> 
            <ShowText word="仓库" title={detail.warehouseName} /> 
            <ShowText word="发起人" title={detail.createUserName} /> 
            <ShowText word="采购类型" title={detail.purchaseType} /> 
            <ShowText word="采购金额" title={detail.totalAmount} />
            <ShowText word="采购说明" title={detail.memo} />
          </Flex>
          <ShowMingXiCaiGou list={list} />
          <ShowActions
            isSpecial={true}
            state={this.state}
            click={() => {
              const refresh = common.getValueFromProps(this.props, 'refresh');
              refresh && refresh();
              this.props.navigation.goBack();
            }}
          />
          {/* <ShowFiles /> */}
          <ShowRecord records={records} />
        </ScrollView>
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
    marginBottom: 15
  }
});
