
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
    FlatList,
    TextInput,
    Platform,
    Alert, CameraRoll,
    ActivityIndicator
} from 'react-native';
import BasePage from '../../base/base';
import { Icon, Flex, TextareaItem, Button, Modal as AntModal } from '@ant-design/react-native';
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
import ActionPopover from '../../../components/action-popover';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import NoDataView from '../../../components/no-data-view'; 

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
            contents: '',//事项
            value: '',//回复内容
            memo: '',//闭单说明
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
            btnList: [],//按钮权限
            //费用明细
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            data: [],
            refreshing: false,//刷新
            loading: false,//加载完成 
            hasMore: true,//更多
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
                this.onRefresh();//刷新费用明细，必须
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
                    linkList: item.linkList,
                    //businessId: item.businessId,
                    statusName: item.statusName
                },
                contents: item.data.contents
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

        this.loadData();

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
        const { id, isQD, selectPerson, repairmajor, convertMemo, contents } = this.state;
        if (contents == '') {
            UDToast.showError('请输入事项');
            return;
        }

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
                        convertMemo,
                        contents
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
        const { id, contents, convertMemo } = this.state;
        if (contents == '') {
            UDToast.showError('请输入事项');
            return;
        }
        Alert.alert(
            '请确认',
            '是否转投诉？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
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
        const { id, isQD,
            selectPerson,
            repairmajor,
            contents,
            continueMemo } = this.state;
        if (contents == '') {
            UDToast.showError('请输入事项');
            return;
        }

        if (repairmajor == null || repairmajor.id == null) {
            UDToast.showError('请选择维修专业');
            return;
        }

        if (selectPerson == null) {
            UDToast.showError('请选择派单人');
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
                        contents,
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


    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1
        }, () => {
            this.loadData(true);
        });
    };

    //费用明细
    loadData = (isRefreshing = false) => {
        if (this.state.loading || (!isRefreshing && !this.state.hasMore)) return;
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const { id, pageIndex, pageSize } = this.state;
        WorkService.serverFeeList(currentPage, pageSize, id).then(res => {
            if (isRefreshing) {
                this.setState({
                    data: res.data,
                    pageIndex: 2,
                    total: res.total
                });
            }
            else {
                this.setState({
                    data: [...this.state.data, ...res.data],
                    pageIndex: pageIndex + 1,
                    hasMore: pageIndex * pageSize < res.total ? true : false,
                    total: res.total
                });
            }
        }).catch(err => UDToast.showError(err)
        ).finally(() => this.setState({ loading: false, refreshing: false }))
    };


    //作废
    doInvalid = (item) => {
        WorkService.checkBillFee(item.id).then((res) => {
            if (res == 0) {
                // Alert.alert(
                //     '请确认',
                //     `您确定要作废${item.feeName}？`,
                //     [{ text: '取消', tyle: 'cancel' },
                //     {
                //         text: '确定',
                //         onPress: () => {
                //             WorkService.invalidDetailForm(item.id).then(res => {
                //                 UDToast.showInfo('作废成功');
                //                 this.loadData();
                //             }).catch(err => {
                //                 UDToast.showError(err);
                //             });
                //         }
                //     }
                //     ], { cancelable: false });

                AntModal.alert(
                    '请确认',
                    `您确定要作废${item.feeName}？`,
                    [
                        {
                            text: '取消', onPress: () => {
                            }, style: 'cancel'
                        },
                        {
                            text: '确定', onPress: () => {
                                WorkService.invalidDetailForm(item.id).then(res => {
                                    UDToast.showInfo('作废成功');
                                    this.loadData();
                                }).catch(err => {
                                    UDToast.showError(err);
                                });
                            }
                        }
                    ]
                )
            }
            else {
                if (res == 1) {
                    UDToast.showError('该费用已经生成了通知单，不允许作废');
                } else if (res == 2) {
                    UDToast.showError('该费用已经生成了减免单，不允许作废');
                } else if (res == 3) {
                    UDToast.showError('该费用已经生成了冲抵单，不允许作废');
                }
                else {
                    UDToast.showError('该费用已经生成了优惠单，不允许作废');
                }
            }
        });
    }

    //推送账单
    send = (item) => {
        AntModal.alert(
            '请确认',
            `您确定要推送${item.feeName}账单？`,
            [
                {
                    text: '取消', onPress: () => {
                    }, style: 'cancel'
                },
                {
                    text: '确定', onPress: () => {
                        WorkService.sendServiceDeskFee(item.id).then(res => {
                            UDToast.showInfo('推送账单成功');
                            this.loadData();
                        }).catch(err => {
                            UDToast.showError(err);
                        });
                    }
                }
            ]
        )
    };

    //退款
    refund = (item) => {
        if (!item.payId) {
            UDToast.showError('非在线支付的费用，无法在线退款');
            return;
        }
        AntModal.alert(
            '请确认',
            `您确定要退款${item.feeName}？`,
            [
                {
                    text: '取消', onPress: () => {
                    }, style: 'cancel'
                },
                {
                    text: '确定', onPress: () => {
                        WorkService.refundForm(item.receiveId, item.payId).then(res => {
                            UDToast.showInfo('退款成功');
                            this.loadData();
                        });
                    }
                }
            ]
        )
    }

    _renderItem = ({ item, index }) => {
        return (
            <Flex
                direction='column' align={'start'}
                style={[styles.card, index % 2 == 0 ? styles.blue : styles.orange]}>
                <Flex justify='between' style={{ width: '100%' }}>
                    <Flex>
                        <Text style={styles.title}>{item.feeName}</Text>
                        {item.status == 0 ? <Text style={styles.statusred}>未收</Text> : <Text style={styles.statusblue}>已收</Text>}
                    </Flex>
                    {item.status == 0 ?
                        <ActionPopover
                            textStyle={{ fontSize: 14 }}
                            //hiddenImage={true}
                            onChange={(title) => {
                                if (title === '作废') {
                                    this.doInvalid(item);
                                } else if (title === '推送') {
                                    if (item.noticeId) {
                                        UDToast.showError('该费用已经推送');
                                        return;
                                    }
                                    this.send(item);
                                }
                            }}
                            titles={['推送', '作废']}
                            visible={true} /> :
                        (item.payStatus && item.payStatus == -1 ? null :
                            <ActionPopover
                                textStyle={{ fontSize: 14 }}
                                //hiddenImage={true}
                                onChange={() => {
                                    this.refund(item);
                                }}
                                titles={['退款']}
                                visible={true} />)
                    }
                </Flex>
                <Flex style={styles.line} />
                <Flex align={'start'} direction={'column'}>
                    <Flex justify='between' style={{ width: '100%', paddingTop: 5, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={{ lineHeight: 20 }}>应收金额：{item.amount}
                            ，减免金额：{item.reductionAmount}
                            ，已收金额：{item.receiveAmount}
                            ，未收金额：{item.lastAmount}</Text>
                    </Flex>

                    <Flex justify='between' style={{ width: '100%', paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15 }}>
                        {item.beginDate ?
                            <Text>{moment(item.beginDate).format('YYYY-MM-DD') + '至' + moment(item.endDate).format('YYYY-MM-DD')}</Text> : null
                        }
                    </Flex>

                    <Flex justify='between' style={{ width: '100%', paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15 }}>
                        <Text>账单是否推送：{item.noticeId ? '是' : '否'} </Text>
                        <Text>是否退款：{item.payStatus && item.payStatus == -1 ? '是' : '否'}</Text>
                    </Flex>

                    {/* <Text style={{
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingBottom: 5,
                        color: '#666'
                    }}>{item.memo}</Text> */}
                </Flex>
            </Flex>
        );
    };

    renderFooter = () => {
        if (!this.state.hasMore && this.state.data.length > 0) {
            return <Text>没有更多数据了</Text>;
        }

        return this.state.loading ? <ActivityIndicator /> : null;
    };


    render() {
        const { images, detail, communicates, operations, isQD, repairmajor, selectPerson, btnList,

            data, refreshing

        } = this.state;
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

                    {detail.linkList && detail.linkList.map(item => (
                        <TouchableWithoutFeedback key={item.id}>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]}>
                                <Text style={styles.left}>关联单：</Text>
                                <Text onPress={() => {
                                    if (detail.businessType === 'Repair') {
                                        this.props.navigation.navigate('weixiuD', { id: item.id });
                                    }
                                    else {
                                        this.props.navigation.navigate('tousuD', { id: item.id });
                                    }
                                }} style={[styles.right, { color: Macro.work_blue }]}>{item.billCode}</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    ))}

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

                    {detail.status === 1 ?
                        <View style={{
                            margin: 15
                        }}>
                            <TextareaItem
                                rows={4}
                                autoHeight
                                maxLength={500}
                                placeholder='请输入事项'
                                onChange={contents => this.setState({ contents })}
                                value={this.state.contents}
                                style={{ width: ScreenUtil.deviceWidth() - 32 }}
                            />
                        </View>
                        : <Text style={styles.desc}>{detail.contents}</Text>}

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>费用明细</Text>
                    </Flex>

                    <FlatList
                        data={data}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item) => 'flatList' + item.id}
                        //必须
                        onEndReachedThreshold={0.1}
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}//下拉刷新
                        onEndReached={this.loadMore}//底部往下拉翻页
                        ListFooterComponent={this.renderFooter}
                        ListEmptyComponent={<NoDataView />}
                    //onMomentumScrollBegin={() => this.canLoadMore = true}
                    />
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
                                        width: 120,
                                        backgroundColor: Macro.work_blue,
                                        marginTop: 10,
                                        marginBottom: 10,
                                        height: 40
                                    }}>回复</Button>
                            </Flex> : null}

                        <Flex justify={'center'}>
                            <Button onPress={() => {
                                this.props.navigation.navigate('feeAdd', {
                                    data: {
                                        billSource: '服务单',
                                        id: detail.roomId,
                                        linkId: detail.id
                                    }
                                });
                            }}
                                type={'primary'}
                                activeStyle={{ backgroundColor: Macro.work_blue }}
                                style={{
                                    width: 120,
                                    backgroundColor: Macro.work_blue,
                                    marginTop: 10,
                                    marginBottom: 10,
                                    marginLeft: 8,
                                    height: 40
                                }}>加费</Button>
                        </Flex>
                    </Flex>

                    <Flex justify={'center'}>
                        {detail.status === 1 && !detail.isRefuse ?//驳回的单子，不需要转单
                            <>
                                {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'torepair')) ?
                                    <Flex justify={'center'}>
                                        <Button onPress={() => {
                                            this.setState({
                                                showRepair: true,
                                                repairmajor: null,
                                                selectPerson: null,
                                                convertMemo: ''
                                            })
                                        }}
                                            type={'primary'}
                                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                                width: 120,
                                                backgroundColor: Macro.work_blue,
                                                marginTop: 10,
                                                marginBottom: 10,
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
                                                width: 120,
                                                backgroundColor: Macro.work_blue,
                                                marginTop: 10,
                                                marginBottom: 10,
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
                                                width: 120,
                                                height: 40,
                                                marginTop: 10,
                                                marginBottom: 10,
                                                marginLeft: 8,
                                                borderWidth: 0,
                                                backgroundColor: Macro.work_red,
                                            }}>闭单</Button>
                                    </Flex> : null}
                            </>
                            : null
                        }

                        {detail.isRefuse ?//驳回后续派
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
                                                width: 120,
                                                backgroundColor: Macro.work_blue,
                                                marginTop: 10,
                                                marginBottom: 10,
                                                height: 40
                                            }}>续派</Button>
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
                                                width: 120,
                                                height: 40,
                                                marginTop: 10,
                                                marginBottom: 10,
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


                {this.state.showMemo && (
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

                {this.state.showClose && (
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
                                            placeholder='请输入闭单说明'
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
                                                    <Text style={[repairmajor ? { fontSize: 16, color: '#404145' } :
                                                        { fontSize: 16, color: '#999' }]}>{repairmajor ? repairmajor.name : `请选择维修专业`}</Text>
                                                    <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                                                </Flex>
                                            </TouchableWithoutFeedback>
                                            <TouchableWithoutFeedback
                                                onPress={() => this.props.navigation.navigate('selectRolePerson', {
                                                    moduleId: 'Repair',
                                                    enCode: 'dispatch',
                                                    organizeId: detail.organizeId,
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

                                            {/* <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                                <TextInput
                                                    maxLength={500}
                                                    placeholder='请输入转单说明'
                                                    multiline
                                                    onChangeText={convertMemo => this.setState({ convertMemo })}
                                                    value={this.state.convertMemo}
                                                    style={{ textAlignVertical: 'top', height: 70 }}
                                                    numberOfLines={4}>
                                                </TextInput>
                                            </Flex> */}
                                            <View style={{ height: 110, width: 300 }}>
                                                <TextareaItem
                                                    rows={4}
                                                    autoHeight
                                                    maxLength={500}
                                                    style={{ height: 100 }}
                                                    placeholder='请输入转单说明'
                                                    onChange={convertMemo => this.setState({ convertMemo })}
                                                    value={this.state.convertMemo}
                                                />
                                            </View>
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
                                                placeholder='请输入转单说明'
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
                                                        { fontSize: 16, color: '#999' }]}>{repairmajor ? repairmajor.name : `请选择维修专业`}</Text>
                                                    <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                                                </Flex>
                                            </TouchableWithoutFeedback>
                                            <TouchableWithoutFeedback
                                                onPress={() => this.props.navigation.navigate('selectRolePerson', {
                                                    moduleId: 'Repair',
                                                    enCode: 'dispatch',
                                                    organizeId: detail.organizeId,
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
                                                    placeholder='请输入派单说明'
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
                        imageUrls={this.state.images}
                        menuContext={{ "saveToLocal": "保存到相册", "cancel": "取消" }}
                        onSave={(url) => this.savePhoto(url)}
                    />
                </Modal>

            </CommonView >
        );
    }
}

const styles = StyleSheet.create({

    list: {
        backgroundColor: Macro.color_white,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },

    card: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#c8c8c8',
        borderBottomColor: '#c8c8c8',
        borderRightColor: '#c8c8c8',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: { h: 10, w: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.8
    },

    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5,
    },

    orange: {
        borderLeftColor: Macro.work_orange,
        borderLeftWidth: 5,
    },

    title: {
        paddingTop: 10,
        color: '#404145',
        fontSize: 14,
        paddingBottom: 5,
        marginLeft: 15,
        marginRight: 15
    },

    statusred: {
        paddingTop: 10,
        marginRight: 15,
        paddingBottom: 5,
        color: Macro.work_red
    },

    statusblue: {
        paddingTop: 10,
        marginRight: 15,
        paddingBottom: 5,
        color: Macro.work_blue
    },

    line: {
        width: ScreenUtil.deviceWidth() - 30 - 10 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1
    },

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
    }
}); 
