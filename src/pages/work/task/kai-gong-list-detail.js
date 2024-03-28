import React from 'react';
import {
    TextInput,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView, Modal,
} from 'react-native';
import BasePage from '../../base/base';
import { Icon, Flex } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
// import UDRecord from '../../../utils/UDRecord';
// import api from '../../../utils/api';
// import UDPlayer from '../../../utils/UDPlayer';
import UDToast from '../../../utils/UDToast';
import DashLine from '../../../components/dash-line';
import WorkService from '../work-service';
import UploadImageView from '../../../components/upload-image-view';
// import Communicates from '../../../components/communicates';
import OperationRecords from '../../../components/operationrecords';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';


export default class KaiGongListDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '开始维修',
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
        let id = common.getValueFromProps(this.props);//维修单
        //let type = common.getValueFromProps(this.props, 'type');
        this.state = {
            id,
            value: '',
            images: [],
            isUpload: false,//是否上传了图片
            detail: {},
            communicates: [],
            lookImageIndex: 0,
            visible: false,
            backMemo: ''
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { id } = this.state;
        //查看维修单
        WorkService.weixiuDetail(id).then(detail => {
            this.setState({
                detail: {
                    ...detail.entity,
                    serviceDeskCode: detail.serviceDeskCode,
                    relationId: detail.relationId,
                    statusName: detail.statusName
                },
            });
            //获取维修单的单据动态
            WorkService.getOperationRecord(id).then(res => {
                this.setState({
                    communicates: res
                });
            });
        });

        WorkService.weixiuExtra(id).then(images => {
            this.setState({
                images
            });
        });
    };

    click = (handle) => {
        const { id, isUpload, images, value } = this.state;
        // if (handle === '回复' && !(value&&value.length > 0)) {
        if (!(value && value.length > 0)) {
            UDToast.showInfo('请输入故障判断');
            return;
        }

        const kgimages = images.filter(t => t.type === '开工');

        if (kgimages.length == 0 && !isUpload) {
            UDToast.showInfo('请上传开工图片');
            return;
        }

        WorkService.serviceHandle(handle, id, value).then(res => {
            UDToast.showInfo('操作成功');
            this.props.navigation.goBack();
        });
    };

    back = (handle) => {
        const { id, backMemo } = this.state;
        // if (handle === '回复' && !(value&&value.length > 0)) {
        if (!(backMemo && backMemo.length > 0)) {
            UDToast.showInfo('请输入退单原因');
            return;
        }
        WorkService.serviceHandle(handle, id, backMemo).then(res => {
            UDToast.showInfo('操作成功');
            this.props.navigation.goBack();
        });
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
            communicates: d
        });
    }
    cancel = () => {
        this.setState({
            visible: false
        });
    };

    lookImage = (lookImageIndex) => {
        this.setState({
            lookImageIndex,
            visible: true
        });
    };

    //刷新图片上传状态
    reload = () => {
        this.setState({
            isUpload: true
        });
    }

    render() {
        const { images, detail, communicates } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>
                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.address} {detail.contactName}</Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.contactLink)}>
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')}
                                style={{ width: 16, height: 16 }} /></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                    <Text style={styles.desc}>{detail.repairContent}</Text>
                    <ListImages images={images} lookImage={this.lookImage} />
                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>转单人：{detail.createUserName} {detail.createDate}</Text>
                    </Flex>

                    <TouchableWithoutFeedback>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]}>
                            <Text style={styles.left}>关联单：</Text>
                            <Text onPress={() => this.props.navigation.navigate('service', { data: { id: detail.relationId } })}
                                style={[styles.right, { color: Macro.work_blue }]}>{detail.serviceDeskCode}</Text>
                        </Flex>
                    </TouchableWithoutFeedback>

                    <UploadImageView style={{ marginTop: 10 }}
                        linkId={this.state.id}
                        reload={this.reload}
                        type='开工'
                    />

                    {/* <View style={{
                        margin: 15,
                        borderStyle: 'solid',
                        borderColor: '#F3F4F2',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}>
                        <TextareaItem
                            rows={3}
                            placeholder='请输入故障判断'
                            style={{ paddingTop: 10, width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={value => this.setState({ value })}
                            value={this.state.value}
                        />
                    </View> */}

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <TextInput
                            maxLength={500}
                            placeholder='请输入故障判断'
                            multiline
                            onChangeText={value => this.setState({ value })}
                            value={this.state.value}
                            style={{ fontSize: 16, textAlignVertical: 'top' }}
                            numberOfLines={4}>
                        </TextInput>
                    </Flex>

                    {/* <View style={{
                        margin: 15,
                        borderStyle: 'solid',
                        borderColor: '#F3F4F2',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}>
                        <TextareaItem
                            rows={3}
                            placeholder='请输入退单原因'
                            style={{ paddingTop: 10, width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={value => this.setState({ backMemo: value })}
                            value={this.state.backMemo}
                        />
                    </View> */}

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <TextInput
                            maxLength={500}
                            placeholder='请输入退单原因'
                            multiline
                            onChangeText={value => this.setState({ backMemo: value })}
                            value={this.state.backMemo}
                            style={{ fontSize: 16, textAlignVertical: 'top' }}
                            numberOfLines={4}>
                        </TextInput>
                    </Flex>

                    <Flex justify={'center'} style={{ marginTop: 20 }} >
                        <TouchableWithoutFeedback onPress={() => this.click('开始维修')}>
                            <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_blue }]}>
                                <Text style={styles.word}>开始维修</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.back('退单')}>
                            <Flex justify={'center'} style={[styles.ii, { backgroundColor: 'red' }]}>
                                <Text style={styles.word}>退单</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                    <OperationRecords communicateClick={this.communicateClick} communicates={communicates} />
                </ScrollView>
                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer
                        index={this.state.lookImageIndex}
                        onCancel={this.cancel}
                        onClick={this.cancel}
                        imageUrls={this.state.images} />
                </Modal>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({

    every: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    every2: {
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 10,
        paddingTop: 10
    },
    left: {
        fontSize: 16,
        color: '#333'
    },
    right: {
        fontSize: 16,
        color: '#333'
    },
    desc: {
        fontSize: 16,
        color: '#333',
        padding: 15,
        paddingBottom: 40
    },
    ii: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginBottom: 20
    },
    word: {
        color: 'white',
        fontSize: 16
    }
});
