import React, {Fragment} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    ScrollView,
    SectionList,
    TouchableWithoutFeedback,
    ImageBackground,
    Animated,
    FlatList,
    Image, TouchableOpacity,
} from 'react-native';

import BasePage from '../../base/base';
import BuildingHeader from '../../../components/building/building-header';
import BuildingCell from '../../../components/building/build-cell';
import {Button, Flex, Icon, List, WhiteSpace, SegmentedControl} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import forge from 'node-forge';
import LoadImage from '../../../components/load-image';
import {connect} from 'react-redux';
import {saveSelectBuilding} from '../../../utils/store/actions/actions';
import ScreenUtil from '../../../utils/screen-util';
import common from '../../../utils/common';
import SelectHeader from '../../../components/select-header';
import Echarts from 'native-echarts';
import AreaInfo from '../../../components/area-info';
import ScrollTitle from '../../../components/scroll-title';
import DashLine from '../../../components/dash-line';
import NavigatorService from '../navigator-service';
import ScrollTitleChange from '../../../components/scroll-title-change';


class QianFeiZhangLingPage extends BasePage {

    static navigationOptions = ({navigation}) => {


        return {
            tabBarVisible: false,
            title: '欠费账龄',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                    <Icon name='bars' style={{marginRight: 15}} color="black"/>
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
        this.getStatustics();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({selectBuilding: nextProps.selectBuilding}, () => {
                this.onRefresh();
            });
        }

    }
    getStatustics = () => {
        NavigatorService.getFeeStatistics(1,this.state.selectBuilding.key,100000).then(statistics=>{
            console.log(1,statistics)
            this.setState({statistics:statistics.data || []});
        })
    }

    onRefresh = () => {

    };
    titleChange = (index) => {
        // this.getStatustics();
        const {statistics} = this.state;
        let item = statistics[index-1];
        this.setState({
            estateId: item.id
        },()=>{
            this.getStatustics();
        })

    };
    typeChange = (title,index) => {
        this.setState({
            type: index+1
        },()=>{
            this.getStatustics();
        })
    };


    render() {
        const {statistics, dataInfo} = this.state;
        const titles = [...['全部'],...statistics.map(item=>item.name)];
        console.log('t',titles)
        const option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['0-12', '13-24', '24-36', '36以上'],
                }
            ],
            yAxis : [
                {
                    type : 'value',
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    barWidth: '60%',
                    data:[350, 450, 200, 50]
                }
            ],
            // color: ['green','#f0a825','blue','#666'],
            color: ['#3398DB'],

        };
        const xName = 'x 横轴欠费月数';
        const yName = 'y 纵轴欠费金额';
        return (

            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1}}>
                    <ScrollTitleChange titles={titles}/>
                    <DashLine style={{marginTop: 10, marginLeft: 15, marginRight: 15}}/>
                    <AreaInfo style={{marginTop: 15}}/>
                    <DashLine style={{marginTop: 15, marginLeft: 15, marginRight: 15}}/>

                    <Text style={styles.xx}>{xName}</Text>
                    <Text style={styles.xx}>{yName}</Text>
                    <Echarts option={option} height={300}/>

                </ScrollView>


            </SafeAreaView>

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

        width: ScreenUtil.deviceWidth() / 3.0 * 2 - 15,
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
        color:'#333',
        fontSize:14,
        paddingTop:15,
        paddingLeft:15
    },
    name: {
        color: '#666',
        fontSize: 14,
        paddingLeft: 10,
    },
});

const mapStateToProps = ({buildingReducer}) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(QianFeiZhangLingPage);
