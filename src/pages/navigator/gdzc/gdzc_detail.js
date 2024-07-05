import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import { StyleSheet, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import TopTitle from '../../../components/top-title';
import GdzcService from './gdzc-service';
import common from '../../../utils/common';
import ListImages from '../../../components/list-images';
import ImageViewer from 'react-native-image-zoom-viewer';

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
            datasList: [],
            titles: ['基本信息', '领用记录', '维修记录', '盘点记录'],
            indexType: 0,
            visible: false,
            refreshing: false,
            dataInfo: {
                total: 0,
                pageIndex: 0
            }
        };
        this.getInfo()
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
            this.getInfo();
        });
    };

    loadMore = () => {
        const { total, pageIndex } = this.state.dataInfo;
        const { datasList } = this.state;
        if (this.canLoadMore && datasList.length < total) {
            this.canLoadMore = false;
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1
            }, () => {
                this.getInfo();
            });
        }
    };

    getInfo = () => {
        const { indexType, pageIndex, id } = this.state;
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
            GdzcService.gdzcAssetsUseInfo(pageIndex, id).then(res => {
                this.setState({
                    datasList: res.data,
                    total: res.total,
                    refreshing: false
                }, () => {
                })
            }).catch(err => this.setState({ refreshing: false }));
        }
        else if (indexType === 2) {
            GdzcService.gdzcRepairList(pageIndex, id).then(res => {
                this.setState({
                    datasList: res.data,
                    total: res.total,
                    refreshing: false
                }, () => {
                })
            }).catch(err => this.setState({ refreshing: false }));
        }
        else if (indexType === 3) {
            GdzcService.gdzcAssetsCheckList(pageIndex, id).then(res => {
                this.setState({
                    datasList: res.data,
                    total: res.total,
                    refreshing: false
                }, () => {
                })
            }).catch(err => this.setState({ refreshing: false }));
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

    contentView = () => {
        const { indexType, data, imageDatas, datasList } = this.state
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
                            imageUrls={this.state.images} />
                    </Modal>
                </Flex>
            );
        }
        else {
            return (
                <FlatList
                    data={datasList}
                    // ListHeaderComponent={}
                    renderItem={this._renderItem}
                    keyExtractor={(item) => item.id}
                    // ItemSeparatorComponent={() => <View style={{ backgroundColor: '#eee', height: 1 }} />} 
                    //必须
                    onEndReachedThreshold={0.1}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}//下拉刷新
                    onEndReached={this.loadMore}//底部往下拉翻页
                    onMomentumScrollBegin={() => this.canLoadMore = true}

                    ListEmptyComponent={<NoDataView />}
                />

                //                 <ScrollView>
                //                      <ScrollView onRefresh={this.onRefresh()} onScrollEndDrag={this.loadMore()}>
                //                     {
                //                         datasList.map((item) => {
                //                             let data1 = []
                //                             if (indexType == 1) {
                //                                 data1 = [ 
                // /*
                // allName: "中交/中交世通资产管理(北京)有限公司/资产经营部"
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