//楼盘
import React from 'react';
import {
    Text,
    StyleSheet, 
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
//import { connect } from 'react-redux';
//import ListHeader from '../../components/list-header';
import common from '../../../utils/common';
import service from '../statistics-service';
//import LoadImage from '../../components/load-image';
import CommonView from '../../../components/CommonView';

export default class FeeBuildingsPage extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '上门收费',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        let housing = common.getValueFromProps(this.props);
        this.state = {
            housing,
            items: [],
        };
    }

    componentDidMount() {
        service.getBuildings(this.state.housing.id).then(items => {
            this.setState({ items });
        });
    }

    render() {
        const { housing, items } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <Text style={{ paddingLeft: 15, paddingTop: 15, fontSize: 20, color: '#2c2c2c' }}>{housing.name}</Text>
                    <Flex wrap='wrap' style={{ paddingLeft: 10, paddingRight: 10, marginTop: 5 }}>
                        {items.map(item => (
                            <TouchableWithoutFeedback key={item.id}
                                onPress={() => {
                                    if (item.type == 2)
                                        //房间
                                        this.props.navigation.push('feeRooms', { data: item });
                                    else
                                        //车位
                                        this.props.navigation.push('feeParkings', { data: item });
                                }}> 
                                {/* <Flex style={[styles.item, item.color === 2 ? '' : styles.orange]} justify={'center'}>
                                    <Text style={[styles.title, item.color === 2 ? '' : styles.orange]}>{item.name}</Text>
                                </Flex> */}

                                {/* 费用状态，1,2,3
                                没有未收款的 显示灰色1
                                未收款最小账单日小于当前日期的显示橙色2
                                未收款最小账单日大于当前日期的显示绿色3 */}
                                <Flex style={[styles.item, item.color == 1 ? styles.gray : (item.color == 2 ? styles.orange : styles.green)]} justify={'center'}>
                                    <Text style={[styles.title, item.color == 1 ? styles.gray : (item.color == 2 ? styles.orange : styles.green)]}>{item.name}</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        ))}
                    </Flex>
                </ScrollView>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
   
    // content: {
    //     backgroundColor: Macro.color_white,
    //     flex: 1
    // },
    title: {
        color: '#404145',
        fontSize: 16,
    },
     
    left: {
        flex: 1
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
        paddingRight: 5,
        width: (ScreenUtil.deviceWidth() - 50) / 3.0 - 1,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        marginRight: 5,
        marginLeft: 5,
    },
    name: {
        fontSize: Macro.font_16,
        fontWeight: '600',
        paddingBottom: 15,
    },
   
    orange: {
        backgroundColor: Macro.color_f39d39,
        color: '#fff'
    },
    green: {
        backgroundColor: '#298A08',
        color: '#fff'
    },
    gray: {
        backgroundColor: '#A4A4A4',
        color: '#fff'
    }
});
