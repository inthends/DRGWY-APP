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

import BuildingPage from '../building/building';
import WorkPage from '../work/work';
import MinePage from '../mine/mine';
import NavigatorPage from '../navigator/navigator';
import HomePage from '../home/home';
import SecondDetailBuildingPage from '../building/second-detail-buinding/second-detail-buinding';
import ManagerBuildingPage from '../../pages/building/manager-building/manager-building';
import DetailBuildingPage from '../building/detail-building/detail-building';
import DetailParkingPage from '../building/detail-parking/detail-parking';
import BuildingsPage from '../building/buildings/buildings';
import FeeStatisticPage from '../navigator/fee-statistic/fee-statistic';
import AddWorkPage from '../work/add-work';
import PersonInfoPage from '../mine/person-info';
import SettingPage from '../mine/setting';
import ModifyPsdPage from '../mine/modify-psd';

//导航
import FeeHousePage from '../navigator/fee-housing';
import gdMoneyPage from '../navigator/gd-Money';
import FeeBuildingsPage from '../navigator/fee-buildings';
import FeeRoomsPage from '../navigator/fee-rooms';
import FeeParkingsPage from '../navigator/fee-parkings';
import FeeDetailPage from '../navigator/fee-detail';
import FeeAddPage from '../navigator/fee-add';
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
import EstateTousuPage from '../navigator/estate/estate-tousu';

//现场检查
import SelectAllPerson from '../work/select-all-person';
import EstateCheckPage from '../navigator/estate/estate-check';
import EcheckDetailPage from '../navigator/estate/estate-check-detail';
import EcheckAddPage from '../navigator/estate/estate-check-add';

import ScanOnly from '../navigator/ScanOnly';
import ScanSS from '../navigator/scan-ss';
import XunJianPage from '../navigator/xunjian/xunjian';
import TaskPage from '../navigator/xunjian/task';
import XunJianDetailPage from '../navigator/xunjian/xunjian-detail';
import SelectXunJianPerson from '../navigator/xunjian/select-xunjian';
import StartXunJianPage from '../navigator/xunjian/start-xunjian';

//固定资产
import GdzcPandianPage from '../navigator/gdzc/gdzc_pandian';
import GdzcDetailPage from '../navigator/gdzc/gdzc_detail';
import AddRepairPage from '../navigator/gdzc/add-repair';

import OrderlistPage from '../work/order_center/order_list';
import OrderDetailPage from '../work/order_center/order_detail';
import XunJianPointDetailPage from '../navigator/xunjian/xunjian-point-detail';
import XunjianBeforeStart from '../navigator/xunjian/xunjian-before-start';
// import YiQingPage from '../building/yiqing/yiqing';
// import YiQingInfoPage from '../building/yiqing/yiqing-info';
import ChaoBiaoPage from '../navigator/chao-biao/chao-biao';
import NewsList from '../work/news-list';
import FeeChargeDetail from '../navigator/fee-charge-detail';

//工作台
import SelectAddressPage from '../work/select-address';
import SelectPerson from '../work/select-person';
import TaskListPage from '../work/task/task-list';
import ServiceDeskDetailPage from '../work/task/servicedesk-detail';
import DispatchDetailPage from '../work/task/dispatch-detail';
import ReceiveDetailPage from '../work/task/receive-detail';
import StartDetailPage from '../work/task/start-detail';
import CompleteDetailPage from '../work/task/complete-detail';
import CheckDetailPage from '../work/task/check-detail';
import VisitDetailPage from '../work/task/visit-detail';

import AssistDetailPage from '../work/task/assist-detail';

//工作台回访查看单据
import WeixiuDetailPage from '../work/task/weixiu-detail';
import TousuDetailPage from '../work/task/tousu-detail';
import Contact from '../mine/contact/contact';
import ContactDetail from '../mine/contact/contact-detail';
import Jixiao from '../mine/jixiao';
import LouPan from '../navigator/house-infomation/lou-pan';
import LouDong from '../navigator/house-infomation/lou-dong';
import LouCeng from '../navigator/house-infomation/lou-ceng';
import LouDetail from '../navigator/house-infomation/lou-detail';
import SheBeiList from '../navigator/she-bei/list';
import ShebeiDetail from '../navigator/she-bei/detail';
import LouPark from '../navigator/house-infomation/lou-park';

import ScanScreen from '../navigator/qrcode-scanner';
import JLScanScreen from '../navigator/jlscanner';
import BCMScanScreen from '../navigator/bcmscanner';
import CIBScanScreen from '../navigator/cibscanner';
import LKLScanScreen from '../navigator/lklscanner';
import NJScanScreen from '../navigator/njscanner';

//import flow from '../flow';
import ApprovePage from '../flow';
import fukuan from '../flow/fukuan';
import jianmian from '../flow/jianmian';
import songshen from '../flow/songshen';
import chuzunew from '../flow/chuzu-new';
import chuzuchange from '../flow/chuzu-change';
import chuzutui from '../flow/chuzu-tui';
import webPage from '../flow/components/web-page';
import wuyenew from '../flow/wuye-new';
import wuyexu from '../flow/wuye-xu';
import wuyetui from '../flow/wuye-tui';
import zulinplan from '../flow/zulin-plan';
import caigou from '../flow/caigou';
import baoxiao from '../flow/baoxiao';
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
      screen: BuildingPage,
      navigationOptions: (navigation) => ({
        title: '项目',
        headerBackTitle: null,
        header: null,
      }),
    },
    SecondDetail: SecondDetailBuildingPage,

    DetailBuilding: DetailBuildingPage,
    DetailParking: DetailParkingPage,
    Buildings: BuildingsPage,
    Home: HomePage,
    // yiqing: YiQingPage,
    // yiqinginfo: YiQingInfoPage,
    scanForHome: ScanOnly,
    newsList: NewsList,
    feeAdd: FeeAddPage,
    feeDetail: FeeDetailPage,
    louDetail: LouDetail,
  },
  {
    containerOptions: (options) => {
      const { navigation } = options;
      DeviceEventEmitter.emit('currentNavigation', navigation);
      return {
        options,
      };
    },
  },
);
BuildingNavigator.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const navigatorNavigator = createStackNavigator({

  Navigator: {
    screen: NavigatorPage,
  },

  FeeStatistic: {
    screen: FeeStatisticPage,
    navigationOptions: () => ({
      title: '统计分析'
    }),
  },
  addTaskWork: AddWorkPage,
  feeRooms: FeeRoomsPage, //房间
  feeParkings: FeeParkingsPage, //车位
  feeBuildings: FeeBuildingsPage,
  feeHouse: FeeHousePage,
  gdMoney: gdMoneyPage,
  e_fuwu: EstateFuwuPage,
  feeDetail: FeeDetailPage,
  feeAdd: FeeAddPage,
  fuwuD: EfuwuDetailPage,
  weixiuD: EweixiuDetailPage, //服务单页面点击关联单据，跳转到维修单，只能查看
  tousuD: EtousuDetailPage, //投诉单详情，只能查看

  e_weixiu: EstateWeixiuPage,
  e_tousu: EstateTousuPage,

  SelectAddress: SelectAddressPage,
  SelectPerson: SelectPerson,

  charge: FeeChargeDetail,

  //现场检查
  SelectAllPerson: SelectAllPerson,
  check: EstateCheckPage,
  checkDetail: EcheckDetailPage,
  checkAdd: EcheckAddPage,
 
  //固定资产
  gdzcPandian: GdzcPandianPage,
  gdzcDetail: GdzcDetailPage,
  AddRepair: AddRepairPage,

  //订单中心
  orderlist: OrderlistPage,
  orderDetail: OrderDetailPage,

  //报表
  collection: CollectionRatePage,
  zijinliu: ZiJinLiuPage,
  qianfei: QianFeiZhangLingPage,
  weixiu_s: WeiXiuRatePage,
  tousu_s: TouSuPage,
  huifang_s: HuiFangRatePage,

  //扫码支付
  scan: ScanScreen, //威富通扫码
  jlscan: JLScanScreen, //嘉联扫码
  bcmscan: BCMScanScreen, //交通银行扫码
  cibscan: CIBScanScreen, //兴业银行扫码 
  lklscan: LKLScanScreen, //拉卡拉聚合扫码
  njscan: NJScanScreen, //南京银行扫码


  service: ServiceDeskDetailPage,
  wancheng: CompleteDetailPage,
  jianyan: CheckDetailPage,
  kaigong: StartDetailPage,
  jiedan: ReceiveDetailPage,
  paidan: DispatchDetailPage,
  huifang: VisitDetailPage, 
  assist:AssistDetailPage,


  xunjian: XunJianPage,
  xunjiantask: TaskPage,
  xunjianDetail: XunJianDetailPage,
  xunjianPointDetail: XunJianPointDetailPage,
  xunjianBeforeStart: XunjianBeforeStart,

  selectXunjian: SelectXunJianPerson,
  startxunjian: StartXunJianPage,

  scanForWork: ScanOnly,
  chaobiao: ChaoBiaoPage,
  newsList: NewsList,

  louPan: LouPan,
  louDong: LouDong,
  louCeng: LouCeng,
  louPark: LouPark,

  louDetail: LouDetail,
  shebeiList: SheBeiList,
  shebeiDetail: ShebeiDetail,
});


navigatorNavigator.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const WorkNavigator = createStackNavigator({
  Work: {
    screen: WorkPage,
    navigationOptions: () => ({
      title: '工作台',
      headerBackTitle: null,
    }),
  },
  AddWork: AddWorkPage,
  SelectAddress: SelectAddressPage,
  service: ServiceDeskDetailPage,
  weixiuView: WeixiuDetailPage, //工作台里面，待回访点击跳转的维修单，只能查看
  tousuView: TousuDetailPage, //工作台里面，待回访点击跳转的投诉单，只能查看 
  wancheng: CompleteDetailPage,
  assist:AssistDetailPage,
  jianyan: CheckDetailPage,
  kaigong: StartDetailPage,
  jiedan: ReceiveDetailPage,
  paidan: DispatchDetailPage,
  huifang: VisitDetailPage,
  SelectPerson: SelectPerson,
  scanonly: ScanOnly,
  scandemo: ScanSS,
  Task: TaskListPage,
  newsList: NewsList
});

WorkNavigator.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const ShenPiNavigator = createStackNavigator({
  Shenpi: {
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
  wuyexu,
  wuyetui,
  zulinplan,
  caigou,
  baoxiao,
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
  webPage
});

ShenPiNavigator.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const MineNavigator = createStackNavigator({
  Mine: {
    screen: MinePage,
    navigationOptions: () => ({
      headerBackTitle: null,
      header: null,
    }),
  },
  Person: PersonInfoPage,
  Setting: SettingPage,
  ModifyPsd: ModifyPsdPage,
  newsList: NewsList,
  contact: Contact,
  contactDetail: ContactDetail,
  jixiao: Jixiao,
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
        headerBackTitle: null,
      }),
    },
    Navigator: {
      screen: navigatorNavigator,
      navigationOptions: () => ({
        title: '导航',
        headerBackTitle: null,
      }),
    },
    Work: {
      screen: WorkNavigator,
      navigationOptions: () => ({
        title: '工作台',
        headerBackTitle: null,
      }),
    },
    Shenpi: {
      screen: ShenPiNavigator,
      navigationOptions: () => ({
        title: '审批',
        headerBackTitle: null,
      }),
    },
    Mine: {
      screen: MineNavigator,
      navigationOptions: () => ({
        title: '我',
        headerBackTitle: null,
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

            case 'Navigator':
              name = 'star';
              break;

            case 'Work':
              name = 'desktop';
              break;

            case 'Shenpi':
              name = 'form';
              break;

            case 'Mine':
              name = 'user';
              break;
          }

          let color = 'black';
          if (focused) {
            color = Macro.work_blue;
          }
          return <Icon name={name} size={22} color={color} />
        }
      };
    }
  }
);


const { width } = Dimensions.get('window');
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

