import React, {Component, Fragment} from 'react';
import {View, Text, StyleSheet, Animated, TouchableWithoutFeedback} from 'react-native';
import {Flex} from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';


const item_width = ScreenUtil.deviceWidth() / 3.0;
const single_width = 50;

export default class ListJianYanHeader extends Component {
    constructor(props) {
        super(props);
        let index = 0;
        if (this.props.overdue) {
            index = parseInt(this.props.overdue) + 1;
        }

        let value = (item_width) * index + (item_width - single_width) / 2.0;
        this.state = {
            fadeAnim: new Animated.Value(value),
            index: index,
        };
    }

    tap = (index) => {
        let value = (item_width) * index + (item_width - single_width) / 2.0;

        Animated.timing(                  // 随时间变化而执行动画
            this.state.fadeAnim,            // 动画中的变量值
            {
                toValue: value,                   // 透明度最终变为1，即完全不透明
                duration: 200,              // 让动画持续一段时间
            },
        ).start();
        const datas = [{'title': '全部', value: null}, {'title': '回访', value: 5}, {'title': '检验', value: 6}];
        this.setState({index: index}, () => {
            if (this.props.onChange) {
                this.props.onChange(datas[index].value);
            }
        });
    };

    render() {
        const datas = [{'title': '全部', select: true}, {'title': '回访'}, {'title': '检验'}];
        return (
            <Fragment>
                <Flex direction={'column'} align={'start'}>
                    <Flex justify={'center'} style={[styles.content, this.props.style]}>
                        {datas.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={item.title} onPress={() => this.tap(index)}>
                                    <View>
                                        <Text style={[index === this.state.index ? styles.title_select : styles.title]}>
                                            {item.title}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>

                            );
                        })}
                    </Flex>
                    <Animated.View style={[styles.line, {marginLeft: this.state.fadeAnim}]}/>
                </Flex>
            </Fragment>
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
        width: item_width,
        paddingTop: 15,
        textAlign: 'center',
    },
    title_select: {
        fontSize: 16,
        color: '#333',
        width: item_width,
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
