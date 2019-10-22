import React from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from 'react-native';
import BasePage from '../base/base';
import {Flex} from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import WorkService from './work-service';
import Macro from '../../utils/macro';
import CommonView from '../../components/CommonView';


export default class WorkPage extends BasePage {
    // static navigationOptions = ({navigation}) => {
    //     return {
    //         title: '工作台',
    //         // headerRight: (
    //         //     <TouchableWithoutFeedback onPress={() => navigation.push('AddWork')}>
    //         //         <Icon name='plus' style={{marginRight: 15}} color="black"/>
    //         //     </TouchableWithoutFeedback>
    //         // ),
    //     };
    // };

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            refreshing: false,
            data:{}
        };
    }


    componentDidMount(): void {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                WorkService.workData().then(data=>{
                    console.log(123,data);
                    this.setState({data})
                })
            },
        );
    }

    componentWillUnmount(): void {
        this.viewDidAppear.remove();
    }

    getData = () => {
        this.setState({refreshing: true}, () => {
            setTimeout(() => {
                this.setState({refreshing: false});
            }, 2000);
        });
    };


    render() {
        const {data} = this.state;
        return (
            <CommonView style={{flex: 1, backgroundColor: '#efefef'}}>
                <Flex style={{paddingTop: 15, paddingBottom: 15, backgroundColor: 'white'}}>
                    <TouchableWithoutFeedback>
                        <Flex direction='column' style={{width: '25%'}}>
                            <LoadImage style={{width: 40, height: 40}}/>
                            <Text style={styles.button}>扫一扫</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.push('AddWork')}>
                        <Flex direction='column' style={{width: '25%'}}>
                            <LoadImage style={{width: 40, height: 40}}/>
                            <Text style={styles.button}>拍一拍</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <Flex direction='column' style={{width: '25%'}}>
                            <Text style={styles.top}/>
                            <Text style={styles.button}/>
                        </Flex>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <Flex direction='column' style={{width: '25%'}}>
                            <LoadImage style={{width: 40, height: 40}}/>
                            <Text style={styles.button}>签到</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                </Flex>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.getData()}
                    />
                }>
                    <Flex direction={'column'} style={{padding: 15, paddingTop: 30}}>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task',{'data':{'type':'fuwu',title:'服务单列表'}})}>
                            <Flex direction='column' align={'start'}
                                  style={[styles.card, {borderLeftColor: Macro.color_4d8fcc, borderLeftWidth: 8}]}>
                                <Text style={styles.title}>服务单</Text>
                                <Flex style={styles.line}/>
                                <Flex>
                                    <Flex direction='column' style={{width: '25%'}}>
                                        <Text style={styles.top}>{data.pendingreply}</Text>
                                        <Text style={styles.bottom}>待回复</Text>
                                    </Flex>
                                    <Flex direction='column' style={{width: '25%'}}>
                                        <Text style={styles.top}>{data.overduereply}</Text>
                                        <Text style={styles.bottom}>回复逾期</Text>
                                    </Flex>
                                    <Flex direction='column' style={{width: '25%'}}>
                                        <Text style={styles.top}/>
                                        <Text style={styles.bottom}/>
                                    </Flex>
                                    <Flex direction='column' style={{width: '25%'}}>
                                        <Text style={styles.top}/>
                                        <Text style={styles.bottom}/>
                                    </Flex>

                                </Flex>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <Flex direction='column' align={'start'}
                              style={[styles.card, {borderLeftColor: Macro.color_f39d39, borderLeftWidth: 8,borderStyle:'solid'}]}>
                            <Text style={styles.title}>工单任务</Text>
                            <Flex style={styles.line}/>
                            <Flex>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task',{'data':{'type':'1',title:'派单列表'}})}>
                                    <Flex direction='column' style={{width: '25%'}}>
                                        <Text style={styles.top}>{data.todo}</Text>
                                        <Text style={styles.bottom}>待派单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task',{'data':{'type':'2',title:'接单列表'}})}>
                                    <Flex direction='column' style={{width: '25%'}}>
                                        <Text style={styles.top}>{data.going}</Text>
                                        <Text style={styles.bottom}>待接单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback  onPress={() => this.props.navigation.push('Task',{'data':{'type':'3',title:'完成维修列表'}})}>
                                    <Flex direction='column' style={{width: '25%'}}>
                                        <Text style={styles.top}>{data.unfinish}</Text>
                                        <Text style={styles.bottom}>待完成</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback  onPress={() => this.props.navigation.push('Task',{'data':{'type':'6',title:'检验列表'}})}>
                                    <Flex direction='column' style={{width: '25%'}}>
                                        <Text style={styles.top}>{data.nottest}</Text>
                                        <Text style={styles.bottom}>待检验</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </Flex>
                        <Flex direction='column' align={'start'}
                              style={[styles.card, {borderLeftColor: Macro.color_f39d39, borderLeftWidth: 8}]}>
                            <Text style={styles.title}>工单逾期</Text>
                            <Flex style={styles.line}/>
                            <Flex>
                                <TouchableWithoutFeedback  onPress={() => this.props.navigation.push('Task',{'data':{'type':'1',overdue:1,hiddenHeader:true,title:'派单逾期列表'}})}>
                                    <Flex direction='column' style={{width: '33.3%'}}>
                                        <Text style={styles.top}>{data.overduedispatch}</Text>
                                        <Text style={styles.bottom}>派单逾期</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback  onPress={() => this.props.navigation.push('Task',{'data':{'type':'2',overdue:1,hiddenHeader:true,title:'接单逾期列表'}})}>

                                    <Flex direction='column' style={{width: '33.3%'}}>
                                        <Text style={styles.top}>{data.overdueorder}</Text>
                                        <Text style={styles.bottom}>接单逾期</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback  onPress={() => this.props.navigation.push('Task',{'data':{'type':'3',overdue:1,hiddenHeader:true,title:'接单列表'}})}>

                                    <Flex direction='column' style={{width: '33.3%'}}>
                                        <Text style={styles.top}>{data.overduefinish}</Text>
                                        <Text style={styles.bottom}>完成逾期</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </Flex>
                    </Flex>
                </ScrollView>
            </CommonView>
        );
    }
}
const styles = StyleSheet.create({
    title: {
        paddingTop: 15,
        textAlign: 'left',
        color: '#333',
        fontSize: 16,
        paddingBottom: 10,

        marginLeft: 20,
        marginRight: 20,

        // width: ,
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30 - 15 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1,
    },
    top: {
        paddingTop: 20,
        color: '#000',
        fontSize: 18,
        paddingBottom: 15,
    },
    bottom: {
        color: '#868688',
        fontSize: 18,
        paddingBottom: 20,
    },
    button: {
        color: '#868688',
        fontSize: 16,
        paddingTop: 10,
    },
    card: {
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: {h: 10, w: 10},
        shadowRadius: 5,
        shadowOpacity: 0.8,
    },
    blue: {
        borderLeftColor: Macro.color_4d8fcc,
        borderLeftWidth: 8,
        borderStyle:'solid',
    },
    orange: {
        borderLeftColor: Macro.color_f39d39,
        borderLeftWidth: 8,
        borderStyle:'solid',

    },
});
