import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Keyboard
} from 'react-native';
import BasePage from '../../base/base';
import { Icon, Flex, Button, TextareaItem } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
import UDToast from '../../../utils/UDToast';
import WorkService from '../work-service';
import OperationRecords from '../../../components/operationrecords';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';
import UploadImageView from '../../../components/upload-image-view';

export default class CompleteDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '完成维修',
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
        let id = common.getValueFromProps(this.props);
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
            KeyboardShown: false,
            isUpload: false
        };
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
    }

    componentDidMount() {
        this.getData();
    }

    //add new
    componentWillMount() {
        //注册鼠标事件，用于文本框输入的时候往上移动 2024年5月23日
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            this.setState({
                KeyboardShown: true,
            });
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({
                KeyboardShown: false,
            });
        });
    }

    //add new
    componentWillUnmount() {
        //卸载键盘弹出事件监听
        if (this.keyboardDidShowListener != null) {
            this.keyboardDidShowListener.remove();
        }
        //卸载键盘隐藏事件监听
        if (this.keyboardDidHideListener != null) {
            this.keyboardDidHideListener.remove();
        }
    }

    getData = () => {
        const { id } = this.state;
        WorkService.weixiuDetail(id).then(detail => {
            this.setState({
                detail: {
                    ...detail.entity,
                    serviceDeskCode: detail.serviceDeskCode,
                    emergencyLevel: detail.emergencyLevel,
                    importance: detail.importance,
                    relationId: detail.relationId,
                    statusName: detail.statusName,
                    assistName: detail.assistName,//协助人 
                    reinforceName: detail.reinforceName//增援人 
                }
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
        // if (!(value && value.length > 0)) {
        //     UDToast.showInfo('请输入文字');
        //     return;
        // }
        const wcimages = images.filter(t => t.type === '完成');
        if (wcimages.length == 0 && !isUpload) {
            UDToast.showInfo('请上传完成图片');
            return;
        }
        WorkService.serviceHandle(handle, id, value).then(res => {
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
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }}>
                    <ScrollView style={{ marginTop: this.state.KeyboardShown ? - 250 : 0, height: '100%' }}>
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
                            <Text style={styles.left}>紧急：{detail.emergencyLevel}，重要：{detail.importance}</Text>
                        </Flex>
                        <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                            <Text style={styles.left}>转单人：{detail.createUserName}</Text>
                        </Flex>
                        <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                            <Text style={styles.left}>转单时间：{detail.createDate}</Text>
                        </Flex>
                        <TouchableWithoutFeedback>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]}>
                                <Text style={styles.left}>关联单：</Text>
                                <Text
                                    //onPress={() => this.props.navigation.navigate('service', { data: detail.relationId })} 
                                    onPress={() => {
                                        if (detail.sourceType === '服务总台') {
                                            this.props.navigation.navigate('service', { data: { id: detail.relationId } });
                                        }
                                        else {
                                            //检查单
                                            this.props.navigation.navigate('checkDetail', { data: { id: detail.relationId } });
                                        }
                                    }}
                                    style={[styles.right, { color: Macro.work_blue }]}>{detail.serviceDeskCode}</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                            <Text style={styles.left}>维修专业：{detail.repairMajor}</Text>
                        </Flex>
                        <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                            <Text style={styles.left}>协助人：{detail.assistName}</Text>
                        </Flex>
                        <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                            <Text style={styles.left}>增援人：{detail.reinforceName}</Text>
                        </Flex>
                        <UploadImageView
                            style={{ marginTop: 10 }}
                            linkId={this.state.id}
                            reload={this.reload}
                            type='完成'
                        />
                        <View style={{ margin: 15 }}>
                            <TextareaItem
                                rows={4}
                                autoHeight
                                placeholder='请输入完成情况'
                                style={{ width: ScreenUtil.deviceWidth() - 32 }}
                                onChange={value => this.setState({ value })}
                                value={this.state.value}
                            />
                        </View>
                        <Flex justify={'center'}>
                            <Button onPress={() => this.click('完成维修')} type={'primary'}
                                activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                    width: 200,
                                    backgroundColor: Macro.work_blue,
                                    marginTop: 20,
                                    height: 40
                                }}>完成维修</Button>
                        </Flex>
                        <OperationRecords communicateClick={this.communicateClick} communicates={communicates} />
                    </ScrollView>
                </TouchableWithoutFeedback>
                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
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
        color: '#404145'
    },
    right: {
        fontSize: 16,
        color: '#404145'
    },
    desc: {
        fontSize: 16,
        color: '#404145',
        padding: 15,
        paddingBottom: 40
    },
   
});
