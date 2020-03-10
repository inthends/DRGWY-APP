import React from 'react';
import {View, Text, Button, TouchableWithoutFeedback, TouchableOpacity, StyleSheet} from 'react-native';
import BasePage from '../base/base';
import {Icon} from '@ant-design/react-native';
import {List, WhiteSpace, Flex, TextareaItem, Switch, ActionSheet} from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import Macro from '../../utils/macro';
import ManualAction from '../../utils/store/actions/manual-action';
import MineService from './mine-service';


export default class SettingPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '设置',
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
            index: 0,
            data: ['报修', '报事', '巡场'],
            value: '',
            checked: false,
        };
    }

    componentDidMount(): void {
    }

    logout = () => {
        this.showActionSheet();

    };
    showActionSheet = () => {
        const BUTTONS = [
            '确认退出',
            '取消',
        ];
        ActionSheet.showActionSheetWithOptions(
            {
                title: '是否退出？',
                message: '退出后将收不到推送消息',
                options: BUTTONS,
                cancelButtonIndex: 1,
                destructiveButtonIndex: -1,
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    MineService.logout();
                    ManualAction.saveTokenByStore(null);
                }
            },
        );
    };

    render() {
        const {data} = this.state;
        return (
            <View style={{backgroundColor: '#E8E8E8', flex: 1}}>
                <List renderHeader={<View style={{height: 10}}/>}>
                    <List.Item extra={<Switch color='#447FEA' checked={this.state.checked}
                                              onChange={checked => this.setState({checked})}/>}>
                        <Flex style={{height: 40}}>
                            <Text style={{color: '#666', fontSize: 16}}>消息推送</Text>
                        </Flex>
                    </List.Item>
                </List>
                <List renderHeader={<View style={{height: 10}}/>}>
                    <TouchableWithoutFeedback onPress={() => this.logout()}>
                        <Flex justify={'center'} style={{height: 50}}>
                            <Text style={{color: Macro.work_blue, fontSize: 16}}>退出登录</Text>
                        </Flex>
                    </TouchableWithoutFeedback>

                </List>
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
        paddingLeft: 20,
        paddingRight: 20,
        height: ScreenUtil.contentHeight(),
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
        fontSize: 16,
        color: '#999',
        paddingTop: 5,
    },
    item: {
        fontSize: 16,
        color: '#333',
    },
});
