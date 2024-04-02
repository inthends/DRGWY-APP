import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ManagerBuildingService from './manager-building-service';
import { connect } from 'react-redux';
import {
  saveSelectBuilding,
  saveSelectDrawerType,
  saveSelectTask,
  //saveSelectDepartment
} from '../../../utils/store/actions/actions';
import CommonView from '../../../components/CommonView';
import { DrawerType } from '../../../utils/store/action-types/action-types';

const SectionHeader = (props) => {
  return (
    <Flex
      direction="row"
      alige-="center"
      style={{
        width: '100%',
        paddingLeft: 15,
        backgroundColor: 'rgba(0,0,0,0.6)'
      }}
    >
      {
        //props.item.type !== 'D' 
        props.item.isleaf != true
        && (
          <Icon name={`${props.item.open ? 'minus-square' : 'plus-square'}`} />
        )}
      <Text style={styles.sectionHeader}>{props.item.title}</Text>
    </Flex>
  );
};

const SectionSecond = (props) => {
  return (
    <Flex
      direction="row"
      alige-="center"
      style={{
        width: '100%',
        paddingLeft: 40,
        backgroundColor: 'rgba(0,0,0,0.45)',
      }}
    >
      {
        //props.item.type !== 'D' 
        props.item.isLeaf != true
        && (
          <Icon name={`${props.item.open ? 'minus-square' : 'plus-square'}`} />
        )}
      <Text style={styles.sectionHeader} >{props.item.title}</Text>
    </Flex>
  );
};

const Row = (props) => {
  return (
    <Flex
      direction="row"
      alige-="center"
      style={{
        width: '100%',
        paddingLeft: 70,
        backgroundColor: 'rgba(0,0,0,0.3)'
      }}
    >
      {
        //props.item.type !== 'D' 
        props.item.isLeaf != true
        && (
          <Icon name={`${props.item.open ? 'minus-square' : 'plus-square'}`} />
        )}
      <Text style={styles.item}>{props.item.title}</Text>
    </Flex>
  );
};

const RowDD = (props) => {
  return (
    <Flex
      direction="row"
      alige-="center"
      style={{
        width: '100%',
        paddingLeft: 90,
        backgroundColor: 'rgba(0,0,0,0.15)'
      }}
    >
      {
        //props.item.type !== 'D' 
        props.item.isLeaf != true
        && (
          <Icon name={`${props.item.open ? 'minus-square' : 'plus-square'}`} />
        )}
      <Text style={styles.item}>{props.item.title}</Text>
    </Flex>
  );
};

class ManagerBuildingPage extends BasePage {

  static navigationOptions = ({ navigation }) => {
    return {
      title: '机构'
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      allData: [],
      buildingAllData: [],
      taskAllData: [],
      //departmentAllData: []
    };

    this.selectDrawerType = DrawerType.building;
    props.saveSelectDrawerType(DrawerType.building);

    ManagerBuildingService.getOrg().then((buildingAllData) => {
      this.setState({
        buildingAllData,
        allData: buildingAllData
      });
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (
      this.selectDrawerType &&
      nextProps.selectDrawerType &&
      this.selectDrawerType != nextProps.selectDrawerType
    ) {
      this.selectDrawerType = nextProps.selectDrawerType;
      if (this.selectDrawerType === DrawerType.building) {
        //机构管理处，查询楼盘使用
        const { buildingAllData } = this.state;
        if (buildingAllData.length > 0) {
          this.setState({
            allData: buildingAllData
          });
        } else {
          ManagerBuildingService.getOrg().then((buildingAllData) => {
            this.setState({
              buildingAllData,
              allData: buildingAllData
            });
          });
        }
      }
      //废弃，影响较大
      // else if (this.selectDrawerType === DrawerType.department) {
      //   //机构管理处和部门，选择人员页面头部右侧树使用
      //   const { departmentAllData } = this.state;
      //   if (departmentAllData.length > 0) {
      //     this.setState({
      //       allData: departmentAllData
      //     });
      //   } else {
      //     ManagerBuildingService.getDep().then((departmentAllData) => {
      //       this.setState({
      //         departmentAllData,
      //         allData: departmentAllData
      //       });
      //     });
      //   }
      // }
      else {
        //流程页面使用，选择单据分类
        const { taskAllData = [] } = this.state;
        if (taskAllData.length > 0) {
          this.setState({
            allData: taskAllData
          });
        } else {
          ManagerBuildingService.getFlowType().then((taskAllData) => {
            this.setState({
              taskAllData,
              allData: taskAllData
            });
          });
        }
      }
    }

    // if (
    //   !(
    //     this.selectDrawerType &&
    //     nextProps.selectBuilding &&
    //     this.selectBuilding.key === nextProps.selectBuilding.key
    //   )
    // ) {
    //   this.selectBuilding = nextProps.selectBuilding;
    //   this.onRefresh();
    // }
  }

  clickSectionHeader = (data) => {
    if (data.isLeaf == true) {
      this.clickRow(data);
      return;
    }
 
    this.clearData();//清除之前的选中值

    let allData = [...this.state.allData];
    allData = allData.map((item) => {
      if (item.key === data.key) {
        let child = item.children || [];
        let children = [...child];
        children = children.map((it) => {
          return {
            ...it,
            open: false,
          };
        });
        item = {
          ...item,
          children,
          open: !(item.open === true),
        };
      }
      return item;
    });
    this.setState({ allData: allData });
  };

  clickSectionSecond = (clickItem, clickIt) => {
    // console.log('clickIt:' + clickIt);
    // console.log('isLeaf:' + clickIt.isLeaf);
    if (
      //clickIt.type === 'D' 
      clickIt.isLeaf == true
      ||
      this.selectDrawerType === DrawerType.task) {
      this.clickRow(clickIt);//保存值
      return;
    }

    let allData = [...this.state.allData];
    allData = allData.map((item) => {
      if (item.key === clickItem.key) {
        let child = item.children || [];
        let children = [...child];
        children = children.map((it) => {
          if (it.key === clickIt.key) {
            it = {
              ...it,
              open: !(it.open === true)
            };
          }
          return it;
        });

        item = {
          ...item,
          children
        };
      }

      return item;
    });

    this.setState({ allData: allData });
  };

  clickSectionThird = (clicka, clickItem, clickIt) => { 
    //if (clickIt.type === 'D') 
    if (clickIt.isLeaf == true) {
      this.clickRow(clickIt);
      return;
    }
    let allData = [...this.state.allData];
    allData = allData.map((item) => {
      if (item.key === clicka.key) {
        let child = item.children || [];
        let children = [...child];
        children = children.map((it) => {
          if (it.key === clickItem.key) {
            let ch = it.children || [];
            let c = [...ch];
            c = c.map((iii) => {
              if (iii.key === clickIt.key) {
                iii = {
                  ...iii,
                  open: !(iii.open === true),
                };
              }
              return iii;
            });

            it = {
              ...it,
              children: c,
            };
          }
          return it;
        });
        item = {
          ...item,
          children,
        };
      }
      return item;
    });
    this.setState({ allData: allData });
  };

  clickRow = (data) => {
    if (this.selectDrawerType === DrawerType.building) {
      this.props.saveBuilding(data);
    }
    // else if (this.selectDrawerType === DrawerType.department) {
    //   this.props.saveDepartment(data);
    // }
    else {
      this.props.saveTask(data);
    }
    this.props.navigation.closeDrawer();
  };


  //清除值
  clearData = () => {
    if (this.selectDrawerType === DrawerType.building) {
      this.props.saveBuilding(null);
    }
    // else if (this.selectDrawerType === DrawerType.department) {
    //   this.props.saveDepartment(null);
    // }
    else {
      this.props.saveTask(null);
    }
  };


  render() {
    const { allData } = this.state;
    let content = allData.map((item) => {
      return (
        <View key={item.key}>
          <TouchableOpacity onPress={() => this.clickSectionHeader(item)}>
            <SectionHeader item={item} />
          </TouchableOpacity>

          {item.open === true
            ? (item.children || []).map((it) => {
              return (
                <Fragment key={it.key}>
                  <TouchableOpacity
                    onPress={() => this.clickSectionSecond(item, it)}
                  >
                    <SectionSecond item={it} />
                  </TouchableOpacity>

                  {it.open === true
                    ? (it.children || []).map((i) => {
                      return (
                        <Fragment key={i.key}>
                          <TouchableOpacity
                            onPress={() =>
                              this.clickSectionThird(item, it, i)
                            }
                          >
                            <Row item={i} />
                          </TouchableOpacity>

                          {i.open === true
                            ? (i.children || []).map((iii) => {
                              return (
                                <Fragment key={iii.key}>
                                  <TouchableOpacity
                                    onPress={() => this.clickRow(iii)}
                                  >
                                    <RowDD item={iii} />
                                  </TouchableOpacity>
                                </Fragment>
                              );
                            })
                            : null}
                        </Fragment>
                      );
                    })
                    : null}
                </Fragment>
              );
            })
            : null}
        </View>
      );
    });

    return (
      <View style={styles.all}>
        <CommonView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{this.selectDrawerType === DrawerType.task ? '单据类别' : '机构'}</Text>
            <ScrollView>{content}</ScrollView>
          </View>
        </CommonView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  all: {
    backgroundColor: Macro.color_black_trunslent,
    flex: 1
  },
  content: {
    backgroundColor: Macro.color_white
  },
  // list: {
  //   // flex: 5,
  // },
  title: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 10
  },
  container: {
    flex: 1,
    paddingTop: 22
  },

  sectionHeader: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: Macro.color_white
  },


  item: {
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    color: Macro.color_white,
    width: '100%'
  }
});

const mapStateToProps = ({ buildingReducer }) => {
  return {
    selectBuilding: buildingReducer.selectBuilding,
    selectTask: buildingReducer.selectTask || {},
    //saveSelectDepartment: buildingReducer.selectDepartment || {},
    selectDrawerType: buildingReducer.selectDrawerType
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveBuilding: (item) => {
      dispatch(saveSelectBuilding(item));
    },
    saveTask: (item) => {
      dispatch(saveSelectTask(item));
    },

    // saveDepartment: (item) => {
    //   dispatch(saveSelectDepartment(item));
    // },

    saveSelectDrawerType: (item) => {
      dispatch(saveSelectDrawerType(item));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManagerBuildingPage);
