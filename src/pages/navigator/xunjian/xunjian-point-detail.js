import React, {Fragment} from 'react';
import BasePage from '../../base/base';
import {Flex, Accordion, List, Icon} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import {Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import ScrollTitle from '../../../components/scroll-title';
import XunJianComponent from './xunjian-component';
import ListImages from '../../../components/list-images';
import common from '../../../utils/common';
import XunJianService from './xunjian-service';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class XunJianPointDetailPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            title: '巡检点详情',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
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
            images: [],
        };
    }

    componentDidMount(): void {
        const {lineId, pointId} = this.state;
        XunJianService.xunjianPointDetail(lineId, pointId).then(items => {
            console.log(11, items);
            this.setState({
                items,
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


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {items} = this.state;
        return (
            <CommonView>
                {items.map((item, index) => (
                    <Flex key={item.pointName + index} direction={'column'} align={'start'} style={styles.content}>
                        <Text style={styles.title}>{item.pointName}</Text>
                        <XunJianComponent data={item}/>
                        <ListImages images={item.fileList} lookImage={this.lookImage}/>
                    </Flex>
                ))}
                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                                 imageUrls={this.state.images}/>
                </Modal>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    title: {
        color: '#333',
        fontSize: 18,
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,
    },
});
