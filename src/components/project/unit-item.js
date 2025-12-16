
import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import BasePage from '../../pages/base/base';
import Macro from '../../utils/macro';
import {
    Flex
} from '@ant-design/react-native';
import LoadImage from '../load-image';
import ScreenUtil from '../../utils/screen-util';
import numeral from 'numeral';

//房产或者车位
export default class UnitItem extends BasePage {
    constructor(props) {
        super(props);
    }

    render() {
        const { item } = this.props;
        return (
            <TouchableWithoutFeedback onPress={() => 
                this.props.navigation.navigate(
                    'DetailUnit',
                    { data: item }
                )}>
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
                                <Text style={styles.complete}>{item.state}</Text>
                                <Text style={styles.number}>{numeral(item.billarea).format('0,0.00')}{Macro.meter_square}</Text>
                            </Flex>
                            <Flex style={[styles.item, { marginTop: 12 }]}>
                                <Text style={styles.desc}>{item.allname}</Text>
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
