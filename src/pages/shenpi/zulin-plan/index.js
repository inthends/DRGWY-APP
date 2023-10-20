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
import common from '../../../utils/common';
import service from '../service';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';
import ShowRecord from '../components/show-record';
import ShowMingXi2 from '../components/show-mingxi2';

export default class DetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    //是否完成
    var isCompleted = navigation.getParam('isCompleted');
    return {
      title: isCompleted ? '租赁规划详情' : '租赁规划审批',
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
    // const item = common.getValueFromProps(props) || {};
    // const { id, instanceId } = item;
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
      // const { setParams } = this.props.navigation;
      // setParams({ title: detail.statusName }); 
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
      records = []
    } = this.state;
    const { list = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="项目" title={detail.organizeName} />
            <ShowText word="规划单号" title={detail.billCode} />
            <ShowText word="规划费项" title={detail.feeName} />
            <ShowText word="规划期限" title={detail.billDate} />
            <ShowText word="发起人" title={detail.createUserName} />
            <ShowText word="规划说明" title={(detail.memo || '').trim()} />
          </Flex>
          <ShowMingXi2 list={list} />
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
                data: fileStr
              });
            }
          } />
          <ShowRecord records={records} />
        </ScrollView>
      </CommonView>
    );
  }
}

const styles = StyleSheet.create({
  // header: {
  //   paddingTop: 15,
  //   paddingBottom: 15,
  //   paddingLeft: 15,
  //   paddingRight: 15,
  //   backgroundColor: '#F3F4F2',
  // }, 
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
