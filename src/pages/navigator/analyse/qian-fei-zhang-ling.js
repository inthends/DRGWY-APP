import React  from 'react';
import { 
  Text,
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
import MyPopover from '../../../components/my-popover';
import CommonView from '../../../components/CommonView';
import { Table, Row, Rows } from 'react-native-table-component';

class QianFeiZhangLingPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false,
      title: '欠费账龄',
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
    };
  }

  componentDidMount(): void {
    NavigatorService.GetReceiveFeeItems().then((res) => {
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
    NavigatorService.collectionRate(3, estateId, type).then((res) => {
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
    const titles = this.state.titles || [];
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

    let {
      option,
      xName,
      yName, 
      tableData = [],
      tableHead = [],
    } = this.state.res || {};
    // console.log(123456, tableHead, tableData);

    // option =
    // {

    //       "xAxis": {
    //         "type": "category",
    //         "name": "x",
    //         "splitLine": null,
    //         "data": [
    //           "0-12",
    //           "13-24",
    //           "24-36",
    //           "36以上"
    //         ]
    //       },
    //       "yAxis": {
    //         "type": "value",
    //         "name": "y",
    //         "data": null
    //       },
    //       "title": {
    //         "text": "",
    //         "left": "center"
    //       },
    //       "series": [
    //         {
    //           "name": "",
    //           "type": "bar",
    //           "data": [
    //             350,
    //             450,
    //             200,
    //             50
    //           ],
    //           "barWidth": null
    //         }
    //       ],
    //       "color": [
    //         "blue",
    //         "#f0a825",
    //         "green",
    //         "#666"
    //       ],
    //       "tooltip": {
    //         "trigger": "axis",
    //         "formatter": null,
    //         "axisPointer": {
    //           "type": "shadow"
    //         }
    //       },
    //       "grid": {
    //         "left": "3%",
    //         "right": "4%",
    //         "bottom": "3%",
    //         "containLabel": true
    //       },
    //       "legend": null

    //   }
    // tableData = [
    //     ['0-12个月', '100', '100'],
    //     ['13-24个月', '100', '100'],
    //     ['24-36个月', '100', '100'],
    //     ['36个月以上', '100', '100'],
    //     ['合计', '100', '100'],
    // ];
    // tableHead = ['欠费月数', '欠费户数', '欠费金额'];

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

          <Text style={styles.xx}>{xName}</Text>
          <Text style={styles.xx}>{yName}</Text>
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
  xx: {
    color: '#333',
    fontSize: 14,
    paddingTop: 15,
    paddingLeft: 15,
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
export default connect(mapStateToProps)(QianFeiZhangLingPage);
