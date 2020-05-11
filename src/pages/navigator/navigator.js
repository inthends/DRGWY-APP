import React, {Fragment} from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';

import BasePage from '../base/base';
import {Flex} from '@ant-design/react-native';
import Macro from '../../utils/macro';
import LoadImage from '../../components/load-image';
import CommonView from '../../components/CommonView';
import ScreenUtil from '../../utils/screen-util';
import ChaoBiaoPage from './chao-biao/chao-biao';


export default class NavigatorPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '导航',
            headerTitleStyle: {
                flex: 1,
                textAlign: 'center',
            },
        };
    };


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
        return (


            <CommonView style={{flex: 1}}>
                <ScrollView style={{flex: 1}}>
                    <Flex direction={'column'} align={'start'} style={styles.cell}>
                        <Flex style={{
                            paddingTop: 3,
                            paddingBottom: 3,
                        }}>
                            <Text style={styles.title}>财务管理</Text>
                        </Flex>

                        {/*//feeHouse*/}
                        {/*feeDetail*/}
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('feeHouse')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 19, height: 25}}
                                               defaultImg={require('../../static/images/navigator/shangmen.png')}/>
                                    <Text style={styles.content}>上门收费</Text>
                                </Flex>
                            </TouchableWithoutFeedback>


                            {/*<TouchableWithoutFeedback onPress={() => alert(1)}>*/}
                            {/*    <Flex style={styles.right}>*/}
                            {/*        <LoadImage style={{width: 22, height: 22}}*/}
                            {/*                   defaultImg={require('../../static/images/home/search.png')}/>*/}
                            {/*        <Text style={styles.content}>统计分析</Text>*/}
                            {/*    </Flex>*/}
                            {/*</TouchableWithoutFeedback>*/}
                        </Flex>
                        <Flex style={styles.line}/>

                    </Flex>
                    <Flex direction={'column'} align={'start'} style={styles.cell}>
                        <Flex style={{
                            paddingTop: 3,
                            paddingBottom: 3,
                        }}>
                            <Text style={styles.title}>物业管理</Text>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('e_fuwu')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/navigator/fuwudan.png')}/>
                                    <Text style={styles.content}>服务单</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('e_weixiu')}>
                                <Flex style={styles.right}>
                                    <LoadImage style={{width: 20, height: 22}}
                                               defaultImg={require('../../static/images/navigator/weixiudan.png')}/>
                                    <Text style={styles.content}>维修单</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('e_tousu')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/navigator/tousudan.png')}/>
                                    <Text style={styles.content}>投诉单</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjian')}>
                                <Flex style={styles.right}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/navigator/zonghexunjian.png')}/>
                                    <Text style={styles.content}>综合巡检</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('chaobiao')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/navigator/zonghexunjian.png')}/>
                                    <Text style={styles.content}>移动抄表</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {}}>
                                <Flex style={styles.left}>

                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>

                        <Flex style={styles.line}/>
                    </Flex>
                    <Flex direction={'column'} align={'start'} style={styles.cell}>
                        <Flex style={{
                            paddingTop: 3,
                            paddingBottom: 3,
                        }}>
                            <Text style={styles.title}>查询分析</Text>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('collection')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/navigator/shoujiaolv.png')}/>
                                    <Text style={styles.content}>收缴率</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('zijinliu')}>
                                <Flex style={styles.right}>
                                    <LoadImage style={{width: 20, height: 22}}
                                               defaultImg={require('../../static/images/navigator/zijinliu.png')}/>
                                    <Text style={styles.content}>资金流</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('qianfei')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 20, height: 22}}
                                               defaultImg={require('../../static/images/navigator/zlfx.png')}/>
                                    <Text style={styles.content}>账龄分析</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('weixiu_s')}>
                                <Flex style={styles.right}>
                                    <LoadImage style={{width: 20, height: 20}}
                                               defaultImg={require('../../static/images/navigator/wanchenglv.png')}/>
                                    <Text style={styles.content}>维修完成率</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('tousu_s')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 20, height: 22}}
                                               defaultImg={require('../../static/images/navigator/tousu.png')}/>
                                    <Text style={styles.content}>投诉完成率</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('huifang_s')}>
                                <Flex style={styles.right}>
                                    <LoadImage style={{width: 20, height: 22}}
                                               defaultImg={require('../../static/images/navigator/huifang.png')}/>
                                    <Text style={styles.content}>回访满意</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Flex style={styles.line}/>
                    </Flex>
                </ScrollView>
            </CommonView>

        );
    }
}

const styles = StyleSheet.create({
    cell: {
        marginTop: 20,
        marginLeft: 15,

    },
    title: {
        color: '#000000',
        fontSize: 19.44,
        paddingLeft: 6,
    },
    cellContnent: {
        marginLeft: 30,
        marginRight: 30,
    },
    content: {
        color: '#404145',
        fontSize: 17.6,
        paddingLeft: 15,
    },
    left: {
        flex: 1,
        paddingTop: 30,
    },
    right: {
        flex: 1,
        paddingLeft: 25,
        paddingTop: 30,
    },
    line: {
        marginTop: 20,
        marginBottom: 10,
        marginRight: 15,
        width: ScreenUtil.deviceWidth() - 30,
        backgroundColor: '#E0E0E0',
        height: 0.5,
    },
});
