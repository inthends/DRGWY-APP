import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  SectionList,
  TouchableWithoutFeedback,
  ImageBackground,
  Animated,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import BasePage from '../../base/base';
import BuildingHeader from '../../../components/building/building-header';
import BuildingCell from '../../../components/building/build-cell';
import {
  Button,
  Flex,
  Icon,
  List,
  WhiteSpace,
  SegmentedControl,
} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import forge from 'node-forge';
import LoadImage from '../../../components/load-image';
import { connect } from 'react-redux';
import { saveSelectBuilding } from '../../../utils/store/actions/actions';
import ScreenUtil from '../../../utils/screen-util';
import common from '../../../utils/common';
import SelectHeader from '../../../components/select-header';
import Echarts from 'native-echarts';
import AreaInfo from '../../../components/area-info';
import ScrollTitle from '../../../components/scroll-title';
import DashLine from '../../../components/dash-line';
import NavigatorService from '../navigator-service';
import ScrollTitleChange from '../../../components/scroll-title-change';
import MyPopover from '../../../components/my-popover';
import CommonView from '../../../components/CommonView';
import { Table, Row, Rows } from 'react-native-table-component';

class ZiJinLiuPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false,
      title: '资金流',
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
        option: null,
      },
    };
  }

  componentDidMount(): void {
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
    NavigatorService.collectionRate(2, estateId, type).then((res) => {
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
    this.setState(
      {
        type: index + 1,
      },
      () => {
        this.getStatustics();
      },
    );
  };

  render() {
    const { statistics, dataInfo } = this.state;
    const titles = [...['全部'], ...statistics.map((item) => item.name)];
    console.log('t', titles);
    let { option, area, rooms, rate, tableData = [] } = this.state.res;

    // option = { xAxis:
    //     { type: 'category',
    //       name: 'x',
    //       splitLine: { show: false },
    //       data: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ] },
    //    yAxis:
    //     { type: 'value',
    //       name: 'y',
    //       data: [ '0', '20', '40', '60', '80', '100' ] },
    //    title: { text: '', left: 'center' },
    //    series:
    //     [ { name: '本年月度实收',
    //         type: 'line',
    //         data: [ 12, 13, 10, 14, 9, 23, 21, 12, 3, 4, 6, 80 ] },
    //      ],
    //    color: [ 'blue', '#f0a825', 'green', '#666' ],
    //    tooltip: { trigger: 'axis', formatter: null, axisPointer: null },
    //    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    //    legend:
    //     { left: 'center',
    //       orient: 'horizontal',
    //       data: [ '本年月度实收'] } }

    return (
      <CommonView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {/* <ScrollTitleChange onChange={this.titleChange} titles={titles}/> */}

          <Flex
            direction={'column'}
            style={{ width: ScreenUtil.deviceWidth(), marginTop: 15 }}
          >
            <Flex
              justify={'between'}
              style={{
                width: ScreenUtil.deviceWidth() - 30,
                paddingBottom: 20,
              }}
            >
              <Text style={styles.name}>
                管理面积：{area}万{Macro.meter_square}
              </Text>

              <Text style={styles.name}>房屋套数：{rooms}套</Text>
            </Flex>
            <Flex
              justify={'between'}
              style={{ paddingLeft: 10, width: ScreenUtil.deviceWidth() - 30 }}
            >
              {/* <Text style={styles.name}>入住率：{rate}</Text> */}
              <MyPopover
                textStyle={{ fontSize: 14 }}
                onChange={this.typeChange}
                titles={['全部', '收费项目类别', '不是收费项目']}
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
            <Rows data={tableData} textStyle={styles.text} />
          </Table>
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
  name: {
    color: '#666',
    fontSize: 14,
    paddingLeft: 10,
  },
  text: {
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    color: '#666',
  },
});

const mapStateToProps = ({ buildingReducer }) => {
  return {
    selectBuilding: buildingReducer.selectBuilding,
  };
};
export default connect(mapStateToProps)(ZiJinLiuPage);
