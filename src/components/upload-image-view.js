import React, { Component, Fragment } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Button, Flex, Icon, List, WhiteSpace, SegmentedControl } from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';
import SelectImage from '../utils/select-image';

const single_width = 60;

export default class UploadImageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [{ icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png' }],
        };
    }

    selectImages = () => {
        // SelectImage.select(this.state.id, this.props.uploadUrl || '/api/MobileMethod/MUploadRepairFile').then(res => { 
        SelectImage.select(this.props.linkId, this.props.uploadUrl || '/api/MobileMethod/MUploadRepairFile').then(res => {
            // console.log(1122, res);
            let images = [...this.state.images];
            images.splice(images.length - 1, 0, { 'icon': res });
            if (images.length > 4) {
                images = images.filter((item, index) => index !== images.length - 1);
            }
            // console.log(images);
            this.setState({ images });
        }).catch(error => {
        });
    };

    render() {
        const { images } = this.state;
        const width = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        const height = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        return (
            <Flex justify={'start'} align={'start'} style={[{ width: ScreenUtil.deviceWidth() }, this.props.style]}>
                <Flex wrap={'wrap'}>
                    {images.map((item, index) => {
                        return (
                            <TouchableWithoutFeedback key={index} onPress={() => {
                                if (index === images.length - 1 && item.icon.includes('os.alipayobjects.com')) {
                                    this.selectImages();
                                }
                            }}>
                                <View style={{
                                    paddingLeft: 15,
                                    paddingRight: 5,
                                    paddingBottom: 10,
                                    paddingTop: 10,
                                }}>
                                    <Image style={{ width: width, height: height }} source={{ uri: item.icon }} />
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    })}
                </Flex>
            </Flex>
        );
    }
}

const styles = StyleSheet.create({


});
