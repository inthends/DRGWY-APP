import React from 'react';
import {View, Text, Button, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import BasePage from '../base/base';
import {Icon} from '@ant-design/react-native';
import {List, WhiteSpace, Flex, TextareaItem, Switch, ActionSheet} from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import Macro from '../../utils/macro';
import ManualAction from '../../utils/store/actions/manual-action';
import MineService from './mine-service';
import {connect} from 'react-redux';
import {savehasNetwork, saveUser, saveXunJian} from '../../utils/store/actions/actions';
import XunJianService from '../navigator/xunjian/xunjian-service';
import UDToast from '../../utils/UDToast';
import WorkService from '../work/work-service';
import axios from 'axios';
import Echarts from 'native-echarts';
import DatePicker from 'react-native-datepicker';
import common from '../../utils/common';
import MyPopover from '../../components/my-popover';


class Jixiao extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '我的绩效',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),

        };
    };

    constructor(props) {
        super(props);

        console.log(11,this.props)

        Date.prototype.getYearAndMonth = function () {
            let year = this.getFullYear();
            let month = this.getMonth() + 1 + '';
            if (month.length === 1) {
                month = 0 + month;
            }
            return year + '-' + month;
        }

        let current = new Date().getYearAndMonth();
        this.state = {
            ym: common.getYM('2020-01'),
            begin: current,
            end: current,
            data:{},
        };
    }

    componentDidMount(): void {
this.getData()
    }

    getData = () => {
        const {begin,end} = this.state;
        MineService.getMyAchievement(begin,end).then(res=>{
            console.log(112,res)
            this.setState({
                data: res,
            })
        })
    }




    render() {
        const {ym,data} = this.state;

        /*
        allreceive: 0
going: 0
nottestandvisit: 0
testandvisit: 0
unfinish: 0
        */

       const {allreceive = 0,going = 0,nottestandvisit = 0,testandvisit = 0,unfinish = 0} = data;


        const items = [
            {
                'name': '待接单',
                value: going,
            },
            {
                'name': '待完成',
                value: unfinish,
            },
            {
                'name': '待检验/回访',
                value: nottestandvisit,
            },
            {
                'name': '已检验/回访',
                value: testandvisit,
            },
        ];

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 0,
                data: items.map(item=>item.name)
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: items,
                }
            ]
        };



        return (
            <View style={styles.all}>
                <Text style={styles.name}>工单绩效</Text>

                <Flex style={styles.date} justify={'around'}>
                    {/*<Text style={styles.select}>2020-08</Text>*/}
                    <View style={styles.select}>
                        <MyPopover hiddenImage={true} onChange={begin=>{
                            this.setState({
                                begin,
                            }, () => {
                                this.getData();
                            });
                        }} titles={ym} visible={true} />
                    </View>

                    <Text style={styles.zhi}>至</Text>
                    {/*<Text style={styles.select}>2020-08</Text>*/}
                    <View style={styles.select}>
                        <MyPopover hiddenImage={true} onChange={end=>{
                            this.setState({
                                end,
                            }, () => {
                                this.getData();
                            });
                        }} titles={ym} visible={true} />
                    </View>

                </Flex>

                <Text style={styles.jiedan}>总接单：{allreceive}</Text>

                <Echarts option={option || {}} height={300}/>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_white,
        flex: 1,
    },
    content: {
        backgroundColor: Macro.color_white,
        paddingLeft: 20,
        paddingRight: 20,
        height: ScreenUtil.contentHeight(),
    },
    header: {
        paddingTop: 30,
        paddingBottom: 30,
    },
    name: {
        fontSize: 20,
        color: '#333',
        paddingTop:15,
        paddingLeft: 15,
    },
    desc: {
        fontSize: 16,
        color: '#999',
        paddingTop: 5,
    },
    item: {
        fontSize: 16,
        color: '#333',

    },
    date: {
        marginTop:20,
        width:'100%',
        paddingLeft:30,
        paddingRight: 30,
        paddingTop:10,
        paddingBottom: 30
    },
    select: {
        color:'#333',
        fontSize:18,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:4,
        paddingBottom:4,
        borderStyle:'solid',
        borderWidth:1,
        borderColor: '#EEE',
        borderRadius:6,
    },
    zhi: {
        fontSize: 16,
        color:'#666',
    },
    jiedan: {
        fontSize:18,
        color:'green',
        paddingLeft:15,
    }
});

const mapStateToProps = ({buildingReducer,memberReducer}) => {
    const user = memberReducer.user || {};

    return {
        selectBuilding: buildingReducer.selectBuilding || {},
        user: {
            ...user,
            id: user.userId,
        },
    };
};


export default connect(mapStateToProps)(Jixiao);





