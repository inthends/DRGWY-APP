import React//, {Fragment} 
    from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import BasePage from '../../pages/base/base';
import Macro from '../../utils/macro';
import {
    Flex,
    //Button, WhiteSpace, WingBlank
} from '@ant-design/react-native';
import LoadImage from '../load-image';
import ScreenUtil from '../../utils/screen-util';
import numeral from 'numeral';
//楼栋
export default class BuildingCell extends BasePage {
    constructor(props) {
        super(props);
    }
    //louDetail shebeiDetail
    //<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('feeDetail',{})}>
    //DetailBuilding

    render() {
        const { item } = this.props;
        return (
            //<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('feeDetail',{})}>
            //<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('louDetail',{})}> 
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate(this.props.nextRouteName, { data: item })}>
                <View style={styles.content}>
                    <Flex direction="row">
                        <Flex style={styles.left}>
                            <LoadImage img={item.mainpic} style={styles.image} />
                        </Flex>
                        <Flex direction="column" justify="between" style={styles.right}>
                            <Flex justify="between" style={styles.item}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.area}>{item.code}</Text>
                            </Flex>
                            <Flex justify="between" style={[styles.item, { marginTop: 10 }]}>
                                <Text style={styles.complete}>{item.buildingformat == '住宅' ? '入住率' : '出租率'} {item.rentarearate}%</Text>
                                <Text style={styles.number}>{numeral(item.areasum).format('0,0.00')}{Macro.meter_square}</Text>
                            </Flex>
                            <Flex style={[styles.item, { marginTop: 12 }]}>
                                <Text style={styles.desc}>在租 {numeral(item.rentareasum).format('0,0.00')}{Macro.meter_square}</Text>
                                <View style={styles.line} />
                                <Text style={[styles.desc, { marginRight: 10 }]}>可招商 {numeral(item.investmentareasum).format('0,0.00')}{Macro.meter_square}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        borderBottomColor: '#f6f5f7',
        borderBottomWidth: 1,
    },
    left: {
        paddingTop: 20,
        paddingBottom: 20,
        height: 140
    },
    right: {
        width: ScreenUtil.deviceWidth() - 100 - 20 - 10 - 20,
        height: 120,
        paddingTop: 10,
        paddingBottom: 20,
        marginLeft: 10,
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 5
    },
    item: {
        marginTop: 5,
        width: '100%'
    },
    name: {
        fontSize: 16,
        // fontWeight: '600',
        color: '#2c2c2c'
    },
    area: {
        // fontWeight: '600',
        fontSize: Macro.font_14,
        color: '#2c2c2c'
    },
    complete: {
        color: 'white',
        fontSize: Macro.font_14,
        backgroundColor: '#74BAF1',
        padding: 3,
        paddingLeft: 5,
        borderRadius: 3
    },
    number: {
        color: '#666',
        fontSize: Macro.font_14,
    },
    desc: {
        color: '#999999',
        fontSize: Macro.font_14
    },
    line: {
        width: 1,
        height: 15,
        backgroundColor: '#bcbcbe',
        marginLeft: 10,
        marginRight: 10
    }
});
