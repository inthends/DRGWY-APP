 
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
import ShowTextWithRight from '../components/show-text-with-right';
import service from '../service';
import common from '../../../utils/common';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';
import ShowRecord from '../components/show-record';
import ShowMingXiBaoXiao from '../components/show-mingxi-baoxiao';

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    //是否完成
    var isCompleted = navigation.getParam('isCompleted');
    return {
      title: isCompleted ? '任务详情' : '任务审批',
      headerForceInset:this.headerForceInset,
            headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" style={{ width: 30, marginLeft: 15 }} />
        </TouchableOpacity>
      )
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
    } = this.state;
    const { list = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, padding: 10 }}>
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
