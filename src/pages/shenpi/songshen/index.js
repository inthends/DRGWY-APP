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
import { Flex } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ShowTitle from '../components/show-title';
import ShowText from '../components/show-text';
import ShowTextWithRight from '../components/show-text-with-right';
import ShouDetail from '../components/shou-detail';
import ChongDiDetail from '../components/chong-di-detail';
import ShowRecord from '../components/show-record';
import ShowActions from '../components/show-actions';
import common from '../../../utils/common';
import service from '../service';
import ShowMingXiLook from '../components/show-mingxi-look';

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
      showItem: null,
    };
    this.shouDetailRef = null;
    this.chongDiDetailRef = null;
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { id, instanceId } = this.state;
    service.getFlowData(id).then((detail) => {
      console.log('detail', detail);
      this.setState({
        detail: {
          ...detail,
          billList: (detail.billList || []).map((item) => ({
            id: item.billId,
            word: item.billCode,
            word2: '收款',
            word3: item.billDate,
            word4: item.detail,
          })),
          offsetList: (detail.offsetList || []).map((item) => ({
            id: item.billId,
            word: item.billCode,
            word2: '冲抵',
            word3: item.billDate,
            word4: `应付冲抵：${item.amount}`,
          })),
        },
      });
    });
    service.getApproveLog(instanceId).then((records) => {
      console.log('log', records);
      this.setState({
        records,
      });
    });
  };

  render() {
    const { detail = {}, records = [], showItem = {} } = this.state;
    const { billList = [], offsetList = [] } = detail;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ padding: 15, paddingBottom: 30 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="送审项目" title={detail.organizeName} />
            <ShowText word="送审单号" title={detail.billCode} />
            <ShowTextWithRight
              word="发起人"
              title={detail.createUserName}
              right={detail.billDate}
            />
            <ShowText word="送审说明" title={(detail.memo || '').trim()} />
          </Flex>

          <ShowTitle title="送审金额" />
          <Flex style={styles.card} direction="column" align="start">
            <Text style={[styles.txt, { color: Macro.work_blue }]}>
              {detail.groupTotal}
            </Text>
            <Text style={[styles.txt, { color: Macro.work_orange }]}>
              {detail.receiveDetail}
            </Text>
          </Flex>

          <ShowActions
            state={this.state}
            click={() => {
              const refresh = common.getValueFromProps(this.props, 'refresh');
              refresh && refresh();
              this.props.navigation.goBack();
            }}
          />

          <ShowRecord records={records} />

          <ShowMingXiLook
            title="收款明细"
            list={billList}
            click={(item) => {
              service.getReceiveEntity(item.id).then((res) => {
                this.setState(
                  {
                    showItem: res,
                  },
                  () => {
                    this.shouDetailRef.showModal();
                  },
                );
              });
            }}
          />
          <ShowMingXiLook
            title="冲抵明细"
            list={offsetList}
            click={(item) => {
              service.getOffsetEntity(item.id).then((res) => {
                this.setState(
                  {
                    showItem: res,
                  },
                  () => {
                    this.chongDiDetailRef.showModal();
                  },
                );
              });
            }}
          />
        </ScrollView>
        <ShouDetail
          detail={showItem || {}}
          ref={(ref) => (this.shouDetailRef = ref)}
        />
        <ChongDiDetail
          detail={showItem || {}}
          ref={(ref) => (this.chongDiDetailRef = ref)}
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
});
