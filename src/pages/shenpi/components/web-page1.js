import React from 'react';
import {TouchableOpacity,Icon} from 'react-native'
import { WebView } from 'react-native-webview';
import BasePage from '../../base/base';
import common from '../../../utils/common';
export default class webPage1 extends BasePage {
  static navigationOptions = ({ navigation }) => {  
    return {
      // tabBarVisible: false,
      title: '查看附件',
      headerForceInset:this.headerForceInset,
            headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
        </TouchableOpacity>
      ),
      type: null,
      isShow: true,
      urlStr: ''
    };
  };
  
  constructor(props) {
    super(props);
    let urlStr = common.getValueFromProps(this.props);
    this.state = {
      urlStr,
    }
    return (
      <WebView source={{ uri: this.state.urlStr }} />
    );
  }
};