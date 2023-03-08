import React, {Fragment} from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
} from 'react-native';

import BasePage from '../../base/base';
import SelectHeader from '../../../components/select-header';
import Echarts from 'native-echarts';
import CommonView from '../../../components/CommonView';



export default class FeeStatisticPage extends BasePage {


    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }

    componentDidMount(): void {

    }


    render() {
        const {statistics, dataInfo} = this.state;
        const option = {
            color: ['#3398DB'],
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
                    data : ['1', '2', '3', '4', '5', '6', '7','8','9','10','11','12'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'直接访问',
                    type:'bar',
                    barWidth: '60%',
                    data:[10, 52, 200, 334, 390, 330, 220,10,12,11,13,14]
                }
            ]
        };
        return (

            <View style={styles.all}>
                <StatusBar
                    animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
                    hidden={false}  //是否隐藏状态栏。
                    backgroundColor={'green'} //状态栏的背景色
                    translucent={false}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
                    // barStyle={'light-content'} // enum('default', 'light-content', 'dark-content')
                />
                <CommonView>
                    <SelectHeader/>
                    <Echarts option={option} height={300} />
                </CommonView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {},
});
