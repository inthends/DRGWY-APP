import React, { Component, Fragment } from 'react';
import { Text, StyleSheet, Animated, TouchableWithoutFeedback, View } from 'react-native';
import { Flex } from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';
const item_width = ScreenUtil.deviceWidth() / 4.0;
const single_width = 50;

export default class TopTitle extends Component {
    constructor(props) {
        super(props);
        let index = this.props.index || 0;
        this.state = {
            fadeAnim: new Animated.Value((item_width - single_width) / 2.0 + item_width * index),
            index,
            titles: this.props.titles || [],
        };
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        this.setState({
            titles: nextProps.titles || [],
        });
    }

    tap = (index) => {
        let value = (item_width - single_width) / 2.0 + item_width * index;

        Animated.timing(                  // 随时间变化而执行动画
            this.state.fadeAnim,            // 动画中的变量值
            {
                toValue: value,                   // 透明度最终变为1，即完全不透明
                duration: 200,              // 让动画持续一段时间
            },
        ).start();
        if (this.state.index !== index) {
            this.setState({ index }, () => {
                // const { titles } = this.state;
                if (this.props.onChange) {
                    this.props.onChange(index);
                }
            });
        }

    };

    render() {
        const { titles } = this.state;
        return (
            <Fragment>
                <Flex style={{ ...this.props.style, ...styles.content }}>
                    {titles.map((item, index) => {
                        let bgcolor = index === this.state.index ? '#ffffff' : '#e6e6e6'
                        return (
                            <TouchableWithoutFeedback key={item} onPress={() => this.tap(index)}>

                                <View
                                    backgroundColor={bgcolor}
                                    marginTop={10}
                                    marginBottom={10}
                                    marginLeft={5}
                                    marginRight={5}
                                    borderRadius={5}
                                    height={30}
                                    alignItem={'center'}
                                    borderColor={'#e6e6e6'}
                                    borderWidth={1}
                                    width={item_width - 13}
                                >
                                    <Text style={{ ...[index === this.state.index ? styles.title_select : styles.title], textAlign: 'center', lineHeight: 26, height: 26 }}>
                                        {item}
                                    </Text>
                                </View>

                            </TouchableWithoutFeedback>

                        );
                    })}
                </Flex>
            </Fragment>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        width: ScreenUtil.deviceWidth(),
        paddingLeft: 10,
        paddingRight: 10
    },
    title: {
        fontSize: 16,
        color: '#999',
        // width: item_width,
        textAlign: 'center'
    },
    title_select: {
        fontSize: 16,
        color: '#404145',
        // width: item_width,
        textAlign: 'center'
    }
});
