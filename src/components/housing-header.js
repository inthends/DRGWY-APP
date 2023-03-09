import React, {Component, Fragment} from 'react';
import {View, Text,  StyleSheet, Animated,TouchableWithoutFeedback} from 'react-native';
import {Flex} from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';

const single_width = 60;

export default class HousingHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value((ScreenUtil.deviceWidth()-(28*2+single_width*3))/2.0),
            index: 0,
        };
    }

    tap = (index) => {
        let value = (28+single_width) * index + (ScreenUtil.deviceWidth()-(28*2+single_width*3))/2.0;

        Animated.timing(                  // 随时间变化而执行动画
            this.state.fadeAnim,            // 动画中的变量值
            {
                toValue: value,                   // 透明度最终变为1，即完全不透明
                duration: 200,              // 让动画持续一段时间
            },
        ).start();
        this.setState({index: index});
    };

    render() {
        const datas = [{'title': '收缴率', select: true}, {'title': '欠费账龄'}, {'title': '日收款'}];
        return (
            <Fragment>
                <Flex direction={'column'} align={'start'}>
                    <Flex justify={'center'} style={[styles.content, this.props.style]}>
                        {datas.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={item.title} onPress={()=>this.tap(index)}>
                                    <View>
                                        <Text style={[index === this.state.index ? styles.title_select : styles.title]}>
                                            {item.title}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>

                            );
                        })}
                    </Flex>
                    <Animated.View style={[styles.line,{marginLeft:this.state.fadeAnim}]}/>
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
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
    },
    title_select: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,

    },
    line: {
        height: 2,
        backgroundColor: '#5f96eb',
        width: single_width,
        marginTop:10
    },
});
