import React, {Fragment} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Linking,
} from 'react-native';
import BasePage from '../base/base';
import {Button, Flex, Icon, List, WhiteSpace} from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
import {connect} from 'react-redux';
import ListHeader from '../../components/list-header';
import common from '../../utils/common';
import LoadImage from '../../components/load-image';
import TwoChange from '../../components/two-change';
import NavigatorService from './navigator-service';

export default class FeeDetailPage extends BasePage {
    static navigationOptions = ({navigation}) => {

        console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '上门收费',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
            type: null,
        };
    };

    constructor(props) {
        super(props);
        let room = common.getValueFromProps(this.props);
        console.log('room', room);
        this.state = {
            room,
            pageIndex: 1,
            dataInfo: {
                data: [],
            },
            type: null,

        };

    }


    componentDidMount(): void {
        this.onRefresh();
    }

    click = (index) => {

    };


    onRefresh = () => {
        const {pageIndex, type, room} = this.state;
        NavigatorService.getBillList(type, room.id, pageIndex, 1000).then(dataInfo => {
            this.setState({
                dataInfo: dataInfo,
            },()=>{
                console.log(this.state)
            });
        });
    };
    typeOnChange = (type) => {
        console.log(type);
        this.setState({type},()=>{
            this.onRefresh();
        });
    };


    render() {
        const {statistics, dataInfo,type,room} = this.state;
        return (


            <SafeAreaView style={{flex: 1}}>
                <Text style={{paddingLeft: 15, paddingTop: 15, fontSize: 20}}>{room.allName} {room.tenantName}</Text>
                <TwoChange onChange={this.typeOnChange}/>
                <Flex style={{backgroundColor: '#eee', height: 1, marginLeft: 15, marginRight: 15, marginTop: 15}}/>
                {dataInfo.data.map(item => (
                    <Flex key={item.id} align={'start'} direction={'column'} style={styles.item}>
                        <Flex justify={'between'}
                              style={{paddingLeft: 15, paddingTop: 5, paddingBottom: 5, width: '100%'}}>
                            <Text>{item.feeName}</Text>
                            <Flex>
                                <Text style={{paddingRight: 15}}>{item.amount}</Text>
                                <LoadImage style={{width: 15, height: 15}}/>
                            </Flex>
                        </Flex>
                        <Text style={{paddingLeft: 15, paddingTop: 10}}>{item.beginDate}至{item.endDate}</Text>
                    </Flex>
                ))}
                {type === '已交' ? null : (
                    <Flex>
                        <TouchableWithoutFeedback onPress={() => this.click(0)}>
                            <Flex justify={'center'} style={styles.ii}>
                                <Text style={styles.word}>刷卡</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.click(1)}>
                            <Flex justify={'center'} style={[styles.ii, {backgroundColor: 'blue'}]}>
                                <Text style={styles.word}>扫码</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.click(2)}>
                            <Flex justify={'center'} style={[styles.ii, {backgroundColor: '#f39d39'}]}>
                                <Text style={styles.word}>收款码</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.click(3)}>
                            <Flex justify={'center'} style={[styles.ii, {backgroundColor: 'green'}]}>
                                <Text style={styles.word}>现金</Text>
                            </Flex>
                        </TouchableWithoutFeedback>


                    </Flex>
                )}


            </SafeAreaView>

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
        borderWidth: 1,
        borderColor: '#c8c8c8',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: {h: 10, w: 10},
        shadowRadius: 5,
        shadowOpacity: 0.8,
    },
    blue: {
        borderLeftColor: '#4d8fcc',
        borderLeftWidth: 8,
    },
    orange: {
        borderLeftColor: '#f39d39',
        borderLeftWidth: 8,
    },

    left: {
        flex: 1,

    },
    right: {
        flex: 3,

        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: 20,
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
        paddingLeft: 5,
        paddingRight: 15,

        // width: (ScreenUtil.deviceWidth() - 50) / 3.0-1,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        marginRight: 15,
        marginLeft: 15,
    },
    name: {
        fontSize: Macro.font_16,
        fontWeight: '600',
        paddingBottom: 15,
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
        marginTop: 30,
    },
    word: {
        color: 'white',
        fontSize: 16,


    },
});
