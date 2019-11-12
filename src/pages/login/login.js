import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import BasePage from '../base/base';
import {Button, InputItem, List} from '@ant-design/react-native';
import LoginService from './login-service';
import {saveToken,saveUrl} from '../../utils/store/actions/actions';
import {connect} from 'react-redux';
import LoadImage from '../../components/load-image';
import ScreenUtil from '../../utils/screen-util';

class LoginPage extends BasePage {


    constructor(props) {
        super(props);
        this.state = {
            username: 'system',
            password: '111111',
            usercode: '1001',
        };

    }


    componentDidMount(): void {

    }

    login = () => {
        const {username, password, usercode} = this.state;

        LoginService.getServiceUrl(usercode).then(res=>{
            this.props.saveUrl(res);
            LoginService.login(username, password, usercode).then(res => {
                console.log(1, res);
                this.props.saveToken(res);
            }).catch(error => {
                console.log(error);
            });
        }).catch(err=>{

        });



    };


    render() {
        const {goods, kinds} = this.state;
        return (
            <View style={styles.content}>
                <LoadImage style={{width: 120, height: 120, borderRadius: 5, marginBottom: 50}}
                           img={require('../../static/images/logo.png')}/>
                <List style={{width: ScreenUtil.deviceWidth() - 60}}>
                    <InputItem
                        clear
                        labelNumber='6'
                        value={this.state.usercode}
                        onChange={value => {
                            this.setState({
                                usercode: value,
                            });
                        }}
                        placeholder="请输入产品编号"
                    >
                        产品编号
                    </InputItem>
                    <InputItem
                        clear
                        labelNumber='6'
                        value={this.state.username}
                        onChange={value => {
                            this.setState({
                                username: value,
                            });
                        }}
                        placeholder="请输入账号"
                    >
                        账号
                    </InputItem>
                    <InputItem
                        clear
                        labelNumber='6'
                        secureTextEntry
                        value={this.state.password}
                        onChange={value => {
                            this.setState({
                                password: value,
                            });
                        }}
                        placeholder="请输入密码"
                        last={true}
                    >
                        密码
                    </InputItem>
                </List>
                <Button onPress={() => this.login()} style={styles.login} type="primary">登陆</Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {


        // paddingLeft: 30,
        // paddingRight: 30,

        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    login: {
        marginTop: 30,
        width: ScreenUtil.deviceWidth() - 60,
    },

});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveToken: (token) => {
            dispatch(saveToken(token));
        },
        saveUrl:(url)=>{
            dispatch(saveUrl(url));
        }
    };
};
export default connect(null, mapDispatchToProps)(LoginPage);

