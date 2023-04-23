import React, {Component } from 'react';
import {Text, StyleSheet} from 'react-native';
import {Flex} from '@ant-design/react-native';
import Macro from '../utils/macro';
import ScreenUtil from '../utils/screen-util';
import LoadImage from './load-image';
// import DashLine from './dash-line';

export default class AreaInfo extends Component {


    render() {
        return (
            <Flex direction={'column'} style={[{width: ScreenUtil.deviceWidth()},this.props.style]}>
                <Flex justify={'between'} style={{width: ScreenUtil.deviceWidth() - 30,paddingBottom: 20,}}>
                    <Text style={styles.name}>管理面积：7.8万{Macro.meter_square}</Text>

                    <Text style={styles.name}>房屋套数：930套</Text>


                </Flex>
                <Flex justify={'between'} style={{width: ScreenUtil.deviceWidth() - 30}}>
                    <Text style={styles.name}>入住率：75%</Text>

                    <Flex>
                        <LoadImage style={{width:15,height:15}}/>
                        <Text style={styles.name}>收费类别</Text>
                    </Flex>


                </Flex>
            </Flex>
        );
    }

}

const styles = StyleSheet.create({
    name: {
        color: '#666',
        fontSize: 14,
        paddingLeft:10
    },
});
