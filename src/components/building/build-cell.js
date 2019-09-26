import React, {Fragment} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import BasePage from '../../pages/base/base';
import Macro from '../../utils/macro';
import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';
import LoadImage from '../load-image';


export default class BuildingCell extends BasePage {


    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }

    componentDidMount(): void {

    }

//DetailBuilding
    render() {
        const {item} = this.props;
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate(this.props.nextRouteName, {data: item})}>
                <View style={styles.content}>
                    <Flex direction="row" style={styles.top}>
                        <Flex style={styles.left}>
                            <LoadImage style={styles.image}/>
                        </Flex>
                        <Flex direction="column" justify="between" style={styles.right}>
                            <Flex justify="between" style={styles.item}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.area}>0{Macro.yuan_meter_day}</Text>
                            </Flex>
                            <Flex justify="between" style={styles.item}>
                                <Text style={styles.complete}>预计完成率 0%</Text>
                                <Text style={styles.number}>管理数量{item.roomsum}{Macro.meter_square}</Text>
                            </Flex>
                            <Flex style={styles.item}>
                                <Text style={styles.desc}>在租{item.checkarea}{Macro.meter_square}</Text>
                                <View style={styles.line}/>
                                <Text
                                    style={styles.desc}>可招商{100 * (item.roomsum - item.checkarea) / item.roomsum}%{item.roomsum - item.checkarea}{Macro.meter_square}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'column',
        height: 120,
        marginLeft: 15,
        marginRight: 15,
        borderBottomColor: Macro.color_f6f5f7,
        borderBottomWidth: 1,
    },
    left: {
        flex: 1,
        height: 120,
    },
    right: {
        flex: 3,
        height: 120,
        paddingTop: 20,
        paddingBottom: 20,
    },
    image: {
        height: 90,
        width: 90,
    },
    item: {
        width: '100%',
    },
    name: {
        fontSize: Macro.font_16,
        fontWeight: '600',
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


});
