import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    //ScrollView,
} from 'react-native';
import BasePage from '../base/base';
import {Icon} from '@ant-design/react-native';
import {  Flex, TextareaItem, Grid, Button} from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import SelectImage from '../../utils/select-image';
import common from '../../utils/common';
import UDRecord from '../../utils/UDRecord';
import api from '../../utils/api';
import UDPlayer from '../../utils/UDPlayer';
import UDToast from '../../utils/UDToast';
import WorkService from './work-service';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import CommonView from '../../components/CommonView';
import {connect} from 'react-redux';
import {saveXunJianAction} from '../../utils/store/actions/actions';

class AddWorkPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '新增',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),

        };
    };

    constructor(props) {
        super(props);
        const {taskId, address} = common.getValueFromProps(this.props) || {};
        console.log('address', taskId, address);
        console.log(this.props);
        this.state = {
            index: 0,
            data: ['报修', '报事', '巡场'],
            value: '',
            images: [{icon: ''}],
            image: '',
            recording: false,
            id: common.getGuid(),
            fileUrl: null,
            playing: false,
            address,
            canSelectAddress: !address,
            taskId,
            KeyboardShown: false,
        };
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
    }

    componentDidMount(): void {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                console.log('address1', obj);

                if (obj.state.params) {
                    const {address} = obj.state.params.data || {};
                    this.setState({address});
                }


            },
        );
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


    startRecord = () => {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            if (!isAuthorised) {
                this.setState({isAuthorised: false});
            } else {
                this.setState({isAuthorised: true});
            }
            if (!isAuthorised) {
                UDToast.showInfo('录音功能未授权');
            } else {
                if (!this.state.recording) {
                    let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
                    AudioRecorder.prepareRecordingAtPath(audioPath, {
                        SampleRate: 22050,
                        Channels: 1,
                        AudioQuality: 'Low',
                        AudioEncoding: 'aac',
                    });

                    AudioRecorder.onProgress = (data) => {
                        console.log(Math.floor(data.currentTime));
                        // this.setState({currentTime: Math.floor(data.currentTime)});
                    };

                    AudioRecorder.onFinished = (data) => {
                        // Android callback comes in the form of a promise instead.
                        // console.log('finish', data);
                        // if (common.isIOS()) {
                        //     resolve(data.audioFileURL);
                        // }
                        console.log('recond', data);
                        api.uploadFile(data.audioFileURL, this.state.id, '/api/MobileMethod/MUploadServiceDesk', false).then(res => {
                            console.log(res);
                            this.setState({fileUrl: res});
                        }).catch(error => {

                        });
                    };
                    this.recordId = UDToast.showLoading('正在录音中...');
                    this.setState({recording: true}, () => {
                        UDRecord.startRecord();
                    });
                }
            }

        });


    };
    stopRecord = () => {
        if (this.state.isAuthorised && this.state.recording) {
            setTimeout(() => {
                UDToast.hiddenLoading(this.recordId);
                this.setState({recording: false}, () => {
                    UDRecord.stopRecord();
                });
            }, 1000);
        }

    };
    play = () => {
        UDPlayer.play(this.state.fileUrl);
    };


    selectImages = () => {
        SelectImage.select(this.state.id, '/api/MobileMethod/MUploadServiceDesk').then(res => {
            console.log(1122, res);
            let images = [...this.state.images];
            images.splice(images.length - 1, 0, {'icon': res});
            if (images.length > 4) {
                images = images.filter((item, index) => index !== images.length - 1);
            }
            console.log(images);
            this.setState({images});
        }).catch(error => {

        });
    };

    submit = () => {
        if (this.canSubmit === false) {
            return;
        }
        this.canSubmit = false;
        const {id, data, index, address, value,taskId} = this.state;
        if (!address) {
            const title = '请选择' + data[index] + '地址';
            UDToast.showInfo(title);
            return;
        }
        const params = {
            id,
            keyvalue: id,
            source: '员工APP',
            billType: data[index],
            roomId: address.id,
            address: address.allName,
            contents: value,
            isAdd: true,
            taskId: this.state.taskId,
        };

        if (this.props.hasNetwork || !taskId) {
            WorkService.saveForm(params).then(res => {
                UDToast.showInfo('提交成功', true);
                setTimeout(() => {
                    this.canSubmit = true;
                    this.props.navigation.goBack();
                }, 2000);
            }).catch(res => {
                this.canSubmit = true;
            });
        } else {
            const {taskId} = this.state;
            const {xunJianAction} = this.props;
            const data = xunJianAction[taskId];
            console.log(this.props,xunJianAction,taskId,data)
            if (!data) {
                UDToast.showSuccess('数据异常，请关闭app重新进入');
            } else {
                this.props.saveXunJianAction({
                    [taskId]: {
                        ...data,
                        workParams:params,
                    },
                });
                UDToast.showSuccess('已保存，稍后可在我的-设置中同步巡检数据');
            }
        }
    };

    render() {
        const {data, index, images, fileUrl, address, canSelectAddress} = this.state;
        const title = data[index];
        const title2 = '输入' + title + '内容';

        const width = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        const height = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        return (
            <CommonView style={{flex: 1, backgroundColor: 'F3F4F2'}}>
                {/*<ScrollView>*/}
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }}>
                    <View style={{marginTop:this.state.KeyboardShown ? -100 : 0,height:'100%'}}>
                    <Flex direction='column'>
                    <Flex justify='between' style={styles.header}>
                        {data.map((item, i) => (
                            <TouchableWithoutFeedback key={i} onPress={() => this.setState({index: i})}>
                                <Flex justify='center' style={[{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    backgroundColor: '#0325FD',
                                    height: 30,
                                    width: (ScreenUtil.deviceWidth() / 3.0 - 20),
                                    borderRadius: 4,
                                }, index === i && {backgroundColor: '#E67942'}]}>
                                    <Text style={{color: 'white', fontSize: 14}}>{item}</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        ))}
                    </Flex>
                    <Flex>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                if (canSelectAddress) {
                                    this.props.navigation.push('select');
                                }
                            }
                            }>
                            <Flex justify="between" style={[{
                                paddingTop: 15,
                                paddingBottom: 15,
                                marginLeft: 15,
                                marginRight: 15,
                                width: ScreenUtil.deviceWidth() - 30,
                            }, ScreenUtil.borderBottom()]}>
                                <Text style={[address ? {color: '#333', fontSize: 16} : {
                                    color: '#999',
                                    fontSize: 16,
                                }]}>{address ? address.allName : `请选择${title}地址`}</Text>
                                <LoadImage style={{width: 6, height: 11}}
                                           defaultImg={require('../../static/images/address/right.png')}/>
                            </Flex>
                        </TouchableWithoutFeedback>

                    </Flex>

                    <View style={{marginLeft: -15}}>
                        <TextareaItem
                            rows={4}
                            placeholder={title2}
                            autoHeight
                            style={{paddingTop: 15, minHeight: 100, width: ScreenUtil.deviceWidth() - 30}}
                            onChange={value => this.setState({value})}
                            value={this.state.value}
                        />
                    </View>
                    <Flex align={'start'} justify={'start'} style={{
                        paddingTop: 15,
                        paddingBottom: 15,
                        width: ScreenUtil.deviceWidth() - 30,
                    }}>
                        <TouchableOpacity onPressIn={() => this.startRecord()} onPressOut={() => this.stopRecord()}>
                            <LoadImage style={{width: 20, height: 20}}
                                       defaultImg={require('../../static/images/icon_copy.png')}/>
                        </TouchableOpacity>
                        {fileUrl && fileUrl.length > 0 ?
                            <TouchableOpacity onPress={() => this.play()}>
                                <LoadImage style={{width: 20, height: 20, marginLeft: 10}}
                                           defaultImg={require('../../static/images/icon_s.png')}/>
                            </TouchableOpacity>
                            : null}

                    </Flex>
                    <Flex justify={'start'} align={'start'} style={{width: ScreenUtil.deviceWidth()}}>
                        <Flex wrap={'wrap'}>
                            {images.map((item, index) => {
                                return (
                                    <TouchableWithoutFeedback key={index} onPress={() => {
                                        if (index === images.length - 1 && item.icon.length === 0) {
                                            this.selectImages();
                                        }
                                    }}>
                                        <View style={{
                                            paddingLeft: 15,
                                            paddingRight: 5,
                                            paddingBottom: 10,
                                            paddingTop: 10,
                                        }}>
                                            <LoadImage style={{width: width, height: height}}
                                                       defaultImg={require('../../static/images/add_pic.png')}
                                                       img={item.icon}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </Flex>
                    </Flex>
                </Flex>
                <Flex justify={'center'} align={'start'} style={{
                    height: 80,
                    backgroundColor: '#eee',
                    width: '100%',
                    marginTop: 20,
                    flex: 1,
                    paddingTop: 40,
                }}>
                    <Button style={{width: '90%'}} type="primary" onPress={() => this.submit()}>确定</Button>
                    </Flex>
                    </View>
                    </TouchableWithoutFeedback>
                {/*</ScrollView>*/}
            </CommonView>
        );
    }
}

const mapStateToProps = ({memberReducer, xunJianReducer}) => {

    return {
        hasNetwork: memberReducer.hasNetwork,
        ...xunJianReducer,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        saveXunJianAction(data) {
            dispatch(saveXunJianAction(data));
        },

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddWorkPage);


const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F3F4F2',
    },

});
