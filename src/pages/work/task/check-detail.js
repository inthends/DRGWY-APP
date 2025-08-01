import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Platform,
    Keyboard,CameraRoll
} from 'react-native';
import BasePage from '../../base/base';
import { Button, Icon, Flex, TextareaItem } from '@ant-design/react-native';
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
import RNFetchBlob from 'rn-fetch-blob'; 

export default class CheckDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '维修检验',
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
        let id = common.getValueFromProps(this.props, 'id');
        //let type = common.getValueFromProps(this.props, 'type');
        this.state = {
            id,
            value: '',
            result: 1,
            preimages: [],
            isUpload: false,//是否上传了图片
            images: [],//检验图片
            startimages: [],
            finishimages: [],
            detail: {},
            communicates: [],
            lookImageIndex: 0,
            visible: false,
            KeyboardShown: false,
            isMustCheckFile: false
        };
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
    }

    componentDidMount() {
        this.getData();
        //获取附件是否必填验证 
        WorkService.getSetting('isMustCheckFile').then(res => {
            this.setState({ isMustCheckFile: res });
        });
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
                    relationId: detail.relationId,
                    serviceDeskCode: detail.serviceDeskCode,
                    statusName: detail.statusName,
                    assistName: detail.assistName,//协助人 
                    reinforceName: detail.reinforceName//增援人 
                }
            });

            // WorkService.serviceCommunicates(detail.relationId).then(res => {
            //     this.setState({
            //         communicates: res,
            //     });
            // });

            //根据不同单据类型获取附件作为维修前图片
            WorkService.workPreFiles(detail.entity.sourceType, detail.relationId).then(preimages => {
                this.setState({
                    preimages
                });
            });

            WorkService.weixiuExtra(id).then(images => {
                const startimages = images.filter(t => t.type === '开工') || [];
                const finishimages = images.filter(t => t.type === '完成') || [];
                this.setState({
                    startimages,
                    finishimages
                });
            });

            //获取维修单的单据动态
            WorkService.getOperationRecord(id).then(res => {
                this.setState({
                    communicates: res
                });
            });
        });

        // WorkService.weixiuExtra(id).then(images => {
        //     this.setState({
        //         images
        //     });
        // });
    };

    click = (handle) => {
        const { id, value, images, isUpload, result, isMustCheckFile } = this.state;
        if (!(value && value.length > 0)) {
            UDToast.showError('请输入检验情况');
            return;
        }

        if (images.length == 0 && !isUpload && isMustCheckFile == true) {
            UDToast.showError('请上传检验图片');
            return;
        }

        WorkService.serviceHandle(handle, id, value, { result }).then(res => {
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

    // lookImage = (lookImageIndex) => {
    //     this.setState({
    //         lookImageIndex,
    //         visible: true
    //     });
    // };

    lookImage = (lookImageIndex, files) => {
        this.setState({
            lookImageIndex,
            selectimages: files,//需要缓存是哪个明细的图片
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
        const {
            preimages,
            startimages,
            finishimages,
            detail,
            communicates,
            result } = this.state;

        const selectImg = require('../../../static/images/select.png');
        const noselectImg = require('../../../static/images/no-select.png');

        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView style={{ marginTop: this.state.KeyboardShown ? -200 : 0, height: '100%' }}>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.address} {detail.contactName}</Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.contactLink)}>
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{ width: 16, height: 16 }} /></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                    <Text style={styles.desc}>{detail.repairContent}</Text>
                    {/* <DashLine /> */}
                    <ListImages images={preimages} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, preimages)} />

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>紧急程度：{detail.emergencyLevel}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.right}>重要程度：{detail.importance}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>转单人：{detail.createUserName}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>转单时间：{detail.createDate}</Text>
                    </Flex>

                    <TouchableWithoutFeedback>
                        <Flex style={[styles.every]}>
                            <Text style={styles.left}>关联单：</Text>
                            <Text
                                onPress={() => {
                                    if (detail.sourceType === '服务总台') {
                                        this.props.navigation.navigate('service', { id: detail.relationId });
                                    }
                                    else //if (detail.sourceType === '维修单') 
                                    {
                                        //检验不通过关联的旧的维修单
                                        this.props.navigation.navigate('weixiuView', { id: detail.relationId });
                                    }
                                    // else {
                                    //     //检查单
                                    //     this.props.navigation.navigate('checkDetail', { id: detail.relationId });
                                    // }
                                }}
                                style={[styles.right, { color: Macro.work_blue }]}>{detail.serviceDeskCode}</Text>
                        </Flex>
                    </TouchableWithoutFeedback>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>派单人：{detail.senderName}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>派单时间：{detail.sendDate}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>派单说明：{detail.dispatchMemo}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>维修专业：{detail.repairMajor}，积分：{detail.score}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>协助人：{detail.assistName}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>增援人：{detail.reinforceName}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>开工时间：{detail.beginDate}</Text>
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>预估完成时间：{detail.estimateDate}</Text>
                    </Flex>
                    <ListImages images={startimages} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, startimages)} />

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>完成时间：{detail.endDate}，用时：{detail.useTime}分</Text>
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>完成情况：{detail.achieved}</Text>
                    </Flex>
                    <ListImages images={finishimages} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, finishimages)} />

                    <Flex justify={'between'} style={{ margin: 15 }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ result: 1 })}>
                            <Flex>
                                <LoadImage img={result === 1 ? selectImg : noselectImg}
                                    style={{ width: 15, height: 15 }} />
                                <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15 }}>合格</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.setState({ result: 0 })}>
                            <Flex>
                                <LoadImage img={result === 0 ? selectImg : noselectImg}
                                    style={{ width: 15, height: 15 }} />
                                <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15 }}>不合格</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>

                    <UploadImageView
                        style={{ marginTop: 10 }}
                        linkId={this.state.id}
                        reload={this.reload}
                        type='检验'
                    />
                    <View style={{
                        margin: 15
                        // borderStyle: 'solid',
                        // borderColor: '#F3F4F2',
                        // borderWidth: 1,
                        // borderRadius: 5
                    }}>
                        <TextareaItem
                            rows={4}
                            autoHeight
                            placeholder='请输入检验情况'
                            style={{ width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={value => this.setState({ value })}
                            value={this.state.value}
                            maxLength={500}
                        />
                    </View>

                    <Flex justify={'center'}>
                        <Button onPress={() => this.click('完成检验')} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 220,
                                backgroundColor: Macro.work_blue,
                                marginTop: 20,
                                height: 40
                            }}>完成检验</Button>
                    </Flex>
                    <OperationRecords communicateClick={this.communicateClick} communicates={communicates} />
                </ScrollView>

                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                        imageUrls={this.state.selectimages}
                        menuContext={{ "saveToLocal": "保存到相册", "cancel": "取消" }}
                        onSave={(url) => this.savePhoto(url)}
                    />
                </Modal>

            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    every: {
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 10,
        paddingTop: 10
    },
    left: {
        fontSize: 14,
        color: '#404145'
    },
    right: {
        fontSize: 14,
        color: '#404145'
    },
    desc: {
        lineHeight: 20,
        fontSize: 15,
        padding: 15
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
