import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import {
    StyleSheet, Text, TouchableOpacity, Modal, FlatList,
    Platform, CameraRoll, ActivityIndicator
} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import TopTitle from '../../../components/top-title';
import GdzcService from './gdzc-service';
import common from '../../../utils/common';
import ListImages from '../../../components/list-images';
import ImageViewer from 'react-native-image-zoom-viewer';
import RNFetchBlob from 'rn-fetch-blob';
import UDToast from '../../../utils/UDToast';
let screen_width = ScreenUtil.deviceWidth()

export default class GdzcDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '固定资产详情',
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
            ...(common.getValueFromProps(this.props)),
            data: {},
            imageDatas: [],
            titles: ['基本信息', '领用记录', '维修记录', '盘点记录'],
            indexType: 0,
            visible: false,


            pageIndex: 1,
            pageSize: 10,
            total: 0,
            datasList: [],
            refreshing: false,//刷新
            loading: false,//加载完成 
            hasMore: true,//更多 
        };
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.loadData();
            }
        );
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    getImages = () => {
        GdzcService.gdzcAssetsFileInfo(this.state.id).then(res => {
            this.setState({
                imageDatas: res
            }, () => {
            })
        })
    }

    onRefresh = (indexType = this.state.indexType) => {
        this.setState({
            indexType: indexType,
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


    loadData = (isRefreshing = false) => {
        if (this.state.loading || (!isRefreshing && !this.state.hasMore))  {
            this.setState({ loading: false, refreshing: false });
            return;
        }
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });

        const { data, indexType, pageIndex, pageSize, id } = this.state;
        if (indexType === 0) {
            GdzcService.gdzcBaseInfo(id).then(res => {
                this.setState({
                    data: res,
                    total: res.total
                }, () => {
                    this.getImages()
                })
            })

        }
        else if (indexType === 1) {

            GdzcService.gdzcAssetsUseInfo(currentPage, id).then(res => {
                // this.setState({
                //     datasList: res.data,
                //     total: res.total,
                //     refreshing: false
                // }, () => {
                // })

                if (isRefreshing) {
                    this.setState({
                        datasList: res.data,
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
                        pageIndex: pageIndex,
                        hasMore: pageIndex * pageSize < res.total ? true : false,
                        total: res.total
                    });
                }

            }).catch(err => UDToast.showError(err)
            ).finally(() => this.setState({ loading: false, refreshing: false }))
        }
        else if (indexType === 2) {
            GdzcService.gdzcRepairList(currentPage, id).then(res => {
                if (isRefreshing) {
                    this.setState({
                        datasList: res.data,
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
                        pageIndex: pageIndex,
                        hasMore: pageIndex * pageSize < res.total ? true : false,
                        total: res.total
                    });
                }
            }).catch(err => UDToast.showError(err)
            ).finally(() => this.setState({ loading: false, refreshing: false }))
        }
        else if (indexType === 3) {
            GdzcService.gdzcAssetsCheckList(currentPage, id).then(res => {
                if (isRefreshing) {
                    this.setState({
                        datasList: res.datasList,
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
                        pageIndex: pageIndex,
                        hasMore: pageIndex * pageSize < res.total ? true : false,
                        total: res.total
                    });
                }
            }).catch(err => UDToast.showError(err)
            ).finally(() => this.setState({ loading: false, refreshing: false }))
        }
    }

    lookImage = (lookImageIndex) => {
        this.setState({
            lookImageIndex,
            visible: true,
        });
    };

    cancel = () => {
        this.setState({
            visible: false,
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
            UDToast.showError(error);
        }
    }

    _renderItem = ({ item }) => {
        const { indexType } = this.state
        let data1 = []
        if (indexType == 1) {
            data1 = [
                { key: '领用日期', value: item.useDate },
                { key: '领用人', value: item.userName },
                { key: '领用说明', value: item.memo },
                { key: '归还日期', value: item.returnDate },
                { key: '归还说明', value: item.returnMemo }
            ]
        }
        else if (indexType == 2) {
            data1 = [
                { key: '维修日期', value: item.repairDate },
                { key: '经办人', value: item.handUserName },
                { key: '维修费用', value: item.fee },
                { key: '故障描述', value: item.memo }
            ]
        }
        else if (indexType == 3) {
            data1 = [
                { key: '盘点日期', value: item.checkDate },
                { key: '盘点人', value: item.createUserName },
                { key: '盘点结果', value: item.status === 1 ? '正常' : '异常' },
                { key: '盘点说明', value: item.memo }
            ]
        }
        return <Flex direction="column" style={{ ...styles.content, height: 30 * data1.length }}>
            {
                data1.map((subItem) => {
                    return <Text style={styles.desc}>{subItem.key + '：' + (subItem.value == null ? '' : subItem.value)}</Text>
                })
            }
        </Flex>
    }

    renderFooter = () => {
        if (!this.state.hasMore && this.state.datasList.length > 0) {
            return <Text style={{ fontSize: 14, alignSelf: 'center' }}>没有更多数据了</Text>;
        }
        return this.state.loading ? <ActivityIndicator /> : null;
    };

    contentView = () => {
        const { indexType, data, imageDatas, datasList, total, refreshing } = this.state
        let images = imageDatas.map((item) => {
            return item.thumbUrl
        })
        if (indexType == 0) {
            let data1 = [
                { key: '编号', value: data.code },
                { key: '名称', value: data.name },
                { key: '品牌', value: data.brand },
                { key: '型号规格', value: data.modelNo },
                { key: '数量', value: data.num + data.unit },
                { key: '原值', value: data.price },
                { key: '存放地址', value: data.address },
                { key: '保管人', value: data.custodianName }
            ];

            return (
                <Flex direction={'column'} align={'start'} style={{
                    marginHorizontal: 10,
                    paddingHorizontal: 10,
                    flex: 1,
                    width: screen_width - 20,
                    height: 120,
                    alignItems: 'flex-start'
                }}>
                    <Flex style={styles.line} />
                    {
                        data1.map((item) => {
                            return <Flex>
                                <Text style={styles.desc}>{item.key + '：'}</Text>
                                <Text style={styles.desc}>{item.value == null ? '' : item.value}</Text>
                            </Flex>
                        })
                    }

                    <ListImages images={images} lookImage={this.lookImage} />

                    <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                        <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                            imageUrls={this.state.images}
                            menuContext={{ "saveToLocal": "保存到相册", "cancel": "取消" }}
                            onSave={(url) => this.savePhoto(url)}
                        />
                    </Modal>
                </Flex>
            );
        }
        else {
            return (
                <>
                    <FlatList
                        data={datasList}
                        // ListHeaderComponent={}
                        renderItem={this._renderItem}
                        keyExtractor={(item) => item.id}
                        // ItemSeparatorComponent={() => <View style={{ backgroundColor: '#eee', height: 1 }} />} 
                        //必须
                        onEndReachedThreshold={0.2}
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}//下拉刷新
                        onEndReached={this.loadMore}//底部往下拉翻页
                        //onMomentumScrollBegin={() => this.canLoadMore = true}
                        ListFooterComponent={this.renderFooter}
                        ListEmptyComponent={<NoDataView />}
                    />
                    <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {datasList.length}, 共 {total} 条</Text>
                </>

                //                 <ScrollView>
                //                      <ScrollView onRefresh={this.onRefresh()} onScrollEndDrag={this.loadMore()}>
                //                     {
                //                         datasList.map((item) => {
                //                             let data1 = []
                //                             if (indexType == 1) {
                //                                 data1 = [ 
                // /*
                // allName: ""
                // assetsId: "08d8ba78-1d35-4bee-a3b5-755e85eea651"
                // createDate: null
                // createUserId: null
                // createUserName: null
                // id: 4
                // memo: "1111"
                // modifyDate: null
                // modifyUserId: null
                // modifyUserName: null
                // phoneNum: "1111"
                // postName: null
                // restitutionUserId: null
                // restitutionUserName: null
                // returnDate: null
                // rowIndex: 1
                // status: 0
                // useDate: "2022-11-02 00:00:00"
                // userId: "ea77df59-5bb9-4142-9367-7bc012acbdee"
                // userName: "陆陆"
                // */

                //                                     { key: '领用日期', value: item.useDate },
                //                                     { key: '领用人', value: item.userName },
                //                                     { key: '领用说明', value: item.name },
                //                                     { key: '归还日期', value: item.returnDate },
                //                                     { key: '归还说明', value: item.name }
                //                                 ]
                //                             }
                //                             else if (indexType == 2) {
                //                                 data1 = [
                //                                     { key: '维修日期', value: item.name },
                //                                     { key: '经办人', value: item.name },
                //                                     { key: '维修费用', value: item.name },
                //                                     { key: '故障描述', value: item.name }
                //                                 ]
                //                             }
                //                             else if (indexType == 3) {
                //                                 data1 = [
                //                                     { key: '盘点日期', value: item.name },
                //                                     { key: '盘点人', value: item.name },
                //                                     { key: '盘点结果', value: item.name },
                //                                     { key: '盘点说明', value: item.name }
                //                                 ]
                //                             }
                //                             return <Flex direction="column" style={{ ...styles.content, height: 30 * data1.length }}>
                //                                 {
                //                                     data1.map((subItem)=>{
                //                                         return <Text style={styles.desc}>{subItem.key + ': ' + subItem.value}</Text>
                //                                     })
                //                                 }
                //                             </Flex>
                //                         })
                //                     }
                //                 </ScrollView>
            );
        }
    }

    onChange = (index) => {
        this.onRefresh(index)
        // this.getInfo()
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { indexType, titles } = this.state;
        return (
            <CommonView style={{ flex: 1, justifyContent: 'flex-start' }}>
                <TopTitle index={indexType} onChange={this.onChange} titles={titles} />
                {this.contentView()}
            </CommonView>
        );
    }
}


const styles = StyleSheet.create({
    content: {
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eeeeee',
        width: screen_width - 20,
        height: 120,
        alignItems: 'flex-start'
    },
    line: {
        width: ScreenUtil.deviceWidth() - 40,
        backgroundColor: '#E0E0E0',
        height: 1,
        marginVertical: 10
    },
    top: {
        fontSize: 14,
        color: '#666'
    },
    desc: {
        marginVertical: 5,
        color: '#404145',
        fontSize: 14
    },

});