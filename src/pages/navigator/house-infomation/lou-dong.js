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
// import { connect } from 'react-redux';
// import ListHeader from '../../../components/list-header';
import common from '../../../utils/common';
import service from '../navigator-service';
// import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
 
export default class LouDong extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '楼栋/车库',
            headerForceInset:this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            )
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
 
    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1
        }, () => {
            this.getList();
        });
    };
    
    render() {
        const { housing, items } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <Text style={{ paddingLeft: 15, paddingTop: 15, fontSize: 20, color: '#2c2c2c' }}>{housing.name}</Text>
                    <Flex wrap='wrap' style={{ paddingLeft: 10, paddingRight: 10  }}>
                        {items.map(item => (
                            <TouchableWithoutFeedback key={item.id}
                                onPress={() => {
                                    if (item.type == 2)
                                        //房间
                                        this.props.navigation.push('louCeng', { data: item });
                                    else
                                        //车位
                                        this.props.navigation.push('louPark', { data: item });
                                }}>

                                {/* <Flex style={[styles.item, item.color === 2 ? '' : styles.orange2]} justify={'center'}>
                                    <Text style={[styles.title, item.color === 2 ? '' : styles.orange2]}>{item.name}</Text>
                                </Flex> */} 
                                <Flex style={[styles.item, item.color == 1 ? styles.gray : (item.color == 2 ? styles.orange : styles.green)]} justify={'center'}>
                                    <Text style={[styles.title, item.color == 1 ? styles.gray : (item.color == 2 ? styles.orange : styles.green)]}>{item.name}</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        ))} 
                    </Flex>
                </ScrollView> 
            </CommonView >

        );
    }
}

const styles = StyleSheet.create({
    
    title: {
        color: '#404145',
        fontSize: 16
    },

    left: {
        flex: 1
    },
    image: {
        height: 90,
        width: 90
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
        marginLeft: 5
    },
    name: {
        fontSize: Macro.font_16,
        fontWeight: '600',
        paddingBottom: 15
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
