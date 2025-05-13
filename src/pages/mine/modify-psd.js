import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BasePage from '../base/base';
import { WhiteSpace, Flex, InputItem, Icon, Button } from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import Macro from '../../utils/macro';
import MineService from './mine-service';
import ManualAction from '../../utils/store/actions/manual-action';
//import common from '../../utils/common';
import UDToast from '../../utils/UDToast';

export default class ModifyPsdPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '修改密码',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            isComplexPassword: false
        };
    }
 
    componentDidMount() {
        MineService.getSetting('isComplexPassword').then((res) => {
            this.setState({ isComplexPassword: res });
        });
    }

    submit = () => {
        const { oldPassword, newPassword, confirmPassword, isComplexPassword } = this.state; 
        if (newPassword === confirmPassword) { 
            if (newPassword != '' && isComplexPassword) {
                //验证新密码
                let reg = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,20}$/;
                var isok = reg.test(newPassword);
                if (!isok) {
                    UDToast.showInfo('新密码格式不正确');
                    return;
                }
            }

            MineService.changePsd(newPassword, oldPassword).then(res => {
                UDToast.showInfo('修改成功');
                //common.pagebackAfterTime(this.props);
                //需要重新登录
                MineService.logout();
                ManualAction.saveTokenByStore(null);
            });
        }
    };


    render() {
        const { isComplexPassword } = this.state;
        return (
            <View style={styles.content}>
                <Flex justify='between' aligen='center' style={styles.header}>
                    <Flex direction='column' align='start'>
                        <Text style={styles.name}>修改密码</Text>
                    </Flex>
                </Flex>

                <Flex direction='column' align='start' style={{ marginLeft: -15 }}>
                    <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15 }}>原密码</Text>
                    <InputItem
                        clear
                        type="password"
                        maxLength={20}
                        value={this.state.oldPassword}
                        onChange={value => {
                            this.setState({
                                oldPassword: value,
                            });
                        }}
                        placeholder="请输入原密码"
                    // extra={<Icon/>}
                    />
                </Flex>

                <Flex direction='column' align='start' style={{ marginLeft: -15 }}>
                    <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15, paddingTop: 15 }}>新密码</Text>
                    <InputItem
                        clear
                        type="password"
                        maxLength={20}
                        value={this.state.newPassword}
                        onChange={value => {
                            this.setState({
                                newPassword: value,
                            });
                        }}
                        placeholder="请输入新密码"
                    // extra={<Icon/>}
                    />
                </Flex>

                <Flex direction='column' align='start' style={{ marginLeft: -15 }}>
                    <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15, paddingTop: 15 }}>确认新密码</Text>
                    <InputItem
                        clear
                        type="password"
                        maxLength={20}
                        value={this.state.confirmPassword}
                        onChange={value => {
                            this.setState({
                                confirmPassword: value,
                            });
                        }}
                        placeholder="请再次输入新密码"
                    // extra={<Icon/>}
                    />
                </Flex>
                <WhiteSpace style={{ height: 15 }} />
                {isComplexPassword ? <Text style={styles.desc}>长度在6到20个字符之间，且至少包含一个小写字母、一个数字和一个英文特殊字符（!@#$%^&*）</Text> : null}
                <Button style={styles.button} type="primary" onPress={() => this.submit()}>确定</Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    content: {
        backgroundColor: Macro.color_white,
        paddingLeft: 20,
        paddingRight: 20,
        height: ScreenUtil.contentHeight()
        // height: ScreenUtil.contentHeightWithNoTabbar(),
    },
    header: {
        paddingTop: 30,
        paddingBottom: 20,
    },
    name: {
        fontSize: 20,
        color: '#404145',

    },
    desc: {
        fontSize: 14,
        color: '#999',
        paddingTop: 5,
    },
    button: {
        marginTop: 15,
        backgroundColor: Macro.work_blue
    },
});
