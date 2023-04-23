import React  from 'react';
import BasePage from '../pages/base/base';
import {SafeAreaView, View} from 'react-native';
import common from '../utils/common';

export default class CommonView extends BasePage {
    render() {
        let v;
        if (common.isIOS()) {
            v = <SafeAreaView style={this.props.style}>
                {this.props.children}
            </SafeAreaView>;
        } else {
            v = <View style={this.props.style}>
                {this.props.children}
            </View>;
        }
        return v;
    }
}
