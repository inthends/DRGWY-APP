
import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Keyboard,
    Modal,
    TextInput,
    Alert
} from 'react-native';
import BasePage from '../../base/base';
import { Icon, Flex, TextareaItem, Button } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
import UDToast from '../../../utils/UDToast';
import WorkService from '../work-service';
import Communicates from '../../../components/communicates';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import OperationRecords from '../../../components/operationrecords';
import ImageViewer from 'react-native-image-zoom-viewer';
import Star from '../../../components/star';

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
        let id = common.getValueFromProps(this.props, 'id');
        this.state = {
            isQD: 0,
            repairmajor: null,
            selectPerson: null,
            id,
            value: '',
            memo: '',
            showMemo: false,//弹出回复页面

            images: [],
            detail: {
            },
            communicates: [],
            operations: [],
            lookImageIndex: 0,
            visible: false,
            showRepair: false,//转单
            convertMemo: '',//转单说明
            showComplaint: false,//转投诉
            showClose: false,//闭单备注

            showContinue: false,//续派
            continueMemo: '',//续派说明

            KeyboardShown: false,
            btnList: []//按钮权限
        };

        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (obj.state.params.repairmajor) {
                    const { repairmajor } = obj.state.params.repairmajor || {};
                    this.setState({ repairmajor });
                }
            }
        );

        //获取按钮权限 
        WorkService.getButtonList().then(btnList => {
            this.setState({ btnList });
        });

        this.getData();
    }

    //add new
    componentWillMount() {
        //注册鼠标事件，用于文本框输入的时候往上移动 2024年5月23日
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            this.setState({
                KeyboardShown: true
            });
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({
                KeyboardShown: false
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
            //console.log('item.data',item.data);
            this.setState({
                detail: {
                    ...item.data,
                    isRefuse: item.isRefuse,
                    //businessId: item.businessId,
                    statusName: item.statusName
                }
                // repairmajor: {
                //     id: item.repairMajorId,
                //     name: item.repairMajor,
                // },
                // isQD: item.isQD,//设置默认值0
                // selectPerson: {
                //     id: item.senderId,
                //     name: item.senderName
                // }
            });


            if (item.isQD) {
                this.setState({ isQD: item.isQD });
            }

            if (item.repairMajorId) {
                this.setState({
                    repairmajor: {
                        id: item.repairMajorId,
                        name: item.repairMajor,
                    }
                });
            }

            if (item.senderId) {
                this.setState({
                    selectPerson: {
                        id: item.senderId,
                        name: item.senderName
                    }
                });
            }
        });

        WorkService.serviceCommunicates(id).then(res => {
            this.setState({
                communicates: res
            });
        });

        WorkService.serviceOperations(id).then(res => {
            this.setState({
                operations: res
            });
        });

        WorkService.serviceExtra(id).then(images => {
            this.setState({
                images
            });
        });
    };

    reply = () => {
        const { id, value } = this.state;
        if (!(value && value.length > 0)) {
            UDToast.showError('请输入回复内容');
            return;
        }
        WorkService.serviceHandle('回复', id, value).then(res => {
            this.props.navigation.goBack();
        }).catch(err => {
            UDToast.showError(err);
        });
    };

    doWork = (handle) => {
        const { id, memo } = this.state;
        if (!(memo && memo.length > 0)) {
            UDToast.showError('请输入说明');
            return;
        }

        Alert.alert(
            '请确认',
            '是否' + handle + '？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {

                    WorkService.serviceHandle(handle, id, memo).then(res => {
                        this.props.navigation.goBack();
                    }).catch(err => {
                        UDToast.showError(err);
                    });
                }
            }
            ], { cancelable: false });
    };

    toRepair = () => {
        const { id, isQD, selectPerson, repairmajor, convertMemo } = this.state;
        if (repairmajor == null || repairmajor.id == null) {
            UDToast.showError('请选择维修专业');
            return;
        }
        // if (isQD == 1 && selectPerson == null) {
        //     UDToast.showError('请选择派单人');
        //     return;
        // }

        if (selectPerson == null || selectPerson.id == null) {
            UDToast.showError('请选择派单人');
            return;
        }

        Alert.alert(
            '请确认',
            '是否转维修？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
                    WorkService.changeToRepair(
                        id,
                        isQD,
                        senderId = selectPerson ? selectPerson.id : null,
                        senderName = selectPerson ? selectPerson.name : null,
                        repairmajor.id,
                        repairmajor.name,
                        convertMemo
                    ).then(res => {
                        this.props.navigation.goBack();
                    }).catch(err => {
                        UDToast.showError(err);
                    });
                }
            }
            ], { cancelable: false });
    };


    //转投诉
    toComplaint = () => {
        Alert.alert(
            '请确认',
            '是否转投诉？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
                    const { id, convertMemo } = this.state;
                    WorkService.changeToComplaint(id, convertMemo).then(res => {
                        this.props.navigation.goBack();
                    }).catch(err => {
                        UDToast.showError(err);
                    });
                }
            }
            ], { cancelable: false });
    };


    //续派
    toContinue = () => {
        const { id, isQD, selectPerson, repairmajor, continueMemo } = this.state;
        if (repairmajor == null || repairmajor.id == null) {
            UDToast.showError('请选择维修专业');
            return;
        }

        if (selectPerson == null) {
            UDToast.showError('请选择派单人');
            return;
        }

        if (continueMemo == '') {
            UDToast.showError('请输入说明');
            return;
        }

        Alert.alert(
            '请确认',
            '是否续派？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
                    WorkService.continueRepair(
                        id,
                        isQD,
                        senderId = selectPerson ? selectPerson.id : null,
                        senderName = selectPerson ? selectPerson.name : null,
                        repairmajor.id,
                        repairmajor.name,
                        continueMemo
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

    operationClick = (i) => {
        let c = this.state.operations;
        let d = c.map(it => {
            if (it.id === i.id) {
                it.show = i.show !== true;
            }
            return it;
        });
        this.setState({
            operations: d
        });
    };

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
        const { images, detail, communicates, operations, isQD, repairmajor, selectPerson, btnList } = this.state;
        const selectImg = require('../../../static/images/select.png');
        const noselectImg = require('../../../static/images/no-select.png');
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView style={{ marginTop: this.state.KeyboardShown ? - 200 : 0, height: '100%' }}>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.billType}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>单据状态：{detail.statusName}</Text>
                    </Flex>

                    <Flex style={[styles.every3, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.address}</Text>
                    </Flex>

                    <Text style={[styles.desc]}>{detail.contents}</Text>
                    <ListImages images={images} lookImage={this.lookImage} />
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>紧急程度：{detail.emergencyLevel}</Text>
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.right}>重要程度：{detail.importance}</Text>
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>报单人：{detail.contactName} </Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.contactPhone)}>
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')}
                                style={{ width: 18, height: 18 }} /></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>报单时间：{detail.createDate}</Text>
                    </Flex>

                    {detail.returnVisitDate ?
                        <>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>回访时间：{detail.returnVisitDate}</Text>
                            </Flex>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>回访人：{detail.returnVisiterName}</Text>
                            </Flex>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.right}>回访方式：{detail.returnVisitMode}</Text>
                            </Flex>
                            <Star star={detail.custEvaluate} />
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>回访结果：{detail.returnVisitResult}</Text>
                            </Flex>
                        </>
                        : null
                    }

                    {detail.testDate ?
                        <>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验时间：{detail.testDate}</Text>
                            </Flex>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验人：{detail.testerName}</Text>
                                <Text style={styles.right}>检验结果：{detail.testResult == 1 ? '合格' : '不合格'}</Text>
                            </Flex>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验说明：{detail.testRemark}</Text>
                            </Flex>
                        </>
                        : null
                    }

                    {/* {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'reply')) ?
                        <>
                            <View style={{ margin: 15 }}>
                                <TextareaItem
                                    rows={4}
                                    autoHeight
                                    maxLength={500}
                                    placeholder='请输入回复内容'
                                    style={{ width: ScreenUtil.deviceWidth() - 32 }}
                                    onChange={value => this.setState({ value })}
                                    value={this.state.value}
                                />
                            </View>
                            <Flex justify={'center'}>
                                <Button onPress={() => this.reply()} type={'primary'}
                                    activeStyle={{ backgroundColor: Macro.work_blue }}
                                    style={{
                                        width: 110,
                                        backgroundColor: Macro.work_blue,
                                        marginTop: 10,
                                        marginBottom: 10,
                                        height: 40
                                    }}>回复</Button>
                            </Flex></> : null}
                             */}


                    <Flex justify={'center'}>
                        {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'reply')) ?
                            <Flex justify={'center'}>
                                <Button onPress={() => {
                                    this.setState({
                                        showMemo: true,
                                        value: ''
                                    })
                                }}
                                    type={'primary'}
                                    activeStyle={{ backgroundColor: Macro.work_blue }}
                                    style={{
                                        width: 88,
                                        backgroundColor: Macro.work_blue,
                                        marginTop: 10, 
                                        marginBottom: 10,
                                        height: 40
                                    }}>回复</Button>
                            </Flex> : null}

                        {detail.status === 1 && !detail.isRefuse ?
                            <>
                                {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'torepair')) ?
                                    <Flex justify={'center'}>
                                        <Button onPress={() => {
                                            this.setState({
                                                showRepair: true,
                                                convertMemo: ''
                                            })
                                        }}
                                            type={'primary'}
                                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                                width: 88,
                                                backgroundColor: Macro.work_blue,
                                                height: 40, 
                                                marginLeft: 8
                                            }}>转维修</Button>
                                    </Flex> : null}

                                {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'tocomplaint')) ?
                                    <Flex justify={'center'}>
                                        <Button onPress={() =>
                                            this.setState({
                                                showComplaint: true,
                                                convertMemo: ''
                                            })

                                        } type={'primary'}
                                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                                width: 88,
                                                backgroundColor: Macro.work_blue,
                                                height: 40, 
                                                marginLeft: 8
                                            }}>转投诉</Button>
                                    </Flex> : null}

                                {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'close')) ?
                                    <Flex justify={'center'}>
                                        <Button onPress={() => {
                                            this.setState({
                                                memo: '',
                                                showClose: true
                                            })
                                        }}
                                            type={'primary'}
                                            activeStyle={{ backgroundColor: Macro.work_red }}
                                            style={{
                                                width: 88,
                                                height: 40, 
                                                marginLeft: 8,
                                                borderWidth: 0,
                                                backgroundColor: Macro.work_red,
                                            }}>闭单</Button>
                                    </Flex> : null}
                            </>
                            : null
                        }

                        {detail.isRefuse ? 
                            <>
                            {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'continue')) ?
                                <Flex justify={'center'}>
                                    <Button onPress={() => {
                                        this.setState({
                                            showContinue: true,
                                            continueMemo: ''
                                        })
                                    }}
                                        type={'primary'}
                                        activeStyle={{ backgroundColor: Macro.work_blue }}
                                        style={{
                                            width: 88, 
                                            backgroundColor: Macro.work_blue,
                                            height: 40,
                                            marginLeft: 8
                                        }}>续派</Button>
                                </Flex>: null}

                                {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'close')) ?
                                    <Flex justify={'center'}>
                                        <Button onPress={() => {
                                            this.setState({
                                                memo: '',
                                                showClose: true
                                            })
                                        }}
                                            type={'primary'}
                                            activeStyle={{ backgroundColor: Macro.work_red }}
                                            style={{
                                                width: 88,
                                                height: 40, 
                                                marginLeft: 8,
                                                borderWidth: 0,
                                                backgroundColor: Macro.work_red,
                                            }}>闭单</Button>
                                    </Flex> : null}
                                    </> 
                            : null
                        }
                    </Flex>
                    <Communicates communicateClick={this.communicateClick} communicates={communicates} />
                    <OperationRecords communicateClick={this.operationClick} communicates={operations} />
                </ScrollView>
                {
                    this.state.showMemo && (
                        //回复
                        <View style={styles.mengceng}>
                            <TouchableWithoutFeedback onPress={() => {
                                Keyboard.dismiss();
                            }}>
                                <Flex direction={'column'} justify={'center'} align={'center'}
                                    style={{
                                        flex: 1, padding: 25,
                                        backgroundColor: 'rgba(178,178,178,0.5)'
                                    }}>
                                    <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                        <View style={{ height: 110, width: 300 }}>
                                            <TextareaItem
                                                rows={4}
                                                autoHeight
                                                maxLength={500}
                                                style={{ height: 100 }}
                                                placeholder='请输入回复内容'
                                                onChange={value => this.setState({ value })}
                                                value={this.state.value}
                                            />
                                        </View>
                                        <Flex style={{ marginTop: 15 }}>
                                            <Button onPress={this.reply} type={'primary'}
                                                activeStyle={{ backgroundColor: Macro.work_blue }}
                                                style={{
                                                    width: 120,
                                                    backgroundColor: Macro.work_blue,
                                                    height: 35
                                                }}>确认</Button>

                                            <Button onPress={() => {
                                                this.setState({ showMemo: false });
                                            }}
                                                type={'primary'}
                                                activeStyle={{ backgroundColor: Macro.work_blue }}
                                                style={{
                                                    marginLeft: 30,
                                                    width: 120,
                                                    backgroundColor: '#666',
                                                    borderWidth: 0,
                                                    height: 35
                                                }}>取消</Button>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </View>
                    )
                }

                {
                    this.state.showClose && (
                        //闭单
                        <View style={styles.mengceng}>
                            <TouchableWithoutFeedback onPress={() => {
                                Keyboard.dismiss();
                            }}>
                                <Flex direction={'column'} justify={'center'} align={'center'}
                                    style={{
                                        flex: 1, padding: 25,
                                        backgroundColor: 'rgba(178,178,178,0.5)'
                                    }}>
                                    <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                        <View style={{ height: 110, width: 300 }}>
                                            <TextareaItem
                                                rows={4}
                                                autoHeight
                                                maxLength={500}
                                                style={{ height: 100 }}
                                                placeholder='请输入说明'
                                                onChange={memo => this.setState({ memo })}
                                                value={this.state.memo}
                                            />
                                        </View>
                                        <Flex style={{ marginTop: 15 }}>
                                            <Button onPress={() => this.doWork('闭单')} type={'primary'}
                                                activeStyle={{ backgroundColor: Macro.work_blue }}
                                                style={{
                                                    width: 120,
                                                    backgroundColor: Macro.work_blue,
                                                    height: 35
                                                }}>确认</Button>

                                            <Button onPress={() => {
                                                this.setState({ showClose: false });
                                            }}
                                                type={'primary'}
                                                activeStyle={{ backgroundColor: Macro.work_blue }}
                                                style={{
                                                    marginLeft: 30,
                                                    width: 120,
                                                    backgroundColor: '#666',
                                                    borderWidth: 0,
                                                    height: 35
                                                }}>取消</Button>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </View>
                    )
                }

                {
                    this.state.showRepair && (
                        //转维修
                        <View style={styles.mengceng}>
                            <TouchableWithoutFeedback onPress={() => {
                                Keyboard.dismiss();
                            }}>
                                <Flex direction={'column'} justify={'center'} align={'center'}
                                    style={{ flex: 1, padding: 25, backgroundColor: 'rgba(178,178,178,0.5)' }}>
                                    <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                        <CommonView style={{ height: 260, width: 300 }}>
                                            <Flex justify='between' style={[styles.every, ScreenUtil.borderBottom()]}>
                                                <Text style={styles.text}>是否抢单</Text>
                                                <Flex onPress={() => this.setState({ isQD: 1 })}>
                                                    <LoadImage style={{ width: 18, height: 18 }}
                                                        defaultImg={isQD === 1 ? selectImg : noselectImg} />
                                                    <Text style={styles.state}> 是</Text>
                                                </Flex>
                                                <Flex style={{ paddingLeft: 10 }} onPress={() => this.setState({ isQD: 0 })}>
                                                    <LoadImage style={{ width: 18, height: 18 }}
                                                        defaultImg={isQD === 0 ? selectImg : noselectImg} />
                                                    <Text style={styles.state}> 否</Text>
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
                                                onPress={() => this.props.navigation.navigate('selectRolePerson', {
                                                    moduleId: 'Repair',
                                                    enCode: 'dispatch',
                                                    onSelect: this.onSelectPerson
                                                })}>
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

                                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                                <TextInput
                                                    maxLength={500}
                                                    placeholder='请输入说明'
                                                    multiline
                                                    onChangeText={convertMemo => this.setState({ convertMemo })}
                                                    value={this.state.convertMemo}
                                                    style={{ textAlignVertical: 'top', height: 70 }}
                                                    numberOfLines={4}>
                                                </TextInput>
                                            </Flex>

                                        </CommonView>
                                        <Flex style={{ marginTop: 15 }}>
                                            <Button onPress={this.toRepair} type={'primary'}
                                                activeStyle={{ backgroundColor: Macro.work_blue }}
                                                style={{
                                                    width: 120,
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
                                                    width: 120,
                                                    backgroundColor: '#666',
                                                    borderWidth: 0,
                                                    height: 35
                                                }}>取消</Button>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </View>
                    )
                }

                {
                    this.state.showComplaint && (
                        //转投诉
                        <View style={styles.mengceng}>
                            <TouchableWithoutFeedback onPress={() => {
                                Keyboard.dismiss();
                            }}>
                                <Flex direction={'column'} justify={'center'} align={'center'}
                                    style={{
                                        flex: 1, padding: 25,
                                        backgroundColor: 'rgba(178,178,178,0.5)'
                                    }}>
                                    <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                        <View style={{ height: 110, width: 300 }}>
                                            <TextareaItem
                                                rows={4}
                                                autoHeight
                                                maxLength={500}
                                                style={{ height: 100 }}
                                                placeholder='请输入说明'
                                                onChangeText={convertMemo => this.setState({ convertMemo })}
                                                value={this.state.convertMemo}
                                            />
                                        </View>
                                        <Flex style={{ marginTop: 15 }}>
                                            <Button onPress={this.toComplaint} type={'primary'}
                                                activeStyle={{ backgroundColor: Macro.work_blue }}
                                                style={{
                                                    width: 125,
                                                    backgroundColor: Macro.work_blue,
                                                    height: 35
                                                }}>确认</Button>

                                            <Button onPress={() => {
                                                this.setState({ showComplaint: false });
                                            }}
                                                type={'primary'}
                                                activeStyle={{ backgroundColor: Macro.work_blue }}
                                                style={{
                                                    marginLeft: 30,
                                                    width: 125,
                                                    backgroundColor: '#666',
                                                    borderWidth: 0,
                                                    height: 35
                                                }}>取消</Button>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </View>
                    )
                }

                {
                    this.state.showContinue && (
                        //续派
                        <View style={styles.mengceng}>
                            <TouchableWithoutFeedback onPress={() => {
                                Keyboard.dismiss();
                            }}>
                                <Flex direction={'column'} justify={'center'} align={'center'}
                                    style={{ flex: 1, padding: 25, backgroundColor: 'rgba(178,178,178,0.5)' }}>
                                    <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                        <CommonView style={{ height: 260, width: 300 }}>
                                            <Flex justify='between' style={[styles.every, ScreenUtil.borderBottom()]}>
                                                <Text style={styles.text}>是否抢单</Text>
                                                <Flex onPress={() => this.setState({ isQD: 1 })}>
                                                    <LoadImage style={{ width: 18, height: 18 }}
                                                        defaultImg={isQD === 1 ? selectImg : noselectImg} />
                                                    <Text style={styles.state}> 是</Text>
                                                </Flex>
                                                <Flex style={{ paddingLeft: 10 }} onPress={() => this.setState({ isQD: 0 })}>
                                                    <LoadImage style={{ width: 18, height: 18 }}
                                                        defaultImg={isQD === 0 ? selectImg : noselectImg} />
                                                    <Text style={styles.state}> 否</Text>
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
                                                onPress={() => this.props.navigation.navigate('selectRolePerson', {
                                                    moduleId: 'Repair',
                                                    enCode: 'dispatch',
                                                    onSelect: this.onSelectPerson
                                                })}>
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

                                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                                <TextInput
                                                    maxLength={500}
                                                    placeholder='请输入说明'
                                                    multiline
                                                    onChangeText={continueMemo => this.setState({ continueMemo })}
                                                    value={this.state.continueMemo}
                                                    style={{ textAlignVertical: 'top', height: 70 }}
                                                    numberOfLines={4}>
                                                </TextInput>
                                            </Flex>

                                        </CommonView>
                                        <Flex style={{ marginTop: 15 }}>
                                            <Button onPress={this.toContinue} type={'primary'}
                                                activeStyle={{ backgroundColor: Macro.work_blue }}
                                                style={{
                                                    width: 125,
                                                    backgroundColor: Macro.work_blue,
                                                    height: 35
                                                }}>确认</Button>
                                            <Button onPress={() => {
                                                this.setState({ showContinue: false });
                                            }}
                                                type={'primary'}
                                                activeStyle={{ backgroundColor: Macro.work_blue }}
                                                style={{
                                                    marginLeft: 30,
                                                    width: 125,
                                                    backgroundColor: '#666',
                                                    borderWidth: 0,
                                                    height: 35
                                                }}>取消</Button>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </TouchableWithoutFeedback>
                        </View>
                    )
                }


                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex}
                        onCancel={this.cancel}
                        onClick={this.cancel}
                        imageUrls={this.state.images} />
                </Modal>

            </CommonView >
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

    every3: {

        lineHeight: 20,//必须，否则显示不全
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15,
        paddingBottom: 15
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
        lineHeight: 20,//必须，否则显示不全
        fontSize: 15,
        //color: '#404145',
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15
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
