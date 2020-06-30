import React, {Component} from 'react';
import {Image, Dimensions, Text, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {
    createBottomTabNavigator,
    createAppContainer,
    createStackNavigator,
    createDrawerNavigator,
} from 'react-navigation';
import BuildingPage from '../building/building';
import WorkPage from '../work/work';
import MinePage from '../mine/mine';
import NavigatorPage from '../navigator/navigator';
import HomePage from '../home/home';
import SecondDetailBuildingPage from '../building/second-detail-buinding/second-detail-buinding';
import ManagerBuildingPage from '../../pages/building/manager-building/manager-building';
import DetailBuildingPage from '../building/detail-building/detail-building';
import BuildingsPage from '../building/buildings/buildings';
import FeeStatisticPage from '../navigator/fee-statistic/fee-statistic';
import {Icon} from '@ant-design/react-native';
import AddWorkPage from '../work/add-work';
import PersonInfoPage from '../mine/person-info';
import SettingPage from '../mine/setting';
import ModifyPsdPage from '../mine/modify-psd';
import SelectAddressPage from '../work/select-address';
import TaskListPage from '../work/task/task-list';
import FuWuDanListDetailPage from '../work/task/fu-wu-dan-list-detail';
import PaiDanListDetailPage from '../work/task/pai-dan-list-detail';
import JieDanListDetailPage from '../work/task/jie-dan-list-detail';
import KaiGongListDetailPage from '../work/task/kai-gong-list-detail';
import WanChengListDetailPage from '../work/task/wan-cheng-list-detail';
import SelectPaiDanPerson from '../work/task/select-pai-dan-person';
import FeeHousePage from '../navigator/fee-housing';
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
import JianYanListDetailPage from '../work/task/jian-yan-list-detail';
import HuiFangDetailPage from '../work/task/hui-fang-detail';
import ScanScreen from '../navigator/qrcode-scanner';
import ScanOnly from '../navigator/ScanOnly';
import ScanSS from '../navigator/scan-ss';

import XunJianPage from '../navigator/xunjian/xunjian';
import TaskPage from '../navigator/xunjian/task';
import XunJianDetailPage from '../navigator/xunjian/xunjian-detail';
import SelectXunJianPerson from '../navigator/xunjian/select-xunjian';
import StartXunJianPage from '../navigator/xunjian/start-xunjian';
import XunJianPointDetailPage from '../navigator/xunjian/xunjian-point-detail';
import XunjianBeforeStart from '../navigator/xunjian/xunjian-before-start';
import YiQingPage from '../building/yiqing/yiqing';
import YiQingInfoPage from '../building/yiqing/yiqing-info';
import ChaoBiaoPage from '../navigator/chao-biao/chao-biao';
import NewsList from '../work/news-list';
import FeeChargeDetail from '../navigator/fee-charge-detail';

const BuildingNavigator = createStackNavigator({

    Building: {
        screen: BuildingPage,
        navigationOptions: (navigation) => ({
            title: '楼宇',
            headerBackTitle: null,
            header: null,
        }),
    },
    SecondDetail: SecondDetailBuildingPage,
    DetailBuilding: DetailBuildingPage,
    Buildings: BuildingsPage,
    Home: HomePage,
    yiqing: YiQingPage,
    yiqinginfo: YiQingInfoPage,
    scanForHome: ScanOnly,
    newsList: NewsList,
    feeAdd: FeeAddPage,
}, {

    containerOptions: (options) => {
        const {navigation} = options;
        DeviceEventEmitter.emit('currentNavigation', navigation);
        //console.log('navigation 对象', navigation);
        return {
            options,
        };
    },
});
BuildingNavigator.navigationOptions = ({navigation}) => ({
    tabBarVisible: navigation.state.index === 0,
});

const navigatorNavigator = createStackNavigator({
    Navigator: {
        screen: NavigatorPage,
    },
    FeeStatistic: {
        screen: FeeStatisticPage,
        navigationOptions: () => ({
            title: '统计分析',
        }),
    },
    feeRooms: FeeRoomsPage,//房间
    feeParkings: FeeParkingsPage,//车位
    feeBuildings: FeeBuildingsPage,
    feeHouse: FeeHousePage,
    e_fuwu: EstateFuwuPage,
    feeDetail: FeeDetailPage,
    feeAdd: FeeAddPage,
    fuwuD: EfuwuDetailPage,

    weixiuD: EweixiuDetailPage,//服务单页面点击关联单据，跳转到维修单，只能查看

    tousuD: EtousuDetailPage,
    e_weixiu: EstateWeixiuPage,
    e_tousu: EstateTousuPage,
    selectPaidanPerson: SelectPaiDanPerson,
    charge: FeeChargeDetail,

    collection: CollectionRatePage,
    zijinliu: ZiJinLiuPage,
    qianfei: QianFeiZhangLingPage,
    weixiu_s: WeiXiuRatePage,
    tousu_s: TouSuPage,
    huifang_s: HuiFangRatePage,
    scan: ScanScreen,

    service: FuWuDanListDetailPage,
    wancheng: WanChengListDetailPage,
    jianyan: JianYanListDetailPage,
    kaigong: KaiGongListDetailPage,
    jiedan: JieDanListDetailPage,
    paidan: PaiDanListDetailPage,
    huifang: HuiFangDetailPage,
    xunjian: XunJianPage,
    xunjiantask: TaskPage,
    xunjianDetail: XunJianDetailPage,
    xunjianPointDetail: XunJianPointDetailPage,
    xunjianBeforeStart: XunjianBeforeStart,

    selectXunjian: SelectXunJianPerson,
    startxunjian: StartXunJianPage,
    addTaskWork: AddWorkPage,
    scanForWork: ScanOnly,
    chaobiao: ChaoBiaoPage,
    newsList: NewsList,


});
navigatorNavigator.navigationOptions = ({navigation}) => ({
    tabBarVisible: navigation.state.index === 0,
});

const WorkNavigator = createStackNavigator({
    // select: SelectAddressPage,
    // AddWork: AddWorkPage,
    // Task: TaskListPage, 
    Work: {
        screen: WorkPage,
        navigationOptions: () => ({
            title: '工作台',
            headerBackTitle: null,
        }),
    },
    AddWork: AddWorkPage,
    select: SelectAddressPage,
    service: FuWuDanListDetailPage,
    wancheng: WanChengListDetailPage,
    jianyan: JianYanListDetailPage,
    kaigong: KaiGongListDetailPage,
    jiedan: JieDanListDetailPage,
    paidan: PaiDanListDetailPage,
    huifang: HuiFangDetailPage,
    selectPaidanPerson: SelectPaiDanPerson,
    scanonly: ScanOnly,
    scandemo: ScanSS,
    Task: TaskListPage,
    newsList: NewsList,


});
WorkNavigator.navigationOptions = ({navigation}) => ({
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
});
MineNavigator.navigationOptions = ({navigation}) => ({
    tabBarVisible: navigation.state.index === 0,
});

const tabbar = createBottomTabNavigator({
    // Mine: {
    //     screen: MineNavigator,
    //     navigationOptions: () => ({
    //         title: '我',
    //         headerBackTitle: null,
    //     }),
    // },
    //

    Building: {
        screen: BuildingNavigator,
        navigationOptions: () => ({
            title: '楼宇',
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


    // Work: {
    //     screen: WorkNavigator,
    //     navigationOptions: () => ({
    //         title: '工作台',
    //         headerBackTitle: null,
    //     }),
    // },
    Mine: {
        screen: MineNavigator,
        navigationOptions: () => ({
            title: '我',
            headerBackTitle: null,
        }),
    },

}, {
    tabBarOptions: {
        activeTintColor: '#2491C4',
        inactiveTintColor: '#6F757C',
        labelStyle: {
            fontSize: 14,
        },
        tabStyle: {
            // padding:1
        },

    },
    defaultNavigationOptions: ({navigation}) => {
        if (navigation.isFocused()) {
            console.log('navigation 对象', navigation);
            DeviceEventEmitter.emit('currentNavigation', navigation);
        }

        return {

            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                let imageUrl;
                if (routeName === 'Building') {
                    if (focused) {
                        imageUrl = require('../../static/images/tabbar/ly_h.png');
                    } else {
                        imageUrl = require('../../static/images/tabbar/ly_n.png');
                    }
                } else if (routeName === 'Navigator') {
                    if (focused) {
                        imageUrl = require('../../static/images/tabbar/dh_h.png');
                    } else {
                        imageUrl = require('../../static/images/tabbar/dh_n.png');
                    }
                } else if (routeName === 'Work') {
                    if (focused) {
                        imageUrl = require('../../static/images/tabbar/gz_h.png');
                    } else {
                        imageUrl = require('../../static/images/tabbar/gz_n.png');
                    }
                } else {
                    if (focused) {
                        imageUrl = require('../../static/images/tabbar/me_h.png');
                    } else {
                        imageUrl = require('../../static/images/tabbar/me_n.png');
                    }
                }


                // You can return any component that you like here!
                return <Image
                    style={{width: 15, height: 18}}
                    source={imageUrl}
                />;
            },
        };
    },

});
const {width, height} = Dimensions.get('window');

const Drawer = createDrawerNavigator({
        TabBar: {
            screen: tabbar,
            navigationOptions: {
                header: null,
            },
        },
    },
    {
        drawerPosition: 'left',
        drawerWidth: width * 0.8,
        drawerLockMode: 'locked-closed',
        useNativeAnimations: true,
        overlayColor: '#000000b3',
        contentComponent: props => {
            return <ManagerBuildingPage {...props}/>;
        },
    });


export default createAppContainer(Drawer);
