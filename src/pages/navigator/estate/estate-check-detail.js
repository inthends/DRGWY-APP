
import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    TextInput,
    Platform,
    Modal
} from 'react-native';
import BasePage from '../../base/base';
import { Button, Flex, Icon } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import common from '../../../utils/common';
import WorkService from '../../work/work-service';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ListImages from '../../../components/list-images';
import ImageViewer from 'react-native-image-zoom-viewer';
import NoDataView from '../../../components/no-data-view';
import RNFetchBlob from 'rn-fetch-blob';

export default class EcheckDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '检查单详情',
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
            memo: '',
            detail: {},
            pageIndex: 1,
            dataInfo: {
                data: [],
            },
            lookImageIndex: 0,
            visible: false,
            refreshing: true
        };
    }

    componentDidMount() {
        this.getData();
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.onRefresh();
            }
        );
    }

    // componentWillUnmount() {
    //     this.viewDidAppear.remove();
    // }

    getData = () => {
        const { id } = this.state;
        WorkService.checkDetail(id).then(detail => {
            this.setState({
                detail
            });
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

    //检查明细
    getList = () => {
        const { id } = this.state;
        WorkService.checkDetailList(this.state.pageIndex, id).then(dataInfo => {
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


    lookImage = (lookImageIndex, files) => {
        this.setState({
            lookImageIndex,
            images: files,//需要缓存是哪个明细的图片
            visible: true
        });
    };

    cancel = () => {
        this.setState({
            visible: false
        });
    };

    //评审
    save = () => {
        const { id, memo } = this.state;
        WorkService.approveCheck(
            id,
            memo
        ).then(res => {
            if (res.flag == false) {
                UDToast.showError(res.msg);
                return;
            }
            UDToast.showError('提交成功');
            this.props.navigation.goBack();
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


    _renderItem = ({ item, index }) => {
        //获取附件
        // WorkService.checkFiles(item.id).then(images => {
        //     this.setState({
        //         images
        //     });
        // });
        return (
            <Flex direction='column' align={'start'}
                style={[styles.card, index % 2 == 0 ? styles.blue : styles.orange]}>
                <Flex justify='between' style={{ width: '100%' }}>
                    <Text style={styles.title}>{item.allName}</Text>
                </Flex>
                <Flex style={styles.line} />
                <Flex align={'start'} direction={'column'}>
                    <Flex justify='between'
                        style={{ width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
                        <Text>责任人：{item.dutyUserName} {item.postName}，维修专业：{item.repairMajor}</Text>
                    </Flex>
                    <Text style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: 10,
                        color: '#666'
                    }}>检查情况：{item.memo}</Text>
                    <Text style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: 5,
                        color: '#666'
                    }}>整改要求：{item.rectification}</Text>
                </Flex>
                <ListImages images={item.images} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, item.images)} />
            </Flex>
        );
    };



    render() {
        const { detail, dataInfo } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>检查人：{detail.checkUserName} {detail.postName}</Text>
                        <Text style={styles.right}>{detail.billDate}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>检查组：{detail.checkRole}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>检查类型：{detail.checkType}</Text>
                    </Flex>

                    <Text style={[styles.every, ScreenUtil.borderBottom()]}>{detail.memo}</Text>

                    <FlatList
                        data={dataInfo.data}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item) => item.id}
                        //必须
                        onEndReachedThreshold={0.1}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}//下拉刷新
                        onEndReached={this.loadMore}//底部往下拉翻页
                        onMomentumScrollBegin={() => this.canLoadMore = true}
                        ListEmptyComponent={<NoDataView />}
                    />
                    <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {dataInfo.data.length}, 共 {dataInfo.total} 条</Text>

                    {detail.statusName == '待评审' ?
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <TextInput
                                maxLength={500}
                                placeholder='请输入'
                                multiline
                                style={{ fontSize: 16, textAlignVertical: 'top' }}
                                onChangeText={memo => this.setState({ memo })}
                                value={this.state.memo}
                                numberOfLines={2}>
                            </TextInput>
                        </Flex> : null
                    }

                </ScrollView>
                {detail.statusName == '待评审' ?
                    <Flex justify={'center'}>
                        <Flex justify={'center'}>
                            <Button onPress={this.save} type={'primary'}
                                activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                    width: 110,
                                    marginTop: 5,
                                    backgroundColor: Macro.work_blue,
                                    height: 40
                                }}>评审</Button>
                        </Flex>
                    </Flex> : null}

                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
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

    every: {
        //fontSize: 16,
        //color: '#404145',
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

    list: {
        backgroundColor: Macro.color_white,
        margin: 15
    },

    card: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#c8c8c8',
        borderBottomColor: '#c8c8c8',
        borderRightColor: '#c8c8c8',
        borderRadius: 5,
        marginBottom: 15,
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
    line: {
        width: ScreenUtil.deviceWidth() - 30 - 15 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1
    },
    title: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20
    }
});
