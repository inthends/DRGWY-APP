import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

import BasePage from '../../base/base';
import { Flex } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import DetailBuildingService from './detail-building-service';
import ScreenUtil from '../../../utils/screen-util';
import common from '../../../utils/common';
import BackTitleNavigationBar from '../../../components/back-title-navigation-bar';
import CommonView from '../../../components/CommonView';

export default class DetailBuildingPage extends BasePage {
  static navigationOptions = ({ navigation }) => {
    console.log(1, navigation);
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    let item = common.getValueFromProps(this.props);
    this.state = {
      data: [],
      item,
      detail: {},
    };

    //
  }

  componentDidMount(): void {
    let id = this.state.item.id;
    DetailBuildingService.getPStructs(id, 4).then((res) => {
      const floors = res || [];
      const promises = floors.map((item) => {
        return DetailBuildingService.getPStructs(item.id, 5).then((res) => {
          const allRooms = res || [];
          const rooms = common.convertArrayToSmallArray(allRooms);
          return {
            ...item,
            rooms,
          };
        });
      });
      Promise.all(promises).then((res) => {
        this.setState({ data: res });
      });
    });
    DetailBuildingService.getBuildingDetail(id).then((detail) => {
      this.setState({ detail });
    });
  }

  open = (sectionIndex, roomIndex, index, isOpen) => {
    console.log(this.state.data);
    console.log(roomIndex);
    console.log(index);
    let data = [...this.state.data];

    let sections = data[sectionIndex].rooms;
    let rooms = sections[roomIndex];
    console.log(data);
    console.log(rooms);
    rooms = rooms.map((item, i) => {
      return {
        ...item,
        open: isOpen ? (i === index ? isOpen : !isOpen) : false,
      };
    });
    console.log('111', rooms);

    sections = sections.map((item, i) => {
      return i === roomIndex ? rooms : item;
    });
    data = data.map((item, i) => {
      return {
        ...item,
        rooms: i === sectionIndex ? sections : item.rooms,
      };
    });
    this.setState({ data: data });
  };

  onSubmit = (value) => {
    // alert(1);
  };

  render() {
    const { detail } = this.state;
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
                paddingTop: 30,
                paddingBottom: 10,
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              <Text style={styles.name}>{detail.name}</Text>
              <Text style={styles.name}>
                {detail.rentareasum} / {detail.areasum}
                {Macro.meter_square}
              </Text>
            </Flex>
            <ScrollView>
              <Flex
                direction="row"
                justify="between"
                style={{
                  paddingTop: 20,
                  paddingBottom: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
              >
                <Text style={styles.leftText}>管理数量：</Text>
                <Text style={styles.rightText}>{detail.areasum}</Text>
              </Flex>
              <Flex
                direction="row"
                justify="between"
                style={{ paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
              >
                <Text style={styles.leftText}>在租数量：</Text>
                <Text style={styles.rightText}>
                  {detail.rentareasum}
                  {Macro.meter_square}({detail.rentarearate}%)
                </Text>
              </Flex>
              <Flex
                direction="row"
                justify="between"
                style={{ paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
              >
                <Text style={styles.leftText}>可招商数量：</Text>
                <Text style={styles.rightText}>
                  {detail.investmentareasum}
                  {Macro.meter_square}({detail.investmentarearate}%)
                </Text>
              </Flex>
              <Flex
                direction="row"
                justify="between"
                style={{ paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
              >
                <Text style={styles.leftText}>在租均价：</Text>
                <Text style={styles.rightText}>
                  {detail.rentingaverprice}
                  {Macro.yuan_meter_day}
                </Text>
              </Flex>
              <Flex
                direction="row"
                justify="between"
                style={{ paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
              >
                <Text style={styles.leftText}>入住率：</Text>
                <Text style={styles.rightText}>{detail.completionRate}%</Text>
              </Flex>
              <Flex direction="row" style={{ paddingTop: 30 }}>
                <Flex direction="column" style={styles.div}>
                  <View
                    style={[
                      styles.square,
                      { backgroundColor: Macro.color_small_2019 },
                    ]}
                  />
                  <Text style={[styles.top, { paddingLeft: 5 }]}>~2019</Text>
                  <Text style={styles.bottom}>(0)</Text>
                </Flex>
                <Flex direction="column" style={styles.div}>
                  <View
                    style={[
                      styles.square,
                      { backgroundColor: Macro.color_2019 },
                    ]}
                  />
                  <Text style={styles.top}>2019</Text>
                  <Text style={styles.bottom}>(0)</Text>
                </Flex>
                <Flex direction="column" style={styles.div}>
                  <View
                    style={[
                      styles.square,
                      { backgroundColor: Macro.color_2020 },
                    ]}
                  />
                  <Text style={styles.top}>2020</Text>
                  <Text style={styles.bottom}>(0)</Text>
                </Flex>
                <Flex direction="column" style={styles.div}>
                  <View
                    style={[
                      styles.square,
                      { backgroundColor: Macro.color_2021 },
                    ]}
                  />
                  <Text style={styles.top}>2021</Text>
                  <Text style={styles.bottom}>(0)</Text>
                </Flex>
                <Flex direction="column" style={styles.div}>
                  <View
                    style={[
                      styles.square,
                      { backgroundColor: Macro.color_2022 },
                    ]}
                  />
                  <Text style={styles.top}>2022+</Text>
                  <Text style={styles.bottom}>(0)</Text>
                </Flex>
                <Flex direction="column" style={styles.div}>
                  <View
                    style={[
                      styles.square,
                      { backgroundColor: Macro.color_free },
                    ]}
                  />
                  <Text style={styles.top}>空置中</Text>
                  <Text style={styles.bottom}>(0)</Text>
                </Flex>
                <Flex direction="column" style={styles.div}>
                  <View
                    style={[
                      styles.square,
                      {
                        // backgroundColor: Macro.color_business,
                        borderWidth: 1,
                        borderColor: '#999',
                        borderStyle: 'dotted',
                      },
                    ]}
                  />
                  <Text style={styles.top}>可招商</Text>
                  <Text style={styles.bottom}>(0)</Text>
                </Flex>
              </Flex>
            </ScrollView>
            <ScrollView>
              {this.state.data.map((item, sectionIndex) => {
                return (
                  <Flex
                    key={sectionIndex + 'item'}
                    direction="column"
                    align="start"
                  >
                    <Flex
                      style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 15,
                      }}
                    >
                      <Flex
                        justify="center"
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: '#eee',
                          borderRadius: 12,
                        }}
                      >
                        <Text style={{ color: '#666' }}>
                          {item.id.substring(
                            item.id.length - 2,
                            item.id.length,
                          )}
                        </Text>
                      </Flex>
                      <Text
                        style={{
                          paddingLeft: 10,
                          color: '#333',
                        }}
                      >
                        管理数量({Macro.meter_square})：{item.area}
                      </Text>
                    </Flex>

                    {item.rooms.map((room, roomIndex) => {
                      return (
                        <ScrollView
                          key={roomIndex + 'ite'}
                          horizontal={true}
                          style={{ width: ScreenUtil.deviceWidth() }}
                        >
                          {room.map((it, index) => {
                            return (
                              <View
                                key={index + 'it'}
                                style={{ paddingLeft: index === 0 ? 15 : 5 }}
                              >
                                {it.open === true ? (
                                  <Flex>
                                    <TouchableWithoutFeedback
                                      onPress={() =>
                                        this.open(
                                          sectionIndex,
                                          roomIndex,
                                          index,
                                          false,
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
                                            backgroundColor: '#f5d14c',
                                            paddingRight: 15,
                                            paddingLeft: 5,
                                            paddingBottom: 5,
                                          },
                                          it.state === 0 ? styles.dash : null,
                                        ]}
                                      >
                                        <Flex align="start" direction="column">
                                          <Text style={styles.color_top}>
                                            {it.name}室
                                          </Text>
                                          <Text style={styles.color_top}>
                                            {it.area}
                                            {Macro.meter_square}/{it.tenantName}
                                          </Text>
                                        </Flex>
                                        <Flex align="start" direction="column">
                                          {it.ContractCounts ? (
                                            <Text style={styles.color_top}>
                                              {it.ContractCounts}需求
                                            </Text>
                                          ) : null}
                                          {it.RequireCounts ? (
                                            <Text style={styles.color_top}>
                                              {it.RequireCounts}需求
                                            </Text>
                                          ) : null}
                                        </Flex>
                                      </Flex>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback
                                      onPress={() =>
                                        this.props.navigation.navigate(
                                          'SecondDetail',
                                          { data: it },
                                        )
                                      }
                                    >
                                      <Flex
                                        style={[
                                          {
                                            backgroundColor: '#f5d14c',
                                            marginLeft: 5,
                                            height: 100,
                                          },
                                          it.state === 0 ? styles.dash : null,
                                        ]}
                                      >
                                        <Text style={{ color: 'white' }}>
                                          {' '}
                                          >{' '}
                                        </Text>
                                      </Flex>
                                    </TouchableWithoutFeedback>
                                  </Flex>
                                ) : (
                                  <TouchableWithoutFeedback
                                    onPress={() =>
                                      this.open(
                                        sectionIndex,
                                        roomIndex,
                                        index,
                                        true,
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
                                          backgroundColor: '#f5d14c',
                                          width:
                                            (ScreenUtil.deviceWidth() -
                                              30 -
                                              5 * 4) /
                                            5,
                                          paddingLeft: 5,
                                        },
                                        it.state === 0 ? styles.dash : null,
                                      ]}
                                    >
                                      <Flex align="start" direction="column">
                                        <Text style={styles.color_top}>
                                          {it.name}室
                                        </Text>
                                        <Text style={styles.color_top}>
                                          {it.area}
                                          {Macro.meter_square}/{it.tenantName}
                                        </Text>
                                      </Flex>
                                      <Flex align="start" direction="column">
                                        {it.ContractCounts ? (
                                          <Text style={styles.color_top}>
                                            {it.ContractCounts}需求
                                          </Text>
                                        ) : null}
                                        {it.RequireCounts ? (
                                          <Text style={styles.color_top}>
                                            {it.RequireCounts}需求
                                          </Text>
                                        ) : null}
                                      </Flex>
                                    </Flex>
                                  </TouchableWithoutFeedback>
                                )}
                              </View>
                            );
                          })}
                        </ScrollView>
                      );
                    })}
                  </Flex>
                );
              })}
            </ScrollView>
          </ScrollView>
        </View>
      </CommonView>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    color: '#2d3040',
    fontWeight: '600',
  },
  leftText: {
    fontSize: 14,
    color: '#7b7b7d',
  },
  rightText: {
    fontSize: 14,
    color: '#2b2d31',
    fontWeight: '600',
  },
  div: {
    width: ScreenUtil.deviceWidth() / 7.0,
    height: ScreenUtil.deviceWidth() / 7.0 + 30,
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
  },
  square: {
    // backgroundColor: 'red',
    width: 20,
    height: 20,
  },
  top: {
    paddingTop: 5,
    paddingBottom: 5,
    color: '#565759',
    fontSize: 12,
  },
  bottom: {
    color: '#565759',
    fontSize: 12,
  },
  color_top: {
    color: 'white',
    fontSize: 12,
    paddingTop: 5,
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
    marginBottom: 4,
  },
  dash: {
    borderColor: '#5c665b',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
