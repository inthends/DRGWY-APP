import React  from 'react';
import { 
    Text,
    StyleSheet,
    //View,
    // StatusBar,
    // FlatList,
    // Linking,
    TouchableOpacity,
    TouchableWithoutFeedback, 
    ScrollView,
} from 'react-native';
import BasePage from '../base/base';
import {   Flex, Icon } from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
//import { connect } from 'react-redux';
//import ListHeader from '../../components/list-header';
import common from '../../utils/common';
import NavigatorService from './navigator-service';
//import LoadImage from '../../components/load-image';
import CommonView from '../../components/CommonView';


export default class FeeBuildingsPage extends BasePage {
    static navigationOptions = ({ navigation }) => { 
        // console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '上门收费',
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
        // console.log(11, housing);
        this.state = {
            housing,
            items: [],
        };
    }

    componentDidMount(): void {
        NavigatorService.getBuildings(this.state.housing.id).then(items => {
            this.setState({ items });
        });
    }


    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1,
        }, () => {
            this.getList();
        });
    };


    render() {
        const { housing, items } = this.state;
        return (


            <CommonView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <Text style={{ paddingLeft: 15, paddingTop: 15, fontSize: 20 }}>{housing.name}</Text>
                    <Flex wrap='wrap' style={{ paddingLeft: 10, paddingRight: 10, marginTop: 15 }}>
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
                                {/* <Flex style={[styles.item, item.isClear === true ? '' : styles.orange2]} justify={'center'}>
                                    <Text style={[styles.title, item.isClear === true ? '' : styles.orange2]}>{item.name}</Text>
                                </Flex> */}

                                <Flex style={[styles.item, item.color === 2 ? '' : styles.orange2]} justify={'center'}>
                                    <Text style={[styles.title, item.color === 2 ? '' : styles.orange2]}>{item.name}</Text>
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
    orange2: {
        backgroundColor: Macro.color_f39d39,
        color: '#fff',
    },
});
