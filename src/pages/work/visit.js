//访客登记
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import BasePage from '../base/base';
import { Flex, Button, Icon } from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import CommonView from '../../components/CommonView';
import WorkService from './work-service';
import Macro from '../../utils/macro';
import UDToast from '../../utils/UDToast';

export default class VisitPage extends BasePage {

    //class VisitPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '访客登记',
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
        // let id = common.getValueFromProps(this.props); 
        this.state = {
            //id,
            data: {}
        };
    }

    // componentDidMount() {
    //     //详情
    //     WorkService.getVisitEntity(this.state.id).then(res => {
    //         this.setState({
    //             data: res
    //         });
    //     });
    // }

    start = () => {
        this.props.navigation.push('scanonly', {
            data: {
                callBack: this.callBack,
                needBack: true
            }
        });
    };

    callBack = (id) => {
        //详情
        WorkService.getVisitEntity(id).then(res => {
            this.setState({
                data: res
            });
        });
    };

    //放行
    ok = () => {
        const { data } = this.state;
        if (!data.name) {
            UDToast.showError('请扫码');
            return;
        }
        WorkService.updateVisitEntity(data.id).then(res => {
            this.props.navigation.goBack();
        });
    }

    render() {
        const { data } = this.state;
        return (

            <CommonView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Flex direction='column' align='start'
                        style={{ marginBottom: 20, backgroundColor: 'white', borderRadius: 4 }}>
                        <Flex justify='start' style={styles.single}>
                            <Text style={styles.left}>访客称呼：</Text>
                            <Text style={styles.right}>{data.name || ''}</Text>
                        </Flex>

                        <Flex justify='start' style={styles.single}>
                            <Text style={styles.left}>手机号码：</Text>
                            <Text style={styles.right}>{data.mobile || ''}</Text>
                        </Flex>

                        <Flex justify='start' style={styles.single}>
                            <Text style={styles.left}>来访事由：</Text>
                            <Text style={styles.right}>{data.billType || ''}</Text>
                        </Flex>

                        <Flex justify='start' style={styles.single}>
                            <Text style={styles.left}>到访地址：</Text>
                            <Text style={styles.right}>{data.allName || ''}</Text>
                        </Flex>

                        <Flex justify='start' style={styles.single}>
                            <Text style={styles.left}>有效期至：</Text>
                            <Text style={styles.right}>{data.endTime || ''}</Text>
                        </Flex>

                        <Flex justify='start' style={styles.single}>
                            <Text style={styles.left}>车牌号码：</Text>
                            <Text style={styles.right}>{data.cardNo || ''}</Text>
                        </Flex>

                        <Flex justify='start' style={styles.single}>
                            <Text style={styles.left}>状态：</Text>
                            <Text style={styles.right}>{data.statusName}</Text>
                        </Flex>

                        <Text style={[styles.desc]}>{data.remark || ''}</Text>

                    </Flex>
                </View>

                <Flex justify={'center'}>
                    <Button
                        onPress={this.start}
                        type={'primary'}
                        activeStyle={{ backgroundColor: Macro.work_blue }}
                        style={{
                            width: 110,
                            marginBottom: 10,
                            marginRight: 20,
                            backgroundColor: Macro.work_blue,
                            height: 40
                        }}>扫一扫</Button>

                    <Button
                        onPress={this.ok}
                        disabled={data ? false : true}
                        type={'primary'}
                        activeStyle={{ backgroundColor: Macro.work_blue }}
                        style={{
                            width: 110,
                            marginBottom: 10,
                            backgroundColor: Macro.work_blue,
                            height: 40
                        }}>确定</Button>
                </Flex>

            </CommonView>
        );
    }
}

const styles = StyleSheet.create({

    right: {
        fontSize: 16,
        color: '#38393d'
    },
    left: {
        fontSize: 16,
        color: '#848388'
    },
    single: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderStyle: 'solid',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 13,
        paddingBottom: 13,
        width: ScreenUtil.deviceWidth() - 20
    },
    desc: {
        lineHeight: 20,
        fontSize: 15,
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15
    }
}); 
