import React, {Fragment} from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    NativeModules,
    ScrollView,
    Alert,
    DeviceEventEmitter,
    View,
} from 'react-native';
import BasePage from '../../base/base';
import {Flex, Icon, Checkbox, Modal, Popover, DatePicker, DatePickerView, Provider} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import {connect} from 'react-redux';
// import ListHeader from '../../components/list-header';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import TwoChange from '../../../components/two-change';
import NavigatorService from '../navigator-service';
import MyPopover from '../../../components/my-popover';

import UDToast from '../../../utils/UDToast';
// import QRCode from 'react-native-qrcode-svg';
import CommonView from '../../../components/CommonView';
import ActionPopover from '../../../components/action-popover';
import JianFei from '../../../components/jian-fei';
import ChaiFei from '../../../components/chai-fei';
import api from '../../../utils/api';


// import { upgrade } from 'rn-app-upgrade';


class ShebeiDetail extends BasePage {
    static navigationOptions = ({navigation}) => {
        // console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '设备详情',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
        };
    };

    handleDate = (string) => {
        return string && string.split(' ')[0];
    };


    constructor(props) {
        super(props);

        let room = common.getValueFromProps(this.props) || {id: 'd65f548c-06cb-42a1-bc30-373772a5c791'};
        // let room = common.getValueFromProps(this.props);
        console.log('room123', room);
        this.state = {
            room,
            repaireDetail: null,
            maintenanceDetail: null,
            ym: common.getYM('2020-01'),

        };
        api.getData('/api/MobileMethod/MGetDevice', {deviceId: room.id}).then(res => {
            this.setState({detail: res});
        });

        this.repairList();
        this.maintenanceList();

    }

    repairList = () => {
        const {room, startTime = common.getCurrentYearAndMonth(), endTime = common.getCurrentYearAndMonth()} = this.state;
        api.getData('/api/MobileMethod/MGetDeviceRepairList', {
            deviceId: room.id,
            dateFrom: startTime,
            dateTo: endTime,
        }, false).then(res => {
            this.setState({repairs: res});
        });
    };

    maintenanceList = () => {
        const {room, startTime2 = common.getCurrentYearAndMonth(), endTime2 = common.getCurrentYearAndMonth()} = this.state;
        api.getData('/api/MobileMethod/MGetMaintenanceList', {
            deviceId: room.id,
            dateFrom: startTime2,
            dateTo: endTime2,
        }, false).then(res => {
            this.setState({maintenances: res}, () => {
                console.log(12, this.state.maintenances);
            });
        });
    };
    timeChange = () => {
        this.repairList();

    };
    timeChange2 = () => {

        this.maintenanceList();
    };

    render() {
        const {detail, repairs = [], maintenances = [], repaireDetail, maintenanceDetail, ym} = this.state;
        if (!detail) {
            return null;
        }
        console.log(11, repairs);

        return (
            <CommonView style={{flex: 1}}>
                <ScrollView>
                    <Flex justify={'between'} style={{paddingLeft: 15, paddingTop: 15, paddingRight: 15}}>
                        <Text style={{fontSize: 18, color: '#333'}}>视频分配器</Text>
                        <Text style={{fontSize: 18, color: '#333'}}>{detail.code}</Text>
                    </Flex>

                    <Flex direction={'column'} justify={'between'} align={'start'}
                          style={{paddingTop: 15, paddingLeft: 20, paddingRight: 20}}>
                        <Flex justify={'between'} style={{width: '100%'}}>
                            <Flex direction={'column'} align={'start'}>
                                <Text style={styles.name}>规格型号</Text>
                                <Flex style={styles.item} justify={'center'} align={'center'}>
                                    <Text style={styles.text}>{detail.modelNo}</Text>
                                </Flex>
                            </Flex>
                            <Flex direction={'column'} align={'start'}>
                                <Text style={styles.name}>品牌</Text>
                                <Flex style={styles.item} justify={'center'} align={'center'}>
                                    <Text style={styles.text}>{detail.brand}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex justify={'between'} style={{width: '100%', marginTop: 10}}>
                            <Flex direction={'column'} align={'start'}>
                                <Text style={styles.name}>安装日期</Text>
                                <Flex style={styles.item} justify={'center'} align={'center'}>
                                    <Text style={styles.text}></Text>
                                </Flex>
                            </Flex>
                            <Flex direction={'column'} align={'start'}>
                                <Text style={styles.name}>启用日期</Text>
                                <Flex style={styles.item} justify={'center'} align={'center'}>
                                    <Text style={styles.text}>{this.handleDate(detail.useDate)}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex justify={'between'} style={{width: '100%', marginTop: 10}}>
                            <Flex direction={'column'} align={'start'}>
                                <Text style={styles.name}>使用年限</Text>
                                <Flex style={styles.item} justify={'center'} align={'center'}>
                                    <Text style={styles.text}>{detail.dateLimit}</Text>
                                </Flex>
                            </Flex>
                            <Flex direction={'column'} align={'start'}>
                                <Text style={styles.name}>当前状态</Text>
                                <Flex style={styles.item} justify={'center'} align={'center'}>
                                    <Text style={styles.text}>{detail.status}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>


                    {/*生产商*/}
                    <View style={styles.line}/>
                    <Flex style={[styles.bb, {borderLeftColor: '#999'}]}>
                        <Text style={styles.se}>生产商</Text>
                    </Flex>
                    <Flex justify={'between'} style={{marginLeft: 20, marginTop: 5, marginRight: 20}}>
                        <Flex style={[styles.item, {width: ScreenUtil.deviceWidth() - 40}]}>
                            <Text style={styles.text2}>{detail.factory}</Text>
                        </Flex>
                    </Flex>


                    {/*安装商*/}
                    <Flex style={[styles.bb, {borderLeftColor: '#999'}]}>
                        <Text style={styles.se}>安装商</Text>
                    </Flex>
                    <Flex justify={'between'} style={{marginLeft: 20, marginTop: 5, marginRight: 20}}>
                        <Flex style={[styles.item, {width: ScreenUtil.deviceWidth() - 40}]}>
                            <Text style={styles.text2}></Text>
                        </Flex>
                    </Flex>


                    {/*维保商*/}
                    <Flex style={[styles.bb, {borderLeftColor: 'green'}]}>
                        <Text style={styles.se}>维保商</Text>
                    </Flex>
                    <Flex justify={'between'} style={{marginLeft: 20, marginTop: 5, marginRight: 20}}>
                        <Flex style={[styles.item, {width: ScreenUtil.deviceWidth() - 40}]}>
                            <Text style={styles.text2}>{detail.maintainUser}</Text>
                        </Flex>
                    </Flex>


                    <Flex direction={'column'} justify={'between'} align={'start'}
                          style={{paddingTop: 15, paddingLeft: 20, paddingRight: 20}}>
                        <Flex justify={'between'} style={{width: '100%'}}>
                            <Flex direction={'column'} align={'start'}>
                                <Text style={styles.name}>质保期限</Text>
                                <Flex style={styles.item} justify={'center'} align={'center'}>
                                    <Text style={styles.text}></Text>
                                </Flex>
                            </Flex>
                            <Flex direction={'column'} align={'start'}>
                                <Text style={styles.name}>维保期限</Text>
                                <Flex style={styles.item} justify={'center'} align={'center'}>
                                    <Text style={styles.text}>{this.handleDate(detail.maintenanceEndDate)}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                    <View style={styles.line}/>


                    {/*维修记录*/}
                    <Flex style={[styles.bb, {borderLeftColor: 'green'}]}>
                        <Text style={styles.se}>维修记录</Text>
                    </Flex>
                    <Flex direction={'column'} justify={'between'} align={'start'}
                          style={{paddingTop: 5, paddingLeft: 20, paddingRight: 20}}>
                        <Flex justify={'between'} style={{width: '100%'}}>
                            <Flex direction={'column'}>

                                <Flex style={[styles.item, {paddingTop: 10}]} justify={'center'} align={'center'}>
                                    <MyPopover hiddenImage={true}
                                               onChange={(time) => this.setState({startTime: time}, () => this.timeChange())}
                                               titles={ym}
                                               visible={true}/>
                                </Flex>
                            </Flex>
                            <Flex direction={'column'}>

                                <Text style={styles.text}>至</Text>
                            </Flex>
                            <Flex direction={'column'}>

                                <Flex style={[styles.item, {paddingTop: 10}]} justify={'center'} align={'center'}>

                                    <MyPopover hiddenImage={true}
                                               onChange={(time) => this.setState({endTime: time}, () => this.timeChange())}
                                               titles={ym}
                                               visible={true}/>

                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex direction={'column'} style={{maxHeight: 150}}>
                        {
                            repairs.map(item => (
                                <TouchableWithoutFeedback key={item.id}
                                                          onPress={() => this.setState({repaireDetail: item})}>
                                    <Flex justify={'between'}
                                          style={{width: '100%', paddingLeft: 20, paddingRight: 20, marginTop: 10}}>
                                        <Text
                                            style={[styles.text, item.finishDate ? {} : {color: 'red'}]}>{this.handleDate(item.billDate)}</Text>
                                        <Text
                                            style={[styles.text, item.finishDate ? {} : {color: 'red'}]}>{item.billCode}</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            ))
                        }
                    </Flex>

                    <View style={styles.line}/>


                    {/*维保记录*/}
                    <Flex style={[styles.bb, {borderLeftColor: 'green'}]}>
                        <Text style={styles.se}>维保记录</Text>
                    </Flex>
                    <Flex direction={'column'} justify={'between'} align={'start'}
                          style={{paddingTop: 5, paddingLeft: 20, paddingRight: 20}}>
                        <Flex justify={'between'} style={{width: '100%'}}>
                            <Flex direction={'column'}>

                                <Flex style={[styles.item, {paddingTop: 10}]} justify={'center'} align={'center'}>
                                    <MyPopover hiddenImage={true}
                                               onChange={(time) => this.setState({startTime2: time}, () => this.timeChange2())}
                                               titles={ym}
                                               visible={true}/>

                                </Flex>
                            </Flex>
                            <Flex direction={'column'}>

                                <Text style={styles.text}>至</Text>
                            </Flex>
                            <Flex direction={'column'}>

                                <Flex style={[styles.item, {paddingTop: 10}]} justify={'center'} align={'center'}>
                                    <MyPopover hiddenImage={true}
                                               onChange={(time) => this.setState({endTime2: time}, () => this.timeChange2())}
                                               titles={ym}
                                               visible={true}/>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex direction={'column'} style={{maxHeight: 150}}>
                        {
                            maintenances.map(item => (
                                <TouchableWithoutFeedback key={item.id}
                                                          onPress={() => this.setState({maintenanceDetail: item})}>
                                    <Flex justify={'between'}
                                          style={{width: '100%', paddingLeft: 20, paddingRight: 20, marginTop: 10}}>
                                        <Text
                                            style={[styles.text, item.finishDate ? {} : {color: 'red'}]}>{this.handleDate(item.finishDate)}</Text>
                                        <Text
                                            style={[styles.text, item.finishDate ? {} : {color: 'red'}]}>{item.billCode}</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>

                            ))
                        }
                    </Flex>
                    <View style={{height:10}}/>
                </ScrollView>

                {
                    repaireDetail && (
                        <TouchableWithoutFeedback onPress={() => this.setState({repaireDetail: null})}>
                            <View style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                left: 0,
                                width: '100%',
                                top: 0,
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }}>
                                <ScrollView style={{maxHeight: ScreenUtil.deviceHeight() * 0.8}}>
                                    <Flex justify={'center'} align={'center'} style={{
                                        backgroundColor: 'white',
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        width: ScreenUtil.deviceWidth() - 60,
                                    }}>
                                        <Flex direction={'column'} justify={'center'} align={'center'}
                                              style={{width: 200}}>
                                            <Flex direction={'column'} justify={'between'} align={'start'}
                                                  style={{
                                                      paddingTop: 15,
                                                      width: 300,
                                                      paddingLeft: 10,
                                                      paddingRight: 10,
                                                  }}>
                                                <Flex justify={'between'} style={{width: '100%', marginTop: 10}}>
                                                    <Flex direction={'column'} align={'start'}>
                                                        <Text style={styles.name}>单据日期</Text>
                                                        <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                            <Text
                                                                style={styles.text}>{this.handleDate(repaireDetail.billDate)}</Text>
                                                        </Flex>
                                                    </Flex>
                                                    <Flex direction={'column'} align={'start'}>
                                                        <Text style={styles.name}>完成日期</Text>
                                                        <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                            <Text
                                                                style={styles.text}>{this.handleDate(repaireDetail.finishDate)}</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                            <Flex direction={'column'} justify={'between'} align={'start'}
                                                  style={{
                                                      paddingTop: 5,
                                                      width: 300,
                                                      paddingLeft: 10,
                                                      paddingRight: 10,
                                                  }}>
                                                <Flex justify={'between'} style={{width: '100%', marginTop: 10}}>
                                                    <Flex direction={'column'} align={'start'}>
                                                        <Text style={styles.name}>故障判断</Text>
                                                        <Flex style={[styles.item3]}>
                                                            <Text style={styles.text}>{repaireDetail.breakdown}</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                            <Flex direction={'column'} justify={'between'} align={'start'}
                                                  style={{
                                                      paddingTop: 5,
                                                      width: 300,
                                                      paddingLeft: 10,
                                                      paddingRight: 10,
                                                  }}>
                                                <Flex justify={'between'} style={{width: '100%', marginTop: 10}}>
                                                    <Flex direction={'column'} align={'start'}>
                                                        <Text style={styles.name}>维修结果</Text>
                                                        <Flex style={[styles.item3]}>
                                                            <Text style={styles.text}>{repaireDetail.status}</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                            <Flex direction={'column'} justify={'between'} align={'start'}
                                                  style={{
                                                      paddingTop: 15,
                                                      width: 300,
                                                      paddingLeft: 10,
                                                      paddingRight: 10,
                                                  }}>
                                                <Flex justify={'between'} style={{width: '100%', marginTop: 10}}>
                                                    <Flex direction={'column'} align={'start'}>
                                                        <Text style={styles.name}>维修费用</Text>
                                                        <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                            <Text style={styles.text}>{repaireDetail.fee}</Text>
                                                        </Flex>
                                                    </Flex>
                                                    <Flex direction={'column'} align={'start'}>
                                                        <Text style={styles.name}>完成人</Text>
                                                        <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                            <Text
                                                                style={styles.text}>{repaireDetail.finishUserName}</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                                <Flex justify={'between'} style={{width: '100%', marginTop: 10}}>
                                                    <Flex direction={'column'} align={'start'}>
                                                        <Text style={styles.name}>检验日期</Text>
                                                        <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                            <Text
                                                                style={styles.text}>{this.handleDate(repaireDetail.checkDate)}</Text>
                                                        </Flex>
                                                    </Flex>
                                                    <Flex direction={'column'} align={'start'}>
                                                        <Text style={styles.name}>检验人</Text>
                                                        <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                            <Text
                                                                style={styles.text}>{repaireDetail.status == 0 ? '不合格' : '合格'}</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                                <Flex justify={'between'}
                                                      style={{width: '100%', marginTop: 10, marginBottom: 10}}>
                                                    <Flex direction={'column'} align={'start'}>
                                                        <Text style={styles.name}>检验结果</Text>
                                                        <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                            <Text style={styles.text}>{repaireDetail.checkMemo}</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>

                    )
                }

                {
                    maintenanceDetail && (
                        <TouchableWithoutFeedback onPress={() => this.setState({maintenanceDetail: null})}>
                            <View style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                left: 0,
                                width: '100%',
                                top: 0,
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }}>

                                <Flex justify={'center'} align={'center'} style={{
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    width: ScreenUtil.deviceWidth() - 60,
                                }}>
                                    <Flex direction={'column'} justify={'center'} align={'center'} style={{width: 200}}>
                                        <Flex direction={'column'} justify={'between'} align={'start'}
                                              style={{paddingTop: 15, width: 300, paddingLeft: 10, paddingRight: 10}}>
                                            <Flex justify={'between'} style={{width: '100%', marginTop: 10}}>
                                                <Flex direction={'column'} align={'start'}>
                                                    <Text style={styles.name}>计划日期</Text>
                                                    <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                        <Text
                                                            style={styles.text}>{this.handleDate(maintenanceDetail.planDate)}</Text>
                                                    </Flex>
                                                </Flex>
                                                <Flex direction={'column'} align={'start'}>
                                                    <Text style={styles.name}>完成日期</Text>
                                                    <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                        <Text
                                                            style={styles.text}>{this.handleDate(maintenanceDetail.finishDate)}</Text>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                        <Flex direction={'column'} justify={'between'} align={'start'}
                                              style={{paddingTop: 5, width: 300, paddingLeft: 10, paddingRight: 10}}>
                                            <Flex justify={'between'} style={{width: '100%', marginTop: 10}}>
                                                <Flex direction={'column'} align={'start'}>
                                                    <Text style={styles.name}>维保内容</Text>
                                                    <Flex style={[styles.item3]}>
                                                        <Text style={styles.text}>{maintenanceDetail.memo}</Text>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                        <Flex direction={'column'} justify={'between'} align={'start'} style={{
                                            paddingTop: 15,
                                            width: 300,
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                            marginBottom: 20,
                                        }}>
                                            <Flex justify={'between'} style={{width: '100%', marginTop: 10}}>
                                                <Flex direction={'column'} align={'start'}>
                                                    <Text style={styles.name}>完成人</Text>
                                                    <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                        <Text
                                                            style={styles.text}>{maintenanceDetail.finishUserName}</Text>
                                                    </Flex>
                                                </Flex>
                                                <Flex direction={'column'} align={'start'}>
                                                    <Text style={styles.name}>维保说明</Text>
                                                    <Flex style={styles.item2} justify={'center'} align={'center'}>
                                                        <Text style={styles.text}>{maintenanceDetail.memo}</Text>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Flex>

                            </View>
                        </TouchableWithoutFeedback>
                    )
                }


            </CommonView>

        );
    }
}

const styles = StyleSheet.create({
    every2: {
        marginLeft: 15,
        marginRight: 15,
        width: ScreenUtil.deviceWidth() - 30,
        // paddingBottom: 10,
    },
    left: {
        fontSize: 16,
        color: '#666',

    },
    line: {
        backgroundColor: '#EEE',
        marginLeft: 15,
        marginRight: 15,
        height: 1,
        width: ScreenUtil.deviceWidth() - 30,
        marginTop: 10,
    },
    name: {
        fontSize: 16,
        color: '#333',
        paddingBottom: 5,
    },
    item: {
        width: (ScreenUtil.deviceWidth() - 100) / 2,
        height: 30,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#999',
        marginTop: 6,
        marginBottom: 6,
    },
    item2: {
        width: (ScreenUtil.deviceWidth() - 160) / 2,
        height: 30,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#999',
        marginTop: 6,
        marginBottom: 6,
    },
    item3: {
        width: ScreenUtil.deviceWidth() - 130,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#999',
        marginTop: 6,
        marginBottom: 6,
        padding: 8,

    },
    text: {
        fontSize: 15,
        color: '#666',
    },
    bb: {
        marginLeft: 15,
        marginTop: 15,
    },
    se: {
        paddingLeft: 10,
        fontSize: 18,
        color: '#666',
    },
    text2: {
        paddingLeft: 10,
        fontSize: 16,
        color: '#999',
    },
    text3: {
        fontSize: 18,
        color: '#333',
    },
    a: {
        fontSize: 16,
        color: '#333',
        paddingBottom: 10,
    },
    b: {
        fontSize: 16,
        color: '#333',
        paddingBottom: 10,
    },
    c: {
        fontSize: 16,
        color: '#666',
        paddingBottom: 10,
    },
    card: {
        borderWidth: 1,
        borderColor: '#c8c8c8',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: {h: 10, w: 10},
        shadowRadius: 5,
        shadowOpacity: 0.8,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        padding: 10,
    },
    blue: {},
});

const mapStateToProps = ({memberReducer}) => {
    return {userInfo: memberReducer.userInfo};
};

export default connect(mapStateToProps)(ShebeiDetail);
