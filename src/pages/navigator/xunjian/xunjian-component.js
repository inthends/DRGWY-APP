//巡检页面
import React, { Fragment } from 'react';
import BasePage from '../../base/base';
import { Flex } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import {
    ScrollView, StyleSheet, Text, Keyboard,
    TouchableWithoutFeedback, View, TextInput
} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';

export default class XunJianDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            KeyboardShown: false
        };
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
    }

    isNormal(itemData) {
        let newlist = this.state.list;
        newlist.filter((item) => {
            if (item.id === itemData.id) {
                return itemData;
            }
            else {
                return item;
            }
        });
        this.setState({ list: newlist });
        //如果是查看页面，则不更改数据
        if (this.props._inspecting)
            this.props._inspecting(newlist);
    }


    //add new
    componentWillMount() {
        //注册鼠标事件，用于文本框输入的时候往上移动 2024年5月23日
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            this.setState({
                KeyboardShown: true
            });
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({
                KeyboardShown: false
            });
        });
    }

    //add new
    componentWillUnmount() {
        //卸载键盘弹出事件监听
        if (this.keyboardDidShowListener != null) {
            this.keyboardDidShowListener.remove();
        }
        //卸载键盘隐藏事件监听
        if (this.keyboardDidHideListener != null) {
            this.keyboardDidHideListener.remove();
        }
    }

    render() { //:React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        const { data } = this.props;
        const { list } = this.state;
        const selectImg = require('../../../static/images/select.png');
        const noselectImg = require('../../../static/images/no-select.png');

        return (
            // <ScrollView>
            <ScrollView style={{ marginTop: this.state.KeyboardShown ? -200 : 0, height: '100%' }}>
                <Flex direction={'column'} align={'start'}>
                    <Flex style={{ width: ScreenUtil.deviceWidth() - 30 }} justify={'between'}>
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
                        let currentItem = { id: item.id, contentId: item.contentId, result: 1, msg: '' };
                        let isContains = false;
                        list.map((subItem) => {
                            if (subItem.id === item.id) {
                                currentItem = subItem;
                                isContains = true;
                            }
                        });
                        if (!isContains) {
                            list.push(currentItem);
                        }
                        return <Fragment key={item.id}>
                            <Flex direction={'column'}
                                align={'start'}
                                style={styles.contentRect}>
                                <Text style={styles.moreText}>{item.name}</Text>
                                <View style={{ flexDirection: 'row' , paddingTop: 5}}>
                                    <Text style={styles.blueText}>方法：</Text>
                                    <Text style={styles.moreText2}>{item.checkWay}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', paddingTop: 5}}>
                                    <Text style={styles.blueText}>标准：</Text>
                                    <Text style={styles.moreText2}>{item.criterion}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <Text style={styles.blueText}>结果：</Text>
                                    <View style={{ flexDirection: 'column', paddingTop: 5 }}> 
                                        {/* <TouchableWithoutFeedback
                                            onPress={() => {
                                                currentItem.result = 1;
                                                this.isNormal(currentItem);
                                            }}>
                                            <Flex>
                                                <LoadImage img={currentItem.result === 1 ? selectImg : noselectImg}
                                                    style={{ width: 15, height: 15 }} />
                                                <Text style={{ color: '#666', fontSize: 16, marginLeft: 15 }}>正常</Text>
                                            </Flex>
                                        </TouchableWithoutFeedback> */}

                                        <View flexDirection={'row'} marginTop={5} style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                            <TouchableWithoutFeedback
                                                onPress={() => {
                                                    Keyboard.dismiss();
                                                    currentItem.result = 1;
                                                    this.isNormal(currentItem);
                                                }}>
                                                <Flex>
                                                    <LoadImage img={currentItem.result === 1 ? selectImg : noselectImg}
                                                        style={{ width: 15, height: 15 }} />
                                                    <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15 }}>正常</Text>
                                                </Flex>
                                            </TouchableWithoutFeedback>

                                            {/* 正常也需要输入备注，客户要求 */}
                                            <TextInput
                                                maxLength={500}
                                                multiline={true}
                                                editable={true}
                                                keyboardType={'default'}
                                                style={styles.textInput}
                                                onChangeText={memo => {
                                                    currentItem.msg = memo;
                                                    this.isNormal(currentItem);
                                                }}
                                            ></TextInput>
                                        </View>


                                        <View flexDirection={'row'} marginTop={5} style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                            <TouchableWithoutFeedback
                                                onPress={() => {
                                                    Keyboard.dismiss();
                                                    currentItem.result = 0;
                                                    this.isNormal(currentItem);
                                                }}>
                                                <Flex>
                                                    <LoadImage img={currentItem.result === 0 ? selectImg : noselectImg}
                                                        style={{ width: 15, height: 15 }} />
                                                    <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15 }}>异常</Text>
                                                </Flex>
                                            </TouchableWithoutFeedback>

                                            <TextInput
                                                maxLength={500}
                                                multiline={true} 
                                                editable={true}
                                                keyboardType={'default'}
                                                // style={currentItem.result === 0 ? styles.textInput : { height: 1 }}
                                                style={styles.textInput}
                                                onChangeText={memo => {
                                                    currentItem.msg = memo;
                                                    this.isNormal(currentItem);
                                                }}
                                            ></TextInput>
                                        </View>
                                    </View>
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
    moreText: {
        lineHeight: 20,
        fontSize: 14
    },

    moreText2: {
        lineHeight: 20,
        fontSize: 14,
        width: ScreenUtil.deviceWidth() - 85
    },
    work: {
        color: Macro.work_blue,
        fontSize: 16
    },
    title: {
        color: '#404145',
        fontSize: 16,
        paddingTop: 15
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
        color: Macro.work_blue,
        fontSize: 14,
        marginVertical: 2
    },
    normalText: {
        color: '#999999',
        fontSize: 14,
        marginVertical: 2
    },
    textInput: {
        width: ScreenUtil.deviceWidth() - 150,
        borderBottomColor: '#333333',
        paddingBottom: 5,
        paddingVertical: 0,
        borderBottomWidth: 1
    }
});
