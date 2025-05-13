import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Icon, Flex } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import Macro from '../../../utils/macro';
import BasePage from '../../base/base';

export default class Contact extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '通讯录',
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
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.content}> 
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('contactDetail')}>
                            <Flex justify='between'
                                style={[{
                                    marginTop: 30,
                                    paddingBottom: 20,
                                    paddingLeft: 15,
                                    paddingRight: 25,
                                }, ScreenUtil.borderBottom()]}>
                                <Flex>
                                    <Text style={styles.item}>内部员工</Text>
                                </Flex>
                                <LoadImage style={{ width: 8, height: 15 }}
                                    defaultImg={require('../../../static/images/address/right.png')} />
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('vendorDetail')}>
                            <Flex justify='between'
                                style={[{
                                    marginTop: 30,
                                    paddingBottom: 20,
                                    paddingLeft: 15,
                                    paddingRight: 25,
                                }, ScreenUtil.borderBottom()]}>
                                <Flex>
                                    <Text style={styles.item}>往来单位</Text>
                                </Flex>
                                <LoadImage style={{ width: 8, height: 15 }} defaultImg={require('../../../static/images/address/right.png')} />
                            </Flex>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    content: {
        backgroundColor: Macro.color_white,
        paddingLeft: 15,
        paddingRight: 20,
        height: ScreenUtil.contentHeight(),
        // height: ScreenUtil.contentHeightWithNoTabbar(),
    },

    name: {
        fontSize: 20,
        color: '#404145',

    },

    item: {
        fontSize: 16,
        color: '#404145'
    },
});
