import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    Alert,
    ScrollView
} from 'react-native';
import BasePage from '../../base/base';
import { Icon, Flex, TextareaItem, Button } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
// import LoadImage from '../../../components/load-image';
import LoadImageDelete from '../../../components/load-image-del';
import SelectImage from '../../../utils/select-image';
import common from '../../../utils/common';
// import UDRecord from '../../../utils/UDRecord';
// import api from '../../../utils/api';
// import UDPlayer from '../../../utils/UDPlayer';
import UDToast from '../../../utils/UDToast';
import GdzcService from './gdzc-service';
// import { AudioRecorder, AudioUtils } from 'react-native-audio';
import CommonView from '../../../components/CommonView';
import { connect } from 'react-redux';
import { saveXunJianAction } from '../../../utils/store/actions/actions';
import Macro from '../../../utils/macro';

//固定资产盘点，异常的时候弹出维修单页面
class AddRepairPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '新增',
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
        const { taskId, address, value } = common.getValueFromProps(this.props) || {};
        this.state = {
            index: 0,
            data: ['报修', '报事', '巡场'],
            images: [''],
            //image: '',
            //recording: false,
            id: common.getGuid(),
            //fileUrl: null,
            //playing: false,
            taskId,
            KeyboardShown: false,
            canSelectAddress: false, //!address,
            address,
            value,
            isMustServicedeskFile: false
        };
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (obj.state.params) {
                    const { address, value } = obj.state.params.data || {};
                    this.setState({ address, value });
                }
            }
        );

        //获取附件是否必填验证 
        GdzcService.getSetting('isMustServicedeskFile').then(res => {
            this.setState({ isMustServicedeskFile: res });
        });
    }

    componentWillMount() {
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

    componentWillUnmount() {
        this.viewDidAppear.remove();
        UDToast.hiddenLoading(this.recordId);
        //卸载键盘弹出事件监听
        if (this.keyboardDidShowListener != null) {
            this.keyboardDidShowListener.remove();
        }
        //卸载键盘隐藏事件监听
        if (this.keyboardDidHideListener != null) {
            this.keyboardDidHideListener.remove();
        }
    }

    // startRecord = () => {
    //     AudioRecorder.requestAuthorization().then((isAuthorised) => {
    //         if (!isAuthorised) {
    //             this.setState({ isAuthorised: false });
    //         } else {
    //             this.setState({ isAuthorised: true });
    //         }
    //         if (!isAuthorised) {
    //             UDToast.showError('录音功能未授权');
    //         } else {
    //             if (!this.state.recording) {
    //                 let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
    //                 AudioRecorder.prepareRecordingAtPath(audioPath, {
    //                     SampleRate: 22050,
    //                     Channels: 1,
    //                     AudioQuality: 'Low',
    //                     AudioEncoding: 'aac',
    //                 });

    //                 AudioRecorder.onProgress = (data) => {
    //                     // this.setState({currentTime: Math.floor(data.currentTime)});
    //                 };

    //                 AudioRecorder.onFinished = (data) => {
    //                     // Android callback comes in the form of a promise instead. 
    //                     // if (common.isIOS()) {
    //                     //     resolve(data.audioFileURL);
    //                     // } 
    //                     api.uploadFile(data.audioFileURL,
    //                         this.state.id,
    //                         '',
    //                         '/api/MobileMethod/MUploadServiceDesk', false).then(url => {
    //                             this.setState({ fileUrl: url });
    //                         }).catch(error => {
    //                         });
    //                 };
    //                 this.recordId = UDToast.showLoading('正在录音中...');
    //                 this.setState({ recording: true }, () => {
    //                     UDRecord.startRecord();
    //                 });
    //             }
    //         }
    //     });
    // };

    // stopRecord = () => {
    //     if (this.state.isAuthorised && this.state.recording) {
    //         setTimeout(() => {
    //             UDToast.hiddenLoading(this.recordId);
    //             this.setState({ recording: false }, () => {
    //                 UDRecord.stopRecord();
    //             });
    //         }, 1000);
    //     }
    // };

    // play = () => {
    //     UDPlayer.play(this.state.fileUrl);
    // };

    selectImages = () => {
        SelectImage.select(this.state.id, '', '/api/MobileMethod/MUploadServiceDesk').then(url => {
            let images = [...this.state.images];
            images.splice(images.length - 1, 0, url);
            if (images.length > 10) {
                //最多五张
                images = images.filter((item, index) => index !== images.length - 1);
            }
            this.setState({ images });
        }).catch(error => { });
    };

    //删除附件
    delete = (url) => {
        Alert.alert(
            '请确认',
            '是否删除？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
                    GdzcService.deleteWorkFile(url).then(res => {
                        let index = this.state.images.indexOf(url);
                        let myimages = [...this.state.images];
                        myimages.splice(index, 1);
                        this.setState({ images: myimages });
                    });
                }
            }
            ], { cancelable: false });
    }

    submit = () => {
        const { id, data, index, address, value, taskId, isMustServicedeskFile, images } = this.state;
        if (address == null || address.allName == null) {
            const title = '请选择' + data[index] + '地址';
            UDToast.showError(title);
            return;
        }

        if (isMustServicedeskFile == true && images.length == 1) {
            UDToast.showError('请上传图片');
            return;
        }

        if (this.canSubmit === false) {
            return;
        }
        this.canSubmit = false;//防止重复提交

        const params = {
            id,
            keyvalue: id,
            //source: '员工APP',
            billType: data[index],
            roomId: address.id,
            address: address.allName,
            contents: value,
            isAdd: true,
            taskId: this.state.taskId
        };

        if (this.props.hasNetwork || !taskId) {
            GdzcService.saveRepariForm(params).then(res => {
                UDToast.showInfo('提交成功', true);
                setTimeout(() => {
                    this.canSubmit = true;
                    //this.props.navigation.goBack(); 
                    //盘点结束跳转到固定资产列表
                    this.props.navigation.navigate('assets');
                }, 2000);
            }).catch(res => {
                this.canSubmit = true;
            });
        } else {
            const { taskId } = this.state;
            const { xunJianAction } = this.props;
            const data = xunJianAction[taskId];
            if (!data) {
                UDToast.showSuccess('数据异常，请关闭app重新进入');
            } else {
                this.props.saveXunJianAction({
                    [taskId]: {
                        ...data,
                        workParams: params
                    }
                });
                UDToast.showSuccess('已保存，稍后可在我的-设置中同步巡检数据');
            }
        }
    };

    // onSelectAddress = ({ selectItem }) => {
    //     this.setState({
    //         address: selectItem
    //     })
    // }

    render() {
        const { data, index, images, address, canSelectAddress } = this.state;
        // const title = data[index];
        // const title2 = '输入' + title + '内容';
        const width = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        const height = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        return (
            <CommonView style={{ flex: 1, backgroundColor: 'F3F4F2' }}>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }}>
                    <View style={{ height: '100%' }}>
                        <Flex direction='column'>
                            <Flex justify='between' style={styles.header}>
                                {data.map((item, i) => (
                                    <TouchableWithoutFeedback key={i} onPress={() => this.setState({ index: i })}>
                                        <Flex justify='center' style={[{
                                            marginLeft: 5,
                                            marginRight: 5,
                                            backgroundColor: '#0325FD',
                                            height: 40,
                                            width: (ScreenUtil.deviceWidth() / 3.0 - 20),
                                            borderRadius: 4
                                        }, index === i && { backgroundColor: '#E67942' }]}>
                                            <Text style={{ color: 'white', fontSize: 14 }}>{item}</Text>
                                        </Flex>
                                    </TouchableWithoutFeedback>
                                ))}
                            </Flex>
                            <Flex>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        if (canSelectAddress) {
                                            //this.props.navigation.push('selectAddress', { onSelect: this.onSelectAddress });
                                            this.props.navigation.push('selectAddress', { title: '选择位置', parentName: 'addRepair' });
                                        }
                                    }
                                    }>
                                    <Flex justify="between" style={[{
                                        paddingTop: 15,
                                        paddingBottom: 15,
                                        marginLeft: 15,
                                        marginRight: 15,
                                        width: ScreenUtil.deviceWidth() - 30
                                    }, ScreenUtil.borderBottom()]}>
                                        <Text style={[address && address.allName ? { color: '#404145', fontSize: 16 } : {
                                            color: '#999',
                                            fontSize: 16,
                                        }]}>{address && address.allName ? address.allName : '请选择地址'}</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>

                            <TextareaItem
                                rows={12}
                                placeholder='请输入内容'
                                style={[{
                                    color: '#404145',
                                    fontSize: 16,
                                    paddingTop: 15,
                                    width: ScreenUtil.deviceWidth() - 30,
                                    height: ScreenUtil.deviceHeight() - 570
                                }, ScreenUtil.borderBottom()]}
                                onChange={value => this.setState({ value })}
                                value={this.state.value}
                                maxLength={500}
                            />

                            <ScrollView style={{ maxHeight: 100 }}>
                                <Flex justify={'start'} align={'start'}
                                    style={{ width: ScreenUtil.deviceWidth() }}>
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
                                                            defaultImg={require('../../../static/images/add_pic.png')}
                                                            img={url}
                                                            top={15}
                                                            delete={() => this.delete(url)}
                                                        />
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            );
                                        })}
                                    </Flex>
                                </Flex>
                            </ScrollView>

                        </Flex>

                        <Flex justify={'center'} align={'start'} style={{
                            height: 60,
                            backgroundColor: '#eee',
                            width: '100%',
                            flex: 1,
                            paddingTop: 8,
                            paddingBottom: 10,
                            marginTop: ScreenUtil.deviceHeight() - 140,
                            position: 'absolute'
                        }}>
                            <Button
                                style={{
                                    width: 220,
                                    backgroundColor: Macro.work_blue
                                }}
                                type="primary"
                                onPress={() => this.submit()}>确定</Button>
                        </Flex>
                    </View>
                </TouchableWithoutFeedback>
            </CommonView>
        );
    }
}

const mapStateToProps = ({ memberReducer, xunJianReducer }) => {
    return {
        hasNetwork: memberReducer.hasNetwork,
        ...xunJianReducer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveXunJianAction(data) {
            dispatch(saveXunJianAction(data));
        }
    };
};

const styles = StyleSheet.create({
    header: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F3F4F2'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddRepairPage);

