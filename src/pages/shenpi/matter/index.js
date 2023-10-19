//事项申请
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

export default class MatterDetailPage extends BasePage {
  
  static navigationOptions = ({ navigation }) => { 
    //是否完成
    var isCompleted = navigation.getParam('isCompleted'); 
    return {
      // title: navigation.getParam('data')
      //   ? navigation.getParam('data').codeName
      //   : '',
      title: isCompleted ? '事项详情' : '事项审批',
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
      records: [],
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
        records,
      });
    });
  };

  render() {
    const {
      detail = {},
      records = []
    } = this.state;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ padding: 15, paddingBottom: 30 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="单号" title={detail.billCode} />
            <ShowText word="机构" title={detail.organizeName} />
            <ShowText word="部门" title={detail.departmentName} />
            <ShowTextWithRight
              word="申报人"
              title={detail.applyUser}
              right={detail.date}
            />
            <ShowText word="事项类别" title={detail.matterType} />
            <ShowText word="事项说明" title={detail.memo} />
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
          <ShowFiles files={detail.files} onPress={
            (fileStr) => {
              this.props.navigation.navigate('webPage', {
                data: fileStr,
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
  header: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#F3F4F2'
  },
  every: {
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 15,
    paddingBottom: 15
  },
  every2: {
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 10
  },
  left: {
    fontSize: 14,
    color: '#666'
  },
  right: {},
  desc: {
    padding: 15,
    paddingBottom: 40
  },
  ii: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
    backgroundColor: '#999',
    borderRadius: 6,
    marginBottom: 20
  },
  word: {
    color: 'white',
    fontSize: 16
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
    marginBottom: 15
  },
  txt: {
    fontSize: 14,
    paddingBottom: 10
  },
  textarea: {
    marginTop: 5,
    borderStyle: 'solid',
    borderColor: '#F3F4F2',
    borderWidth: 1,
    borderRadius: 5
  },
  fixedWidth: {
    width: 60
  },
  txt2: {
    color: Macro.work_blue,
  }
});
