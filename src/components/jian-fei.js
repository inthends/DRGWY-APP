import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native';
import BasePage from '../pages/base/base';
import { Flex, Button, WhiteSpace, TextareaItem } from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';
import MyPopover from '../components/my-popover';
import UDToast from '../utils/UDToast';
import api from '../utils/api';
import Macro from '../utils/macro';

export default class JianFei extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            money: '',
            memo: '',
            reductionType: ''
        };
    }

    componentDidMount() {
        api.getData('/api/MobileMethod/MGetDataItemTreeJson', { code: 'ReductionType' }).then(res => {
            if (res.length > 0) {
                this.setState({
                    types: [...res.map(item => item.title)],
                    reductionType: res[0].title
                }, () => {
                });
            }
        });
    }

    in = () => {
        const { money, memo, reductionType } = this.state;
        const { item } = this.props;
        if (!money) {
            UDToast.showError('请输入金额');
            return;
        }

        let p = {
            ReductionAmount: money,
            Memo: memo,
            Rebate: 10,
            ReductionType: reductionType
        }

        let params = {
            Data: JSON.stringify(p),
            keyvalue: item.id,
        };
        api.postData('/api/MobileMethod/ReductionBilling', params).then(res => {
            UDToast.showInfo('操作成功');
            this.props.onClose();
        });
    };

    render() {
        const { types } = this.state;
        return (
            <View style={{ flex: 1, width: '100%' }}>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }}>
                    <Flex direction={'column'}>
                        <Flex align={'center'} style={{ width: '100%' }} >
                            <Text style={styles.text}>减免类别</Text>
                            <MyPopover
                                style={styles.input}
                                onChange={value => this.setState({ reductionType: value })}
                                titles={types}
                                visible={true} />
                        </Flex>
                        <WhiteSpace size={'lg'} />
                        <Flex align={'center'} style={{ width: '100%' }}>
                            <Text style={styles.text}>减免金额</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType={'decimal-pad'}
                                value={this.state.money}
                                onChangeText={money => this.setState({ money })}
                                placeholder={'输入金额'} />
                        </Flex>

                        <WhiteSpace size={'lg'} />
                        {/* <Flex align={'center'} style={{ width: '100%' }}>
                            <Flex>
                                <Text style={styles.left}>说明</Text>
                            </Flex>
                        </Flex>
                        <WhiteSpace size={'lg'} /> */}
                        <TextareaItem
                            //style={styles.area}
                            placeholder={'请输入说明'}
                            style={{
                                width: ScreenUtil.deviceWidth() - 150
                            }}
                            rows={4}
                            onChange={memo => this.setState({ memo })}
                            value={this.state.memo}
                            maxLength={500}
                        />
                        <Button
                            style={{
                                width: 220,
                                marginTop: 10,
                                backgroundColor: Macro.work_blue
                            }}
                            type="primary"
                            onPress={this.in}>确定</Button>
                    </Flex>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    left: {
        fontSize: 16,
        width: '100%'
    },
    text: {
        fontSize: 16
    },
    input: {
        fontSize: 16,
        marginLeft: 10
    },
    state: {
        fontSize: 16,
        paddingLeft: 10
    },
    //area: {
    // borderWidth: 1,
    // borderColor: '#eeeeee',
    // borderRadius: 10
    //width: ScreenUtil.deviceWidth() - 150, 
    //},
    // area2: { 
    //     borderBottomColor: '#eee',
    //     borderBottomWidth: 2,
    //     borderStyle: 'solid', 
    // },
});

