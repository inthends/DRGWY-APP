import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BasePage from '../../base/base';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import {
  Flex,
  Button,
  WhiteSpace,
  WingBlank,
  Icon,
} from '@ant-design/react-native';
import YiQingService from './yiqing-service';
import common from '../../../utils/common';

class YiQingPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '小区管理',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" style={{ width: 30, marginLeft: 15 }} />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);

    const { keyvalue } = common.getValueFromProps(this.props);
    this.state = {
      allName: '',
      records: [],
      keyvalue,
    };
    YiQingService.detail(this.state.keyvalue).then((res) => {
      this.setState({
        allName: res.entity.allName,
      });
    });
  }

  componentDidMount(): void {
    YiQingService.records(this.state.keyvalue).then((res) => {
      this.setState({
        records: res.data,
      });
    });
  }

  out = () => {
    YiQingService.record(this.state.keyvalue, '0', '1', '1', '').then((res) => {
      this.props.navigation.popToTop();
    });
  };

  render() {
    const { allName, records } = this.state;
    return (
      <CommonView style={{ flex: 1 }}>
        <ScrollView>
          <Text style={styles.title}>{allName}</Text>

          <Flex justify={'around'} style={styles.buttons}>
            <Button type={'primary'} style={styles.button1} onPress={this.out}>
              出小区
            </Button>
            <Button
              type={'primary'}
              style={styles.button2}
              onPress={() =>
                this.props.navigation.navigate('yiqinginfo', {
                  data: { keyvalue: this.state.keyvalue },
                })
              }
            >
              入小区
            </Button>
          </Flex>
          <Text style={styles.records}>出行记录</Text>
          <WhiteSpace />
          {records.map((item) => (
            <Fragment key={item.createDate}>
              <WhiteSpace />
              <WingBlank>
                <WingBlank>
                  <Flex style={styles.record}>
                    <Text
                      style={
                        item.flag === '出' ? styles.redText : styles.blackText
                      }
                    >
                      {item.flag}
                    </Text>
                    <WingBlank>
                      <Text
                        style={
                          item.flag === '出' ? styles.redText : styles.blackText
                        }
                      >
                        {item.createDate}
                      </Text>
                    </WingBlank>
                  </Flex>
                </WingBlank>
              </WingBlank>
            </Fragment>
          ))}
        </ScrollView>
      </CommonView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    paddingLeft: 15,
    paddingTop: 20,
  },
  buttons: {
    paddingTop: 40,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 40,
  },
  button1: {
    backgroundColor: Macro.work_blue,
    borderWidth: 0,
  },
  button2: {
    borderWidth: 0,
    backgroundColor: Macro.work_orange,
  },
  records: {
    paddingLeft: 15,
    fontSize: 16,
  },
  redText: {
    color: 'red',
    fontSize: 15,
  },
  blackText: {
    color: '#333',
    fontSize: 15,
  },
});

export default YiQingPage;
