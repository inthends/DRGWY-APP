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
  Icon,
} from '@ant-design/react-native';
import { connect } from 'react-redux';
import ScreenUtil from '../../../utils/screen-util';
import Echarts from 'native-echarts';
import DashLine from '../../../components/dash-line';
import service from '../statistics-service';
import { Row, Rows, Table } from 'react-native-table-component';
import MyPopover from '../../../components/my-popover';
import CommonView from '../../../components/CommonView';
import { saveSelectBuilding, saveSelectDrawerType } from '../../../utils/store/actions/actions';
import { DrawerType } from '../../../utils/store/action-types/action-types';

class HuiFangRatePage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false,
      title: '回访满意度',
      headerForceInset: this.headerForceInset,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" style={{ width: 30, marginLeft: 15 }} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
          <Icon name="bars" style={{ marginRight: 15 }} color="black" />
        </TouchableWithoutFeedback>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      selectBuilding: this.props.selectBuilding || {},
      //selectBuilding: {},//默认为空，防止别的报表选择了机构，带到当前报表
      //statistics: [],
      titles: [],
      res: {
        option: null,
        tableData: [],
      },
    };
  }

  componentDidMount() {
    this.viewDidAppear = this.props.navigation.addListener(
      'didFocus',
      (obj) => {
        this.props.saveBuilding({});//加载页面清除别的页面选中的数据
        this.props.saveSelectDrawerType(DrawerType.building);

        this.setState({
          titles: ['全部', '报修', '投诉'],
        });
        this.getStatustics();
      }
    );
  }

  componentWillReceiveProps(nextProps): void {
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
          selectBuilding: nextSelectBuilding,
          //estateId: nextProps.selectBuilding.key,
          index: 0,
        },
        () => {
          this.getStatustics();
        },
      );
    }
  }

  componentWillUnmount() {
    this.viewDidAppear.remove();
  }

  // initData = () => {
  //   service.getFeeStatistics(
  //     1,
  //     this.state.selectBuilding.key,
  //     100000,
  //   ).then((statistics) => {
  //     this.setState({ statistics: statistics.data || [] }, () => {
  //       this.getStatustics();
  //     });
  //   });
  // };

  getStatustics = () => {
    const { selectBuilding, type } = this.state;
    let organizeId;
    if (selectBuilding) {
      organizeId = selectBuilding.key;
    }
    service.collectionRate(6, organizeId, type, '', '').then((res) => {
      this.setState({ res });
    });
  };

  // titleChange = (index) => {
  //   const { statistics } = this.state; 
  //   let estateId;
  //   if (index === 0) {
  //     estateId = this.state.selectBuilding.key;
  //   } else {
  //     estateId = statistics[index - 1].id;
  //   }
  //   this.setState(
  //     {
  //       index,
  //       estateId,
  //     },
  //     () => {
  //       this.getStatustics();
  //     },
  //   );
  // };

  typeChange = (title, index) => {
    const titles = this.state.titles || [];
    this.setState(
      {
        type: index == 0 ? '' : titles[index + 1] || '',
      },
      () => {
        this.getStatustics();
      },
    );
  };

  render() {
    const { titles = [] } = this.state;
    let { option, tableData, tableHead } = this.state.res;

    // option = {
    //   xAxis: {
    //     type: 'category',
    //     name: 'x',
    //     splitLine: { show: false },
    //     data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    //   },
    //   yAxis: {
    //     type: 'value',
    //     name: 'y',
    //     data: ['0', '20', '40', '60', '80', '100'],
    //   },
    //   title: { text: '', left: 'center' },
    //   series: [
    //     {
    //       name: '本年月度回访量',
    //       type: 'line',
    //       data: [3, 13, 10, 14, 9, 23, 21, 12, 3, 4, 6, 80],
    //       barWidth: null,
    //     },
    //   ],
    //   color: ['blue', '#F7A51E', 'green'],
    //   tooltip: { trigger: 'axis', formatter: null, axisPointer: null },
    //   grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    //   legend: {
    //     left: 'center',
    //     orient: 'horizontal',
    //     data: ['本年月度回访量'],
    //   },
    // };

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
        </ScrollView>
      </CommonView>
    );
  }
}

const styles = StyleSheet.create({
  left: {
    width: ScreenUtil.deviceWidth() / 3.0 - 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 15,
    height: 30
  },
  right: {
    width: (ScreenUtil.deviceWidth() / 3.0) * 2 - 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 30
  },
  text: {
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    color: '#666'
  },
  name: {
    color: '#666',
    fontSize: 14,
    paddingLeft: 10
  },
});

const mapStateToProps = ({ buildingReducer }) => {
  return {
    selectBuilding: buildingReducer.selectBuilding,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveBuilding: (item) => {
      dispatch(saveSelectBuilding(item));
    },
    saveSelectDrawerType: (item) => {
      dispatch(saveSelectDrawerType(item));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(HuiFangRatePage);
