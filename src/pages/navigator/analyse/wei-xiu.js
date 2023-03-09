import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import BasePage from '../../base/base';
import {
  Flex,
  Icon
} from '@ant-design/react-native';
import { connect } from 'react-redux';
import ScreenUtil from '../../../utils/screen-util';
import Echarts from 'native-echarts';
import DashLine from '../../../components/dash-line';
import NavigatorService from '../navigator-service';
import { Rows, Row, Table } from 'react-native-table-component';
import MyPopover from '../../../components/my-popover';
import CommonView from '../../../components/CommonView';

class WeiXiuRatePage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false,
      title: '维修工单完成率',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" style={{ width: 30, marginLeft: 15 }} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
          <Icon name="bars" style={{ marginRight: 15 }} color="black" />
        </TouchableWithoutFeedback>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      selectBuilding: this.props.selectBuilding || {},
      statistics: [],
      res: {
        tableData: [],
      },
    };
  }

  componentDidMount(): void {
    NavigatorService.GetDataItemTreeJsonRepairMajor().then((res) => {
      const titles = (res || []).map((item) => item.title);
      this.setState({
        titles: ['全部', ...titles],
      });
    });
    this.initData();
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    const selectBuilding = this.state.selectBuilding;
    const nextSelectBuilding = nextProps.selectBuilding;
    if (
      !(
        selectBuilding &&
        nextSelectBuilding &&
        selectBuilding.key === nextSelectBuilding.key
      )
    ) {
      this.setState(
        {
          selectBuilding: nextProps.selectBuilding,
          estateId: nextProps.selectBuilding.key,
          index: 0,
        },
        () => {
          this.initData();
        },
      );
    }
  }

  initData = () => {
    NavigatorService.getFeeStatistics(
      1,
      this.state.selectBuilding.key,
      100000,
    ).then((statistics) => {
      this.setState({ statistics: statistics.data || [] }, () => {
        this.getStatustics();
      });
    });
  };

  getStatustics = () => {
    const { estateId, type } = this.state;
    NavigatorService.collectionRate(4, estateId, type).then((res) => {
      this.setState({ res });
    });
  };

  titleChange = (index) => {
    const { statistics } = this.state;
    console.log(this.state);
    let estateId;
    if (index === 0) {
      estateId = this.state.selectBuilding.key;
    } else {
      estateId = statistics[index - 1].id;
    }
    this.setState(
      {
        index,
        estateId,
      },
      () => {
        this.getStatustics();
      },
    );
  };
  typeChange = (title, index) => {
    // const titles = this.state.titles || [];
    this.setState(
      {
        type: index == 0 ? '' : title,
      },
      () => {
        this.getStatustics();
      },
    );
  };

  render() {
    const { titles = [] } = this.state;
    const { option, tableData, tableHead } = this.state.res;

    return (
      <CommonView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Flex
            direction={'column'}
            style={{ width: ScreenUtil.deviceWidth(), marginTop: 15 }}
          >
            <Flex
              justify={'between'}
              style={{ paddingLeft: 10, width: ScreenUtil.deviceWidth() - 30 }}
            >
              {/* <Text style={styles.name}>入住率：{rate}</Text> */}
              <MyPopover
                textStyle={{ fontSize: 14 }}
                onChange={this.typeChange}
                titles={titles}
                visible={true}
              />
            </Flex>
          </Flex>
          <DashLine
            style={{ marginTop: -10, marginLeft: 15, marginRight: 15 }}
          />

          <Echarts option={option || {}} height={300} />
          <Table
            style={{ margin: 15 }}
            borderStyle={{ borderWidth: 2, borderColor: '#eee' }}
          >
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            <Rows data={tableData} textStyle={styles.text} />
          </Table>
          {/* <Echarts option={option2} height={300}/> */}
        </ScrollView>
      </CommonView>
    );
  }
}

const styles = StyleSheet.create({
  header: {},
  left: {
    width: ScreenUtil.deviceWidth() / 3.0 - 15,

    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 15,
    height: 30,
  },
  right: {
    width: (ScreenUtil.deviceWidth() / 3.0) * 2 - 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 30,
  },
  leftText: {
    fontSize: 14,
    color: '#666',
  },
  rightText: {
    fontSize: 14,
    color: '#666',
  },
  text: {
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    color: '#666',
  },
  name: {
    color: '#666',
    fontSize: 14,
    paddingLeft: 10,
  },
});

const mapStateToProps = ({ buildingReducer }) => {
  return {
    selectBuilding: buildingReducer.selectBuilding,
  };
};
export default connect(mapStateToProps)(WeiXiuRatePage);
