import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BasePage from '../../pages/base/base';
import Macro from '../../utils/macro';
import { Flex } from '@ant-design/react-native';
import { Icon } from '@ant-design/react-native';
//import NavigatorService from '../../pages/navigator/navigator-service';
import numeral from 'numeral';

export default class BuildingHeader extends BasePage {
    constructor(props) {
        super(props);
    }

    // componentDidMount()  { 
    // }

    // scan = () => {
    //     this.props.navigation.push('scanForHome', {
    //         data: {
    //             callBack: (keyvalue) => {
    //                 this.props.navigation.navigate('yiqing', {
    //                     'data': {
    //                         keyvalue,
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // };

    render() {
        const { statistics } = this.props;
        return (
            <View style={styles.content}>
                {/* <Flex direction="row" justify='between' style={styles.top}>
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
                </Flex> */}

                <Flex direction="row" justify='between' style={styles.top}>
                    <Flex justify='start' style={{ flex: 4 }}>
                        <Text style={[styles.text, styles.big]}>总面积 {numeral(statistics.areasum).format('0,0.00')}{Macro.meter_square}</Text>
                    </Flex>

                    <Flex justify='end' style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='bars' color="white" />
                        </TouchableOpacity>
                    </Flex>
                </Flex>

                {/* <Flex direction="column" style={styles.middle}>
                    <Flex justify="between" style={styles.area}>
                        <Text style={styles.text}>总面积</Text> 
                        <Text style={styles.text}>{numeral(statistics.areasum).format('0,0.00')}{Macro.meter_square}</Text>
                    </Flex>
                    <Flex justify='start' style={styles.number}>
                        <Text style={[styles.text, styles.big]}>{numeral(statistics.areasum).format('0,0.00')}</Text>
                    </Flex>
                </Flex> */}

                <Flex style={styles.bottom}>
                    <Flex.Item style={styles.item}>
                        <Text size="small" style={styles.topText}>在租 {statistics.rentarearate}%</Text>
                        <Text size="small" style={styles.bottomText}>{numeral(statistics.rentareasum).format('0,0.00')}{Macro.meter_square}</Text>
                    </Flex.Item>
                    <Flex.Item style={styles.item}>
                        <Text size="small" style={styles.topText}>可招商 {statistics.investmentarearate}%</Text>
                        <Text size="small"
                            style={styles.bottomText}>{numeral(statistics.investmentareasum).format('0,0.00')}{Macro.meter_square}</Text>
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
        height: 150,
        backgroundColor: Macro.color_sky_dark
    },
    top: { 
        flex: 2,
        backgroundColor: Macro.color_sky_dark,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 14
    },
 
    bottom: {
        flex: 2,
        backgroundColor: Macro.color_sky_dark,
        fontSize: 14,
        marginBottom: 8
    },
    
    text: {
        color: Macro.color_white,
        fontSize: 16
    },
    // number: {
    //     flex: 3,
    //     width: '100%'
    // },
    big: {
        fontSize: 25,  
        paddingLeft: 10 
    },
    item: {
        alignItems: 'center'
    },
    topText: {
        color:  '#74BAF1',
        fontSize: 16
    },
    bottomText: {
        color: Macro.color_white,
        fontSize: 16,
        paddingTop: 5
    }
});
