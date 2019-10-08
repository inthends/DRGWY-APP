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
import {Row, Rows, Table} from 'react-native-table-component';
import MyPopover from '../../../components/my-popover';


class HuiFangRatePage extends BasePage {

    static navigationOptions = ({navigation}) => {


        return {
            tabBarVisible: false,
            title: '回访满意度',
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
            res:{
                option:null,
                tableData:[],
            }
        };
    }

    componentDidMount(): void {
        this.initData();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({selectBuilding: nextProps.selectBuilding,estateId: nextProps.selectBuilding.key,index:0}, () => {
                this.initData();
            });
        }
    }

    initData = () => {
        NavigatorService.getFeeStatistics(1, this.state.selectBuilding.key, 100000).then(statistics => {
            this.setState({statistics: statistics.data || []}, () => {
                this.getStatustics();
            });
        });
    };

    getStatustics = () => {
        const {estateId, type} = this.state;
        NavigatorService.collectionRate(6, estateId, type).then(res => {
            this.setState({res});
        });
    };


    titleChange = (index) => {
        const {statistics} = this.state;
        console.log(this.state);
        let estateId;
        if (index === 0) {
            estateId = this.state.selectBuilding.key;
        }else {
            estateId = statistics[index - 1].id;
        }
        this.setState({
            index,
            estateId,
        }, () => {
            this.getStatustics();
        });
    };
    typeChange = (title, index) => {
        this.setState({
            type: index + 1,
        }, () => {
            this.getStatustics();
        });
    };


    render() {
        const {statistics, dataInfo} = this.state;
        const titles = [...['全部'],...statistics.map(item=>item.name)];
        console.log('t',titles)
        const {option,tableData, area,rooms,rate,tableHead } = this.state.res;


        return (

            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1}}>
                    <ScrollTitleChange onChange={this.titleChange} titles={titles}/>
                    <DashLine style={{marginTop: 10, marginLeft: 15, marginRight: 15}}/>
                    <Flex direction={'column'} style={{width: ScreenUtil.deviceWidth(), marginTop: 15}}>
                        <Flex justify={'between'} style={{width: ScreenUtil.deviceWidth() - 30, paddingBottom: 20}}>
                            <Text style={styles.name}>管理面积：{area}万{Macro.meter_square}</Text>

                            <Text style={styles.name}>房屋套数：{rooms}套</Text>


                        </Flex>
                        <Flex justify={'between'} style={{width: ScreenUtil.deviceWidth() - 30}}>
                            <Text style={styles.name}>入住率：{rate}</Text>
                            <MyPopover textStyle={{fontSize:14}} onChange={this.typeChange} titles={['全部', '收费项目类别', '不是收费项目']} visible={true}/>
                        </Flex>
                    </Flex>
                    <DashLine style={{marginTop: 15, marginLeft: 15, marginRight: 15}}/>

                    <Echarts option={option} height={300}/>
                    <Table style={{margin:15}} borderStyle={{borderWidth: 2, borderColor: '#eee'}}>
                        <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                        <Rows data={tableData} textStyle={styles.text}/>
                    </Table>


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
    text: {
        textAlign: 'center',
        paddingTop:5,
        paddingBottom:5,
        color: '#666',
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
export default connect(mapStateToProps)(HuiFangRatePage);
