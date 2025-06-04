import React from 'react';
import { Dimensions, DeviceEventEmitter } from 'react-native';
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import { Icon } from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ProjectPage from '../building/project';
import WorkPage from '../work/work';
import MinePage from '../mine/mine';
import StatisticsPage from '../navigator/statistics';
import HomePage from '../home/home';
import SecondDetailBuildingPage from '../building/second-detail-buinding/second-detail-buinding';
import ManagerBuildingPage from '../../pages/building/manager-building/manager-building';
import DetailBuildingPage from '../building/detail-building/detail-building';
import DetailParkingPage from '../building/detail-parking/detail-parking';
import BuildingsPage from '../building/buildings/buildings';
import FeeStatisticPage from '../navigator/fee-statistic/fee-statistic';
import AddWorkPage from '../work/add-work';
import VisitPage from '../work/visit';

import PersonInfoPage from '../mine/person-info';
import SettingPage from '../mine/setting';
import ModifyPsdPage from '../mine/modify-psd';

//统计
import FeeHousePage from '../navigator/fee/fee-housing';
import AssetsPage from '../navigator/assets/assets';
import FeeBuildingsPage from '../navigator/fee/fee-buildings';
import FeeRoomsPage from '../navigator/fee/fee-rooms';
import FeeParkingsPage from '../navigator/fee/fee-parkings';
import FeeDetailPage from '../navigator/fee/fee-detail';
import FeeAddPage from '../navigator/fee/fee-add';
import CollectionRatePage from '../navigator/analyse/collection-rate';
import ZiJinLiuPage from '../navigator/analyse/zijinliu';
import QianFeiZhangLingPage from '../navigator/analyse/qian-fei-zhang-ling';
import WeiXiuRatePage from '../navigator/analyse/wei-xiu';
import TouSuPage from '../navigator/analyse/tou-su';
import HuiFangRatePage from '../navigator/analyse/hui-fang';
import EstateFuwuPage from '../navigator/estate/estate-fuwu';
import EfuwuDetailPage from '../navigator/estate/estate-fuwu-detail';
import EtousuDetailPage from '../navigator/estate/estate-tousu-detail';
import EweixiuDetailPage from '../navigator/estate/estate-weixiu-detail';
import EstateWeixiuPage from '../navigator/estate/estate-weixiu';
//import EstateTousuPage from '../navigator/estate/estate-tousu';

//工作台

//现场检查
import SelectAllPerson from '../work/select-all-person';
import SelectRolePersonMulti from '../work/select-role-person-multi';
import EstateCheckPage from '../navigator/estate/estate-check';
import EcheckDetailPage from '../navigator/estate/estate-check-detail';
import EcheckModifyPage from '../navigator/estate/estate-check-modify';

import ScanOnly from '../navigator/scanonly';
// import ScanSS from '../navigator/scan-ss';
import XunJianPage from '../navigator/xunjian/xunjian';
import TaskPage from '../navigator/xunjian/task';
import XunJianDetailPage from '../navigator/xunjian/xunjian-detail';
// import SelectXunJianPerson from '../navigator/xunjian/select-xunjian';
import StartXunJianPage from '../navigator/xunjian/start-xunjian';

//固定资产
import GdzcPandianPage from '../navigator/assets/gdzc_pandian';
import GdzcDetailPage from '../navigator/assets/gdzc_detail';
import AddRepairPage from '../navigator/assets/add-repair';

import OrderlistPage from '../work/order_center/order_list';
import OrderDetailPage from '../work/order_center/order_detail';

import NewsList from '../work/news-list';
import FeeChargeDetail from '../navigator/fee/fee-charge-detail';

import SelectAddressPage from '../work/select-address';
import SelectRolePerson from '../work/select-role-person'; 
import SelectReceivePerson from '../work/select-receive-person';


import SelectRolePersonInspect from '../work/select-role-person-inspect';
import SelectRolePersonPolling from '../work/select-role-person-polling';

import SelectAreaPage from '../work/select-area';

import ServiceDeskDetailPage from '../work/task/servicedesk-detail';
import DispatchDetailPage from '../work/task/dispatch-detail';
import ReceiveDetailPage from '../work/task/receive-detail';
import StartDetailPage from '../work/task/start-detail';
import CompleteDetailPage from '../work/task/complete-detail';
import CheckDetailPage from '../work/task/check-detail';
import VisitDetailPage from '../work/task/visit-detail';
import AssistDetailPage from '../work/task/assist-detail';
import ApproveDetailPage from '../work/task/approve-detail';

import TaskQDListPage from '../work/task/task-qd-list';
import SelectRepairMajor from '../work/select-repairmajor';
import SelectType from '../work/select-type';

import RobDetailPage from '../work/task/rob-detail';

import TaskListPage from '../work/task/task-list';
import TaskDoneListPage from '../work/task/task-done-list';
import TaskUnFinishListPage from '../work/task/task-unfinish-list';
import TaskFinishListPage from '../work/task/task-finish-list';
import TaskUnSendListPage from '../work/task/task-unsend-list';

//服务单
import ServicedeskListPage from '../work/task/servicedesk-list';
import ServicedeskUnFinishListPage from '../work/task/servicedesk-unfinish-list';
import ServicedeskDoneListPage from '../work/task/servicedesk-done-list';

//工作台回访查看单据
import WeixiuDetailPage from '../work/task/weixiu-detail';
import TousuDetailPage from '../work/task/tousu-detail';

//我的
import Contact from '../mine/contact/contact';
import ContactDetail from '../mine/contact/contact-detail';
import VendorDetail from '../mine/contact/vendor-detail';
//import Jixiao from '../mine/jixiao'; 
import Score from '../mine/score-list';

// import LouPan from '../navigator/house-infomation/lou-pan';
// import LouDong from '../navigator/house-infomation/lou-dong';
// import LouCeng from '../navigator/house-infomation/lou-ceng';
// import LouPark from '../navigator/house-infomation/lou-park';
// import LouDetail from '../navigator/house-infomation/lou-detail';
import SheBeiList from '../navigator/she-bei/list';
import ShebeiDetail from '../navigator/she-bei/detail';
import WFTScanScreen from '../navigator/fee/wftscanner';
import JLScanScreen from '../navigator/fee/jlscanner';
import BCMScanScreen from '../navigator/fee/bcmscanner';
import CIBScanScreen from '../navigator/fee/cibscanner';
import LKLScanScreen from '../navigator/fee/lklscanner';
import NJScanScreen from '../navigator/fee/njscanner';
import CCBScanScreen from '../navigator/fee/ccbscanner';
import XunJianPointDetailPage from '../navigator/xunjian/xunjian-point-detail';
import XunjianBeforeStart from '../navigator/xunjian/xunjian-before-start';
// import YiQingPage from '../building/yiqing/yiqing';
// import YiQingInfoPage from '../building/yiqing/yiqing-info';
import ChaoBiaoPage from '../navigator/chao-biao/chao-biao';
import FeeAlertPage from '../navigator/fee/fee-alert';

//流程审批
import ApprovePage from '../flow';
import fukuan from '../flow/fukuan';
import jianmian from '../flow/jianmian';
import songshen from '../flow/songshen';
import chuzunew from '../flow/chuzu-new';
import chuzuchange from '../flow/chuzu-change';
import chuzutui from '../flow/chuzu-tui';
import webPage from '../flow/components/web-page';
import wuyenew from '../flow/wuye-new';
import wuyetui from '../flow/wuye-tui';
import wuyechange from '../flow/wuye-change';

import zulinplan from '../flow/zulin-plan';
import caigou from '../flow/caigou';
import baoxiao from '../flow/baoxiao';
import assistance from '../flow/assistance';
import matter from '../flow/matter';
import task from '../flow/task';
import admincontract from '../flow/admin-contract';
import budgetchange from '../flow/budget-change';
import settlement from '../flow/settlement';
import inquiry from '../flow/inquiry';
import budget from '../flow/budget';
import question from '../flow/question';
import goodsout from '../flow/goodsout';
import merchants from '../flow/merchants';


const BuildingNavigator = createStackNavigator(
  {
    Building: {
      screen: ProjectPage,
      navigationOptions: (navigation) => ({
        title: '项目',
        headerBackTitle: null,
        header: null
      })
    },
    DetailBuilding: DetailBuildingPage,
    DetailParking: DetailParkingPage,
    SecondDetail: SecondDetailBuildingPage,
    Buildings: BuildingsPage,
    Home: HomePage,
    //yiqing: YiQingPage,
    //yiqinginfo: YiQingInfoPage,
    //scanForHome: ScanOnly,
    //newsList: NewsList,
    feeAdd: FeeAddPage,
    feeDetail: FeeDetailPage,
    //louDetail: LouDetail
  },
  {
    containerOptions: (options) => {
      const { navigation } = options;
      DeviceEventEmitter.emit('currentNavigation', navigation);
      return {
        options
      };
    }
  }
);

BuildingNavigator.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0
});

const StatisticsNavigator = createStackNavigator({
  Statistics: {
    screen: StatisticsPage,
  },
  FeeStatistic: {
    screen: FeeStatisticPage,
    navigationOptions: () => ({
      title: '统计'
    })
  },

  //报表
  collection: CollectionRatePage,
  zijinliu: ZiJinLiuPage,
  qianfei: QianFeiZhangLingPage,
  weixiu_s: WeiXiuRatePage,
  tousu_s: TouSuPage,
  huifang_s: HuiFangRatePage,
  // louPan: LouPan,
  // louDong: LouDong,
  // louCeng: LouCeng,
  // louPark: LouPark,
  // louDetail: LouDetail,  
  fuwulist: EstateFuwuPage,
  weixiulist: EstateWeixiuPage,
  // e_tousu: EstateTousuPage,
  serverDeskView: EfuwuDetailPage,//服务单页面点击关联单据，只能查看

  weixiuD: EweixiuDetailPage, //服务单页面点击关联单据，跳转到维修单，只能查看
  tousuD: EtousuDetailPage, //投诉单详情，只能查看
});

StatisticsNavigator.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const WorkNavigator = createStackNavigator({
  Work: {
    screen: WorkPage,
    navigationOptions: () => ({
      title: '工作台',
      headerBackTitle: null
    })
  },

  visit: VisitPage,//访客登记 
  addWork: AddWorkPage,
  selectAddress: SelectAddressPage,
  selectArea: SelectAreaPage,
  service: ServiceDeskDetailPage,
  
  weixiuView: WeixiuDetailPage, //工作台里面，待回访点击跳转的维修单，只能查看
  tousuView: TousuDetailPage, //工作台里面，待回访点击跳转的投诉单，只能查看

  wancheng: CompleteDetailPage,
  assist: AssistDetailPage,
  jianyan: CheckDetailPage,
  kaigong: StartDetailPage,
  jiedan: ReceiveDetailPage,
  paidan: DispatchDetailPage,
  huifang: VisitDetailPage,
  approve: ApproveDetailPage,
  rob: RobDetailPage, 
  //scanonly: ScanOnly,
  //scandemo: ScanSS,
  task: TaskListPage,
  taskdone: TaskDoneListPage,
  taskqd: TaskQDListPage,
  taskunfinish: TaskUnFinishListPage,
  taskfinish: TaskFinishListPage,
  taskunsend: TaskUnSendListPage,

  //服务单
  feeAdd: FeeAddPage,
  servicedesk: ServicedeskListPage,
  servicedeskunfinish: ServicedeskUnFinishListPage,
  servicedeskDone: ServicedeskDoneListPage,

  newsList: NewsList,
  selectRepairMajor: SelectRepairMajor,
  selectType: SelectType,

  chaobiao: ChaoBiaoPage,
  xunjian: XunJianPage,
  xunjiantask: TaskPage,
  xunjianDetail: XunJianDetailPage,
  xunjianPointDetail: XunJianPointDetailPage,
  xunjianBeforeStart: XunjianBeforeStart,
  // selectXunjian: SelectXunJianPerson,
  startxunjian: StartXunJianPage,
  scanonly: ScanOnly,//访客登记、巡检、抄表、资产盘点扫码

  //固定资产
  assets: AssetsPage,
  gdzcPandian: GdzcPandianPage,
  gdzcDetail: GdzcDetailPage,
  //设备
  shebeiList: SheBeiList,
  shebeiDetail: ShebeiDetail,

  wftscan: WFTScanScreen, //威富通扫码
  jlscan: JLScanScreen, //嘉联扫码
  bcmscan: BCMScanScreen, //交通银行扫码
  cibscan: CIBScanScreen, //兴业银行扫码 
  lklscan: LKLScanScreen, //拉卡拉聚合扫码
  njscan: NJScanScreen, //南京银行扫码
  ccbscan: CCBScanScreen,//建设银行扫码
  //现场检查
  selectAllPerson: SelectAllPerson,
  selectRolePersonMulti: SelectRolePersonMulti,
  check: EstateCheckPage,
  checkDetail: EcheckDetailPage,
  checkModify: EcheckModifyPage,
  addTaskWork: AddWorkPage,
  addRepair: AddRepairPage,

  serverDeskView: EfuwuDetailPage,//服务单页面点击关联单据，只能查看
  weixiuD: EweixiuDetailPage, //服务单页面点击关联单据，跳转到维修单，只能查看

  //订单中心
  orderlist: OrderlistPage,
  orderDetail: OrderDetailPage,
  selectRolePerson: SelectRolePerson, 
  selectReceivePerson: SelectReceivePerson, 
  selectRolePersonInspect: SelectRolePersonInspect,
  selectRolePersonPolling:SelectRolePersonPolling,



  feeRooms: FeeRoomsPage, //房间
  feeParkings: FeeParkingsPage, //车位
  feeBuildings: FeeBuildingsPage,
  feeHouse: FeeHousePage,
  charge: FeeChargeDetail,
  feeDetail: FeeDetailPage,
  feeAdd: FeeAddPage,
  feealert: FeeAlertPage
});

WorkNavigator.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const FlowNavigator = createStackNavigator({
  Flow: {
    screen: ApprovePage,//跳转到审批中心
    navigationOptions: () => ({
      title: '审批',
      headerBackTitle: null,
    }),
  },
  fukuan,
  jianmian,
  songshen,
  chuzunew,
  chuzuchange,
  chuzutui,
  wuyenew, 
  wuyetui,
  wuyechange,
  zulinplan,
  caigou,
  baoxiao,
  assistance,
  matter,
  task,
  admincontract,
  budgetchange,
  settlement,
  inquiry,
  budget,
  question,
  goodsout,
  merchants,
  weixiuView: WeixiuDetailPage, //审批协办单，详情页面关联维修单，只能查看
  webPage
});

FlowNavigator.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const MineNavigator = createStackNavigator({
  Mine: {
    screen: MinePage,
    navigationOptions: () => ({
      headerBackTitle: null,
      header: null
    }),
  },
  Person: PersonInfoPage,
  Setting: SettingPage,
  ModifyPsd: ModifyPsdPage,
  //newsList: NewsList,
  contact: Contact,
  contactDetail: ContactDetail,
  vendorDetail: VendorDetail,
  //jixiao: Jixiao
  score: Score
});

MineNavigator.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const tabbar = createBottomTabNavigator(
  {
    Building: {
      screen: BuildingNavigator,
      navigationOptions: () => ({
        title: '项目',
        headerBackTitle: null
      })
    },
    Work: {
      screen: WorkNavigator,
      navigationOptions: () => ({
        title: '工作台',
        headerBackTitle: null
      })
    },
    Flow: {
      screen: FlowNavigator,
      navigationOptions: () => ({
        title: '审批',
        headerBackTitle: null
      })
    },
    Statistics: {
      screen: StatisticsNavigator,
      navigationOptions: () => ({
        title: '统计',
        headerBackTitle: null
      })
    },
    Mine: {
      screen: MineNavigator,
      navigationOptions: () => ({
        title: '我',
        headerBackTitle: null
      })
    }
  },
  {
    tabBarOptions: {
      activeTintColor: '#2491C4',
      inactiveTintColor: '#6F757C',
      labelStyle: {
        fontSize: 14
      },
      tabStyle: {}
    },
    defaultNavigationOptions: ({ navigation }) => {
      if (navigation.isFocused()) {
        DeviceEventEmitter.emit('currentNavigation', navigation);
      }
      // return {
      //   tabBarIcon: ({ focused
      //     //, horizontal, tintColor 
      //   }) => {
      //     const { routeName } = navigation.state;
      //     let imageUrl;
      //     if (routeName === 'Building') {
      //       if (focused) {
      //         imageUrl = require('../../static/images/tabbar/ly_h.png');
      //       } else {
      //         imageUrl = require('../../static/images/tabbar/ly_n.png');
      //       }
      //     } else if (routeName === 'Navigator') {
      //       if (focused) {
      //         imageUrl = require('../../static/images/tabbar/dh_h.png');
      //       } else {
      //         imageUrl = require('../../static/images/tabbar/dh_n.png');
      //       }
      //     } else if (routeName === 'Work') {
      //       if (focused) {
      //         imageUrl = require('../../static/images/tabbar/gz_h.png');
      //       } else {
      //         imageUrl = require('../../static/images/tabbar/gz_n.png');
      //       }
      //     }
      //     else if (routeName === 'Shenpi') {
      //       //审批
      //       if (focused) {
      //         imageUrl = require('../../static/images/tabbar/app_h.png');
      //       } else {
      //         imageUrl = require('../../static/images/tabbar/app_n.png');
      //       }
      //     }
      //     else {
      //       if (focused) {
      //         imageUrl = require('../../static/images/tabbar/me_h.png');
      //       } else {
      //         imageUrl = require('../../static/images/tabbar/me_n.png');
      //       }
      //     }
      //     // You can return any component that you like here!
      //     return <Image style={{ width: 15, height: 18 }} source={imageUrl} />;
      //   }
      // };

      return {
        tabBarIcon: ({ focused }) => {
          const { routeName } = navigation.state;
          let name;
          switch (routeName) { 
            case 'Building':
              name = 'bank';
              break; 
            case 'Work':
              name = 'desktop';
              break; 
            case 'Flow':
              name = 'form';
              break; 
            case 'Statistics':
              name = 'bar-chart';//统计
              break; 
            case 'Mine':
              name = 'user';
              break;
          }

          let color = 'black';
          if (focused) {
            color = Macro.work_blue;
          }
          return <Icon
            name={name}
            size={22}
            color={color} />
        }
      };
    }
  }
);

const { width } = Dimensions.get('window');

//创建左侧机构项目树
const Drawer = createDrawerNavigator(
  {
    TabBar: {
      screen: tabbar,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    drawerPosition: 'left',
    drawerWidth: width * 0.8,
    drawerLockMode: 'locked-closed',
    useNativeAnimations: true,
    overlayColor: '#000000b3',

    contentComponent: (props) => { 
      return <ManagerBuildingPage {...props} />;
    }
  }
);
export default createAppContainer(Drawer);

