
import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Alert } from 'react-native';
import { Flex } from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';
import SelectImage from '../utils/select-image';
// import LoadImage from './load-image';
import LoadImageDelete from './load-image-del';
import WorkService from '../pages/work/work-service';
//const single_width = 60;

export default class UploadImageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // images: [{ icon: '' }],
            images: ['']
        };
    }

    selectImages = () => {
        // SelectImage.select(this.state.id, this.props.uploadUrl || '/api/MobileMethod/MUploadRepairFile').then(res => { 
        SelectImage.select(
            this.props.linkId,
            this.props.type,
            this.props.uploadUrl || '/api/MobileMethod/MUploadRepairFile').then(url => {
                let images = [...this.state.images];
                images.splice(images.length - 1, 0, url);
                if (images.length > 10 ) {
                    images = images.filter((item, index) => index !== images.length - 1);
                }
                this.setState({ images });
                this.props.reload();//设置上传标识
            }).catch(error => { });
    };

    //删除附件
    delete = (url) => {
        Alert.alert(
            '请确认',
            '是否删除？', 
            [
                {
                    text: '取消',
                    style: 'cancel'
                },
                {
                    text: '确定',
                    onPress: () => {
                        WorkService.deleteWorkFile(url).then(res => {
                            let index = this.state.images.indexOf(url);
                            let myimages = [...this.state.images];
                            myimages.splice(index, 1);
                            this.setState({ images: myimages });
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    }

    render() {
        const { images } = this.state;
        const width = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        const height = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        return (
            <Flex justify={'start'} align={'start'} style={[{ width: ScreenUtil.deviceWidth() }, this.props.style]}>
                <Flex wrap={'wrap'}>
                    {images.map((url, index) => {
                        return (
                            <TouchableWithoutFeedback key={index} onPress={() => {
                                if (index === images.length - 1 && url.length === 0) {
                                    this.selectImages();
                                }
                            }}>
                                <View style={{
                                    paddingLeft: 15,
                                    paddingRight: 5,
                                    paddingBottom: 10,
                                    paddingTop: 10
                                }}>
                                    <LoadImageDelete style={{ width: width, height: height }}
                                        defaultImg={require('../static/images/add_pic.png')}
                                        img={url}
                                        delete={() => this.delete(url)} />

                                </View>
                            </TouchableWithoutFeedback>
                        );
                    })}
                </Flex>
            </Flex>
        );
    }
}

// const styles = StyleSheet.create({

// });
