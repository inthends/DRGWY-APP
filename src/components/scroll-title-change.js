import React, {Component, Fragment} from 'react';
import { 
    Text, 
    StyleSheet,
    Animated, 
    ScrollView,
    UIManager,
    findNodeHandle,
} from 'react-native';
import { Flex } from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';

const item_width = ScreenUtil.deviceWidth() / 5.0;
const single_width = 50;

export default class ScrollTitleChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(6.5),
            index: 0,
            titles: this.props.titles || [],
        };
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {

        if (nextProps.index === 0) {
            Animated.timing(                  // 随时间变化而执行动画
                this.state.fadeAnim,            // 动画中的变量值
                {
                    toValue: 6.5,                   // 透明度最终变为1，即完全不透明
                    duration: 200,              // 让动画持续一段时间
                },
            ).start();
            this.setState({
                titles: nextProps.titles || [],
                index: 0,
            });
        } else {
            this.setState({
                titles: nextProps.titles || [],
            });
        }
    }


    render() {
        const {titles} = this.state;
        return (
            <Fragment>
                <Flex direction={'column'} align={'start'} style={this.props.style}>
                    <ScrollView ref={ref => this.scroll = ref} directionalLockEnabled={true}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}>
                        <Flex>
                            {titles.map((item, index) => {
                                return (
                                    <Text key={item + index} onPress={() => {
                                        const a = item + index;
                                        const handle = findNodeHandle(this.refs[a]);
                                        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                                            Animated.timing(                  // 随时间变化而执行动画
                                                this.state.fadeAnim,            // 动画中的变量值
                                                {
                                                    toValue: x + (width - single_width + 10) / 2.0,                   // 透明度最终变为1，即完全不透明
                                                    duration: 200,              // 让动画持续一段时间
                                                },
                                            ).start();
                                            this.setState({index: index}, () => {
                                                if (this.props.onChange) {
                                                    this.props.onChange(index);
                                                }
                                            });
                                        });
                                    }} ref={item + index}
                                          style={[index === this.state.index ? styles.title_select : styles.title]}>
                                        {item}
                                    </Text>


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
        paddingLeft: 15,
        paddingRight: 5,
        paddingTop: 15,
        paddingBottom: 10,
        textAlign: 'center',
    },
    title_select: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 15,
        paddingRight: 5,
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
