import React from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import BasePage from '../base/base';
import { Flex, Icon, ActionSheet } from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import Macro from '../../utils/macro';
import ManualAction from '../../utils/store/actions/manual-action';
 
export default class PersonInfoPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '个人信息',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
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
                    ManualAction.saveTokenByStore(null);
                }
            },
        );
    };

    render() {
        const { data } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Flex direction={'column'} style={{ paddingTop: 30, paddingBottom: 30 }}>
                    <LoadImage style={{ width: 50, height: 50 }} />
                    <Text style={{ paddingTop: 20, fontSize: 14, color: '#666' }}>张三</Text>
                </Flex>
                <Flex style={{ paddingLeft: 20, paddingRight: 20, width: ScreenUtil.deviceWidth() }}>
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Setting')}>
                        <Flex justify='between'
                            style={[{
                                paddingTop: 15,
                                paddingBottom: 20,
                                width: ScreenUtil.deviceWidth() - 40,
                            }, ScreenUtil.borderBottom()]}>

                            <Text style={styles.item}>联系电话</Text>

                            <Flex>
                                <Text style={styles.right}>132323234</Text>
                                <LoadImage style={{ width: 6, height: 11 }}
                                    defaultImg={require('../../static/images/address/right.png')} />
                            </Flex>
                        </Flex>
                    </TouchableWithoutFeedback>
                </Flex>
                <Flex style={{ paddingLeft: 20, paddingRight: 20, width: ScreenUtil.deviceWidth() }}>
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Setting')}>
                        <Flex justify='between'
                            style={[{
                                paddingTop: 15,
                                paddingBottom: 20,
                                width: ScreenUtil.deviceWidth() - 40,
                            }, ScreenUtil.borderBottom()]}>

                            <Text style={styles.item}>微信号</Text>

                            <Flex>
                                <Text style={styles.right}>132323234</Text>
                                <LoadImage style={{ width: 6, height: 11 }}
                                    defaultImg={require('../../static/images/address/right.png')} />
                            </Flex>
                        </Flex>
                    </TouchableWithoutFeedback>
                </Flex>
            </View>
        );
    }
}

const styles = StyleSheet.create({
   
    name: {
        fontSize: 20,
        color: '#404145',

    },
   
    item: {
        fontSize: 16,
        color: '#666',
    },
    right: {
        fontSize: 16,
        color: '#404145',
        paddingRight: 15
    }

});
