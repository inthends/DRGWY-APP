import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import LoadImage from './load-image';
import { Flex } from '@ant-design/react-native';
import Popover from 'react-native-popover-view';

export default class MyPopover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            index: 0,
            titles: this.props.titles,
        };
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (this.props.titles.length !== prevProps.titles.length) {
            this.setState({
                titles: this.props.titles,
                index: 0,
            });
        }
    }

    showPopover = () => {
        this.setState({
            isVisible: true,
        });
    };
    closePopover = () => {
        this.setState({ isVisible: false });
    };
    select = (index) => {
        const { titles } = this.state;
        this.setState({ index, isVisible: false });
        if (this.props.onChange) {
            this.props.onChange(titles[index], index);
        }
    };

    render() {
        const { titles, index } = this.state;
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableWithoutFeedback ref={ref => this.touchable = ref} onPress={() => this.showPopover()}>
                    <Flex style={{ height: 40 }}>
                        {!this.props.hiddenImage && (
                            <Flex>
                                <LoadImage style={{ width: 15, height: 15 }} />
                            </Flex>
                        )}

                        <Text style={[{
                            paddingLeft: 10,
                            color: '#666',
                            fontSize: 16,
                        }, this.props.textStyle]}>{titles[index]}</Text>
                    </Flex>
                </TouchableWithoutFeedback>

                <Popover
                    onRequestClose={() => this.closePopover()}
                    fromView={this.touchable}
                    placement={'auto'}
                    isVisible={this.state.isVisible}>
                    <ScrollView style={{ maxHeight: 400 }}>
                        {titles.map((item, index) => (
                            <TouchableWithoutFeedback key={item + index} onPress={() => this.select(index)}>
                                <Text style={[{
                                    padding: 15,
                                    color: '#666',
                                    fontSize: 16,
                                }, this.props.textStyle]}>{item}</Text>
                            </TouchableWithoutFeedback>
                        ))}
                    </ScrollView>
                </Popover>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 4,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#ccc',
        borderColor: '#333',
        borderWidth: 1,
    },
});
