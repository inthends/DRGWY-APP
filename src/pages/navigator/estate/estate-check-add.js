//导航里面点击的检查单详情
import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    TextInput
} from 'react-native';
import BasePage from '../../base/base';
import { Button, Flex, Icon } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import common from '../../../utils/common';
import WorkService from '../../work/work-service';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import { connect } from 'react-redux';
import LoadImage from '../../../components/load-image';
import UDToast from '../../../utils/UDToast';

class EcheckAddPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '检查单',
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
        let id = common.getValueFromProps(this.props);
        this.state = {
            id,
            detail: {},
            showAdd: false,
            pageIndex: 1,
            memo: '',
            address: null,
            selectPerson: null,
            checkMemo: '',
            dataInfo: {
                data: []
            }
        };
    }

    //guid
    guid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    componentDidMount() {
        const { id } = this.state;
        if (id) {
            this.getData();
            this.viewDidAppear = this.props.navigation.addListener(
                'didFocus',
                (obj) => {
                    this.onRefresh();
                }
            );
        } else {
            let myid = this.guid();
            const { user } = this.props;
            //初始值
            this.setState({
                id: myid,
                detail: {
                    billId: myid,
                    billCode: '自动生成单号',
                    statusName: '待评审',
                    checkUserName: user.showName,
                    postName: user.postName
                }
            });
        }
    }

    // componentWillUnmount() {
    //     this.viewDidAppear.remove();
    // }

    getData = () => {
        const { id } = this.state;
        WorkService.checkDetail(id).then(item => {
            this.setState({
                detail: {
                    ...item.data,
                    statusName: item.statusName
                },
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
                refreshing: false
            }, () => {
            });
        });
    };

    loadMore = () => {
        const { data, total, pageIndex } = this.state.dataInfo;
        // if (!this.state.canLoadMore) {
        //     return;
        // }
        if (this.canAction && data.length < total) {
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1,
                // canLoadMore: false,
            }, () => {
                this.getList();
            });
        }
    };


    _renderItem = ({ item, index }) => {
        return (
            <Flex direction='column' align={'start'}
                style={[styles.card, index === 0 ? styles.blue : styles.orange]}>
                <Flex justify='between' style={{ width: '100%' }}>
                    <Text style={styles.title}>{item.allName}</Text>
                </Flex>
                <Flex style={styles.line} />
                <Flex align={'start'} direction={'column'}>
                    <Flex justify='between'
                        style={{ width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
                        <Text style={styles.title}>责任人：{item.dutyUserName} {item.postName}</Text>
                        <Text style={styles.title}>{item.billDate}</Text>
                    </Flex>
                    <Text style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: 20,
                        color: '#666',
                    }}>{item.memo}</Text>
                </Flex>
            </Flex>
        );
    };

    onSelectAddress = ({ selectItem }) => {
        this.setState({
            address: selectItem
        })
    }

    onSelectPerson = ({ selectItem }) => {
        this.setState({
            selectPerson: selectItem
        })
    }

    save = () => {
        const { id, memo, dataInfo } = this.state;
        if (dataInfo.data.length == 0) {
            UDToast.showError('请添加明细');
            return;
        }
        //保存数据
        WorkService.saveCheck(
            id,
            memo
        ).then(res => {
            UDToast.showError('保存成功');
            this.props.navigation.goBack();
        });
    };


    addDetail = () => {
        const { id, memo, address, selectPerson, checkMemo } = this.state;
        if (!address) {
            UDToast.showError('请选择位置');
            return;
        }

        if (!selectPerson) {
            UDToast.showError('请选择责任人');
            return;
        }

        if (checkMemo == '') {
            UDToast.showError('请输入内容');
            return;
        }

        //保存数据
        WorkService.addCheckDetail(
            id,
            memo,
            address.id,
            address.allName,
            selectPerson.id,
            selectPerson.name,
            checkMemo
        ).then(res => {
            UDToast.showError('添加成功');
            this.setState({ showAdd: false, address: null, selectPerson: null, checkMemo: '' });
            this.getData();
            this.onRefresh();
        });
    };



    render() {
        const { detail, dataInfo, address, selectPerson } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>检查人：{detail.checkUserName} {detail.postName}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <TextInput
                            maxLength={500}
                            placeholder='请输入'
                            multiline
                            style={{ fontSize: 16, textAlignVertical: 'top' }}
                            onChangeText={memo => this.setState({ memo })}
                            value={this.state.memo}
                            numberOfLines={4}>
                        </TextInput>
                    </Flex>

                    <FlatList
                        data={dataInfo.data}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item) => item.id}
                        onEndReached={() => this.loadMore()}
                        onEndReachedThreshold={0.1}
                        onMomentumScrollBegin={() => this.canAction = true}
                        onMomentumScrollEnd={() => this.canAction = false}
                    />
                </ScrollView>

                <Flex justify={'center'}>
                    <Flex justify={'center'}>
                        <Button onPress={this.save} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 110,
                                backgroundColor: Macro.work_blue,
                                height: 35
                            }}>保存</Button>
                    </Flex>

                    <Flex justify={'center'}>
                        <Button onPress={() => this.setState({ showAdd: true })}
                            type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }}
                            style={{
                                width: 110,
                                marginLeft: 60,
                                backgroundColor: Macro.work_blue,
                                height: 35
                            }}>添加明细</Button>
                    </Flex>
                </Flex>

                {this.state.showAdd && (
                    <View style={styles.mengceng}>
                        <Flex direction={'column'} justify={'center'} align={'center'}
                            style={{ flex: 1, padding: 25, backgroundColor: 'rgba(178,178,178,0.5)' }}>
                            <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                <CommonView style={{ height: 250, width: 300 }}>
                                    <TouchableWithoutFeedback
                                        onPress={() => this.props.navigation.navigate('SelectAddress', { onSelect: this.onSelectAddress })}>
                                        <Flex justify="between" style={[{
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            marginLeft: 10,
                                            marginRight: 10,
                                        }, ScreenUtil.borderBottom()]}>
                                            <Text style={[address ? { fontSize: 16, color: '#333' } :
                                                {
                                                    color: '#999',
                                                    //fontSize: 16,
                                                }]}>{address ? address.allName : `请选择位置`}</Text>
                                            <LoadImage style={{ width: 6, height: 11 }}
                                                defaultImg={require('../../../static/images/address/right.png')} />
                                        </Flex>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback
                                        onPress={() => this.props.navigation.navigate('SelectPerson', { onSelect: this.onSelectPerson })}>
                                        <Flex justify='between' style={[{
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            marginLeft: 10,
                                            marginRight: 10,
                                        }, ScreenUtil.borderBottom()]}>
                                            <Text style={[selectPerson ? { fontSize: 16, color: '#333' } :
                                                { color: '#999' }]}>{selectPerson ? selectPerson.name : "请选择责任人"}</Text>
                                            <LoadImage style={{ width: 6, height: 11 }}
                                                defaultImg={require('../../../static/images/address/right.png')} />
                                        </Flex>
                                    </TouchableWithoutFeedback>

                                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                        <TextInput
                                            maxLength={500}
                                            placeholder='请输入'
                                            multiline
                                            onChangeText={checkMemo => this.setState({ checkMemo })}
                                            value={this.state.checkMemo}
                                            style={{ fontSize: 16, textAlignVertical: 'top' }}
                                            numberOfLines={4}>
                                        </TextInput>
                                    </Flex>

                                </CommonView>

                                <Flex style={{ marginTop: 15 }}>
                                    <Button onPress={this.addDetail} type={'primary'}
                                        activeStyle={{ backgroundColor: Macro.work_blue }}
                                        style={{
                                            width: 110,
                                            backgroundColor: Macro.work_blue,
                                            height: 35
                                        }}>确认</Button>
                                    <Button onPress={() => {
                                        this.setState({ showAdd: false });
                                        this.onRefresh();
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
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F3F4F2'
    },
    every: {
        fontSize: 16,
        color: '#666',
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },

    // textarea: {
    //     marginLeft: 8,
    //     fontSize: 16,
    //     color: '#666',
    //     paddingTop: 15,
    //     width: ScreenUtil.deviceWidth() - 32
    // },

    left: {
        fontSize: 16,
        color: '#666'
    },
    right: {
        fontSize: 16,
        color: '#666'
    },
    desc: {
        padding: 15,
        paddingBottom: 40
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
    word: {
        color: 'white',
        fontSize: 16
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
        color: '#333',
        fontSize: 16,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20
    },
    mengceng: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },
});


const mapStateToProps = ({ memberReducer }) => {
    return {
        user: {
            ...memberReducer.user,
            id: memberReducer.user.userId
        }
    };
};


export default connect(mapStateToProps)(EcheckAddPage);