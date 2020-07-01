import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { Checkbox, Flex } from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';
const single_width = 60;

export default class TwoChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: true,//是否按户显示
            fadeAnim: new Animated.Value(20),
            index: 0,
            datas: [{ 'title': '未收', select: true }, { 'title': '已收' }],
        };
    }

    tap = (index) => {
        let value = (single_width + 15) * index + 20;
        Animated.timing(                  // 随时间变化而执行动画
            this.state.fadeAnim,            // 动画中的变量值
            {
                toValue: value,                   // 透明度最终变为1，即完全不透明
                duration: 200,              // 让动画持续一段时间
            },
        ).start();
        this.setState({ index: index, isShow: this.state.isShow });
        if (this.props.onChange) {
            this.props.onChange(this.state.datas[index].title, this.state.isShow);
        }
    };

    //按户显示费用
    showAllFee = (e) => {
        this.setState({ index: this.state.index, isShow: e.target.checked });
        if (this.props.onChange) {
            this.props.onChange(this.state.datas[this.state.index].title, e.target.checked);
        }
    };

    render() {
        const datas = this.state.datas;
        return (
            <Fragment>
                <Flex direction={'column'} align={'start'}>
                    <Flex justify='center' style={[styles.content, this.props.style]}>
                        {datas.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={item.title}
                                    onPress={() => this.tap(index)}>
                                    <View>
                                        <Text
                                            style={[index === this.state.index ? styles.title_select : styles.title, { marginLeft: 15 }]}>
                                            {item.title}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}

                        <Flex style={{ paddingTop: 11, paddingRight: 15, marginLeft: 'auto' }}>
                            <Checkbox
                                defaultChecked={true}
                                onChange={(e) => this.showAllFee(e)}>
                                <Text style={{ paddingTop: 3, paddingLeft: 3 }}>按户显示</Text>
                            </Checkbox>
                        </Flex>
                    </Flex>
                    <Animated.View style={[styles.line, { marginLeft: this.state.fadeAnim }]} />
                </Flex>
            </Fragment >
        );
    }
}

const styles = StyleSheet.create({
    content: {
        width: ScreenUtil.deviceWidth(),
    },
    title: {
        fontSize: 16,
        color: '#999',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        textAlign: 'center',
    },
    title_select: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        textAlign: 'center',
    },
    line: {
        height: 2,
        backgroundColor: '#5f96eb',
        width: single_width,
        marginTop: 10,
    },
});
