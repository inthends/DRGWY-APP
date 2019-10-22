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


export default class NavigatorPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '导航',
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
                            borderStyle: 'solid',
                            borderLeftWidth: 8,
                            borderLeftColor: Macro.color_f39d39,
                            paddingTop: 3,
                            paddingBottom: 3,
                        }}>
                            <Text style={styles.title}>财务管理</Text>
                        </Flex>


                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('feeHouse')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/home/search.png')}/>
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

                    </Flex>
                    <Flex direction={'column'} align={'start'} style={styles.cell}>
                        <Flex style={{
                            borderStyle: 'solid',
                            borderLeftWidth: 8,
                            borderLeftColor: Macro.color_4d8fcc,
                            paddingTop: 3,
                            paddingBottom: 3,
                        }}>
                            <Text style={styles.title}>物业管理</Text>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('e_fuwu')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/home/search.png')}/>
                                    <Text style={styles.content}>服务单</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('e_weixiu')}>
                                <Flex style={styles.right}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/home/search.png')}/>
                                    <Text style={styles.content}>维修单</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('e_tousu')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/home/search.png')}/>
                                    <Text style={styles.content}>投诉单</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                    </Flex>
                    <Flex direction={'column'} align={'start'} style={styles.cell}>
                        <Flex style={{
                            borderStyle: 'solid',
                            borderLeftWidth: 8,
                            borderLeftColor: '#ccc',
                            paddingTop: 3,
                            paddingBottom: 3,
                        }}>
                            <Text style={styles.title}>查询分析</Text>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('collection')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/home/search.png')}/>
                                    <Text style={styles.content}>收缴率</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('zijinliu')}>
                                <Flex style={styles.right}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/home/search.png')}/>
                                    <Text style={styles.content}>资金流</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('qianfei')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/home/search.png')}/>
                                    <Text style={styles.content}>账龄分析</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('weixiu_s')}>
                                <Flex style={styles.right}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/home/search.png')}/>
                                    <Text style={styles.content}>维修完成率</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Flex justify={'between'} style={styles.cellContnent}>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('tousu_s')}>
                                <Flex style={styles.left}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/home/search.png')}/>
                                    <Text style={styles.content}>投诉完成率</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('huifang_s')}>
                                <Flex style={styles.right}>
                                    <LoadImage style={{width: 22, height: 22}}
                                               defaultImg={require('../../static/images/home/search.png')}/>
                                    <Text style={styles.content}>回访满意</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
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
        fontSize: 18,
        paddingLeft: 6,
    },
    cellContnent: {
        marginLeft: 10,
        marginRight: 10,
    },
    content: {
        color: '#404145',
        fontSize: 16,
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
});
