import React, {Fragment} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import BasePage from '../../pages/base/base';
import Macro from '../../utils/macro';
import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';
import {Icon} from '@ant-design/react-native';


export default class BuildingHeader extends BasePage {


    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }

    componentDidMount(): void {

    }



    render() {
        const {statistics,title} = this.props;
        console.log('1',statistics);
        return (
            <View style={styles.content}>
                <Flex direction="row" justify='between' style={styles.top}>
                    <Flex style={{flex: 4}}>
                        <Text style={styles.title}>{title}</Text>
                    </Flex>
                    <Flex justify='between' style={{flex: 1}}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='bars' color="white"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.push('scan')}>
                            <Icon name='scan' color="white"/>
                        </TouchableOpacity>
                    </Flex>
                </Flex>
                <Flex direction="column" style={styles.middle}>
                    <Flex justify="between" style={styles.area}>
                        <Text style={styles.text}>管理数量</Text>
                        <Text style={styles.text}>在租实时均价 0{Macro.yuan_meter_day}</Text>
                    </Flex>
                    <Flex justify='start' style={styles.number}>
                        <Text style={[styles.text, styles.big]}>{statistics.roomsum}</Text>

                    </Flex>
                </Flex>
                <Flex style={styles.bottom}>
                    <Flex.Item style={styles.item}>
                        <Text size="small" style={styles.topText}>在租{100*statistics.checkarea/statistics.roomsum}%</Text>
                        <Text size="small" style={styles.bottomText}>{statistics.checkarea}{Macro.meter_square}</Text>
                    </Flex.Item>
                    <Flex.Item style={styles.item}>
                        <Text size="small" style={styles.topText}>可招商{100*(statistics.roomsum-statistics.checkarea)/statistics.roomsum}%</Text>
                        <Text size="small" style={styles.bottomText}>{statistics.roomsum-statistics.checkarea}{Macro.meter_square}</Text>
                    </Flex.Item>
                    <Flex.Item style={styles.item}>
                        <Text size="small" style={styles.topText}>预计完成率</Text>
                        <Text size="small" style={styles.bottomText}>0%</Text>
                    </Flex.Item>
                </Flex>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'column',
        height: 180,
        backgroundColor: Macro.color_sky,
    },
    top: {
        flex: 2,
        backgroundColor: Macro.color_sky,
        paddingLeft: Macro.marginLeft_15,
        paddingRight: Macro.marginRight_15,
    },
    title: {
        color: Macro.color_white,
        fontSize: Macro.font_20,
        paddingRight: 5,
    },
    middle: {
        flex: 3,
        backgroundColor: Macro.color_sky,
    },
    bottom: {
        flex: 2,
        backgroundColor: Macro.color_sky_dark,
    },
    area: {
        flex: 1,
        width: '100%',
        paddingLeft: Macro.marginLeft_15,
        paddingRight: Macro.marginRight_15,
    },
    text: {
        color: Macro.color_white,
        fontSize: Macro.font_14,
    },
    number: {
        flex: 3,
        width: '100%',
    },
    big: {
        fontSize: Macro.font_40,
        paddingLeft: Macro.marginLeft_15,
    },
    item: {
        alignItems: 'center',
    },
    topText: {
        color: Macro.color_a0b0f3,
        fontSize: Macro.font_12,
    },
    bottomText: {
        color: Macro.color_white,
        fontSize: Macro.font_14,
        paddingTop: 5,
    },
});
