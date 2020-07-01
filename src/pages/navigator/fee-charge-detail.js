import React, {Fragment} from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Linking, Alert,
    ScrollView,
} from 'react-native';
import BasePage from '../base/base';
import {Button, Checkbox, Flex, Icon, List, WhiteSpace} from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
import {connect} from 'react-redux';
import ListHeader from '../../components/list-header';
import common from '../../utils/common';
import LoadImage from '../../components/load-image';
import NavigatorService from './navigator-service';
import NoDataView from '../../components/no-data-view';
import CommonView from '../../components/CommonView';


class FeeChargeDetail extends BasePage {
    static navigationOptions = ({navigation}) => {

        console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '收款单详情',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        let room = common.getValueFromProps(this.props);  
        this.state = {
            room,
            items: [],
        }; 
    }

    componentDidMount(): void {
        const {room} = this.state;
        NavigatorService.billDetailList(room.billId).then(res => { 
            this.setState({
                items: res,
            });
        });
    }


    render() {
        const {statistics, dataInfo, room} = this.state;
        const {selectBuilding} = this.props;
        // console.log('selet', selectBuilding);
        return (
            <View style={{flex: 1}}>
                <CommonView style={{flex: 1}}>
                    <ScrollView style={{flex: 1}}>
                        <Text style={{
                            paddingLeft: 15,
                            paddingTop: 10,
                            fontSize: 20,
                        }}>{room.allName} {room.createUserName}</Text>
                        <Text style={{
                            paddingLeft: 15,
                            paddingTop: 10,
                            fontSize: 16,
                        }}>单号：{room.billCode}</Text>
                        <Text style={{
                            paddingLeft: 15,
                            paddingTop: 10,
                            fontSize: 16,
                        }}>日期：{room.billDate}</Text>
                        {this.state.items.map((item,index)=>(
                            <Flex key={index} style={styles.item}>
                                <Flex align={'start'} direction={'column'} style={{marginLeft: 3, flex: 1}}>
                                    <Flex justify={'between'}
                                          style={{paddingLeft: 10, paddingTop: 5, paddingBottom: 5, width: '100%'}}>
                                        <Text style={{fontSize: 16}}>{item.feeName}</Text>
                                        <Flex>
                                            <Text style={{paddingRight: 10, fontSize: 16}}>{item.amount}</Text>
                                        </Flex>
                                    </Flex>
                                    {item.beginDate ? <Text style={{
                                        paddingLeft: 10,
                                        paddingTop: 10,
                                    }}> {item.beginDate + '至' + item.endDate}</Text> : null}
                                </Flex>
                            </Flex>
                        ))}
                        <WhiteSpace/>
                        <WhiteSpace/> 
                        <WhiteSpace/>     
                        <Flex justify={'center'}>
                            <Text style={{
                                fontSize: 20,
                            }}>合计：{room.amount}</Text>
                        </Flex>

                    </ScrollView>
                </CommonView>

            </View>


        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_sky,
        flex: 1,
    },
    content: {
        backgroundColor: Macro.color_white,
        flex: 1,
    },
    title: {
        color: '#333',
        fontSize: 16,
    },

    top: {

        fontSize: 18,
        paddingBottom: 10,
    },
    bottom: {
        color: '#868688',
        fontSize: 18,
        paddingBottom: 10,
    },
    button: {
        color: '#868688',
        fontSize: 16,
        paddingTop: 10,
    },
    blue: {
        borderLeftColor: Macro.color_4d8fcc,
        borderLeftWidth: 8,
    },
    orange: {
        borderLeftColor: Macro.color_f39d39,
        borderLeftWidth: 8,
    },

    left: {
        flex: 1,
    },
    right: {
        flex: 3, 
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
    },
    image: {
        height: 90,
        width: 90,
    },
    item: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'solid',
        paddingLeft: 10,
        paddingRight: 10,
        // width: (ScreenUtil.deviceWidth() - 50) / 3.0-1,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
    },
    name: {
        fontSize: Macro.font_16,
        fontWeight: '600',
        paddingBottom: 10,
    },
    area: {
        color: Macro.color_636470,
        fontSize: Macro.font_14,
    },
    complete: {
        color: Macro.color_80aae2,
        fontSize: Macro.font_14,
        backgroundColor: Macro.color_dae9ff,
        padding: 3,
        paddingLeft: 5,
        borderRadius: 1,
    },
    number: {
        color: Macro.color_9c9ca5,
        fontSize: Macro.font_14,
    },
    desc: {
        color: Macro.color_c2c1c5,
        fontSize: Macro.font_14,
    },
    line: {
        width: 1,
        height: 15,
        backgroundColor: Macro.color_c2c1c5,
        marginLeft: 5,
        marginRight: 5,
    },
    ii: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 3) / 4.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginTop: 10,
    },
    word: {
        color: 'white',
        fontSize: 16
    },
});

const mapStateToProps = ({buildingReducer}) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(FeeChargeDetail);
