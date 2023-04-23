import React  from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
    ImageBackground,
    Animated,
} from 'react-native';

import BasePage from '../../base/base';

import {  Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import BuildingService from '../building_service';
import LoadImage from '../../../components/load-image';
import {connect} from 'react-redux';
import {saveSelectBuilding} from '../../../utils/store/actions/actions';
import ScreenUtil from '../../../utils/screen-util';
import common from '../../../utils/common';
//import CommonView from '../../../components/CommonView';
 

const lineWidth = 30;


class SecondDetailBuildingPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        };
    };

    constructor(props) {
        super(props);
        let item = common.getValueFromProps(this.props);
        console.log('detail2', item);
        this.state = {
            item,
            index: 0,
            fadeAnim: new Animated.Value((ScreenUtil.deviceWidth() / 6.0) - lineWidth / 2),
            allData: [
                // {title: '向远公司', show: false, data: ['幸福小区']},
                // {
                //     title: '远大ABC',
                //     show: false,
                //     data: ['棋联苑', '富康苑', '金秋元', 'Jimmy', 'Joel', 'John', 'Julie'],
                // },
            ],
            room: {},
        };
    }

    componentDidMount(): void {
        BuildingService.roomDetail(this.state.item.id).then(room => {
            this.setState({
                room: {
                    ...room.entity,
                    statusName: room.statusName,
                    investment:room.investment,
                },
            });
        });

    }

    tap = (index) => {
        let value = (ScreenUtil.deviceWidth() / 3.0) * index + (ScreenUtil.deviceWidth() / 6.0) - lineWidth / 2;

        Animated.timing(                  // 随时间变化而执行动画
            this.state.fadeAnim,            // 动画中的变量值
            {
                toValue: value,                   // 透明度最终变为1，即完全不透明
                duration: 200,              // 让动画持续一段时间
            },
        ).start();
        this.setState({index: index});
    };


    render() {
        const {item, room} = this.state;

        let content;
        if (this.state.index === 0) {
            content = <Flex direction='column' align='start' style={{backgroundColor: 'white', borderRadius: 4}}>
                <Flex style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                    borderBottomStyle: 'solid',
                    width: ScreenUtil.deviceWidth() - 20,
                }}>
                    <Flex style={{padding: 10}}>

                        <LoadImage img={room.mainPic}
                                   style={{width: 80, height: 60}}/>
                    </Flex>
                    <Flex direction='column' align='start'>
                        <Text style={styles.name}>{room.name}</Text>
                        <Text style={styles.left}>{room.address}</Text>
                    </Flex>
                </Flex>
                <Flex justify='between' style={styles.single}>
                    <Text style={styles.left}>面积</Text>
                    <Text style={styles.right}>{room.area} {Macro.meter_square}</Text>
                </Flex>
                <Flex justify='between' style={styles.single}>
                    <Text style={styles.left}>招商状态</Text>
                    <Text style={styles.right}>{room.investment}</Text>
                </Flex>
                <Flex justify='between' style={styles.single}>
                    <Text style={styles.left}>预租单价</Text>
                    <Text style={styles.right}>{room.averagerentprice}{Macro.yuan_meter_day}</Text>
                </Flex>
                <Flex justify='between' style={styles.single}>
                    <Text style={styles.left}>装修</Text>
                    <Text style={styles.right}>{room.statusName}</Text>
                </Flex>
            </Flex>;
        } else {
            content = null;
        }
        // } else if (this.state.index === 1) {
        //     content =
        //         <Flex direction='column' align='start' style={{backgroundColor: 'white', borderRadius: 4, padding: 15}}>
        //             <Flex style={{paddingBottom: 10}}>
        //                 <Text style={{color: '#88878c', fontSize: 14}}>北京天下楼书科技有限公司</Text>
        //                 <Text style={{color: '#999', paddingLeft: 5, fontSize: 14}}>@北京楼书</Text>
        //             </Flex>
        //             <Flex justify={'center'} style={{
        //                 width: 26,
        //                 height: 26,
        //                 borderRadius: 2,
        //                 borderWidth: 1,
        //                 borderColor: '#5c8eec',
        //                 borderStyle: 'solid',
        //             }}>
        //                 <Text style={{color: '#5c8eec', fontSize: 14}}>租</Text>
        //             </Flex>
        //             <Flex style={{
        //                 backgroundColor: '#dcdcdc',
        //                 height: 1,
        //                 width: ScreenUtil.deviceWidth() - 50,
        //                 marginTop: 20,
        //             }}/>
        //             <Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>房号</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>1012233121</Text>
        //                 </Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>开始日</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>2019/08/21</Text>
        //                 </Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>结束日</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>2021/08/20</Text>
        //                 </Flex>
        //             </Flex>
        //             <Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>租赁数</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>510 {Macro.meter_square}</Text>
        //                 </Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>租金单价</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>5{Macro.yuan_meter_day}</Text>
        //                 </Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>物业单价</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>-</Text>
        //                 </Flex>
        //             </Flex>
        //             <Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>合同状态</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>正常执行</Text>
        //                 </Flex>
        //             </Flex>
        //             <Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>合同标签</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>-</Text>
        //                 </Flex>
        //
        //             </Flex>
        //         </Flex>;
        // } else {
        //     content =
        //         <Flex direction='column' align='start' style={{backgroundColor: 'white', borderRadius: 4, padding: 15}}>
        //             <Flex justify='between' style={{paddingBottom: 10, width: ScreenUtil.deviceWidth() - 50}}>
        //                 <Text style={{color: '#88878c', fontSize: 14}}>北京天下楼书科技有限公司</Text>
        //                 <Text style={{color: '#e7ad7c', paddingLeft: 5, fontSize: 14}}>意向客户</Text>
        //             </Flex>
        //
        //             <Flex style={{
        //                 backgroundColor: '#dcdcdc',
        //                 height: 1,
        //                 width: ScreenUtil.deviceWidth() - 50,
        //                 marginTop: 5,
        //             }}/>
        //             <Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>来访时间</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>2019/08/21</Text>
        //                 </Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>渠道</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>公司经纪人</Text>
        //                 </Flex>
        //                 <Flex direction='column' align='start'
        //                       style={{paddingTop: 15, width: (ScreenUtil.deviceWidth() - 50) / 3.0}}>
        //                     <Text style={{color: '#a8a7ab'}}>需求数量</Text>
        //                     <Text style={{paddingTop: 10, color: '#302d39'}}>100-200{Macro.meter_square}</Text>
        //                 </Flex>
        //             </Flex>
        //
        //         </Flex>;
        // }
        return (

            <View>
                <ImageBackground style={{height: 150}} source={room.mainPic ? {uri:room.mainPic} : ''}>
                    <Flex justify='between' align='start' direction='column'
                          style={{height: 90, paddingLeft: 15, paddingRight: 15, marginTop: 44}}>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                            <Icon name='left' style={{width: 30}}/>
                        </TouchableWithoutFeedback>
                        <Text style={{color: 'white', fontSize: 20}}>{this.state.item.allName}</Text>
                    </Flex>
                </ImageBackground>
                <Flex direction={'column'} align={'start'}
                      style={{width: ScreenUtil.deviceWidth(), height: 44, backgroundColor: 'white'}}>
                    <Flex style={{height: 40}}>
                        <TouchableWithoutFeedback onPress={() => this.tap(0)}>
                            <Flex justify={'center'} style={{width: ScreenUtil.deviceWidth() / 3, height: 40}}>
                                <Text style={this.state.index === 0 ? styles.selectText : styles.noSelect}>房源信息</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.tap(1)}>
                            <Flex justify={'center'} style={{width: ScreenUtil.deviceWidth() / 3, height: 40}}>
                                <Text style={this.state.index === 1 ? styles.selectText : styles.noSelect}>合同</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.tap(2)}>
                            <Flex justify={'center'} style={{width: ScreenUtil.deviceWidth() / 3, height: 40}}>
                                <Text style={this.state.index === 2 ? styles.selectText : styles.noSelect}>客户</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                    <Animated.View
                        style={{
                            backgroundColor: '#5f96eb',
                            width: lineWidth,
                            height: 2,
                            marginLeft: this.state.fadeAnim,
                        }}/>
                </Flex>

                <ScrollView style={{padding: 10, backgroundColor: '#eee', height: ScreenUtil.deviceHeight() - 140}}>
                    {content}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    name: {
        fontSize: 16,
        color: '#333',
        paddingBottom: 6,
        fontWeight: '600',
    },
    right: {
        fontSize: 14,
        color: '#38393d',

    },
    left: {
        fontSize: 14,
        color: '#848388',
    },
    single: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderStyle: 'solid',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: ScreenUtil.deviceWidth() - 20,
    },
    selectText: {
        fontSize: 14,
        color: '#302f33',
    },
    noSelect: {
        fontSize: 14,
        color: '#b1b1b1',
    },
});


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveBuilding: (item) => {
            dispatch(saveSelectBuilding(item));
        },
    };
};

export default connect(null, mapDispatchToProps)(SecondDetailBuildingPage);
