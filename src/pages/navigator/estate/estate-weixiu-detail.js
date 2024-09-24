import React from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    Modal
} from 'react-native';
import BasePage from '../../base/base';
import { Icon, Flex } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
import WorkService from '../../work/work-service';
import ListImages from '../../../components/list-images';
import OperationRecords from '../../../components/operationrecords';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';
import moment from 'moment';

//仅查看
export default class EweixiuDetailPage extends BasePage {
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

            //费用明细
            pageIndex: 1,
            refreshing: false,
            dataInfo: {
                data: []
            }
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
                },
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
        });

        // //维修单附件
        // WorkService.weixiuExtra(id).then(images => {
        //     this.setState({
        //         images
        //     });
        // });

        this.getList();
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

    lookImage = (lookImageIndex, files) => {
        this.setState({
            lookImageIndex,
            selectimages: files,//需要缓存是哪个明细的图片
            visible: true
        });
    };
 
    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1
        }, () => {
            this.getList();
        });
    };

    //费用明细
    getList = () => {
        const { detail } = this.state;
        WorkService.serverFeeList(this.state.pageIndex, detail.relationId).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data]
                };
            }
            this.setState({
                dataInfo: dataInfo,
                pageIndex: dataInfo.pageIndex,
                refreshing: false
            }, () => {
            });
        }).catch(err => this.setState({ refreshing: false }));
    };

    loadMore = () => {
        const { data, total, pageIndex } = this.state.dataInfo;
        if (this.canLoadMore && data.length < total) {
            this.canLoadMore = false;
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1
                // canLoadMore: false,
            }, () => {
                this.getList();
            });
        }
    };

    _renderItem = ({ item, index }) => {
        return (
            <Flex
                direction='column' align={'start'}
                style={[styles.card, index % 2 == 0 ? styles.blue : styles.orange]}>
                <Flex justify='between' style={{ width: '100%' }}>
                    <Text style={styles.title}>{item.feeName}</Text>
                </Flex>
                <Flex style={styles.line} />
                <Flex align={'start'} direction={'column'}>
                    <Flex justify='between'
                        style={{ width: '100%', paddingTop: 5, paddingLeft: 15, paddingRight: 15, lineHeight: 20 }}>
                        <Text>应收金额：{item.amount}
                            ，减免金额：{item.reductionAmount}
                            ，已收金额：{item.receiveAmount}
                            ，未收金额：{item.lastAmount}</Text>
                    </Flex>
                    <Flex justify='between'
                        style={{ width: '100%', paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15 }}>
                        {item.beginDate ?
                            <Text>{moment(item.beginDate).format('YYYY-MM-DD') + '至' + moment(item.endDate).format('YYYY-MM-DD')}</Text> : null
                        }
                        <Text>是否推送账单：{item.noticeId ? '是' : '否'} </Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    };

    render() {
        const { images, startimages, finishimages, checkimages, detail, communicates, dataInfo } = this.state;
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
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')}
                                style={{ width: 15, height: 15 }} /></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>

                    <Text style={[styles.desc, ScreenUtil.borderBottom()]}>{detail.repairContent}</Text>
                    <ListImages images={images} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, images)} />

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>紧急程度：{detail.emergencyLevel}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.right}>重要程度：{detail.importance}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>转单人：{detail.createUserName}，{detail.createDate}</Text>
                    </Flex>

                    {detail.relationId && <TouchableWithoutFeedback>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]}>
                            <Text style={styles.left}>关联单：</Text>
                            <Text onPress={() => {
                                if (detail.sourceType === '服务总台') {
                                    this.props.navigation.navigate('serverDeskView', { id: detail.relationId });
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
                    </TouchableWithoutFeedback>}

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
                            <Text style={styles.left}>修正积分：{detail.appScore}</Text>
                        </Flex> : null}

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
                                <Text style={styles.right}>检验结果：{detail.testResult == 1 ? '合格' : '不合格'}</Text>
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
                        data={dataInfo.data}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item) => 'flatList' + item.id}
                        //必须
                        onEndReachedThreshold={0.1}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}//下拉刷新
                        onEndReached={this.loadMore}//底部往下拉翻页
                        onMomentumScrollBegin={() => this.canLoadMore = true}
                    />

                    {/* 维修单显示操作记录，没有沟通记录 */}
                    <OperationRecords communicateClick={this.communicateClick} communicates={communicates} />

                </ScrollView>

                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                        imageUrls={this.state.selectimages} />
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
