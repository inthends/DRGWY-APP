import React, { Component} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Flex } from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';
import SelectImage from '../utils/select-image';
import LoadImage from './load-image';

const single_width = 60;

export default class UploadImageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [{ icon: '' }],
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
                                if (index === images.length - 1 && item.icon.length === 0) {
                                    this.selectImages();
                                }
                            }}>
                                <View style={{
                                    paddingLeft: 15,
                                    paddingRight: 5,
                                    paddingBottom: 10,
                                    paddingTop: 10,
                                }}>
                                    <LoadImage style={{width: width, height: height}}
                                               defaultImg={require('../static/images/add_pic.png')}
                                               img={item.icon}/>

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
