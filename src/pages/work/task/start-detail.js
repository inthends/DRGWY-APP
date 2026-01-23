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
    Keyboard,
    CameraRoll,
    FlatList
} from 'react-native';
import BasePage from '../../base/base';
import { Icon, Flex, Button, TextareaItem } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
import UDToast from '../../../utils/UDToast';
import WorkService from '../work-service';
import UploadImageView from '../../../components/upload-image-view';
import OperationRecords from '../../../components/operationrecords';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import ActionPopover from '../../../components/action-popover';

export default class StartDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '开始维修',
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
        let id = common.getValueFromProps(this.props, 'id');//维修单
        //let type = common.getValueFromProps(this.props, 'type');
        this.state = {
            id,
            value: '',
            preimages: [],
            images: [],//开工照片
            isUpload: false,//是否上传了图片
            detail: {},
            communicates: [],
            lookImageIndex: 0,
            visible: false,
            backMemo: '',
            showClose: false,
            KeyboardShown: false,
            selectPersons: [],
            isMustStartFile: false,
            isMustJudgement: false,

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
        this.getData();
        WorkService.getSetting('isMustStartFile').then(res => {
            this.setState({ isMustStartFile: res });
        });

        //故障判断是否必填
        WorkService.getSetting('isMustJudgement').then(res => {
            this.setState({ isMustJudgement: res });
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
        //查看维修单
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
                value: detail.entity.faultJudgement,
                //增援人赋值
                selectPersons: detail.selectPersons
            });

            //根据不同单据类型获取附件作为维修前图片
            WorkService.workPreFiles(detail.entity.sourceType, detail.relationId).then(preimages => {
                this.setState({
                    preimages
                });
            });

            //获取开工照片
            WorkService.weixiuExtra(id).then(allimages => {
                const images = allimages.filter(t => t.type === '开工') || [];
                if (images.length > 0) {
                    this.setState({
                        isUpload: true
                    });
                }
                this.setState({
                    images
                });
            });

            //获取维修单的单据动态
            WorkService.getOperationRecord(id).then(res => {
                this.setState({
                    communicates: res
                });
            });

            this.loadData();
        });

        // WorkService.weixiuExtra(id).then(images => {
        //     this.setState({
        //         images
        //     });
        // });
    };

    click = () => {
        const { id, isUpload, images, value, isMustStartFile, isMustJudgement, selectPersons } = this.state;

        WorkService.checkStartWork(id).then(res => {
            if (res == true) {
                UDToast.showError('维修人员有开工没有完成的维修单，不允许再开工新的维修单');
                return;
            }

            //判断协助人是否都已经加入，如果没有加入，则弹出提示
            WorkService.checkAssistUser(id).then(res => {
                if (res.flag == false) {
                    UDToast.showError(res.msg);
                    return;
                }

                // if (handle === '回复' && !(value&&value.length > 0)) {
                if (!(value && value.length > 0) && isMustJudgement == true) {
                    UDToast.showError('请输入故障判断');
                    return;
                }

                //const kgimages = images.filter(t => t.type === '开工');
                if (images.length == 0 && !isUpload && isMustStartFile == true) {
                    UDToast.showError('请上传开工图片');
                    return;
                }

                let personIds = selectPersons.map(item => item.id);
                let reinforceId = personIds && personIds.length > 0 ? JSON.stringify(personIds) : '';
                WorkService.startRepair(id, value, reinforceId).then(res => {
                    UDToast.showInfo('操作成功');
                    this.props.navigation.goBack();
                });
            });
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

    //选择增援人
    onSelectPerson = ({ selectItems }) => {
        //要过滤已经选择了的人员
        const { selectPersons } = this.state;
        //去除原队列已存在数据  
        for (var i = 0; i < selectPersons.length; i++) {
            for (var j = 0; j < selectItems.length; j++) {
                if (selectItems[j].id == selectPersons[i].id) {
                    selectItems.splice(j, 1);//移除
                    j = j - 1;
                }
            }
        }
        let list = [...selectPersons, ...selectItems];//合并数组
        this.setState({
            selectPersons: list
        })
    }

    //费用明细
    loadData = (isRefreshing = false) => {
        if (this.state.loading || (!isRefreshing && !this.state.hasMore)) {
            this.setState({ loading: false, refreshing: false });
            return;
        }
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const { data, detail, pageSize } = this.state;
        //服务单id
        WorkService.serverFeeList(currentPage, pageSize, detail.relationId).then(res => {
            if (isRefreshing) {
                this.setState({
                    data: res.data,
                    pageIndex: 2,
                    total: res.total
                });
            }
            else {
                //合并并去重 使用 reduce
                const combinedUniqueArray = [...data, ...res.data].reduce((acc, current) => {
                    if (!acc.some(item => item.id === current.id)) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                this.setState({
                    data: combinedUniqueArray,
                    pageIndex: currentPage,
                    hasMore: currentPage * pageSize < res.total ? true : false,
                    total: res.total
                });
            }
        }).catch(err => UDToast.showError(err.msg)
        ).finally(() => this.setState({ loading: false, refreshing: false }))
    };


    //刷新
    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1
        }, () => {
            this.loadData(true);
        });
    };

    //加载更多
    loadMore = () => {
        if (this.state.loading) return;//防止快速滚动，产生抖动，多次调用
        const { pageIndex } = this.state;
        this.setState({
            pageIndex: pageIndex + 1
        }, () => {
            this.loadData();
        });
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
                //                 UDToast.showError(err.msg);
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
                                    UDToast.showError(err.msg);
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
                            UDToast.showError(err.msg);
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
                    <Text style={styles.title}>{item.feeName}</Text>
                    <Flex>
                        {item.status == 0 ? <Text style={styles.statusred}>未收</Text> : <Text style={styles.statusblue}>已收</Text>}
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
                </Flex>

                <Flex style={styles.line} />
                <Flex align={'start'} direction={'column'}>
                    <Flex justify='between' style={{ width: '100%', paddingTop: 5, paddingLeft: 10 }}>
                        <Text style={{ lineHeight: 20 }}>应收金额：{item.amount}
                            ，减免金额：{item.reductionAmount}
                            ，已收金额：{item.receiveAmount}
                            ，未收金额：{item.lastAmount}</Text>
                    </Flex>
                    <Flex justify='between' style={{ width: '100%', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>
                        {item.beginDate ?
                            <Text>计费期间：{moment(item.beginDate).format('YYYY-MM-DD') + ' 至 ' + moment(item.endDate).format('YYYY-MM-DD')}</Text> : null
                        }
                    </Flex>
                    <Flex justify='between' style={{ width: '100%', paddingBottom: 5, paddingLeft: 10 }}>
                        <Text>账单是否推送：{item.noticeId ? '是' : '否'}，是否退款：{item.payStatus && item.payStatus == -1 ? '是' : '否'}</Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    };


    render() {
        const {
            preimages,
            detail,
            communicates,
            selectPersons,
            data,
            refreshing,
            total
        } = this.state;

        // let personNames = selectPersons.map(item => {
        //     return item.name;
        // });
        // let mystrNames =  personNames

        //转换name
        let personNames = selectPersons.map(item => item.name);
        let mystrNames = personNames.join('，');

        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView style={{ marginTop: this.state.KeyboardShown ? - 200 : 0, height: '100%' }}>

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
                        <Text style={styles.left}>重要程度：{detail.importance}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>是否有偿：{detail.isPaid}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>预约维修时间：{detail.reservationTime}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>转单人：{detail.createUserName}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>转单时间：{detail.createDate}</Text>
                    </Flex>

                    <TouchableWithoutFeedback>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]}>
                            <Text style={styles.left}>关联单据：</Text>
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

                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('selectRolePersonMulti', {
                            moduleId: 'Repair',
                            enCode: 'receive',
                            onSelect: this.onSelectPerson,
                            exceptUserId: detail.receiverId//要过滤掉的接单人
                        })}>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Flex>
                                <Text style={styles.left}>增援人：</Text>
                                <Text
                                    style={[styles.right, mystrNames ? { color: Macro.work_blue } : { color: '#666' }]}>{mystrNames ? mystrNames : "请选择增援人"}</Text>
                            </Flex>
                            <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                        </Flex>
                    </TouchableWithoutFeedback>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>费用明细</Text>
                    </Flex>

                    <FlatList
                        data={data}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item) => 'flatList' + item.id}
                        //必须
                        onEndReachedThreshold={0.2}
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}//下拉刷新
                        onEndReached={this.loadMore}//底部往下拉翻页 
                        ListEmptyComponent={
                            <Flex justify={'center'}>
                                <Text style={{ fontSize: 14, color: '#666', paddingTop: 24, paddingBottom: 15 }}>暂无数据</Text>
                            </Flex>}
                    />
                    <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {data.length}, 共 {total} 条</Text>

                    <UploadImageView
                        style={{ marginTop: 10 }}
                        linkId={this.state.id}
                        reload={this.reload}
                        type='开工'
                    />

                    <View style={{ margin: 15 }}>
                        <TextareaItem
                            rows={4}
                            autoHeight
                            placeholder='请输入故障判断'
                            style={{ width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={value => this.setState({ value })}
                            value={this.state.value}
                            maxLength={500}
                        />
                    </View>

                    {/* <Flex justify={'center'} style={{ marginTop: 20 }}>
                        <TouchableWithoutFeedback onPress={() => this.click()}>
                            <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_blue }]}>
                                <Text style={styles.word}>开始维修</Text>
                            </Flex>
                        </TouchableWithoutFeedback> 
                        <TouchableWithoutFeedback onPress={() => {
                            this.setState({
                                backMemo: '',
                                showClose: true
                            })
                        }}
                        >
                            <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_red }]}>
                                <Text style={styles.word}>退单</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex> */}


                    <Flex justify={'center'}>
                        <Button onPress={this.click} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 115,
                                backgroundColor: Macro.work_blue,
                                marginTop: 20,
                                height: 40
                            }}>开始维修</Button>

                        <Button onPress={() => this.setState({
                            backMemo: '',
                            showClose: true
                        })}
                            type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_red }} style={{
                                width: 115,
                                backgroundColor: Macro.work_red,
                                marginLeft: 30,
                                marginTop: 20,
                                borderWidth: 0,
                                height: 40
                            }}>退单</Button>
                    </Flex>

                    <OperationRecords communicateClick={this.communicateClick} communicates={communicates} />
                </ScrollView>

                {this.state.showClose && (
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
                                            width: 110,
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

                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer
                        index={this.state.lookImageIndex}
                        onCancel={this.cancel}
                        onClick={this.cancel}
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


    title: {
        paddingTop: 10,
        color: '#404145',
        fontSize: 14,
        paddingBottom: 5,
        marginLeft: 10,
        marginRight: 10
    },

    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5,
    },

    orange: {
        borderLeftColor: Macro.work_orange,
        borderLeftWidth: 5,
    },

    statusred: {
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        color: Macro.work_red
    },

    statusblue: {
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        color: Macro.work_blue
    },
    
    line: {
        width: ScreenUtil.deviceWidth() - 30 - 10 * 2,
        marginLeft: 10,
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

    every: {
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
        lineHeight: 20,
        fontSize: 15,
        padding: 15
    },
    // ii: {
    //     paddingTop: 10,
    //     paddingBottom: 10,
    //     marginLeft: 10,
    //     marginRight: 10,
    //     width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
    //     backgroundColor: '#999',
    //     borderRadius: 6,
    //     marginBottom: 20
    // },
    // word: {
    //     color: 'white',
    //     fontSize: 16
    // }
});
