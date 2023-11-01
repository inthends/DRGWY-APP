//选择带title带id
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import LoadImage from './load-image';
import UpImage from '../static/images/address/up.png';
import DownImage from '../static/images/address/down.png';
import { Flex } from '@ant-design/react-native';
import Popover from 'react-native-popover-view';

export default class MyPopoverNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            index: 0,
            data: this.props.data,
        };
    }

    //刷新data
    //componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    componentDidUpdate(prevProps) {
        if (this.props.data.length !== prevProps.data.length) {
            this.setState({
                data: this.props.data,
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

    select = (index, item) => { 
        //alert(item.id);
        //const { data } = this.state;
        this.setState({ index, isVisible: false });
        if (this.props.onChange) {
            this.props.onChange(item);
        }
    };

    render() {
        const { data, index } = this.state;
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableWithoutFeedback ref={ref => this.touchable = ref} onPress={() => this.showPopover()}>
                    <Flex style={{ height: 40 }}>
                        {!this.props.hiddenImage && (
                            <Flex>
                                <LoadImage style={{ width: 15, height: 8 }}
                                    defaultImg={this.state.isVisible ? UpImage : DownImage} />
                            </Flex>
                        )} 
                        <Text style={[{
                            paddingLeft: 10,
                            color: '#666',
                            fontSize: 16,
                        }, this.props.textStyle]}>{data[index].name}</Text>
                    </Flex>
                </TouchableWithoutFeedback>

                <Popover
                    onRequestClose={() => this.closePopover()}
                    fromView={this.touchable}
                    placement={'auto'}
                    isVisible={this.state.isVisible}>
                    <ScrollView style={{ maxHeight: 400 }}>
                        {data.map((item, index) => (
                            <TouchableWithoutFeedback key={item.id}
                                onPress={() => this.select(index, item)}>
                                <Text style={[{
                                    padding: 15,
                                    color: '#666',
                                    fontSize: 16,
                                }, this.props.textStyle]}>{item.name}</Text>
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
