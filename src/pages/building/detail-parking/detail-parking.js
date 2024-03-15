//车库详情
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import BasePage from '../../base/base';
import { Flex,WhiteSpace } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import DetailBuildingService from './detail-parking-service';
import ScreenUtil from '../../../utils/screen-util';
import common from '../../../utils/common';
import BackTitleNavigationBar from '../../../components/back-title-navigation-bar';
import CommonView from '../../../components/CommonView';
import numeral from 'numeral';

export default class DetailParkingPage extends BasePage {
  // static navigationOptions = ({ navigation }) => { 
  //   return {
  //     header: null,
  //   };
  // };
  constructor(props) {
    super(props);
    let item = common.getValueFromProps(this.props);
    this.state = {
      data: [],
      item,
      status: [],
      detail: {}
    };
  }

  componentDidMount() {
    let id = this.state.item.id;

    //获取车位
    DetailBuildingService.getPStructs(id, 9).then((res) => {
      this.setState({ data: res });
      //console.log(res);
    });

    //获取状态
    DetailBuildingService.getPropertyStatus().then((status) => {
      this.setState({ status });
    });

    //详情
    DetailBuildingService.getBuildingDetail(id).then((detail) => {
      this.setState({ detail });
    });
  }

  open = (index, isOpen) => {
    let mydata = this.state.data;//[...this.state.data];
    //let rooms = data[index];
    mydata = mydata.map((item, i) => {
      return {
        ...item,
        open: isOpen ? (i === index ? isOpen : !isOpen) : false,
      };
    });

    // data = data.map((item, i) => {
    //   return {
    //     ...item,
    //     rooms: i === index ? rooms : item.rooms,
    //   };
    // });

    this.setState({ data: mydata });
  };

  // onSubmit = (value) => { 
  // };

  render() {
    const { status, item, data, detail } = this.state;
    return (
      <CommonView style={{ flex: 1 }}>
        <View>
          <BackTitleNavigationBar
            {...this.props}
            title={this.state.item ? this.state.item.allName : ''}
          />
          <ScrollView style={{ height: ScreenUtil.contentHeight() }}>
            <Flex
              direction="row"
              justify="between"
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              <Text style={styles.name}>{detail.name}</Text>
              <Text style={styles.name}>
                {/* {detail.rentareasum} / {detail.areasum} */}
                {numeral(detail.areasum).format('0,0.00')}{Macro.meter_square}
              </Text>
            </Flex>

            <ScrollView>
              <Flex
                direction="row"
                justify="between"
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 15,
                  paddingRight: 15
                }}
              >
                <Text style={styles.leftText}>在租面积：</Text>
                <Text style={styles.rightText}>{numeral(detail.rentareasum).format('0,0.00')}{Macro.meter_square} ({detail.rentarearate}%)</Text>
              </Flex>
              <Flex
                direction="row"
                justify="between"
                style={{ paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
              >
                <Text style={styles.leftText}>可招商面积：</Text>
                <Text style={styles.rightText}>
                  {numeral(detail.investmentareasum).format('0,0.00')}{Macro.meter_square} ({detail.investmentarearate}%)
                </Text>
              </Flex>
              <Flex
                direction="row"
                justify="between"
                style={{ paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                <Text style={styles.leftText}>入住率：</Text>
                <Text style={styles.rightText}>{detail.completionRate}%</Text>
              </Flex>

              <Flex direction="row" style={{ paddingTop: 20 }}>
                {status.map((item, i) => (
                  <Flex
                    key={'flex' + item.id}
                    direction="column"
                    style={styles.div}>
                    <View
                      key={'view' + item.id}
                      style={[
                        styles.square,
                        {
                          borderWidth: 1,
                          borderColor: '#7C8384',
                          backgroundColor: item.code
                        }
                      ]}
                    />
                    <Text style={styles.top}>{item.value}</Text>
                  </Flex>
                ))}
              </Flex>
            </ScrollView>

            <WhiteSpace />

            <ScrollView>
              <Flex
                key={'sectionIndexitem'}
                direction="column"
                align="start"
              >
                <Flex
                  style={{
                    paddingTop: 15,
                    paddingBottom: 10,
                    paddingLeft: 15
                  }}
                >
                  <Flex>
                    <Text style={{ color: '#666' }}>
                      {item.name}
                    </Text>
                  </Flex>
                  <Text
                    style={{
                      paddingLeft: 10,
                      color: '#333'
                    }}>{numeral(item.area).format('0,0.00')}{Macro.meter_square}
                  </Text>
                </Flex>

                <ScrollView
                  key={'roomIndexite'}
                  horizontal={true}
                  style={{ width: ScreenUtil.deviceWidth() }}>
                  {data.map((it, index) => {
                    //获取背景色
                    const thisState = status.filter((item) => item.value == it.state);
                    const color = thisState.length > 0 ? thisState[0].code : '';
                    return (
                      <View
                        key={index + 'it'}
                        style={{ paddingBottom: 5, paddingLeft: index === 0 ? 15 : 5 }}
                      >
                        {it.open === true ? (
                          <Flex>
                            <TouchableWithoutFeedback
                              onPress={() =>
                                this.open(
                                  index,
                                  false
                                )
                              }
                            >
                              <Flex
                                direction="column"
                                justify="between"
                                align="start"
                                style={[
                                  {
                                    height: 100,
                                    paddingRight: 15,
                                    paddingLeft: 5,
                                    //paddingBottom: 5,
                                    backgroundColor: color,//设置颜色
                                    borderWidth: 1,
                                    borderColor: '#7C8384'
                                  },
                                  //it.state === 0 ? styles.dash : null
                                ]}
                              >
                                <Flex align="start" direction="column">
                                  <Text style={styles.color_top}>
                                    {it.name} {it.area}{Macro.meter_square}
                                  </Text>
                                  <Text style={styles.color_top}>
                                    {it.tenantName}
                                  </Text>
                                  <Text style={styles.color_top}>
                                    {it.signboardName}
                                  </Text>
                                </Flex>
                              </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                              onPress={() =>
                                this.props.navigation.navigate(
                                  'SecondDetail',
                                  { data: it },
                                )
                              }>
                              <Flex
                                style={[
                                  {
                                    marginLeft: 5,
                                    height: 100,
                                    backgroundColor: color,//设置颜色
                                    borderWidth: 1,
                                    borderColor: '#7C8384'
                                  },
                                  //it.state === 0 ? styles.dash : null,
                                ]}>
                                <Text style={{ color: 'black' }}>
                                  {' '}&gt;{' '}
                                </Text>
                              </Flex>
                            </TouchableWithoutFeedback>
                          </Flex>
                        ) : (
                          <TouchableWithoutFeedback
                            onPress={() =>
                              this.open(
                                index,
                                true
                              )
                            }>
                            <Flex
                              direction="column"
                              justify="between"
                              align="start"
                              style={[
                                {
                                  height: 100,
                                  backgroundColor: color,//设置颜色
                                  borderWidth: 1,
                                  borderColor: '#7C8384',
                                  width: (ScreenUtil.deviceWidth() - 30 - 5 * 4) / 5,
                                  paddingLeft: 5
                                }
                              ]}>
                              <Flex align="start" direction="column">
                                <Text style={styles.color_top}>
                                  {it.name} {it.area}{Macro.meter_square}
                                </Text>
                                <Text style={styles.color_top}>
                                  {it.tenantName}
                                </Text>
                                <Text style={styles.color_top}>
                                  {it.signboardName}
                                </Text>
                              </Flex>
                            </Flex>
                          </TouchableWithoutFeedback>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              </Flex>
            </ScrollView>
          </ScrollView>
        </View>
      </CommonView>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 16,
    color: '#2d3040',
    fontWeight: '600'
  },
  leftText: {
    fontSize: 14,
    color: '#7b7b7d'
  },
  rightText: {
    fontSize: 14,
    color: '#2b2d31',
    fontWeight: '600'
  },
  div: {
    width: ScreenUtil.deviceWidth() / 7.0,
    height: ScreenUtil.deviceWidth() / 7.0 + 20,
    // borderBottomColor: '#ececec',
    // borderBottomWidth: 1
  },
  square: {
    // backgroundColor: 'red',
    width: 20,
    height: 20
  },
  top: {
    paddingTop: 5,
    paddingBottom: 5,
    color: '#565759',
    fontSize: 12
  },
  bottom: {
    color: '#565759',
    fontSize: 12
  },
  color_top: {
    //color: 'white',
    fontSize: 12,
    paddingTop: 5
  },
  color_bottom: {
    color: '#333',
    fontSize: 12,
    textAlign: 'left',
    backgroundColor: 'white',
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 2,
    paddingBottom: 5,
    marginBottom: 4
  },
  dash: {
    borderColor: '#5c665b',
    borderWidth: 1,
    borderStyle: 'dashed'
  },
});
