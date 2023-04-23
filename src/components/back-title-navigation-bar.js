import React, {Component} from 'react';
import {Text,TouchableOpacity,StyleSheet} from 'react-native';
// import LoadImage from './load-image';
import { Flex, Icon } from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';

export default class BackTitleNavigationBar extends Component {
    render() {
        return (
            <Flex justify='start' style={{height: 44, paddingLeft: 15, paddingRight: 15}}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Icon name='left' style={{width: 30}}/>
                </TouchableOpacity>
                <Text style={sheet.title}>{this.props.title}</Text>
            </Flex>
        );
    }
}
const sheet = StyleSheet.create({
    title: {
        fontSize:20,
        color:'#333',
        // paddingLeft: 100
        width: ScreenUtil.deviceWidth()-30-60,
        textAlign: 'center'
    }
})



