import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    TextInput,
    Keyboard
} from 'react-native';
import BasePage from '../../base/base';
import { Icon, Flex, Button, List, TextareaItem, DatePicker } from '@ant-design/react-native';
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
        let id = common.getValueFromProps(this.props, 'id');
        //let type = common.getValueFromProps(this.props, 'type');
        this.state = {
            id,
            value: '',
            preimages: [],
            startimages: [],
            images: [],//完成图片
            isUpload: false,//是否上传了图片
            detail: {},
            communicates: [],
            lookImageIndex: 0,
            visible: false,
            KeyboardShown: false,
            isUpload: false,
            showClose: false,
            stopDateBegin: new Date(),
            pauseMemo: '',
            isMustFinishFile: false,
            backMemo: '',
            showBack: false,
        };
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
    }

    componentDidMount() {
        this.getData();
        WorkService.getSetting('isMustFinishFile').then(res => {
            this.setState({ isMustFinishFile: res });
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

            //根据不同单据类型获取附件作为维修前图片
            WorkService.workPreFiles(detail.entity.sourceType, detail.relationId).then(preimages => {
                this.setState({
                    preimages
                });
            });

            WorkService.weixiuExtra(id).then(images => {
                const startimages = images.filter(t => t.type === '开工') || [];
                this.setState({
                    startimages
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

    click = () => {
        const { id, isUpload, images, value, isMustFinishFile } = this.state;
        // if (!(value && value.length > 0)) {
        //     UDToast.showError('请输入文字');
        //     return;
        // }
        //const wcimages = images.filter(t => t.type === '完成');
        if (images.length == 0 && !isUpload && isMustFinishFile == true) {
            UDToast.showError('请上传完成图片');
            return;
        }


        WorkService.checkReinforceUser(id).then(res => {
            if (res.flag == false) {
                UDToast.showError(res.msg);
                return;
            }

            WorkService.serviceHandle('完成维修', id, value).then(res => {
                UDToast.showInfo('操作成功');
                this.props.navigation.goBack();
            });
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


    pause = () => {
        //this.setState({ showClose: false });
        const { id, pauseMemo, stopDateBegin } = this.state;
        if (!(pauseMemo && pauseMemo.length > 0)) {
            UDToast.showError('请输入暂停原因');
            return;
        }
        WorkService.pause(id, stopDateBegin, pauseMemo).then(res => {
            UDToast.showInfo('暂停成功');
            this.props.navigation.goBack();
        });
    };

    back = () => {
        const { id, backMemo } = this.state;
        if (!(backMemo && backMemo.length > 0)) {
            UDToast.showError('请输入退单原因');
            return;
        }
        WorkService.serviceHandle('退单', id, backMemo).then(res => {
            UDToast.showInfo('操作成功');
            this.props.navigation.goBack();
        });
    };

    render() {
        const { preimages, startimages, detail, communicates } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView style={{ marginTop: this.state.KeyboardShown ? - 250 : 0, height: '100%' }}>
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

                    <ListImages images={preimages} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, preimages)} />

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>紧急程度：{detail.emergencyLevel}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.right}>重要程度：{detail.importance}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>转单人：{detail.createUserName}，{detail.createDate}</Text>
                    </Flex>
                    <TouchableWithoutFeedback>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]}>
                            <Text style={styles.left}>关联单：</Text>
                            <Text
                                onPress={() => {
                                    if (detail.sourceType === '服务总台') {
                                        this.props.navigation.navigate('service', { id: detail.relationId });
                                    }
                                    else if (detail.sourceType === '维修单') {
                                        //检验不通过关联的旧的维修单
                                        this.props.navigation.navigate('weixiuView', { id: detail.relationId });
                                    }
                                    else {
                                        //检查单
                                        this.props.navigation.navigate('checkDetail', { id: detail.relationId });
                                    }
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

                    <Flex style={styles.every} justify='between'>
                        <Text style={styles.left}>开工图片</Text>
                    </Flex>
                    <ListImages images={startimages} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, startimages)} />

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
                            maxLength={500}
                        />
                    </View>

                    <Flex justify={'center'}>
                        <Button onPress={() => this.setState({
                            backMemo: '',
                            showBack: true
                        })}
                            type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_red }} style={{
                                width: 110,
                                backgroundColor: Macro.work_red,
                                //marginLeft: 20,
                                marginTop: 20,
                                borderWidth: 0,
                                height: 40
                            }}>退单</Button>

                        {detail.status != 0 ?
                            <Button onPress={() => this.setState({
                                showClose: true,
                                pauseMemo: ''
                            })}
                                type={'primary'}
                                activeStyle={{ backgroundColor: Macro.work_red }} style={{
                                    width: 110,
                                    backgroundColor: Macro.work_red,
                                    marginLeft: 20,
                                    marginTop: 20,
                                    borderWidth: 0,
                                    height: 40
                                }}>暂停</Button> : null}

                        <Button onPress={this.click} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 110,
                                backgroundColor: Macro.work_blue,
                                marginLeft: 20,
                                marginTop: 20,
                                height: 40
                            }}>完成维修</Button>

                    </Flex>

                    <OperationRecords communicateClick={this.communicateClick} communicates={communicates} />
                </ScrollView>

                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                        imageUrls={this.state.selectimages} />
                </Modal>

                {this.state.showClose && (
                    //暂停
                    <View style={styles.mengceng}>
                        <TouchableWithoutFeedback onPress={() => {
                            Keyboard.dismiss();//隐藏键盘
                        }}>
                            <Flex direction={'column'} justify={'center'} align={'center'}
                                style={{ flex: 1, padding: 25, backgroundColor: 'rgba(178,178,178,0.5)' }}>
                                <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                    <CommonView style={{ height: 150, width: 300 }}>
                                        <List style={{
                                            marginLeft: 10,
                                            marginRight: 10,
                                            paddingBottom: 10,
                                            paddingTop: 10
                                        }}>
                                            <DatePicker
                                                mode="date"
                                                title="选择时间"
                                                value={this.state.stopDateBegin}
                                                onChange={stopDateBegin => this.setState({ stopDateBegin })}
                                                style={{ backgroundColor: 'white' }}
                                            >
                                                <List.Item arrow="horizontal"><Text style={{ marginLeft: -10, color: '#666' }}>暂停开始时间</Text></List.Item>
                                            </DatePicker>
                                        </List>
                                        <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                                            <TextInput
                                                maxLength={500}
                                                placeholder='请输入暂停原因'
                                                multiline
                                                onChangeText={pauseMemo => this.setState({ pauseMemo })}
                                                value={this.state.pauseMemo}
                                                style={{ textAlignVertical: 'top', height: 50 }}
                                                numberOfLines={4}>
                                            </TextInput>
                                        </Flex>
                                    </CommonView>

                                    <Flex style={{ marginTop: 10 }}>
                                        <Button onPress={this.pause} type={'primary'}
                                            activeStyle={{ backgroundColor: Macro.work_blue }}
                                            style={{
                                                width: 110,
                                                backgroundColor: Macro.work_blue,
                                                height: 35
                                            }}>确认</Button>
                                        <Button onPress={() => this.setState({ showClose: false })}
                                            type={'primary'}
                                            activeStyle={{ backgroundColor: Macro.work_blue }}
                                            style={{
                                                marginLeft: 30,
                                                width: 110,
                                                backgroundColor: '#666',
                                                borderWidth: 0,
                                                height: 35
                                            }}>取消</Button>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </View>
                )}

                {this.state.showBack && (
                    //退单
                    <View style={styles.mengceng}>
                        <Flex direction={'column'} justify={'center'} align={'center'}
                            style={{
                                flex: 1, padding: 25,
                                backgroundColor: 'rgba(178,178,178,0.5)'
                            }}>
                            <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                <View style={{ height: 110, width: 300 }}>
                                    <TextareaItem
                                        style={{ height: 100 }}
                                        placeholder='请输入退单原因'
                                        maxLength={500}
                                        onChange={value => this.setState({ backMemo: value })}
                                        value={this.state.backMemo}
                                    />
                                </View>
                                <Flex style={{ marginTop: 15 }}>
                                    <Button onPress={this.back} type={'primary'}
                                        activeStyle={{ backgroundColor: Macro.work_blue }}
                                        style={{
                                            width: 130,
                                            backgroundColor: Macro.work_blue,
                                            height: 35
                                        }}>确认</Button>
                                    <Button onPress={() => {
                                        this.setState({ showBack: false });
                                    }}
                                        type={'primary'}
                                        activeStyle={{ backgroundColor: Macro.work_blue }}
                                        style={{
                                            marginLeft: 30,
                                            width: 130,
                                            backgroundColor: '#666',
                                            borderWidth: 0,
                                            height: 35
                                        }}>取消</Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </View>
                )}

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
    every2: {
        marginLeft: 10,
        marginRight: 10,
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
        lineHeight: 20,
        fontSize: 15,
        // color: '#404145',
        padding: 15
    },
    mengceng: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    }
});
