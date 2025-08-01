import React from 'react';
import BasePage from '../../base/base';
//import CommonView from '../../../components/CommonView';
import { Flex, Icon } from '@ant-design/react-native';
import { Modal, StyleSheet, Text, Platform, TouchableOpacity, CameraRoll,ScrollView } from 'react-native';
//import Macro from '../../../utils/macro';
//import ScreenUtil from '../../../utils/screen-util';
//import LoadImage from '../../../components/load-image'; 
//import ScrollTitle from '../../../components/scroll-title';
import XunJianComponent from './xunjian-component';
import ListImages from '../../../components/list-images';
import common from '../../../utils/common';
import XunJianService from './xunjian-service';
import ImageViewer from 'react-native-image-zoom-viewer';
import RNFetchBlob from 'rn-fetch-blob'; 

export default class XunJianPointDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '巡检点详情',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);
        let lineId = common.getValueFromProps(this.props).lineId;
        let pointId = common.getValueFromProps(this.props).pointId;
        this.state = {
            lineId,
            pointId,
            items: [],
            visible: false,
            images: []
        };
    }

    componentDidMount() {
        const { lineId, pointId } = this.state;
        XunJianService.xunjianPointDetail(lineId, pointId).then(items => {
            this.setState({
                items
            });
        });
    }

    lookImage = (lookImageIndex, image) => {

        let items = this.state.items.map(item => {
            let images = item.fileList;
            if (images.length <= lookImageIndex) {
                return -1;
            } else {
                return images[lookImageIndex];
            }
        });
        let index = items.indexOf(image);
        if (index < 0) {
            index = 0;
        }
        let images = this.state.items[index].fileList;

        this.setState({
            lookImageIndex,
            images,
            visible: true,
        });
    };
    cancel = () => {
        this.setState({
            visible: false,
        });
    };

    savePhoto = (uri) => {
        try {
            if (Platform.OS == 'android') { //远程文件需要先下载 
                // 下载网络图片到本地
                // const response = await RNFetchBlob.config({
                //     fileCache: true,
                //     appendExt: 'png', // 可以根据需要更改文件扩展名
                // }).fetch('GET', uri);
                // const imagePath = response.path();
                // // 将本地图片保存到相册
                // const result = await CameraRoll.saveToCameraRoll(imagePath);
                // if (result) {
                //     UDToast.showInfo('已保存到相册'); 
                // } else {
                //     UDToast.showInfo('保存失败');
                // }

                //上面方法一样可以

                RNFetchBlob.config({
                    // 接收类型，这里是必须的，否则Android会报错
                    fileCache: true,
                    appendExt: 'png' // 给文件添加扩展名，Android需要这个来识别文件类型
                })
                    .fetch('GET', uri) // 使用GET请求下载图片
                    .then((res) => {
                        // 下载完成后的操作，例如保存到本地文件系统
                        // return RNFetchBlob.fs.writeFile(path, res.data, 'base64'); // 将数据写入文件系统
                        CameraRoll.saveToCameraRoll(res.data);
                    })
                    // .then(() => {
                    //     //console.log('Image saved to docs://image.png'); // 或者使用你的路径
                    //     // 在这里你可以做其他事情，比如显示一个提示或者加载图片等 
                    // })
                    .catch((err) => {
                    });

            }
            else {
                //ios
                let promise = CameraRoll.saveToCameraRoll(uri);
                promise.then(function (result) {
                }).catch(function (err) {
                });
            }

        } catch (error) {
        }
    }


    render() {//: React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { items } = this.state;
        return (
            // <CommonView>
            <ScrollView>
                {items.map((item, index) => (
                    <Flex key={item.pointName + index} direction={'column'} align={'start'} style={styles.content}>
                        <Text style={styles.title}>{item.pointName}</Text>
                        <XunJianComponent data={item} />
                        <ListImages images={item.fileList} lookImage={this.lookImage} />
                    </Flex>
                ))}
                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                        imageUrls={this.state.images}
                        menuContext={{ "saveToLocal": "保存到相册", "cancel": "取消" }}
                        onSave={(url) => this.savePhoto(url)}
                    />
                </Modal>
                {/* </CommonView> */}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingLeft: 15,
        paddingRight: 15
    },
    title: {
        color: '#404145',
        fontSize: 16,
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10
    },
});
