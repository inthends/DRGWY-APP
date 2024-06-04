//未读消息列表点击打开服务单详情
import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Keyboard,
    Alert
} from 'react-native';
import BasePage from '../../base/base';
import { Icon, Flex, Modal, TextareaItem, Button } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
// import SelectImage from '../../../utils/select-image';
// import UDRecord from '../../../utils/UDRecord';
// import api from '../../../utils/api';
// import UDPlayer from '../../../utils/UDPlayer';
import common from '../../../utils/common';
import UDToast from '../../../utils/UDToast';
import WorkService from '../work-service';
import Communicates from '../../../components/communicates';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';
// import ToRepair from '../../../components/to-repair';

export default class ServiceDeskDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '服务单详情',
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
        this.state = {
            isQD: 0,
            repairmajor: null,
            selectPerson: null,
            id,
            value: '',
            images: [],
            detail: {
            },
            communicates: [],
            lookImageIndex: 0,
            visible: false,
            showRepair: false,
            KeyboardShown: false
        };

        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
    }

    componentDidMount() {

        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (obj.state.params) {
                    const { repairmajor } = obj.state.params.data || {};
                    this.setState({ repairmajor });
                }
            }
        );

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
        WorkService.serviceDetail(id).then(item => {
            this.setState({
                detail: {
                    ...item.data,
                    businessId: item.businessId,
                    statusName: item.statusName
                },
            });
        });
        WorkService.serviceCommunicates(id).then(res => {
            this.setState({
                communicates: res,
            });
        });
        WorkService.serviceExtra(id).then(images => {
            this.setState({
                images
            });
        });
    };

    // click = (handle) => {
    //     const { id, value } = this.state;
    //     if (handle === '回复' && !(value && value.length > 0)) {
    //         UDToast.showInfo('请输入文字');
    //         return;
    //     }
    //     WorkService.serviceHandle(handle, id, value).then(res => {
    //         UDToast.showInfo('操作成功');
    //         this.props.navigation.goBack();
    //     });
    // };

    reply = () => {
        const { id, value } = this.state;
        if (!(value && value.length > 0)) {
            UDToast.showInfo('请输入文字');
            return;
        }
        WorkService.serviceHandle('回复', id, value).then(res => {
            this.props.navigation.goBack();
        }).catch(err => {
            UDToast.showError(err);
        });
    };

    doWork = (handle) => {
        Alert.alert(
            '请确认',
            '是否' + handle + '？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
                    const { id, value } = this.state;
                    WorkService.serviceHandle(handle, id, value).then(res => {
                        this.props.navigation.goBack();
                    }).catch(err => {
                        UDToast.showError(err);
                    });
                }
            }
            ], { cancelable: false });
    };

    roRepair = () => {
        Alert.alert(
            '请确认',
            '是否转维修？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
                    const { id, isQD, selectPerson, repairmajor } = this.state;
                    WorkService.changeToRepair(id,
                        isQD, 
                        selectPerson.id,
                        selectPerson.name,
                        repairmajor.id,
                        repairmajor.name
                    ).then(res => {
                        this.props.navigation.goBack();
                    }).catch(err => {
                        UDToast.showError(err);
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

    onSelectPerson = ({ selectItem }) => {
        this.setState({
            selectPerson: selectItem
        })
    }

    render() {
        const { images, detail, id, communicates, isQD, repairmajor, selectPerson } = this.state;
        const selectImg = require('../../../static/images/select.png');
        const noselectImg = require('../../../static/images/no-select.png');

        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }}>
                    <ScrollView style={{ marginTop: this.state.KeyboardShown ? - 200 : 0, height: '100%' }}>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Text style={styles.left}>{detail.billCode}</Text>
                            <Text style={styles.right}>{detail.billType}</Text>
                        </Flex>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Text style={styles.left}>{detail.address}</Text>
                            <Text style={styles.right}>{detail.statusName}</Text>
                        </Flex>
                        <Text style={[styles.desc]}>{detail.contents}</Text>
                        <ListImages images={images} lookImage={this.lookImage} />
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Text style={styles.left}>紧急：{detail.emergencyLevel}，重要：{detail.importance}</Text>
                        </Flex>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Text style={styles.left}>报单人：{detail.contactName} {detail.createDate}</Text>
                            <TouchableWithoutFeedback onPress={() => common.call(detail.contactPhone)}>
                                <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')}
                                    style={{ width: 18, height: 18 }} /></Flex>
                            </TouchableWithoutFeedback>
                        </Flex>

                        {/* 服务单关联单据，不允许操作 neo 2020年6月26日10:24:45 */}
                        {/* {detail.businessCode ? (
                        <TouchableWithoutFeedback>
                            <Flex style={[styles.every]}>
                                <Text style={styles.left}>关联单：</Text>
                                <Text
                                onPress={()=>{
                                    let item = {
                                        ...detail,
                                        id: detail.businessId
                                    };
                                    switch (detail.statusName) {
                                        case '待派单': {
                                            this.props.navigation.navigate('paidan', {data: item});
                                            break;
                                        }
                                        case '待接单': {
                                            this.props.navigation.navigate('jiedan', {data: item});
                                            break;
                                        }
                                        case '待开工': {
                                            this.props.navigation.navigate('kaigong', {data: item});
                                            break;
                                        }
                                        case '待完成': {
                                            this.props.navigation.navigate('wancheng', {data: item});
                                            break;
                                        }
                                        case '待检验': {
                                            this.props.navigation.navigate('jianyan', {data: item});
                                            break;
                                        }
                                        case '待回访': {
                                            this.props.navigation.navigate('huifang', {data: item});
                                            break;
                                        }
                                        default:
                                            break;
                                    }
                                }}

                                style={[styles.right,{color:Macro.work_blue}]}>{detail.businessCode}</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    ):null} */}

                        {/* <View style={{
                        margin: 15,
                        borderStyle: 'solid',
                        borderColor: '#F3F4F2',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}>
                        <TextareaItem
                            rows={4}
                            placeholder='请输入'
                            style={{ paddingTop: 10, width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={value => this.setState({ value })}
                            value={this.state.value}
                        />
                    </View> */}

                        <View style={{ margin: 15 }}>
                            <TextareaItem
                                rows={4}
                                autoHeight
                                placeholder='请输入'
                                style={{ width: ScreenUtil.deviceWidth() - 32 }}
                                onChange={value => this.setState({ value })}
                                value={this.state.value}
                            />
                        </View>

                        {/* <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <TextInput
                            maxLength={500}
                            placeholder='请输入'
                            multiline
                            onChangeText={value => this.setState({ value })}
                            value={this.state.value}
                            style={{ fontSize: 16, textAlignVertical: 'top' }}
                            numberOfLines={4}>
                        </TextInput>
                    </Flex> */}

                        {/* <TouchableWithoutFeedback onPress={() => this.click('回复')}>
                        <Flex justify={'center'} style={[styles.ii, {
                            width: '60%',
                            marginLeft: '10%', marginRight: '10%', marginBottom: 20
                        },
                        { backgroundColor: Macro.work_blue }]}>
                            <Text style={styles.word}>回复</Text>
                        </Flex>
                    </TouchableWithoutFeedback> */}

                        <Flex justify={'center'}>
                            <Button onPress={() => this.reply()} type={'primary'}
                                activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                    width: 150,
                                    backgroundColor: Macro.work_blue,
                                    marginTop: 10,
                                    marginBottom: 10,
                                    height: 40
                                }}>回复</Button>
                        </Flex>

                        {detail.status === 1 && <Flex>
                            <TouchableWithoutFeedback onPress={() =>
                                //this.click('转维修')
                                this.setState({
                                    serviceDeskId: id,
                                    showRepair: true
                                })
                            }>
                                <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_blue }]}>
                                    <Text style={styles.word}>转维修</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.doWork('转投诉')}>
                                <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_blue }]}>
                                    <Text style={styles.word}>转投诉</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.doWork('关闭')}>
                                <Flex justify={'center'} style={[styles.ii, { backgroundColor: '#666' }]}>
                                    <Text style={styles.word}>关闭</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </Flex>}
                        <Communicates communicateClick={this.communicateClick} communicates={communicates} />
                    </ScrollView>
                </TouchableWithoutFeedback>

                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex}
                        onCancel={this.cancel}
                        onClick={this.cancel}
                        imageUrls={this.state.images} />
                </Modal>


                {this.state.showRepair && (
                    // 转报修
                    <View style={styles.mengceng}>
                        <Flex direction={'column'} justify={'center'} align={'center'}
                            style={{ flex: 1, padding: 25, backgroundColor: 'rgba(178,178,178,0.5)' }}>
                            <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                <CommonView style={{ height: 190, width: 300 }}>

                                    <Flex justify='between' style={[styles.every, ScreenUtil.borderBottom()]}>
                                        <Text style={styles.text}>是否抢单</Text>
                                        <Flex onPress={() => this.setState({ isQD: 1 })}>
                                            <LoadImage style={{ width: 20, height: 20 }}
                                                defaultImg={isQD === 1 ? selectImg : noselectImg} />
                                            <Text style={styles.state}>是</Text>
                                        </Flex>
                                        <Flex style={{ paddingLeft: 10 }} onPress={() => this.setState({ isQD: 0 })}>
                                            <LoadImage style={{ width: 20, height: 20 }}
                                                defaultImg={isQD === 0 ? selectImg : noselectImg} />
                                            <Text style={styles.state}>否</Text>
                                        </Flex>
                                    </Flex>

                                    <TouchableWithoutFeedback
                                        onPress={() => this.props.navigation.navigate('selectRepairMajor', { parentName: 'service' })}>
                                        <Flex justify="between" style={[{
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            marginLeft: 10,
                                            marginRight: 10
                                        }, ScreenUtil.borderBottom()]}>
                                            <Text style={[repairmajor ? { color: '#404145' } :
                                                { color: '#999' }]}>{repairmajor ? repairmajor.name : `请选择维修专业`}</Text>
                                            <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                                        </Flex>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback
                                        onPress={() => this.props.navigation.navigate('selectAllPerson', { onSelect: this.onSelectPerson })}>
                                        <Flex justify='between' style={[{
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            marginLeft: 10,
                                            marginRight: 10,
                                        }, ScreenUtil.borderBottom()]}>
                                            <Text style={[selectPerson ? { fontSize: 16, color: '#404145' } :
                                                { color: '#999' }]}>{selectPerson ? selectPerson.name : "请选择派单人"}</Text>
                                            <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                                        </Flex>
                                    </TouchableWithoutFeedback>
                                </CommonView>
                                <Flex style={{ marginTop: 15 }}>
                                    <Button onPress={this.roRepair} type={'primary'}
                                        activeStyle={{ backgroundColor: Macro.work_blue }}
                                        style={{
                                            width: 110,
                                            backgroundColor: Macro.work_blue,
                                            height: 35
                                        }}>确认</Button>
                                    <Button onPress={() => {
                                        this.setState({ showRepair: false });
                                    }}
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
                    </View>
                )}


            </CommonView>
        );
    }
}

const styles = StyleSheet.create({

    mengceng: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },

    every: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    every2: {
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 5
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
