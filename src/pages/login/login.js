import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  NativeModules
} from 'react-native';
import BasePage from '../base/base';
import { Button, Flex, InputItem, List } from '@ant-design/react-native';
import LoginService from './login-service';
import {
  saveToken,
  saveUrl,
  saveUserNameAndPsd,
} from '../../utils/store/actions/actions';
import { connect } from 'react-redux';
import LoadImage from '../../components/load-image';
import ScreenUtil from '../../utils/screen-util';
import Macro from '../../utils/macro';
import JPush from 'jpush-react-native';
// import UDAlert from '../../utils/UDAlert';
// import { addDownListener, upgrade, checkUpdate } from 'rn-app-upgrade';
import common from '../../utils/common';
// import UDToast from '../../utils/UDToast';
// import api from '../../utils/api';
// import NavigatorService from '../navigator/navigator-service';

class LoginPage extends BasePage {
  constructor(props) {
    super(props);
    this.state = { ...this.props.userInfo };

    // this.state = {
    //   usercode: 'test',
    //   username: 'kj',
    //   password: '1234598',
    // };
  }

  componentDidMount() {
    if (!common.isIOS()) {
      NativeModules.LHNToast.getVersionCode((version) => {
        this.setState({ version });
      });
    } else {
      NativeModules.LHNToast.getVersionCode((err, version) => {
        this.setState({ version });
      });
    }
  }

  initUI() {}

  // componentWillMount() {
  //     this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
  //     this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  // }
  //
  // componentWillUnmount() {
  //     this.keyboardDidShowListener.remove();
  //     this.keyboardDidHideListener.remove();
  // }
  //
  // _keyboardDidShow() {
  //     this.keyBoardIsShow = true;
  // }
  //
  // _keyboardDidHide() {
  //     this.keyBoardIsShow = false;
  // }
  //
  // lostBlur() {
  //     //退出软件盘
  //     if (this.keyBoardIsShow === true) {
  //         Keyboard.dismiss();
  //     }
  // }

  login = () => {
    const { username, password, usercode } = this.state;
    JPush.getRegistrationID((result) => {
      // console.log('re', result);
      // this.setState({
      //     registration_id: result.registerID,
      // });

      LoginService.getServiceUrl(usercode)
        .then((res) => {
          this.props.saveUrl(res);
          LoginService.login(username, password, result.registerID)
            .then((res) => {
              this.props.saveNameAndPsd({ ...this.state });
              this.props.saveToken(res);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {});
    });
  };

  render() {
    const { version } = this.state;

    return (
      <Fragment>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.content}>
            <LoadImage
              style={{
                width: 120,
                height: 120,
                borderRadius: 5,
                marginBottom: 50,
              }}
              img={require('../../static/images/logo.png')}
            />
            <List style={{ width: ScreenUtil.deviceWidth() - 60 }}>
              <InputItem
                clear
                labelNumber="6"
                value={this.state.usercode}
                onChange={(value) => {
                  this.setState({
                    usercode: value,
                  });
                }}
                placeholder="请输入编号"
              >
                编号
              </InputItem>
              <InputItem
                clear
                labelNumber="6"
                value={this.state.username}
                onChange={(value) => {
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
                labelNumber="6"
                type="password"
                value={this.state.password}
                onChange={(value) => {
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
            <Button
              onPress={() => this.login()}
              style={styles.login}
              type="primary"
            >
              登录
            </Button>
            <Flex>
              <Text style={styles.version}>版本号：{version}</Text>
            </Flex>
          </View>
        </TouchableWithoutFeedback>
      </Fragment>
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
    backgroundColor: Macro.work_blue,
  },
  version: {
    color: '#999',
    fontSize: 12,
    paddingTop: 60,
  },
});

const mapStateToProps = ({ memberReducer }) => {
  return { userInfo: memberReducer.userInfo };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveToken: (token) => {
      dispatch(saveToken(token));
    },
    saveUrl: (url) => {
      dispatch(saveUrl(url));
    },
    saveNameAndPsd: (data) => {
      dispatch(saveUserNameAndPsd(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
