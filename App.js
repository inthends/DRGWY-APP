/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import AppContainer from './src/pages/tabbar/tabbar';
import { Provider } from '@ant-design/react-native';
import { Provider as Pro } from 'react-redux';
import store from './src/utils/store/store';
import AppRouter from './router';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor } from './src/utils/store/store';
import JPush from 'jpush-react-native';
import { Alert, DeviceEventEmitter } from 'react-native';
import UDAlert from './src/utils/UDAlert';
import NavigatorService from './src/pages/navigator/navigator-service';

type Props = {};

class App extends Component<Props> {
  constructor(props) {
    super(props);
    console.log(123, process.env);

    DeviceEventEmitter.addListener('currentNavigation', (navigation) => {
      this.navigation = navigation;
    });
  }

  componentDidMount() {
    JPush.init();

    //连接状态
    this.connectListener = (result) => {
      // console.log('connectListener:' + JSON.stringify(result));
    };
    JPush.addConnectEventListener(this.connectListener);
    //通知回调
    this.notificationListener = (result) => {
      Alert.alert(
        result.title,
        result.content,
        [
          {
            text: '取消',
            // onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: '立即查看',
            onPress: () => {
              this.navigation.navigate('newsList', {
                data: result,
              });
            },
          },
        ],
        { cancelable: false },
      );
    };
    JPush.addNotificationListener(this.notificationListener);
    //本地通知回调
    this.localNotificationListener = (result) => {
      // console.log('localNotificationListener:' + JSON.stringify(result));
      // alert(1)
    };
    JPush.addLocalNotificationListener(this.localNotificationListener);
    //自定义消息回调
    this.customMessageListener = (result) => {
      console.log('customMessageListener:' + JSON.stringify(result));
    };
    JPush.addCustomMessagegListener(this.customMessageListener);
    //tag alias事件回调
    this.tagAliasListener = (result) => {
      console.log('tagAliasListener:' + JSON.stringify(result));
    };
    JPush.addTagAliasListener(this.tagAliasListener);
    //手机号码事件回调
    this.mobileNumberListener = (result) => {
      console.log('mobileNumberListener:' + JSON.stringify(result));
    };
    JPush.addMobileNumberListener(this.mobileNumberListener);

    // JPush.getRegistrationID(res => {
    //     alert(JSON.stringify(res));
    // });

    JPush.setLoggerEnable(true);
  }

  render() {
    return (
      <Pro store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Provider>
            <AppRouter />
          </Provider>
        </PersistGate>
      </Pro>
    );
  }
}

export default App;
