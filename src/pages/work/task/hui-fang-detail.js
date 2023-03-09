//服务单回访
import React  from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,Modal,
} from 'react-native';
import BasePage from '../../base/base';
import { Icon } from '@ant-design/react-native/lib/index';
import {  Flex, TextareaItem } from '@ant-design/react-native/lib/index';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';

// import SelectImage from '../../../utils/select-image';
// import UDRecord from '../../../utils/UDRecord';
// import api from '../../../utils/api';
// import UDPlayer from '../../../utils/UDPlayer';

import UDToast from '../../../utils/UDToast';
import DashLine from '../../../components/dash-line';
import WorkService from '../work-service';
// import UploadImageView from '../../../components/upload-image-view';
import Star from '../../../components/star';
// import Communicates from '../../../components/communicates';
import OperationRecords from '../../../components/operationrecords';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';

// const Item = List.Item;

export default class HuiFangDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '服务单回访',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),

        };
    };

    constructor(props) {
        super(props);
        let fuwu = common.getValueFromProps(this.props);
        let type = common.getValueFromProps(this.props, 'type');
        this.state = {
            value: '',
            fuwu,
            type,
            images: [],
            detail: {},
            communicates: [],
            star: 3,
            lookImageIndex: 0,
            visible: false,
        };
    }

    componentDidMount(): void {
        this.getData();
    }


    // getData = () => {
    //     const { fuwu, type } = this.state;
    //     // console.log('fuw', fuwu);
    //     WorkService.weixiuDetail(fuwu.id).then(detail => {
    //         // console.log('detail', detail);
    //         this.setState({
    //             detail: {
    //                 ...detail.entity,
    //                 serviceDeskCode: detail.serviceDeskCode,
    //                 relationId: detail.relationId,
    //                 statusName: detail.statusName,
    //             },
    //         });
    //         //获取维修单的单据动态
    //         WorkService.getOperationRecord(fuwu.id).then(res => {
    //             this.setState({
    //                 communicates: res,
    //             });
    //         });
    //     });
    //     //获取维修单附件
    //     WorkService.weixiuExtra(fuwu.id).then(images => {
    //         this.setState({
    //             images,
    //         });
    //     });
    // };

    //获取服务单信息
    getData = () => {
        const { fuwu, type } = this.state;
        // console.log(fuwu);
        WorkService.serviceDetail(type, fuwu.id).then(item => {
            this.setState({
                detail: {
                    ...item.data,
                    businessId: item.businessId,
                    statusName: item.statusName
                },
            });
        });
        WorkService.serviceCommunicates(fuwu.id).then(res => {
            this.setState({
                communicates: res,
            });
        });
        WorkService.serviceExtra(fuwu.id).then(images => {
            this.setState({
                images,
            });
        });
    };

    click = (handle) => {
        const { fuwu,  value, star } = this.state;
        if (handle === '回复' && !(value && value.length > 0)) {
            UDToast.showInfo('请输入文字');
            return;
        }
        WorkService.serviceHandle(handle, fuwu.id, value, { grade: star }).then(res => {
            UDToast.showInfo('操作成功');
            this.props.navigation.goBack();
        });
    };
    changeStar = (star) => {
        this.setState({ star });
    };
    communicateClick = (i) => {
        let c = this.state.communicates;
        let d = c.map(it => {
            if (it.id === i.id) {
                it.show = i.show !== true;
            }
            return it;
        });
        this.setState({
            communicates: d,
        });
    };
    cancel = () => {
        this.setState({
            visible: false,
        });
    };

    lookImage = (lookImageIndex) => {
        this.setState({
            lookImageIndex,
            visible: true,
        });
    };


    render() {
        const { images, detail, communicates } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>
                    <Flex style={[styles.every2]} justify='between'>
                        <Text style={styles.left}>{detail.address} {detail.contactName}</Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.contactLink)}>
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{ width: 30, height: 30 }} /></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                    <DashLine />
                    <Text style={styles.desc}>{detail.repairContent}</Text>
                    <DashLine />
                    <ListImages images={images} lookImage={this.lookImage} />
                    <Flex style={[styles.every2]} justify='between'>
                        <Text style={styles.left}>转单人：{detail.createUserName} {detail.createDate}</Text>
                    </Flex>

                    <TouchableWithoutFeedback>
                        <Flex style={[styles.every]}>
                            <Text style={styles.left}>关联单：</Text>
                            {/* <Text onPress={() => this.props.navigation.navigate('service', { data: { id: detail.relationId } })}
                                style={[styles.right, { color: Macro.color_4d8fcc }]}>{detail.businessCode}</Text> */}

                            <Text onPress={() => {
                                if (detail.businessType === 'Repair') {
                                    this.props.navigation.navigate('weixiuView', { data: { id: detail.businessId } });
                                }
                                else {
                                    this.props.navigation.navigate('tousuView', { data: { id: detail.businessId } });
                                }
                            }} style={[styles.right, { color: Macro.color_4d8fcc }]}>{detail.businessCode}</Text>

                        </Flex>
                    </TouchableWithoutFeedback>
                    <DashLine />
                    <Star star={this.state.star} onChange={this.changeStar} />

                    <View style={{
                        margin: 15,
                        borderStyle: 'solid',
                        borderColor: '#F3F4F2',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}>
                        <TextareaItem
                            rows={4}
                            placeholder='输入业主建议'
                            style={{ fontSize: 14, paddingTop: 10, height: 100, width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={value => this.setState({ value })}
                            value={this.state.value}
                        />
                    </View>
                    <TouchableWithoutFeedback onPress={() => this.click('完成回访')}>
                        <Flex justify={'center'} style={[styles.ii, { width: '80%', marginLeft: '10%', marginRight: '10%', marginBottom: 20 }, { backgroundColor: Macro.color_4d8fcc }]}>
                            <Text style={styles.word}>完成回访</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                    <OperationRecords communicateClick={this.communicateClick} communicates={communicates} />
                </ScrollView>
                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                        imageUrls={this.state.images} />
                </Modal>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F3F4F2',

    },
    every: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
    },
    every2: {
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 10,
        paddingTop: 10,
    },
    left: {
        fontSize: 14,
        color: '#333',
    },
    right: {
        fontSize: 14,
        color: '#333',
    },
    desc: {
        padding: 15,
        paddingBottom: 40,
    },
    ii: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginBottom: 20,
    },
    word: {
        color: 'white',
        fontSize: 16,
    },

});
