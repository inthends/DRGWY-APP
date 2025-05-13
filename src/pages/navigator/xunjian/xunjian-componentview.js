//巡检查看页面
import React, { Fragment } from 'react';
import BasePage from '../../base/base';
import { Flex } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import {
    ScrollView, StyleSheet, Text, View,
    //TouchableWithoutFeedback, View, TextInput
} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
// import LoadImage from '../../../components/load-image';

export default class XunJianDetailViewPage extends BasePage {
    constructor(props) {
        super(props);
    }

    render(){//: React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        const { data } = this.props;
        // const selectImg = require('../../../static/images/select.png');
        // const noselectImg = require('../../../static/images/no-select.png');

        return (
            <ScrollView>
                <Flex direction={'column'} align={'start'}>
                    <Flex //style={{ width: ScreenUtil.deviceWidth() - 30 }} 
                        justify={'between'}>
                        <Text style={styles.work}>{data.taskTime} {data.projectName}</Text>
                    </Flex>
                    <Text style={styles.title}>计划</Text>
                    <Flex style={{ width: ScreenUtil.deviceWidth() - 30 }} justify={'between'}>
                        <Text style={styles.desc}>{data.planTime}</Text>
                        <Text style={styles.desc}>{data.roleName}</Text>
                    </Flex>
                    <Text style={styles.title}>执行</Text>
                    <Flex style={{ width: ScreenUtil.deviceWidth() - 30 }} justify={'between'}>
                        <Text style={styles.desc}>{data.exctuteTime}</Text>
                        <Text style={styles.desc}>{data.excuteUserName}</Text>
                    </Flex>
                    <Text style={styles.title}>内容</Text>
                    {!!data.contents && data.contents.map((item, index) => {
                        return <Fragment key={item.id}>
                            <Flex direction={'column'}
                                align={'start'}
                                style={styles.contentRect}> 
                                <Text style={styles.moreText}>{item.name}</Text> 
                                <View style={{ flexDirection: 'row', paddingTop: 5 }} >
                                    <Text style={styles.blueText}>方法：</Text>
                                    <Text style={styles.moreText2}>{item.checkWay}</Text>
                                </View> 
                                <View style={{ flexDirection: 'row', paddingTop: 5 }} >
                                    <Text style={styles.blueText}>标准：</Text>
                                    <Text style={styles.moreText2}>{item.criterion}</Text>
                                </View> 
                                <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                    <Text style={styles.blueText}>结果：</Text>
                                    <Text style={styles.moreText2}>{item.result ? (item.result === 1 ? '正常' : '异常') : ''} {item.memo}</Text>
                                    {/* <View style={{ flexDirection: 'column', paddingTop: 5 }}> 
                                        <View flexDirection={'row'} marginTop={5} style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                            <TouchableWithoutFeedback >
                                                <Flex>
                                                    <LoadImage img={item.result === 1 ? selectImg : noselectImg}
                                                        style={{ width: 15, height: 15 }} />
                                                    <Text style={{ color: '#333333', fontSize: 14, paddingLeft: 15 }}>正常</Text>
                                                </Flex>
                                            </TouchableWithoutFeedback>
                                            <TextInput
                                                multiline={true}
                                                editable={false}
                                                value={item.memo}
                                            ></TextInput>
                                        </View> 
                                        <View flexDirection={'row'} marginTop={5} style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                            <TouchableWithoutFeedback >
                                                <Flex>
                                                    <LoadImage img={item.result === 0 ? selectImg : noselectImg}
                                                        style={{ width: 15, height: 15 }} />
                                                    <Text style={{ color: '#333333', fontSize: 14, paddingLeft: 15 }}>异常</Text>
                                                </Flex>
                                            </TouchableWithoutFeedback>
                                            <TextInput
                                                multiline={true}
                                                editable={false}
                                                value={item.memo}
                                            ></TextInput>
                                        </View>
                                    </View> */}
                                </View> 
                            </Flex>
                        </Fragment>
                    })}
                </Flex>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    work: {
        color: Macro.work_blue,
        fontSize: 16
    },
    title: {
        color: '#404145',
        fontSize: 16,
        paddingTop: 5
    },

    moreText: {
        lineHeight: 20,
        fontSize: 14
    },

    moreText2: {
        lineHeight: 20,
        fontSize: 14,
        width: ScreenUtil.deviceWidth() - 85
    },

    desc: {
        color: '#404145',
        fontSize: 16,
        paddingTop: 10
    },
    contentRect: {
        width: '100%',
        marginTop: 5,
        borderColor: '#eeeeee',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5
    },

    blueText: {
        color: Macro.work_blue,//'#5f96eb',
        fontSize: 14,
        marginVertical: 2
    },

    // textInput: {
    //     width: ScreenUtil.deviceWidth() - 150,
    //     borderBottomColor: '#333333',
    //     paddingBottom: 5,
    //     paddingVertical: 0,
    //     borderBottomWidth: 1
    // }
});
