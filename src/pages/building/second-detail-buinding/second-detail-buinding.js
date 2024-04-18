import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated
} from 'react-native';

import BasePage from '../../base/base';
import { Flex, Icon, Checkbox } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import BuildingService from '../building_service';
// import LoadImage from '../../../components/load-image';
import { connect } from 'react-redux';
import { saveSelectBuilding } from '../../../utils/store/actions/actions';
import ScreenUtil from '../../../utils/screen-util';
import common from '../../../utils/common';
import CommonView from '../../../components/CommonView';
import SelectImage from '../../../utils/select-image';
const lineWidth = 30;

class SecondDetailBuildingPage extends BasePage {

    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         tabBarVisible: false,
    //         header: null
    //     };
    // };

    static navigationOptions = ({ navigation }) => {
        return {
            title: '资产详情',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);
        let item = common.getValueFromProps(this.props);
        this.state = {
            image: '',//资产图片
            item,
            index: 0,
            fadeAnim: new Animated.Value((ScreenUtil.deviceWidth() / 6.0) - lineWidth / 2),
            allData: [
                // {title: '元度江苏', show: false, data: ['幸福小区']},
                // {
                //     title: '元度ABC',
                //     show: false,
                //     data: ['棋联苑', '富康苑', '金秋元', 'Jimmy', 'Joel', 'John', 'Julie'],
                // },
            ],
            room: {},
            contracts: [],//合同
            customers: [],//客户
            isShow: false//是否显示历史客户
        };
    }

    //componentDidMount(): void {
    componentDidMount() {
        BuildingService.roomDetail(this.state.item.id).then(room => {
            this.setState({
                room: {
                    ...room.entity,
                    statusName: room.statusName,
                    investment: room.investment,
                },
                image: room.entity.mainPic
            });
        });

        //获取合同
        BuildingService.getContractList(this.state.item.id).then(res => {
            this.setState({
                contracts: res || []
            });
        });

        //获取客户
        BuildingService.getCustomerList(this.state.item.id, this.state.isShow).then(res => {
            this.setState({
                customers: res || []
            });
        });
    }

    tap = (index) => {
        let value = (ScreenUtil.deviceWidth() / 3.0) * index + (ScreenUtil.deviceWidth() / 6.0) - lineWidth / 2;
        Animated.timing(                  // 随时间变化而执行动画
            this.state.fadeAnim,            // 动画中的变量值
            {
                toValue: value,                   // 透明度最终变为1，即完全不透明
                duration: 200              // 让动画持续一段时间
            },
        ).start();
        this.setState({ index: index });
    };


    //显示历史客户
    showAll = (e) => {
        this.setState({ isShow: e.target.checked });
        //获取客户
        BuildingService.getCustomerList(this.state.item.id, e.target.checked).then(res => {
            this.setState({
                customers: res || []
            });
        });
    };

    selectImages = () => {
        SelectImage.select(this.state.item.id, '', '/api/MobileMethod/MUploadPStructs').then(res => {
            console.log('MUploadPStructs:', ...res);
            this.setState({ image: res });
        }).catch(error => {
        });
    };


    render() {
        const { room, image, contracts, customers } = this.state;
        let content;
        const width = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        const height = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;

        if (this.state.index === 0) {
            content =
                <Flex direction='column' align='start'
                    style={{ marginBottom: 20, backgroundColor: 'white', borderRadius: 4 }}>

                    {/* <Flex style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                        borderBottomStyle: 'solid',
                        width: ScreenUtil.deviceWidth() - 20,
                    }}>
                        <Flex style={{ padding: 10 }}>
                          <LoadImage img={room.mainPic} style={{ width: 80, height: 60 }} />
                        </Flex>
                        <Flex direction='column' align='start'>
                            <Text style={styles.name}>{room.name}</Text>
                            <Text style={styles.left}>{room.code}</Text>
                        </Flex>
                    </Flex> */}

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>名称</Text>
                        <Text style={styles.right}>{room.name}</Text>
                    </Flex>

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>编号</Text>
                        <Text style={styles.right}>{room.code}</Text>
                    </Flex>

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>全称</Text>
                        <Text style={styles.right}>{room.allName}</Text>
                    </Flex>

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>业主名称</Text>
                        <Text style={styles.right}>{room.ownerName}</Text>
                    </Flex>

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>业主电话</Text>
                        <Text style={styles.right}>{room.ownerPhone}</Text>
                    </Flex>

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>租户名称</Text>
                        <Text style={styles.right}>{room.tenantName}</Text>
                    </Flex>

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>租户电话</Text>
                        <Text style={styles.right}>{room.tenantPhone}</Text>
                    </Flex>

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>状态</Text>
                        <Text style={styles.right}>{room.state}</Text>
                    </Flex>

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>建筑面积</Text>
                        <Text style={styles.right}>{room.area} {Macro.meter_square}</Text>
                    </Flex>

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>土地面积</Text>
                        <Text style={styles.right}>{room.coverArea} {Macro.meter_square}</Text>
                    </Flex>
                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>计费面积</Text>
                        <Text style={styles.right}>{room.billArea} {Macro.meter_square}</Text>
                    </Flex>
                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>套内面积</Text>
                        <Text style={styles.right}>{room.insideArea} {Macro.meter_square}</Text>
                    </Flex>

                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>产权面积</Text>
                        <Text style={styles.right}>{room.propertyArea} {Macro.meter_square}</Text>
                    </Flex>

                    {/* <Flex justify='between' style={styles.single}>
                    <Text style={styles.left}>招商状态</Text>
                    <Text style={styles.right}>{room.investment}</Text>
                   </Flex>
                    <Flex justify='between' style={styles.single}>
                        <Text style={styles.left}>预租单价</Text>
                        <Text style={styles.right}>{room.averagerentprice}{Macro.yuan_meter_day}</Text>
                    </Flex>*/}
                </Flex>;
        }
        else if (this.state.index === 1) {
            content =
                <Flex direction={'column'} align={'start'} style={{ marginBottom: 15 }} >
                    {contracts.map((item, index) => (
                        <Flex key={item.id}
                            direction='column' align='start'
                            style={{ backgroundColor: 'white', borderRadius: 4, padding: 15, marginBottom: 5 }}>
                            <Flex style={{ paddingBottom: 10 }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#404145',
                                    fontWeight: '600',
                                }}>{item.no}</Text>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#404145',
                                    fontWeight: '600',
                                    paddingLeft: 5,
                                    fontSize: 14
                                }}>{item.customer}</Text>
                            </Flex>
                            <Flex justify={'center'} style={{
                                width: 26,
                                height: 26,
                                borderRadius: 2,
                                borderWidth: 1,
                                borderColor: '#5c8eec',
                                borderStyle: 'solid',
                            }}>
                                <Text style={{ color: '#5c8eec', fontSize: 14 }}>租</Text>
                            </Flex>
                            <Flex style={{
                                backgroundColor: '#dcdcdc',
                                height: 1,
                                width: ScreenUtil.deviceWidth() - 50,
                                marginTop: 20
                            }} />
                            <Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>起始日期</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.startDate}</Text>
                                </Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>终止日期</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.endDate}</Text>
                                </Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>租赁数</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.totalArea} {Macro.meter_square}</Text>
                                </Flex>
                            </Flex>
                            <Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>金额</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.totalAmount} 元</Text>
                                </Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>签约日期</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.signingDate}</Text>
                                </Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>合同状态</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.status}</Text>
                                </Flex>
                            </Flex>
                            <Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>招牌</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.signboardName}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    ))
                    }
                </Flex>
        }
        else {
            content =
                <Flex direction={'column'} align={'start'} style={{ marginBottom: 15 }}>
                    <Flex
                        direction='column' align='start' style={{ backgroundColor: 'white', borderRadius: 4, padding: 15, marginBottom: 5 }}>
                        <Flex justify='between' style={{ paddingBottom: 10, width: ScreenUtil.deviceWidth() - 50 }} >
                            <Text style={styles.name} >{customers.length > 0 ? customers[0].name : ''}</Text>
                            <Flex>
                                <Checkbox defaultChecked={false}
                                    onChange={(e) => this.showAll(e)} >
                                    <Text style={{ paddingTop: 3, paddingLeft: 3, color: '#2c2c2c' }}>历史</Text>
                                </Checkbox>
                            </Flex>
                        </Flex>
                    </Flex>

                    {customers.map((item, index) => (
                        <Flex
                            key={item.id}
                            direction='column' align='start' style={{ backgroundColor: 'white', borderRadius: 4, padding: 15, marginBottom: 5 }}>
                            <Flex justify='between' style={{ paddingBottom: 10, width: ScreenUtil.deviceWidth() - 50 }}>
                                <Text style={{ color: '#88878c', fontSize: 14 }}>{item.name}</Text>
                                <Text style={{ color: '#e7ad7c', paddingLeft: 5, fontSize: 14 }}>{item.customerType}</Text>
                            </Flex>
                            <Flex style={{
                                backgroundColor: '#dcdcdc',
                                height: 1,
                                width: ScreenUtil.deviceWidth() - 50,
                                marginTop: 5
                            }} />
                            <Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>类别</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.type}</Text>
                                </Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>编号</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.code}</Text>
                                </Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>手机号码</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.phoneNum}</Text>
                                </Flex>
                            </Flex>
                            <Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>状态</Text>
                                    <Text style={{ paddingTop: 10, color: '#e7ad7c' }}>{item.state}</Text>
                                </Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>联系人</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.linkMan}</Text>
                                </Flex>
                                <Flex direction='column' align='start'
                                    style={{ paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0 }}>
                                    <Text style={{ color: '#a8a7ab' }}>联系电话</Text>
                                    <Text style={{ paddingTop: 10, color: '#302d39' }}>{item.linkPhoneNum}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    ))
                    }
                </Flex>
        }

        return (
            <CommonView style={{ flex: 1 }}>

                <TouchableWithoutFeedback onPress={() => {
                    this.selectImages();
                }}>
                    <ImageBackground style={{ height: 150 }} source={image ? { uri: image } : null}>
                        {/* <Flex justify='between' align='start' direction='column'
                        style={{ height: 90, paddingLeft: 15, paddingRight: 15, marginTop: 44 }}> 
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                            <Icon name='left' style={{ width: 30 }} />
                        </TouchableWithoutFeedback> 
                        <Text style={{ fontSize: 20 }}>{this.state.item.allName}</Text>
                    </Flex>*/}
                    </ImageBackground>
                </TouchableWithoutFeedback>
 

                <Flex direction={'column'} align={'start'}
                    style={{ width: ScreenUtil.deviceWidth(), height: 44, backgroundColor: 'white' }}>
                    <Flex style={{ height: 40 }}>
                        <TouchableWithoutFeedback onPress={() => this.tap(0)}>
                            <Flex justify={'center'} style={{ width: ScreenUtil.deviceWidth() / 3, height: 40 }}>
                                <Text style={this.state.index === 0 ? styles.selectText : styles.noSelect}>房产信息</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.tap(1)}>
                            <Flex justify={'center'} style={{ width: ScreenUtil.deviceWidth() / 3, height: 40 }}>
                                <Text style={this.state.index === 1 ? styles.selectText : styles.noSelect}>合同</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.tap(2)}>
                            <Flex justify={'center'} style={{ width: ScreenUtil.deviceWidth() / 3, height: 40 }}>
                                <Text style={this.state.index === 2 ? styles.selectText : styles.noSelect}>客户</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                    <Animated.View
                        style={{
                            backgroundColor: '#5f96eb',
                            width: lineWidth,
                            height: 2,
                            marginLeft: this.state.fadeAnim
                        }} />
                </Flex>

                {/* <ScrollView style={{ padding: 10, backgroundColor: '#eee', height: ScreenUtil.deviceHeight() - 140 }}> */}
                <ScrollView style={{ flex: 1, padding: 10, backgroundColor: '#eee' }}>
                    {content}
                </ScrollView>
            </CommonView >
        );
    }
}

const styles = StyleSheet.create({
    name: {
        fontSize: 16,
        color: '#404145',
        fontWeight: '600',
        paddingBottom: 6
    },
    right: {
        fontSize: 14,
        color: '#38393d'

    },
    left: {
        fontSize: 14,
        color: '#848388'
    },
    single: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderStyle: 'solid',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: ScreenUtil.deviceWidth() - 20
    },
    selectText: {
        fontSize: 14,
        color: '#302f33'
    },
    noSelect: {
        fontSize: 14,
        color: '#b1b1b1'
    }
});
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveBuilding: (item) => {
            dispatch(saveSelectBuilding(item));
        },
    };
};
export default connect(null, mapDispatchToProps)(SecondDetailBuildingPage);
