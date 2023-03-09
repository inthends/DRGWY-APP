import React from 'react';
import {StyleSheet, Text, TouchableOpacity, TextInput} from 'react-native';
import BasePage from '../../base/base';
// import Macro from '../../../utils/macro';
// import {connect} from 'react-redux';
import CommonView from '../../../components/CommonView';
import {Flex, Button, WhiteSpace, WingBlank,   Icon, TextareaItem} from '@ant-design/react-native';
import LoadImage from '../../../components/load-image';
import ScreenUtil from '../../../utils/screen-util';
import YiQingService from './yiqing-service';
import common from '../../../utils/common';
import UDToast from '../../../utils/UDToast';

import selectImage from '../../../static/images/select.png';
import unselectImage from '../../../static/images/no-select.png';


class YiQingInfoPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '健康状况',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);

        const {keyvalue} = common.getValueFromProps(this.props);
        this.state = {
            keyvalue,
            status: '',
            numbers: '',
            memo: '',
        };
    }


    in = () => {
        const {keyvalue, status, numbers, memo} = this.state;
        if (numbers.length === 0) {
            UDToast.showError('请输入人数');
            return;
        }
        if (status.length === 0) {
            UDToast.showError('请选择是否正常');
            return;
        }
        YiQingService.record(keyvalue, '1', numbers, status, memo).then(res => {
            this.props.navigation.popToTop();
        });
    };


    render() {
        const {status} = this.state;
        return (

            <CommonView style={{flex: 1}}>

                <WhiteSpace size={'xl'}/>
                <WingBlank>
                    <Flex>
                        <Text style={styles.left}>人数</Text>
                        <TextInput value={this.state.numbers}
                                   onChangeText={numbers => this.setState({numbers})} style={styles.input}
                                   placeholder={'请输入人数'}/>
                    </Flex>
                </WingBlank>
                <WhiteSpace size={'xl'}/>
                <WingBlank>
                    <Flex>
                        <Text style={styles.left}>是否正常</Text>
                        <Flex style={{paddingLeft: 30}} onPress={() => this.setState({status: '1'})}>
                            <LoadImage style={{width: 25, height: 25}}
                                       defaultImg={status === '1' ? selectImage : unselectImage}/>
                            <Text style={styles.state}>正常</Text>
                        </Flex>
                        <Flex style={{paddingLeft: 30}} onPress={() => this.setState({status: '0'})}>
                            <LoadImage style={{width: 25, height: 25}}
                                       defaultImg={status === '0' ? selectImage : unselectImage}/>
                            <Text style={styles.state}>不正常</Text>
                        </Flex>
                    </Flex>
                    <WhiteSpace size={'xl'}/>
                    <Flex direction={'column'} align={'start'}>
                        <Flex>
                            <Text style={styles.left}>说明</Text>
                        </Flex>
                        <WhiteSpace size={'xl'}/>

                        <TextareaItem
                            style={styles.area}
                            placeholder={'请输入说明'}
                            rows={5}
                            onChange={memo => this.setState({memo})}
                            value={this.state.memo}

                        />

                    </Flex>
                </WingBlank>
                <Button style={{width: '90%', marginLeft: '5%', marginTop: 60}} type="primary"
                        onPress={this.in}>确定</Button>


            </CommonView>

        );
    }
}

const styles = StyleSheet.create({
    left: {
        fontSize: 17,
    },
    input: {
        fontSize: 17,
        marginLeft: 68,
    },
    state: {
        fontSize: 17,
        paddingLeft: 10,
    },
    area: {

        borderWidth: 1,
        borderColor: '#eeeeee',
        width: ScreenUtil.deviceWidth() - 30,

        borderRadius: 10,

    },
});


export default YiQingInfoPage;
