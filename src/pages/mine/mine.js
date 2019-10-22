import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import BasePage from '../base/base';
import {Flex} from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import MineService from './mine-service';
import CommonView from '../../components/CommonView';

export default class MinePage extends BasePage {
    // static navigationOptions = ({navigation}) => {
    //
    //     console.log(1, navigation);
    //     return {
    //         tabBarVisible: false,
    //         header: null,
    //     };
    // };

    constructor(props) {
        super(props);
        this.state = {
            user: {},
        };
    }

    componentDidMount(): void {
        MineService.getUserInfo().then(user => {
            this.setState({user})
        });
    }


    render() {
        const {user} = this.state;
        return (
            <View style={styles.all}>
                <CommonView>
                    <ScrollView>
                        <View style={styles.content}>
                            <TouchableWithoutFeedback /*onPress={() => this.props.navigation.push('Person')}*/>
                                <Flex justify='between' aligen='center' style={styles.header}>
                                    <Flex direction='column' align='start'>
                                        <Text style={styles.name}>{user.showName}</Text>
                                        <Text style={styles.desc}>{user.departmentName}-{user.postName}</Text>
                                    </Flex>
                                    <LoadImage style={{width: 40, height: 40}}
                                               img={user.headImg}/>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('ModifyPsd')}>
                                <Flex justify='between'
                                      style={[{paddingTop: 15, paddingBottom: 20}, ScreenUtil.borderBottom()]}>
                                    <Flex>
                                        <LoadImage style={{width: 16, height: 18}}
                                                   defaultImg={require('../../static/images/icon_mima.png')}/>
                                        <Text style={styles.item}>修改密码</Text>
                                    </Flex>
                                    <LoadImage style={{width: 6, height: 11}}
                                               defaultImg={require('../../static/images/address/right.png')}/>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Setting')}>
                                <Flex justify='between'
                                      style={[{paddingTop: 15, paddingBottom: 20}, ScreenUtil.borderBottom()]}>
                                    <Flex>
                                        <LoadImage style={{width: 18, height: 16.5}}
                                                   defaultImg={require('../../static/images/icon_mendian.png')}/>
                                        <Text style={styles.item}>设置</Text>
                                    </Flex>
                                    <LoadImage style={{width: 6, height: 11}}
                                               defaultImg={require('../../static/images/address/right.png')}/>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </View>
                    </ScrollView>
                </CommonView>
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
        fontSize: 16,
        color: '#999',
        paddingTop: 5,
    },
    item: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 20,
    },
});
