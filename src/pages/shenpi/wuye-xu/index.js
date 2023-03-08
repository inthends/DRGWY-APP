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

export default class EfuwuDetailPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '出租合同续签审批',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" style={{ width: 30, marginLeft: 15 }} />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    // let fuwu = common.getValueFromProps(this.props);
    // let type = common.getValueFromProps(this.props, 'type');
    //console.log(fuwu, type, 11)
    this.state = {
      value: '',
      fuwu: '',
      type: '',
      images: [],
      detail: {},
      communicates: [],
      lookImageIndex: 0,
      visible: false,
    };
    this.companyDetailRef = null;
  }

  componentDidMount(): void {
    this.getData();
  }

  getData = () => {
    const { fuwu, type } = this.state;
  };
  click = (handle) => {
    const { fuwu, value } = this.state;
    // console.log(11111,value)
    if (handle === '回复' && !(value && value.length > 0)) {
      UDToast.showInfo('请输入文字');
      return;
    }
    WorkService.serviceHandle(handle, fuwu.id, value)
      .then((res) => {
        this.props.navigation.goBack();
      })
      .catch((err) => {
        UDToast.showError(err);
      });
  };

  render() {
    const { images, detail, communicates } = this.state;

    return (
      <CommonView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ padding: 15, paddingBottom: 30 }}>
          <ShowTitle title="基础信息" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="项目" title="祥和府" />
            <ShowText word="合同号" title="D-202201000001" />
            <ShowTextWithRight
              word="合同期限"
              title="2022-04-01至2024-03-31"
              right="2年"
            />
            <ShowText word="付款方式" title="季付" />
            <ShowText word="客户名称" title="南京万事达销售有限公司" />
            <ShowText
              word="合同金额"
              title="租金：240000.00  保证金：50000.00"
            />
            <ShowText word="合同面积" title="89.00" />
            <ShowText word="合同房产" title="1-101,1-102" />
            <ShowText word="其他条款" title="123456" />
          </Flex>

          <ShowTitle title="单价方案" />
          <Flex style={styles.card} direction="column" align="start">
            <Flex justify="between" style={{ width: '100%' }}>
              <Text style={styles.txt}>租金</Text>
              <Text style={styles.txt}>2022-04-01至2024-03-31</Text>
              <Text style={styles.txt}>1.25 元/m</Text>
            </Flex>
            <ShowText word="付款周期" title="3个月" />
            <ShowText word="免租" title="无" />
            <ShowText word="递增" title="无" />
          </Flex>
          <ShowTitle title="审批信息" />
          <View style={styles.textarea}>
            <TextareaItem
              rows={4}
              placeholder="输入审批意见"
              style={{
                fontSize: 14,
                height: 100,
                width: ScreenUtil.deviceWidth() - 45,
              }}
              onChange={(value) => this.setState({ value })}
              value={this.state.value}
            />
          </View>

          <Flex justify="around" style={{ marginTop: 30 }}>
            <TouchableWithoutFeedback onPress={() => this.click('回复')}>
              <Flex
                justify={'center'}
                style={[styles.ii, { backgroundColor: Macro.work_orange }]}
              >
                <Text style={styles.word}>退回</Text>
              </Flex>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.click('回复')}>
              <Flex
                justify={'center'}
                style={[styles.ii, { backgroundColor: Macro.work_green }]}
              >
                <Text style={styles.word}>同意</Text>
              </Flex>
            </TouchableWithoutFeedback>
          </Flex>

          <View style={{ height: 5 }} />

          <ShowTitle title="附件" />

          <View style={{ height: 50 }} />

          <ShowTitle title="审批记录" />
          <Flex style={styles.card} direction="column" align="start">
            <ShowText word="步骤" title="发起" />
            <ShowTextWithRight
              word="办理人"
              title="张丹丹"
              right="2022-02-01"
            />
            <ShowText word="办理结果" title="123123" />
            <ShowText word="意见" title="456" />

            <ShowLine />
          </Flex>

          <ShowTitle title="明细" />
          <Flex style={styles.card} direction="column" align="start">
            <TouchableWithoutFeedback
              onPress={() => {
                // this.shouDetailRef.showModal();
                this.chongDiDetailRef.showModal();
              }}
            >
              <View>
                <Flex justify="between" style={{ width: '100%' }}>
                  <Text style={styles.txt}>租金</Text>
                  <Text style={[styles.txt]}>50000.00</Text>
                </Flex>
                <Text style={[styles.txt, { marginTop: -6 }]}>
                  2022-04-01至2022-06-30
                </Text>
                <ShowLine />
              </View>
            </TouchableWithoutFeedback>
          </Flex>
        </ScrollView>
        <CompanyDetail ref={(ref) => (this.companyDetailRef = ref)} />
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
