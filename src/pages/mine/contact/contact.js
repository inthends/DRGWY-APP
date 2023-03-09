import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ImageBackground,
} from 'react-native';
import {Icon} from '@ant-design/react-native';
import {List, WhiteSpace, Flex, TextareaItem, InputItem, Button} from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import Macro from '../../../utils/macro';
import MineService from '../mine-service';
import common from '../../../utils/common';
import UDToast from '../../../utils/UDToast';
import BasePage from '../../base/base';

export default class Contact extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '通讯录',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),

        };
    };

    constructor(props) {
        super(props);
        this.state = {

        };

    }






    render() {
        const {data} = this.state;
        return (

            <View style={{flex: 1}}>
                <ScrollView>
                    <View style={styles.content}>

                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('contactDetail',{type:'1'})}>
                            <Flex justify='between'
                                  style={[{
                                      marginTop: 30,
                                      paddingBottom: 20,
                                      paddingLeft: 15,
                                      paddingRight: 25,
                                  }, ScreenUtil.borderBottom()]}>
                                <Flex>

                                    <Text style={styles.item}>公司内部</Text>
                                </Flex>
                                <LoadImage style={{width: 8, height: 15}}
                                           defaultImg={require('../../../static/images/address/right.png')}/>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('contactDetail',{type:'2'})}>
                            <Flex justify='between'
                                  style={[{
                                      marginTop: 30,
                                      paddingBottom: 20,
                                      paddingLeft: 15,
                                      paddingRight: 25,
                                  }, ScreenUtil.borderBottom()]}>
                                <Flex>

                                    <Text style={styles.item}>往来单位</Text>
                                </Flex>
                                <LoadImage style={{width: 8, height: 15}}
                                           defaultImg={require('../../../static/images/address/right.png')}/>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>


        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_white,
    },
    content: {
        backgroundColor: Macro.color_white,
        paddingLeft: 15,
        paddingRight: 20,
        height: ScreenUtil.contentHeight(),

        // height: ScreenUtil.contentHeightWithNoTabbar(),
    },
    header: {
        paddingTop: 30,
        paddingBottom: 30,
    },
    name: {
        fontSize: 20,
        color: '#333',

    },
    desc: {
        fontSize: 14,
        color: '#999',
        paddingTop: 5,
    },
    item: {
        fontSize: 18,
        color: '#333',
    },
    button: {
        backgroundColor: Macro.work_blue,
    },
});
