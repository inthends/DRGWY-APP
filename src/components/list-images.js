import React, { Component } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Flex } from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';
import LoadImage from './load-image';

export default class ListImages extends Component { 
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Flex justify={'start'} align={'start'}
                style={{ width: ScreenUtil.deviceWidth() - 15, marginTop: 10 }}>
                <Flex wrap={'wrap'}>
                    {this.props.images && this.props.images.map((item, index) => {
                        return (
                            <TouchableWithoutFeedback key={item.id} 
                            onPress={() => this.props.lookImage && this.props.lookImage(index, item.uid)}>
                                <View style={{
                                    paddingLeft: 10,
                                    //paddingRight: 5,
                                    paddingBottom: 10,
                                    paddingTop: 10,
                                }}>
                                    <LoadImage style={{
                                        width: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                        height: (ScreenUtil.deviceHeight() - 15) / 4.0 - 20,
                                        borderRadius: 5,
                                    }} img={item.thumbUrl} />

                                </View>
                            </TouchableWithoutFeedback>
                        );
                    })}
                </Flex>
            </Flex>
        );
    }
}