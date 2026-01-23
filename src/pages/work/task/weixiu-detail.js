//工作台里面，只能查看
import React from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    Platform,
    Modal,
    CameraRoll
} from 'react-native';
import BasePage from '../../base/base';
import { Icon, Flex } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
import WorkService from '../../work/work-service';
import ListImages from '../../../components/list-images';
import OperationRecords from '../../../components/operationrecords';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';
import Macro from '../../../utils/macro';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import UDToast from '../../../utils/UDToast';
import ActionPopover from '../../../components/action-popover';

export default class WeixiuDetailPage extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            title: '维修单详情',
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
            images: [],
            startimages: [],
            finishimages: [],
            checkimages: [],
            detail: {},
            communicates: [],
            lookImageIndex: 0,
            visible: false,

            pageIndex: 1,
            pageSize: 10,
            total: 0,
            data: [],
            refreshing: false,//刷新
            loading: false,//加载完成 
            hasMore: true,//更多

        };
    }

    componentDidMount() {
        this.getData();
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

            WorkService.getOperationRecord(id).then(res => {
                this.setState({
                    communicates: res
                });
            });

            this.loadData();
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
    };

    cancel = () => {
        this.setState({
            visible: false
        });
    };

    savePhoto = (uri) => {
        // savePhoto =async (uri) => { 
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


    //费用明细
    loadData = (isRefreshing = false) => {
        if (this.state.loading || (!isRefreshing && !this.state.hasMore)) {
            this.setState({ loading: false, refreshing: false });
            return;
        }
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const { data, detail, pageSize } = this.state;
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
                            <Text>计费期间：{moment(item.beginDate).format('YYYY-MM-DD') + '至' + moment(item.endDate).format('YYYY-MM-DD')}</Text> : null
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
            images,
            startimages,
            finishimages,
            checkimages,
            detail,
            communicates,
            data,
            refreshing,
            total
        } = this.state;
        // const selectImg = require('../../../static/images/select.png');
        // const noselectImg = require('../../../static/images/no-select.png');
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.address} {detail.contactName}</Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.contactLink)}>
                            <Flex><LoadImage
                                defaultImg={require('../../../static/images/phone.png')}
                                style={{ width: 16, height: 16 }} /></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>

                    <Text style={styles.desc}>{detail.repairContent}</Text>

                    <ListImages images={images} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, images)} />

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>紧急程度：{detail.emergencyLevel}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>重要程度：{detail.importance}</Text>
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
                                        this.props.navigation.navigate('serverDeskView', { id: detail.relationId });
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

                    {detail.appScore != null ?
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Text style={styles.left}>修正个人积分：{detail.appScore}</Text>
                        </Flex> : null}

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>接单人：{detail.receiverName}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>接单时间：{detail.receiverDate}</Text>
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
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验人：{detail.testerName}</Text>
                            </Flex>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验结果：{detail.testResult == 1 ? '合格' : '不合格'}</Text>
                            </Flex>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验说明：{detail.testRemark}</Text>
                            </Flex>
                            <ListImages images={checkimages} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, checkimages)} />
                        </> : null}


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

                    {/* <Communicates communicateClick={this.communicateClick} communicates={communicates} /> */}
                    {/* 维修单显示操作记录，没有沟通记录 */}
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
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1
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
        padding: 15,
        fontSize: 15
    }
});
