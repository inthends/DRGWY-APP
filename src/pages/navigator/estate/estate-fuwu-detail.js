import React from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    Platform,
    Modal, CameraRoll
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
import WorkService from '../../work/work-service';
import Communicates from '../../../components/communicates';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import OperationRecords from '../../../components/operationrecords';
import ImageViewer from 'react-native-image-zoom-viewer';
import Star from '../../../components/star';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';

//仅查看
export default class EfuwuDetailPage extends BasePage {
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
            id,
            images: [],
            detail: {},
            communicates: [],//沟通记录
            operations: [],//操作记录
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
        WorkService.serviceDetail(id).then(item => {
            this.setState({
                detail: {
                    ...item.data,
                    linkList: item.linkList,
                    statusName: item.statusName
                }
            });
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
                    //     UDToast.showInfo('保存成功');
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
        const { id } = this.state;
        WorkService.serverFeeList(this.state.pageIndex, id).then(dataInfo => {
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
                    {item.status == 0 ? <Text style={styles.statusred}>未收</Text> : <Text style={styles.statusblue}>已收</Text>}
                </Flex>
                <Flex style={styles.line} />
                <Flex align={'start'} direction={'column'}>
                    <Flex justify='between'
                        style={{ width: '100%', paddingTop: 5, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={{ lineHeight: 20 }}>应收金额：{item.amount}
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
        const { images, detail, communicates, operations, dataInfo } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
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
                        <Text style={styles.left}>紧急程度：{detail.emergencyLevel}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.right}>重要程度：{detail.importance}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>报单人：{detail.contactName}</Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.contactPhone)}>
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')}
                                style={{ width: 16, height: 16 }} /></Flex>
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
                            </Flex>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.right}>检验结果：{detail.testResult == 1 ? '合格' : '不合格'}</Text>
                            </Flex>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验说明：{detail.testRemark}</Text>
                            </Flex>
                        </>
                        : null
                    }

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

                    <Communicates communicateClick={this.communicateClick} communicates={communicates} />
                    <OperationRecords communicateClick={this.operationClick} communicates={operations} />
                </ScrollView>

                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex}
                        onCancel={this.cancel}
                        onClick={this.cancel}
                        imageUrls={this.state.images}
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

    every: {
        fontSize: 16,
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    every2: {
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 10
    },
    left: {
        fontSize: 16
    },
    right: {
        fontSize: 16
    },
    desc: {
        lineHeight: 20,
        fontSize: 15,
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15
    },
});
