import React from 'react';
import {
    Text,
    StyleSheet
} from 'react-native';

import BasePage from '../../base/base';
import { Flex, WhiteSpace, WingBlank } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';


class ChaoBiaoCell extends BasePage {


    constructor(props) {
        super(props);
    }


    render() {
        const { modal, item } = this.props;  
        return ( 
            <WingBlank size={'lg'}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, modal ? {} : styles.blue]}>
                    <Flex justify='between'>
                        <Text style={styles.title}>{item.meterName}</Text>
                    </Flex>
                    <Flex style={styles.line} />
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                            style={{ width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>编号：{item.meterCode}</Text>
                            <Text>倍率：{item.meterZoom}</Text>

                        </Flex>
                        <WingBlank size={'lg'}>
                            <WingBlank size={'lg'}>
                                <Text style={{ color: '#666' }}>
                                    上次度数：{item.lastReading}
                                </Text>
                            </WingBlank>
                        </WingBlank>
                        <WhiteSpace />
                        <WingBlank size={'lg'}>
                            <WingBlank size={'lg'}>
                                <Text style={{ color: '#666' }}>
                                    本次抄数：{item.nowReading}
                                </Text>
                            </WingBlank>
                        </WingBlank>
                        <WhiteSpace />
                        <WingBlank size={'lg'}>
                            <WingBlank size={'lg'}>
                                <Text style={{ color: '#666' }}>
                                    本次用量：{item.realUsage}
                                </Text>
                            </WingBlank>
                        </WingBlank>
                        <WhiteSpace />
                    </Flex>
                    <WhiteSpace />
                </Flex>

            </WingBlank>

        );
    }
}

const styles = StyleSheet.create({

    title: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10, 
        marginLeft: 20,
        marginRight: 20
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30 - 15 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1
    }, 
    card: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#c8c8c8',
        borderBottomColor: '#c8c8c8',
        borderRightColor: '#c8c8c8',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: { h: 10, w: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.8
    },
    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5
    }
});


export default ChaoBiaoCell;

