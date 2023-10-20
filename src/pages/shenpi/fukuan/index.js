//导航里面点击的服务单详情
import React   from 'react';
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
import ShowTextWithRight from '../components/show-text-with-right';
import ShowRecord from '../components/show-record';
import common from '../../../utils/common';
import ShowActions from '../components/show-actions';
import service from '../service';
import ShowMingXi from '../components/show-mingxi';

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    var isCompleted = navigation.getParam('isCompleted');
    return {
      title: isCompleted ? '付款单详情' : '付款单审批',
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
    const { list = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="付款单号" title={detail.billCode} />
            <ShowText word="付款对象" title={detail.customerName} />
            <ShowText word="相关房产" title={detail.allName} />
            <ShowTextWithRight
              word="经办人"
              title={detail.createUserName}
              right={detail.billDate}
            />
            <ShowText word="付款金额" title={detail.payAmount} />
            <ShowText word="付款说明" title={(detail.memo || '').trim()} />
          </Flex>

          <ShowMingXi list={list} open={true} />
          <ShowActions
            state={this.state}
            click={() => {
              const refresh = common.getValueFromProps(this.props, 'refresh');
              refresh && refresh();
              this.props.navigation.goBack();
            }}
          />
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
    marginBottom: 15,
  }
});
