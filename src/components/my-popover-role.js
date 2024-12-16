import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import LoadImage from './load-image';
import UpImage from '../static/images/address/up.png';
import DownImage from '../static/images/address/down.png';
import { Flex } from '@ant-design/react-native';
import Popover from 'react-native-popover-view';

//下拉图标在右侧
export default class MyPopoverRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            index: 0,
            data: this.props.data
        };
    }

    componentDidUpdate(prevProps) {//Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (this.props.data.length !== prevProps.data.length) { 
            //设置默认值
            let roleId = this.props.roleId;
            let mydata = this.props.data;
            let roleIndex = mydata.findIndex(item => item.id == roleId); 
            this.setState({
                data: mydata,
                index: roleIndex//0
            });
        }
    }

    showPopover = () => {
        this.setState({
            isVisible: true
        });
    };

    closePopover = () => {
        this.setState({ isVisible: false });
    };

    select = (index, item) => {
        //带title带id
        //const { data } = this.state;
        this.setState({ index, isVisible: false });
        if (this.props.onChange) {
            //this.props.onChange(data[index], index);
            this.props.onChange(item);
        }
    };

    render() {
        const { data, index } = this.state;
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableWithoutFeedback ref={ref => this.touchable = ref} onPress={() => this.showPopover()}>
                    <Flex>
                        <Text style={[{
                            paddingLeft: 10,
                            paddingRight: 10,
                            color: '#666',
                            fontSize: 16
                        }, this.props.textStyle]}>
                            {data[index] && data[index].name}
                        </Text>
                        {!this.props.hiddenImage && (
                            <Flex>
                                <LoadImage style={{ width: 15, height: 8 }}
                                    defaultImg={this.state.isVisible ? UpImage : DownImage} />
                            </Flex>
                        )}
                    </Flex>
                </TouchableWithoutFeedback>
                <Popover
                    onRequestClose={() => this.closePopover()}
                    fromView={this.touchable}
                    placement={'auto'}
                    isVisible={this.state.isVisible}>
                    <ScrollView style={{ maxHeight: 500 }}>
                        {data.map((item, index) => (
                            <TouchableWithoutFeedback key={item + index} onPress={() => this.select(index, item)}>
                                <Text style={[{
                                    padding: 15,
                                    color: '#666',
                                    fontSize: 16
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
        justifyContent: 'center'
    }
});
