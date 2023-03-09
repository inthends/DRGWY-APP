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


class LouDetail extends BasePage {
    static navigationOptions = ({navigation}) => {
        // console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '房屋',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
        };
    };


    constructor(props) {
        super(props);
        let room = common.getValueFromProps(this.props);// || {id: 'FY-XHF-01-0103'};
        // let room = common.getValueFromProps(this.props);
        //console.log('room123', room);
        this.state = {
            room,
            jiao: false,
        };
        api.getData('/api/MobileMethod/MGetRoomEntity', {keyvalue: room.id}).then(res => {
            this.setState({
                detail: {
                    ...res.entity,
                    statusName: res.statusName,
                },
            });
            api.getData('/api/MobileMethod/GetUserRoomList', {customerId: res.entity.tenantId}, false).then(res => {
                this.setState({rooms: res});
            });
        });
        api.getData('/api/MobileMethod/MGetRoomOwnerList', {roomId: room.id}).then(res => {
            this.setState({owners: res});
        });
        api.getData('/api/MobileMethod/MGetRoomTenantList', {roomId: room.id}).then(res => {
            this.setState({tenants: res});
        });
        api.getData('/api/MobileMethod/MGetRoomNotChargeList', {unitId: room.id}).then(res => {
            this.setState({noCharges: res});
        });
        api.getData('/api/MobileMethod/MGetRoomChargeList', {unitId: room.id}).then(res => {
            this.setState({charges: res});
        });
        api.getData('/api/MobileMethod/MGetRoomServerDeskList', {unitId: room.id}).then(res => {
            this.setState({servers: res});
        });


    }

    componentDidMount(): void {

    }

    componentWillUnmount(): void {

    }

    handleDate = (string) => {
        return string && string.split(' ')[0];
    };


    render() {
        const {detail, owners = [], tenants = [], rooms = [], noCharges = [], charges = [], jiao, servers = []} = this.state;
        let fees = [];
        if (jiao) {
            fees = charges;
        } else {
            fees = noCharges;
        }
        if (!detail) {
            return null;
        }

        return (
            <CommonView style={{flex: 1}}>
                <ScrollView>
                    <Text style={{paddingLeft: 15, paddingTop: 15, fontSize: 20, color: '#333'}}>{detail.allName}</Text>
                    <Flex style={[styles.every2]} justify='between'>
                        <Text style={styles.left}>{detail.tenantName}</Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.tenantPhone)}>
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{width: 30, height: 30}}/></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                    <View style={styles.line}/>
                    <Flex justify={'between'} align={'start'}
                          style={{paddingTop: 15, paddingLeft: 20, paddingRight: 20}}>
                        <Flex direction={'column'}>
                            <Flex direction={'column'}>
                                <Text style={styles.name}>建筑面积</Text>
                                <Text style={styles.text}>{detail.area}</Text>
                            </Flex>
                            <Flex direction={'column'} style={{marginTop: 15}}>
                                <Text style={styles.name}>物业类型</Text>
                                <Text style={styles.text}>{detail.propertyType}</Text>
                            </Flex>
                        </Flex>
                        <Flex direction={'column'}>
                            <Flex direction={'column'}>
                                <Text style={styles.name}>交房日期</Text>
                                <Text style={styles.text}>{this.handleDate(detail.handoverDate)}</Text>
                            </Flex>
                            <Flex direction={'column'} style={{marginTop: 15}}>
                                <Text style={styles.name}>计费面积</Text>
                                <Text style={styles.text}>{detail.billArea}</Text>
                            </Flex>
                        </Flex>
                        <Flex direction={'column'}>
                            <Text style={styles.name}>当前状态</Text>
                            <Text style={styles.text}>{detail.statusName}</Text>
                        </Flex>
                    </Flex>
                    <Flex direction={'column'} justify={'start'} align={'start'}
                          style={{paddingTop: 15, paddingLeft: 20, paddingRight: 20}}>
                        <Text style={styles.name}>附加说明</Text>
                        <Text style={styles.text}>{detail.memo}</Text>
                    </Flex>

                    {/*历史业主*/}
                    <View style={styles.line}/>
                    <Flex style={[styles.bb, {borderLeftColor: '#999'}]}>
                        <Text style={styles.se}>历史业主</Text>
                    </Flex>
                    {
                        owners.map(item => (
                            <Flex key={item.id} justify={'between'} align={'center'}
                                  style={{marginLeft: 20, marginTop: 5, marginRight: 20}}>
                                <Text style={styles.text2}>{item.name}</Text>
                                <TouchableWithoutFeedback onPress={() => common.call(item.phoneNum)}>
                                    <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{width: 30, height: 30}}/></Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        ))
                    }

                    <View style={styles.line}/>

                    {/*历史住户*/}
                    <Flex style={[styles.bb, {borderLeftColor: '#999'}]}>
                        <Text style={styles.se}>历史住户</Text>
                    </Flex>
                    {
                        tenants.map(item => (
                            <Flex key={item.id} justify={'between'} align={'center'}
                                  style={{marginLeft: 20, marginTop: 5, marginRight: 20}}>
                                <Text style={styles.text2}>{item.name}</Text>
                                <TouchableWithoutFeedback onPress={() => common.call(item.phoneNum)}>
                                    <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{width: 30, height: 30}}/></Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        ))
                    }
                    <View style={styles.line}/>

                    {/*关联房产*/}
                    <Flex style={[styles.bb, {borderLeftColor: 'green'}]}>
                        <Text style={styles.se}>关联房产</Text>
                    </Flex>
                    {
                        rooms.map(item => (
                            <Flex key={item.id} justify={'between'}
                                  style={{marginLeft: 20, marginTop: 5, marginRight: 20}}>
                                <Text style={styles.text2}>{item.allName}</Text>
                                <Text style={styles.text2}>{item.statusName}</Text>
                            </Flex>
                        ))
                    }
                    <View style={styles.line}/>

                    {/*费用*/}
                    <Flex style={styles.bb}>
                        <Text style={styles.se}>费用</Text>
                    </Flex>
                    <Flex style={{marginLeft: 30, marginTop: 5, marginRight: 20, paddingTop: 10, paddingBottom: 10}}>
                        <TouchableWithoutFeedback onPress={() => this.setState({jiao: false})}>
                            <Text style={[styles.text3, jiao ? {} : {color: '#74BAF1'}]}>未交</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.setState({jiao: true})}>
                            <Text style={[styles.text3, {marginLeft: 30}, jiao ? {color: '#74BAF1'} : {}]}>已交</Text>
                        </TouchableWithoutFeedback>
                    </Flex>
                    <Flex direction={'column'}>
                        {
                            fees.map((item, index) => (
                                <Fragment key={item.id + '' + index}>
                                    <Flex direction={'column'} align={'start'}
                                          style={{width: '100%', paddingLeft: 30, marginTop: 5, paddingRight: 20}}>
                                        <Text style={styles.a}>{item.feeName}</Text>
                                        <Text style={styles.b}>{item.amount}</Text>
                                        <Text style={styles.c}>{item.beginDate}至{item.endDate}</Text>
                                    </Flex>
                                    <View style={styles.line}/>
                                </Fragment>
                            ))
                        }
                    </Flex>

                    {/*服务单*/}
                    <Flex style={[styles.bb, {borderLeftColor: '#74BAF1'}]}>
                        <Text style={styles.se}>服务单</Text>
                    </Flex>

                    {
                        servers.map(item => (
                            <Flex key={item.id} direction='column' align={'start'}
                                  style={[styles.card, styles.blue, {marginBottom: 20}]}>
                                <Flex justify='between' style={{width: '100%'}}>
                                    <Text style={styles.title}>{item.billCode}</Text>
                                    <Text style={styles.aaa}>{item.billType}</Text>
                                </Flex>
                                <Flex align={'start'} direction={'column'}>
                                    <Flex justify='between'
                                          style={{width: '100%', padding: 15, paddingLeft: 0, paddingRight: 0}}>
                                        <Text>{item.address}</Text>
                                        <Text>{item.statusName}</Text>
                                    </Flex>
                                    <Text style={{
                                        paddingBottom: 20,
                                        color: '#666',
                                    }}>{item.contents}</Text>
                                </Flex>
                                <Flex justify='between'
                                      style={{width: '100%', paddingBottom: 15}}>
                                    <Text>{item.contactName} </Text>
                                    <Text>{item.contactPhone} </Text>
                                </Flex>
                            </Flex>
                        ))
                    }


                </ScrollView>


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
    text: {
        fontSize: 15,
        color: '#666',
    },
    bb: {
        borderStyle: 'solid',
        borderLeftWidth: 4,
        borderLeftColor: Macro.color_f39d39,
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
        paddingTop: 10,
    },
    b: {
        fontSize: 16,
        color: '#333',
        paddingBottom: 10,
    },
    c: {
        fontSize: 16,
        color: '#666',

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

export default connect(mapStateToProps)(LouDetail);
