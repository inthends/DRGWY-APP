import React from 'react';
import {View, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet} from 'react-native';
import BasePage from '../base/base';
import {Icon} from '@ant-design/react-native';
import {List, WhiteSpace, Flex, TextareaItem, InputItem, Button} from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import Macro from '../../utils/macro';
import MineService from './mine-service';
import common from '../../utils/common';
import UDToast from '../../utils/UDToast';

export default class ModifyPsdPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '修改密码',
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
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        };

    }

    componentDidMount(): void {
    }

    submit = () => {
        const {oldPassword, newPassword, confirmPassword} = this.state;
        if (newPassword === confirmPassword) {
            MineService.changePsd(newPassword, oldPassword).then(res => {
                UDToast.showInfo('操作成功');
                common.pagebackAfterTime(this.props);
            });
        }

    };


    render() {
        const {data} = this.state;
        return (

            <View style={styles.content}>
                <Flex justify='between' aligen='center' style={styles.header}>
                    <Flex direction='column' align='start'>
                        <Text style={styles.name}>修改密码</Text>
                        <Text style={styles.desc}>密码规则：8-20位字母与数字的组合，必须包含大小写</Text>
                    </Flex>
                </Flex>

                <Flex direction='column' align='start' style={{marginLeft: -15}}>
                    <Text style={{color: '#666', fontSize: 15, paddingLeft: 15}}>原密码</Text>
                    <InputItem
                        clear
                        type="password"

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

                <Flex direction='column' align='start' style={{marginLeft: -15}}>
                    <Text style={{color: '#666', fontSize: 15, paddingLeft: 15, paddingTop: 15}}>新密码</Text>
                    <InputItem
                        clear
                        type="password"
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

                <Flex direction='column' align='start' style={{marginLeft: -15}}>
                    <Text style={{color: '#666', fontSize: 15, paddingLeft: 15, paddingTop: 15}}>确认新密码</Text>
                    <InputItem
                        clear
                        type="password"
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
                <WhiteSpace style={{height: 50}}/>
                <Button style={styles.button} type="primary" onPress={() => this.submit()}>完成</Button>


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
        fontSize: 14,
        color: '#333',
        paddingLeft: 20,
    },
    button: {
        backgroundColor: Macro.work_blue,
    },
});
