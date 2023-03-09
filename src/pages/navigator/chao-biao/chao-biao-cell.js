import React, {Fragment} from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    SectionList,
    TouchableWithoutFeedback,
    ImageBackground,
    Animated,
    FlatList,
    Image, TouchableOpacity,
    TextInput, Modal,
} from 'react-native';

import BasePage from '../../base/base';
import BuildingHeader from '../../../components/building/building-header';
import BuildingCell from '../../../components/building/build-cell';
import {Button, Flex, Icon, List, WhiteSpace, SegmentedControl, WingBlank} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import forge from 'node-forge';
import LoadImage from '../../../components/load-image';
import {connect} from 'react-redux';

import CommonView from '../../../components/CommonView';
import common from '../../../utils/common';
import ScreenUtil from '../../../utils/screen-util';
import NoDataView from '../../../components/no-data-view';
import ChaoBiaoService from './chao-biao-service';
import ImageViewer from 'react-native-image-zoom-viewer';


class ChaoBiaoCell extends BasePage {


    constructor(props) {
        super(props);
    }


    render() {
        const {modal,item} = this.props;


        return (

            <WingBlank size={'lg'}>
                <Flex direction='column' align={'start'}
                      style={[styles.card, modal ? {} : styles.blue]}>
                    <Flex justify='between'>
                        <Text style={styles.title}>{item.meterName}</Text>
                    </Flex>
                    <Flex style={styles.line}/>
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                              style={{width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20}}>
                            <Text>编号：{item.meterCode}</Text>
                            <Text>倍率：{item.meterZoom}</Text>

                        </Flex>
                        <WingBlank size={'lg'}>
                            <WingBlank size={'lg'}>
                                <Text style={{color: '#666'}}>
                                    上次度数：{item.lastReading}
                                </Text>
                            </WingBlank>
                        </WingBlank>
                        <WhiteSpace/>
                        <WingBlank size={'lg'}>
                            <WingBlank size={'lg'}>
                                <Text style={{color: '#666'}}>
                                    本次抄数：{item.nowReading}
                                </Text>
                            </WingBlank>
                        </WingBlank>
                        <WhiteSpace/>
                        <WingBlank size={'lg'}>
                            <WingBlank size={'lg'}>
                                <Text style={{color: '#666'}}>
                                    本次用量：{item.realUsage}
                                </Text>
                            </WingBlank>
                        </WingBlank>
                        <WhiteSpace/>
                    </Flex>
                    <WhiteSpace/>
                </Flex>

            </WingBlank>

        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_sky,
        flex: 1,
    },
    content: {
        backgroundColor: Macro.color_white,
        flex: 1,


    },
    list: {
        backgroundColor: Macro.color_white,
        margin: 15,
    },
    title: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#333',
        fontSize: 16,
        paddingBottom: 10,
        //
        marginLeft: 20,
        marginRight: 20,

        // width: ,
    },
    title2: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#333',
        fontSize: 16,
        paddingBottom: 10,
        //

        marginRight: 20,

        // width: ,
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30 - 15 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1,
    },
    top: {
        paddingTop: 20,
        color: '#000',
        fontSize: 18,
        paddingBottom: 15,
    },
    bottom: {
        color: '#868688',
        fontSize: 18,
        paddingBottom: 20,
    },
    button: {
        color: '#868688',
        fontSize: 16,
        paddingTop: 10,
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
        shadowOffset: {h: 10, w: 10},
        shadowRadius: 5,
        shadowOpacity: 0.8,
    },
    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5,
    },
    orange: {
        borderLeftColor: '#F7A51E',
        borderLeftWidth: 5,
    },
    aaa: {
        paddingRight: 20,
    },
    ii: {
        paddingTop: 12,
        paddingBottom: 12,
        marginLeft: 30,
        marginRight: 30,
        width: (ScreenUtil.deviceWidth() - 120) / 2.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginTop: 30,
    },
    word: {
        color: 'white',
        fontSize: 16,
    },
});


export default ChaoBiaoCell;

