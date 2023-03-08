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
import common from '../../../utils/common';
import service from '../service';
import ShowRecord from '../components/show-record';
import ShowActions from '../components/show-actions';
import ShowFiles from '../components/show-files';

export default class EfuwuDetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('data')
        ? navigation.getParam('data').codeName
        : '',
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
      this.setState({
        records,
      });
    });
  };

  render() {
    const { detail = {}, records = [] } = this.state;
    const { list = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ padding: 15, paddingBottom: 30 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="减免单号" title={detail.billCode} />
            <ShowTextWithRight
              word="经办人"
              title={detail.createUserName}
              right={detail.billDate}
            />
            <ShowText word="折扣金额" title={detail.reductionSumAmount} />
            <ShowText word="折扣说明" title={(detail.memo || '').trim()} />
          </Flex>

          <ShowTitle title="明细" />
          <Flex style={styles.card} direction="column" align="start">
            {list.map((item, index) => (
              <View key={index}>
                <Flex>
                  <Text style={[styles.txt, styles.txt2]}>{item.allName}</Text>
                </Flex>
                <Flex justify="between" style={{ width: '100%' }}>
                  <Text style={styles.txt}>{item.feeName} </Text>
                  <Text style={styles.txt}>{item.amount} </Text>
                  <Text style={styles.txt}>{item.lastAmount}</Text>
                </Flex>
                <Text style={[styles.txt, { marginTop: -6 }]}>{item.date}</Text>
                {index < list.length - 1 && <ShowLine />}
              </View>
            ))}
          </Flex>

          <ShowActions
            state={this.state}
            click={() => {
              const refresh = common.getValueFromProps(this.props, 'refresh');
              refresh && refresh();
              this.props.navigation.goBack();
            }}
          />
          <ShowFiles files={detail.files || []} />
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
  txt2: {
    color: Macro.work_blue,
  },

  fixedWidth: {
    width: 60,
  },
});
