import React from 'react';
import { View, Text, Button, NativeModules, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import BasePage from '../base/base';
import { Icon } from '@ant-design/react-native';
import { List, WhiteSpace, Flex, TextareaItem, Switch, ActionSheet } from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import Macro from '../../utils/macro';
import ManualAction from '../../utils/store/actions/manual-action';
import MineService from './mine-service';
import { connect } from 'react-redux';
import { savehasNetwork, saveXunJian } from '../../utils/store/actions/actions';
import XunJianService from '../navigator/xunjian/xunjian-service';
import UDToast from '../../utils/UDToast';
import WorkService from '../work/work-service';
import axios from 'axios';
import common from '../../utils/common';

class SettingPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '设置',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),

        };
    };

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            data: ['报修', '报事', '巡场'],
            value: '',
            checked: false,
        };
    }

    // componentDidMount(): void {
    //     console.log('network', this.props);
    // }

    logout = () => {
        this.showActionSheet();
    };

    showActionSheet = () => {
        const BUTTONS = [
            '确认退出',
            '取消',
        ];
        ActionSheet.showActionSheetWithOptions(
            {
                title: '是否退出？',
                message: '退出后将收不到推送消息',
                options: BUTTONS,
                cancelButtonIndex: 1,
                destructiveButtonIndex: -1,
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    MineService.logout();
                    ManualAction.saveTokenByStore(null);
                }
            },
        );
    };

    componentWillUnmount() {

        UDToast.hiddenLoading(this.loading);
    }

    changePrint() {
        NativeModules.LHNToast.changeprint();
    }

    update() {
        //console.log(11, this.props);

        this.loading = UDToast.showLoading('正在同步中...');
        XunJianService.xunjianData(this.props.user.userId, false).then(resp => {
            XunJianService.xunjianIndexList(this.props.user.userId, false).then(res => {
                const items = res.data;

                Promise.all(items.map(item => XunJianService.xunjianIndexDetail(item.lineId).then(res => ({
                    ...item,
                    items: res,
                })))).then(rea => {

                    XunJianService.MGetPollingUserPointTasks().then(r => {
                        UDToast.hiddenLoading(this.loading);
                        const aaa = {
                            allData: resp || {},
                            lists: rea || [],
                            scanLists: r || {},
                        };
                        console.log(1221, aaa);
                        UDToast.showInfo('同步完成');
                        this.props.saveXunjian(aaa);
                    }).catch(err => {
                        UDToast.hiddenLoading(this.loading);
                    });
                }).catch(err => {
                    UDToast.hiddenLoading(this.loading);
                });
            }).catch(err => {
                UDToast.hiddenLoading(this.loading);
            });
        }).catch(err => {
            UDToast.hiddenLoading(this.loading);
        });

    }

    uploadWork(works) {
        return new Promise((resolve, reject) => {
            if (works.length === 0) {
                return resolve();
            } else {
                return Promise.all(works.map(item => WorkService.saveForm(item, false)));
            }
        });
    }

    uploadImages(imageObjs) {
        return new Promise((resolve, reject) => {
            if (imageObjs.length === 0) {
                return resolve();
            } else {
                return Promise.all(imageObjs.map(i => {
                    const { id, images } = i;
                    const formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
                    for (let index = 0; index < images.length; index++) {
                        let img = images[index];
                        let file = { uri: img.icon.fileUri, type: 'multipart/form-data', name: 'picture.png' };   //这里的key(uri和type和name)不能改变,
                        formData.append('Files', file);   //这里的files就是后台需要的key
                    }
                    formData.append('keyvalue', id);
                    console.log('formData', formData);
                    axios.defaults.headers['Content-Type'] = 'multipart/form-data';
                    axios.defaults.headers['Authorization'] = 'Bearer ' + ManualAction.getTokenBYStore();
                    return axios.post('/api/MobileMethod/MUploadPollingTask', formData);
                }));
            }
        });

    }

    uploading() {
        const { xunJianAction } = this.props;
        let xunJians = [];
        let imageObjs = [];
        let works = [];
        for (let taskId in xunJianAction) {
            if (xunJianAction.hasOwnProperty(taskId)) {
                let xunJian = xunJianAction[taskId];
                xunJians.push(xunJian.xunjianParams);
                imageObjs.push({
                    images: xunJian.images,
                    id: xunJian.idForUploadImage,
                });
                if (xunJian.workParams) {
                    works.push(xunJian.workParams);
                }
            }
        }
        if (xunJians.length > 0) {
            this.loading = UDToast.showLoading('正在上传中...');
            Promise.all(xunJians.map(item => {
                const { keyvalue, pointStatus, userId, userName } = item;
                return XunJianService.xunjianExecute(keyvalue, pointStatus, userId, userName, false);
            })).then(res => {
                this.uploadWork(works).then(res => {
                    this.uploadImages(imageObjs).then(res => {
                        UDToast.hiddenLoading(this.loading);
                        UDToast.showSuccess('上传成功');
                    }).catch(reas => {
                        UDToast.hiddenLoading(this.loading);
                        UDToast.showError('上传图片数据失败');
                    });
                }).catch(err => {
                    UDToast.hiddenLoading(this.loading);
                    UDToast.showError('上传工单数据失败');
                });
            }).catch(res => {
                UDToast.hiddenLoading(this.loading);
                UDToast.showError('上传巡检数据失败');
            });
        } else {
            UDToast.showError('没有数据需要上传');
        }
    }

    render() {
        //const { data } = this.state;
        return (
            <View style={{ backgroundColor: '#E8E8E8', flex: 1 }}>
                <List renderHeader={<View style={{ height: 10 }} />}>
                    <List.Item extra={<Switch color='#447FEA' checked={this.state.checked}
                        onChange={checked => this.setState({ checked })} />}>
                        <Flex style={{ height: 40 }}>
                            <Text style={{ color: '#666', fontSize: 16 }}>消息推送</Text>
                        </Flex>
                    </List.Item>
                </List>
                <List renderHeader={<View style={{ height: 10 }} />}>
                    <List.Item extra={<Switch color='#447FEA' checked={this.props.hasNetwork}
                        onChange={checked => this.props.savehasNetwork(checked)} />}>
                        <Flex style={{ height: 40 }}>
                            <Text style={{ color: '#666', fontSize: 16 }}>网络有用</Text>
                        </Flex>
                    </List.Item>
                </List>
                <List renderHeader={<View style={{ height: 10 }} />}>
                    <TouchableWithoutFeedback onPress={() => this.update()}>
                        <List.Item>
                            <Flex style={{ height: 40 }}>
                                <Text style={{ color: '#666', fontSize: 16 }}>同步巡检数据</Text>
                            </Flex>
                        </List.Item>
                    </TouchableWithoutFeedback>
                </List>
                {
                    !common.isIOS() && <List renderHeader={<View style={{ height: 10 }} />}>
                        <TouchableWithoutFeedback onPress={() => this.changePrint()}>
                            <List.Item>
                                <Flex style={{ height: 40 }}>
                                    <Text style={{ color: '#666', fontSize: 16 }}>设置打印机</Text>
                                </Flex>
                            </List.Item>
                        </TouchableWithoutFeedback>
                    </List>
                }
                <List renderHeader={<View style={{ height: 10 }} />}>
                    <TouchableWithoutFeedback onPress={() => this.uploading()}>
                        <List.Item>
                            <Flex style={{ height: 40 }}>
                                <Text style={{ color: '#666', fontSize: 16 }}>上传巡检数据</Text>
                            </Flex>
                        </List.Item>
                    </TouchableWithoutFeedback>
                </List>
                <List renderHeader={<View style={{ height: 10 }} />}>
                    <TouchableWithoutFeedback onPress={() => this.logout()}>
                        <Flex justify={'center'} style={{ height: 50 }}>
                            <Text style={{ color: Macro.work_blue, fontSize: 16 }}>退出登录</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                </List>
            </View>
        );
    }
}

// const styles = StyleSheet.create({
//     all: {
//         backgroundColor: Macro.color_white,
//     },
//     content: {
//         backgroundColor: Macro.color_white,
//         paddingLeft: 20,
//         paddingRight: 20,
//         height: ScreenUtil.contentHeight(),
//     },
//     header: {
//         paddingTop: 30,
//         paddingBottom: 30,
//     },
//     name: {
//         fontSize: 20,
//         color: '#333',

//     },
//     desc: {
//         fontSize: 16,
//         color: '#999',
//         paddingTop: 5,
//     },
//     item: {
//         fontSize: 16,
//         color: '#333',
//     },
// });

const mapStateToProps = ({ memberReducer, xunJianReducer }) => {
    const user = memberReducer.user || {};
    return {
        hasNetwork: memberReducer.hasNetwork,
        user: {
            ...user,
            id: user.userId,
        },
        ...xunJianReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        savehasNetwork(user) {
            dispatch(savehasNetwork(user));
        },
        saveXunjian(data) {
            dispatch(saveXunJian(data));
        },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingPage);

