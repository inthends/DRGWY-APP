import React, {Component, Fragment} from 'react';
import { Text,  StyleSheet, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import { Flex } from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';

const item_width = ScreenUtil.deviceWidth() / 5.0;
const single_width = 50;

export default class ScrollTitle extends Component {
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
            this.setState({index}, () => {
                const {titles} = this.state;
                if (this.props.onChange) {
                    this.props.onChange(titles[index]);
                }
            });
        }

    };

    render() {
        const {titles} = this.state;
        return (
            <Fragment>
                <Flex direction={'column'} align={'start'} style={this.props.style}>
                    <ScrollView directionalLockEnabled={true} showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}>
                        <Flex>
                            {titles.map((item, index) => {
                                return (
                                    <TouchableWithoutFeedback key={item} onPress={() => this.tap(index)}>

                                        <Text style={[index === this.state.index ? styles.title_select : styles.title]}>
                                            {item}
                                        </Text>

                                    </TouchableWithoutFeedback>

                                );
                            })}
                        </Flex>
                        <Animated.View style={[styles.line, {marginLeft: this.state.fadeAnim}]}/>
                    </ScrollView>
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
        paddingBottom: 10,
        textAlign: 'center',
    },
    title_select: {
        fontSize: 16,
        color: '#333',
        width: item_width,
        paddingTop: 15,
        paddingBottom: 10,
        textAlign: 'center',

    },
    line: {
        height: 2,
        backgroundColor: '#5f96eb',
        width: single_width,
    },
});
