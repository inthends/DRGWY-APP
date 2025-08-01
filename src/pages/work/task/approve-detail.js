import React from 'react';
import {
    Text,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Alert,
    Platform,
    TextInput,CameraRoll
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
import RNFetchBlob from 'rn-fetch-blob'; 

export default class ApproveDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '维修单审核',
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
        this.state = {
            id,
            value: '',
            result: 1,
            images: [],
            startimages: [],
            finishimages: [],
            checkimages: [],
            detail: {},
            communicates: [],
            selectimages: [],//选中的图片集合，用于弹出展示
            lookImageIndex: 0,
            visible: false,
            isModifyRepairScore: false,
            showClose: false,
            appScore: '',
            verifyMemo: '',
            verifyResult: 1
        };
    }

    componentDidMount() {
        this.getData();
        //获取是否允许修改维修单积分 
        WorkService.getSetting('isModifyRepairScore').then(res => {
            this.setState({ isModifyRepairScore: res });
        });
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
                },
                appScore: detail.entity.score.toString()//默认积分
            });

            //根据不同单据类型获取附件作为维修前图片
            WorkService.workPreFiles(detail.entity.sourceType, detail.relationId).then(images => {
                this.setState({
                    images
                });
            });

            WorkService.weixiuExtra(id).then(images => {
                const startimages = images.filter(t => t.type === '开工') || [];
                const finishimages = images.filter(t => t.type === '完成') || [];
                const checkimages = images.filter(t => t.type === '检验') || [];
                this.setState({
                    startimages,
                    finishimages,
                    checkimages
                });
            });

            //获取维修单的单据动态
            WorkService.getOperationRecord(id).then(res => {
                this.setState({
                    communicates: res
                });
            });
        });
    };

    click = () => {
        const { isModifyRepairScore, appScore } = this.state;
        if (isModifyRepairScore == true && appScore == '') {
            //需要弹出修正积分界面
            // this.setState({
            //     appScore: detail.score.toString(),//转换为字符串
            //     showClose: true
            // }); 
            UDToast.showError('请输入修正积分');
            return;
        }
        Alert.alert(
            '请确认',
            '是否审核？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
                    const { id, verifyResult, verifyMemo } = this.state;
                    WorkService.approve(id, appScore, verifyResult, verifyMemo).then(res => {
                        UDToast.showInfo('审核完成');
                        this.props.navigation.goBack();
                    });
                }
            }
            ], { cancelable: false });
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
    };

    cancel = () => {
        this.setState({
            visible: false
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

    lookImage = (lookImageIndex, files) => {
        this.setState({
            lookImageIndex,
            selectimages: files,//需要缓存是哪个明细的图片
            visible: true
        });
    };

    // setScore = () => {
    //     this.setState({ showClose: false });
    //     const { id,
    //         appScore,
    //         verifyResult,
    //         verifyMemo
    //     } = this.state;
    //     WorkService.approve(
    //         id,
    //         appScore,
    //         verifyResult,
    //         verifyMemo
    //     ).then(res => {
    //         UDToast.showInfo('审核完成');
    //         this.props.navigation.goBack();
    //     });
    // };

    render() {
        const {
            isModifyRepairScore,
            verifyResult,
            images,
            startimages,
            finishimages,
            checkimages,
            detail,
            communicates } = this.state;

        const selectImg = require('../../../static/images/select.png');
        const noselectImg = require('../../../static/images/no-select.png');

        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView style={{ height: '100%' }}>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.address} {detail.contactName}</Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.contactLink)}>
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')}
                                style={{ width: 16, height: 16 }} /></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                    <Text style={styles.desc}>{detail.repairContent}</Text>

                    <ListImages images={images} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, images)} />

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
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]}>
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
                        <Text style={styles.left}>接单人：{detail.receiverName}，{detail.receiverDate}</Text>
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

                    {detail.testDate ?//进行了检验
                        <>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验时间：{detail.testDate}</Text>
                            </Flex>
                            {/* <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验人：{detail.testerName}</Text>
                                <Text style={styles.right}>检验结果：{detail.testResult == 1 ? '合格' : '不合格'}</Text>
                            </Flex> */}
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验人：{detail.testerName}</Text>
                            </Flex>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.right}>检验结果：{detail.testResult == 1 ? '合格' : '不合格'}</Text>
                            </Flex>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验说明：{detail.testRemark}</Text>
                            </Flex>
                            <ListImages images={checkimages} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, checkimages)} />
                        </> : null}

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <TouchableWithoutFeedback onPress={() => this.setState({ verifyResult: 1 })}>
                            <Flex>
                                <LoadImage img={verifyResult === 1 ? selectImg : noselectImg}
                                    style={{ width: 15, height: 15 }} />
                                <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15 }}>通过</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.setState({ verifyResult: 0, appScore: '0' })}>
                            <Flex>
                                <LoadImage img={verifyResult === 0 ? selectImg : noselectImg}
                                    style={{ width: 15, height: 15 }} />
                                <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15 }}>不通过</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>

                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]}>
                        <Text style={styles.left}>修正个人积分：</Text>
                        <TextInput
                            keyboardType={'decimal-pad'}
                            value={this.state.appScore}
                            style={{ fontSize: 14, color: 'red' }}
                            readOnly={!isModifyRepairScore || verifyResult == 0}
                            onChangeText={appScore => this.setState({ appScore })}
                            placeholder='请输入修正个人积分' />
                    </Flex>

                    <View style={{
                        margin: 15
                    }}>
                        <TextareaItem
                            rows={4}
                            autoHeight
                            placeholder='请输入审核情况'
                            style={{ fontSize: 14, width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={verifyMemo => this.setState({ verifyMemo })}
                            value={this.state.verifyMemo}
                            maxLength={500}
                        />
                    </View>

                    <Flex justify={'center'}>
                        <Button onPress={() => this.click()} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 220,
                                backgroundColor: Macro.work_blue,
                                marginTop: 20,
                                height: 40
                            }}>审核</Button>
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
                {/* 
                {
                    this.state.showClose && (
                        //修正个人积分
                        <View style={styles.mengceng}>
                            <Flex direction={'column'} justify={'center'} align={'center'}
                                style={{
                                    flex: 1, padding: 25,
                                    backgroundColor: 'rgba(178,178,178,0.5)'
                                }}>
                                <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                    <View style={[styles.input, ScreenUtil.borderBottom()]}
                                    >
                                        <TextInput
                                            keyboardType={'decimal-pad'}
                                            value={this.state.appScore}
                                            onChangeText={appScore => this.setState({ appScore })}
                                            placeholder='请输入积分' />
                                    </View>
                                    <Flex style={{ marginTop: 15 }}>
                                        <Button onPress={() => this.setScore()}
                                            type={'primary'}
                                            activeStyle={{ backgroundColor: Macro.work_blue }}
                                            style={{
                                                width: 70,
                                                backgroundColor: Macro.work_blue,
                                                height: 35
                                            }}>确认</Button>

                                        <Button onPress={() => {
                                            this.setState({ showClose: false });
                                        }}
                                            type={'primary'}
                                            activeStyle={{ backgroundColor: Macro.work_blue }}
                                            style={{
                                                marginLeft: 15,
                                                width: 70,
                                                backgroundColor: '#666',
                                                borderWidth: 0,
                                                height: 35
                                            }}>取消</Button>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </View>
                    )
                } */}

            </CommonView >
        );
    }
}

const styles = StyleSheet.create({

    // input: {
    //     height: 50, width: 160
    // },

    every: {
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 10,
        paddingTop: 10
    },

    every2: {
        marginLeft: 15,
        marginRight: 15
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
    },
    mengceng: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    }
});
