import React  from 'react';
import {View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BasePage from '../../pages/base/base';
import Macro from '../../utils/macro';
import {  Flex } from '@ant-design/react-native';
import {Icon} from '@ant-design/react-native';
//import NavigatorService from '../../pages/navigator/navigator-service';

export default class BuildingHeader extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }

    // componentDidMount(): void { 
    // }


    scan = () => {
        this.props.navigation.push('scanForHome', {
            data: {
                callBack: (keyvalue) => {
                    this.props.navigation.navigate('yiqing', {
                        'data': {
                            keyvalue,
                        }
                    });
                }
            }
        });
    };


    render() {
        const {statistics, title} = this.props;
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
                        <TouchableOpacity onPress={this.scan}>
                            <Icon name='scan' color="white"/>
                        </TouchableOpacity>
                    </Flex>
                </Flex>
                <Flex direction="column" style={styles.middle}>
                    <Flex justify="between" style={styles.area}>
                        <Text style={styles.text}>管理数量{Macro.meter_square}</Text>
                        <Text style={styles.text}>实时在租均价 {statistics.averagerentprice}{Macro.yuan_meter_day}</Text>
                    </Flex>
                    <Flex justify='start' style={styles.number}>
                        <Text style={[styles.text, styles.big]}>{statistics.areasum}</Text>

                    </Flex>
                </Flex>
                <Flex style={styles.bottom}>
                    <Flex.Item style={styles.item}>
                        <Text size="small" style={styles.topText}>在租 {statistics.rentarearate}%</Text>
                        <Text size="small" style={styles.bottomText}>{statistics.rentareasum}{Macro.meter_square}</Text>
                    </Flex.Item>
                    <Flex.Item style={styles.item}>
                        <Text size="small" style={styles.topText}>可招商 {statistics.investmentarearate}%</Text>
                        <Text size="small"
                              style={styles.bottomText}>{statistics.investmentareasum}{Macro.meter_square}</Text>
                    </Flex.Item>
                    <Flex.Item style={styles.item}>
                        <Text size="small" style={styles.topText}>入住率</Text>
                        <Text size="small" style={styles.bottomText}>{statistics.checkrate}%</Text>
                    </Flex.Item>
                </Flex>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'column',
        height: 240,
        backgroundColor: Macro.color_sky_dark,
    },
    top: {
        flex: 2,
        backgroundColor: Macro.color_sky_dark,
        paddingLeft: Macro.marginLeft_15,
        paddingRight: Macro.marginRight_15,
        fontSize: 14,
    },
    title: {
        color: Macro.color_white,
        fontSize: Macro.font_20,
        paddingRight: 5,
    },
    middle: {
        flex: 4,
        backgroundColor: Macro.color_sky_dark,
    },
    bottom: {
        flex: 2,
        backgroundColor: Macro.color_sky_dark,
        fontSize: 14,
        marginBottom: 8,

    },
    area: {
        flex: 1,
        width: '100%',
        paddingLeft: Macro.marginLeft_15,
        paddingRight: Macro.marginRight_15,
    },
    text: {
        color: Macro.color_white,
        fontSize: 18.5,
    },
    number: {
        flex: 3,
        width: '100%',
    },
    big: {
        fontSize: 41.67, 
        paddingLeft: Macro.marginLeft_15,
    },
    item: {
        alignItems: 'center',

    },
    topText: {
        color: Macro.color_a0b0f3,
        fontSize: 17.67,
    },
    bottomText: {
        color: Macro.color_white,
        fontSize: 17.67,
        paddingTop: 5,
    },
});
