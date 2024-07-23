import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon, TextareaItem } from '@ant-design/react-native';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, FlatList  } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import CommonView from '../../../components/CommonView';
import common from '../../../utils/common';
import OrderService from './order-service';
import Macro from '../../../utils/macro';
import DashLine from '../../../components/dash-line';
import NoDataView from '../../../components/no-data-view';
import LoadImage from '../../../components/load-image';

let screen_width = ScreenUtil.deviceWidth()

export default class OrderDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: navigation.state.params.data.title ?? '订单详情',
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
            dataInfo: {},
            communicatesDatas: [],
            inputMsg: ''
        };
    }

    componentDidMount() {
        this.getOrderDetail()
        this.getOrderCommunicates()
    }
    /*
    allName: "测试项目/第01栋/第01层/1-101"
    billCode: "TESTNo202304090000"
    billDate: "2023-04-09 16:20:58"
    createDate: "2023-04-09 16:20:58"
    createUserId: "732ba1e3-d86a-4b82-8b27-790c1f06c9de"
    createUserName: "朱信保"
    customer: "朱信保"
    id: "0afccd37-73ea-42e5-9f69-9a171ad42a6c"
    linkId: null
    memo: "2023-04-09 00:00"
    modifyDate: "2023-04-15 06:51:14"
    modifyUserId: "bed2b997-3c4b-42e6-8fb3-a9ae144dc3f4"
    modifyUserName: "kj"
    otherId: null
    
    billCode, billDate, createUserName, status, allName 
    */
    getOrderDetail = () => {
        const { id } = this.state;
        OrderService.getOrderDetail(id).then(dataInfo => {
            if (dataInfo && dataInfo.id) {
                this.setState({
                    id: dataInfo.id,
                    billCode: dataInfo.billCode,
                    billDate: dataInfo.billDate,
                    createUserName: dataInfo.createUserName,
                    status: dataInfo.status,
                    allName: dataInfo.allName,
                }, () => {
                });
            }

        });
    }

    getOrderCommunicates = () => {//查看获取的回复信息
        const { id } = this.state;
        OrderService.getOrderCommunicates(id).then(dataInfo => {
            if (dataInfo && dataInfo.length > 0) {
                this.setState({
                    communicatesDatas: dataInfo,
                }, () => {
                });
            }

        });
    };

    _btnClick = (tag) => {
        const { id, inputMsg } = this.state;
        if (tag == 0) {//查阅
            OrderService.getReadForm(id).then(dataInfo => {
                this.setState({
                    inputMsg: ''
                }, () => {
                    this.getOrderDetail()
                });
            });
        }
        else if (tag === 1) {//回复
            OrderService.getReplyCommunicate(id, inputMsg).then(dataInfo => {
                this.setState({
                    inputMsg: ''
                }, () => {
                    this.getOrderDetail()
                });
            });
        }
        else if (tag === 2) {//关闭
            OrderService.getCloseOrder(id, inputMsg).then(dataInfo => {
                this.setState({
                    inputMsg: ''
                }, () => {
                    this.getOrderDetail()
                });
            });
        }
        this.getOrderDetail()
        this.getOrderCommunicates()
    }
    
    contentView = () => {
        const { billCode, billDate, createUserName, status, allName, phoneNum } = this.state;
        let data1 = [
            { key: '订单编号', value: billCode },
            { key: '订单时间', value: billDate },
            { key: '提 交 人', value: createUserName }
        ];
        
        return (
            <Flex marginHorizontal={15} width={screen_width - 30}>
                <Flex direction={'column'} align={'start'} marginTop={10}>
                    {
                        data1.map((item, index) => {
                            return <Flex style={{ marginVertical: 3 }}>
                                <Text>{item.key + ': '}</Text>
                                <Text style={{ marginHorizontal: 10 }}> {item.value}</Text>
                                {index === 2 && <Flex onPress={() => common.call(phoneNum)} backgroundColor={'red'}>
                                    <LoadImage defaultImg={require('../../../static/images/phone.png')} style={{ width: 18, height: 18 }} />
                                </Flex>}
                            </Flex>
                        })
                    }
                    <Text style={{ marginVertical: 3 }}>订单内容</Text>
                    <View
                        style={{ padding: 5, fontSize: 16, borderColor: '#eee', borderRadius: 5, borderWidth: 1, minHeight: 60, marginTop: 3, width: screen_width - 30 }}
                    >
                        <Text>{allName}</Text>
                    </View>
                    <DashLine style={{ marginLeft: 0 }} />
                    {
                        status === 0 && <View>
                            <TextareaItem
                                rows={4}
                                placeholder='请输入'
                                style={{ paddingTop: 10, width: ScreenUtil.deviceWidth() - 32 }}
                                onChange={inputMsg => this.setState({ inputMsg })}
                                value={this.state.inputMsg}
                                maxLength={500}
                            />
                            <Flex justify={'between'} style={{ minHeight: 40, marginBottom: 30, width: screen_width - 30, marginVertical: 10 }}>
                                <TouchableWithoutFeedback onPress={() => this._btnClick(0)}>
                                    <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_orange }]}>
                                        <Text style={styles.word}>查阅</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this._btnClick(1)}>
                                    <Flex justify={'center'} style={[styles.ii]}>
                                        <Text style={styles.word}>回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </View>
                    }
                    {
                        status === 1 && <View>
                            <TextareaItem
                                rows={4}
                                placeholder='请输入'
                                style={{ paddingTop: 10, width: ScreenUtil.deviceWidth() - 32 }}
                                onChange={inputMsg => this.setState({ inputMsg })}
                                value={this.state.inputMsg}
                                maxLength={500}
                            />
                            <Flex justify={'between'} style={{ minHeight: 40, marginBottom: 30, width: screen_width - 30, marginVertical: 10 }}>
                                <TouchableWithoutFeedback onPress={() => this._btnClick(1)}>
                                    <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_orange }]}>
                                        <Text style={styles.word}>回复</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this._btnClick(2)}>
                                    <Flex justify={'center'} style={[styles.ii]}>
                                        <Text style={styles.word}>闭单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </View>
                    }
                    {
                        status === 2 && <View>
                            <TextareaItem
                                rows={4}
                                placeholder='请输入'
                                style={{  paddingTop: 10,  width: ScreenUtil.deviceWidth() - 32  }}
                                onChange={inputMsg => this.setState({ inputMsg })}
                                value={this.state.inputMsg}
                                maxLength={500}
                            />
                            <Flex justify={'center'} style={{ minHeight: 40, marginBottom: 30, width: screen_width - 30, marginVertical: 10 }}>
                                <TouchableWithoutFeedback onPress={() => this._btnClick(2)}>
                                    <Flex justify={'center'} style={{ borderRadius: 6, backgroundColor: Macro.work_blue, width: screen_width - 60, height: 40 }}>
                                        <Text style={styles.word}>闭单</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            </Flex>
                        </View>
                    }
                </Flex>
            </Flex>
        );
    }

    //传入status  待查阅0，待回复1，已回复2，已关闭-1
    _renderItem = ({ item, index }) => {
        return (
            <Flex direction='column' align={'start'}>
                <Flex justify='start' style={{ width: '100%', marginVertical: 5 }}>
                    {index % 2 === 0 && <LoadImage defaultImg={require('../../../static/images/person2.png')} style={{ width: 18, height: 18 }} />}
                    {index % 2 === 1 && <LoadImage defaultImg={require('../../../static/images/person1.png')} style={{ width: 18, height: 18 }} />}
                    <Text style={{ marginHorizontal: 10 }}>{item.author}</Text>
                    <Text>{item.datetime}</Text>
                </Flex>
                {!!item.content && <View
                    style={{ padding: 5, fontSize: 16, borderColor: '#eee', borderRadius: 5, borderWidth: 1, height: 70, width: screen_width - 30, marginVertical: 10 }}
                >
                    <Text>{item.content}</Text>
                </View>}
            </Flex>
        );
    };

    render() {
        const { communicatesDatas, status } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                {this.contentView()}
                {!!communicatesDatas && communicatesDatas.length > 0 && <View flex={1} marginTop={1}>
                    <Text style={{ marginLeft: 15 }}>单据动态</Text>
                    <FlatList
                        data={communicatesDatas}
                        // ListHeaderComponent={}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item, index) => item.id}
                        // refreshing={this.state.refreshing}
                        // onRefresh={() => this.onRefresh()}
                        onEndReachedThreshold={0}
                        ListEmptyComponent={<NoDataView />}
                    />
                </View>}
            </CommonView>

        );
    }
}

const styles = StyleSheet.create({
   
    content: {
        backgroundColor: Macro.color_white,
        flex: 1
    },
    list: {
        backgroundColor: Macro.color_white,
        margin: 15
    },
    title: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10, 
        marginLeft: 20,
        marginRight: 20
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30 - 15 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1
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
