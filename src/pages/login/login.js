import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import BasePage from '../base/base';
import {Button, InputItem, List} from '@ant-design/react-native';
import LoginService from './login-service';
import {saveToken} from '../../utils/store/actions/actions';
import {connect} from 'react-redux';

class LoginPage extends BasePage {


    constructor(props) {
        super(props);
        this.state = {
            username: 'system',
            password: '111111',
        };

    }


    componentDidMount(): void {
        // this.login()
    }

    login = () => {
        const {username, password} = this.state;

        LoginService.login(username, password).then(res => {
            console.log(1, res);
            this.props.saveToken(res);
        }).catch(error =>{
            console.log(error)
        });

    };


    render() {
        const {goods, kinds} = this.state;
        return (
            <View style={styles.content}>
                <List>
                    <InputItem
                        clear
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
                        value={this.state.password}
                        onChange={value => {
                            this.setState({
                                password: value,
                            });
                        }}
                        placeholder="请输入密码"
                    >
                        密码
                    </InputItem>
                    <Button onPress={() => this.login()} style={styles.login} type="primary">登陆</Button>
                </List>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {

        paddingTop: 300,
        paddingLeft: 30,
        paddingRight: 30,
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    login: {
        marginTop: 30,
    },

});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveToken: (token) => {
            dispatch(saveToken(token));
        },
    };
};
export default connect(null, mapDispatchToProps)(LoginPage);

