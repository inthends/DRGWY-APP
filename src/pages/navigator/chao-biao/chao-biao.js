import React, {Fragment} from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    SectionList,
    TouchableWithoutFeedback,
    ImageBackground,
    Animated,
    FlatList,
    Image, TouchableOpacity,
    TextInput, Modal,
} from 'react-native';

import BasePage from '../../base/base';
import BuildingHeader from '../../../components/building/building-header';
import BuildingCell from '../../../components/building/build-cell';
import {Button, Flex, Icon, List, WhiteSpace, SegmentedControl, WingBlank, DatePicker} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import forge from 'node-forge';
import LoadImage from '../../../components/load-image';
import {connect} from 'react-redux';

import CommonView from '../../../components/CommonView';
import common from '../../../utils/common';
import ScreenUtil from '../../../utils/screen-util';
import NoDataView from '../../../components/no-data-view';
import ChaoBiaoService from './chao-biao-service';
import ImageViewer from 'react-native-image-zoom-viewer';
import ChaoBiaoCell from './chao-biao-cell';
import UDToast from '../../../utils/UDToast';


class ChaoBiaoPage extends BasePage {

    static navigationOptions = ({navigation}) => {


        return {
            tabBarVisible: false,
            title: '移动抄表',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
            // headerRight: (
            //     <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
            //         <Icon name='bars' style={{marginRight: 15}} color="black"/>
            //     </TouchableWithoutFeedback>
            // ),
        };
    };

    constructor(props) {
        super(props);
        Date.prototype.getYearAndMonth = function () {
            let year = this.getFullYear();
            let month = this.getMonth() + 1 + '';
            if (month.length === 1) {
                month = 0 + month;
            }
            return year + '-' + month;
        }
        this.state = {
            count: 0,
            selectBuilding: this.props.selectBuilding || {},
            dataInfo: {
                data: [],
            },
            refreshing: true,
            scan: false,
            nowRead: '',
            showSubmit: false,
            current: {},
        };
    }

    componentDidMount(): void {


        this.onRefresh();
    }

    onRefresh() {
        this.setState({
            pageIndex: 1,
        }, () => {
            this.getList();
        });
    }

    getList = (showLoading = true) => {

        ChaoBiaoService.lists(this.state.pageIndex).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data],
                };
            }
            this.setState({
                dataInfo: dataInfo,
                refreshing: false,
                pageIndex: dataInfo.pageIndex,
            }, () => {
                //console.log(this.state.dataInfo.data);
            });
        });

    };

    loadMore = () => {
        const {data, total, pageIndex} = this.state.dataInfo;
        //console.log('loadmore', this.canAction);

        if (!this.canAction && data.length < total) {
            // if (data.length < total) {
            this.canAction = true;
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1,
            }, () => {
                this.getList();
            });
        }
        // if (data.length < total) {
        //     this.setState({
        //         refreshing: true,
        //         pageIndex: pageIndex + 1,
        //     }, () => {
        //         this.getList();
        //     });
        // }
    };

    callBack = (keyvalue) => {
        ChaoBiaoService.lastMeter(keyvalue).then(current => {
            this.setState({
                scan: true,
                nowRead: '',
                current,
            });
        });

        // ChaoBiaoService.lastMeter('').then(current => {
        //     this.setState({
        //         scan: true,
        //         nowRead: '',
        //         current,
        //     });
        // });
    };


    scan = () => {

        this.props.navigation.push('scanForWork', {
            data: {
                callBack: this.callBack,
                needBack: '1'
            },
        });


        // this.callBack();


    };
    submit = () => {
        const {date} = this.state;
        if (date) {
            ChaoBiaoService.saveMeter(date.getYearAndMonth()).then(res => {
                this.setState({
                    showSubmit: false,
                }, () => {
                    this.props.navigation.goBack();
                });
            });

        } else {
            UDToast.showError('请选择日期');
        }
    };
    tanchuangSubmit = () => {
        const {nowRead, current} = this.state;
        if (nowRead.length === 0) {
            UDToast.showError('请输入本次表度数');
            return;
        }
        ChaoBiaoService.readMeter(current.meterCode, current.lastRead, nowRead).then(res => {
            UDToast.showError('提交成功');
            this.onRefresh();
            this.setState({
                scan: false,
                nowRead: '',
            });
        });
    };


    render() {
        const {dataInfo, current} = this.state;

        return (

            <View style={{flex: 1}}>
                <WhiteSpace size={'xl'}/>

                <FlatList
                    data={dataInfo.data}
                    // ListHeaderComponent={}
                    renderItem={({item, index}) => <ChaoBiaoCell item={item}/>}
                    style={{height: ScreenUtil.deviceHeight() - 300}}
                    keyExtractor={(item, index) => (item.id + '')}
                    refreshing={this.state.refreshing}
                    // onRefresh={() => this.onRefresh()}
                    onEndReached={() => this.loadMore()}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => this.canAction = false}
                    ListEmptyComponent={<NoDataView/>}
                />

                <Flex style={{minHeight: 40, marginBottom: 30}}>
                    <TouchableWithoutFeedback onPress={this.scan}>
                        <Flex justify={'center'} style={[styles.ii, {backgroundColor: Macro.color_4d8fcc}]}>
                            <Text style={styles.word}>开始扫码</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({showSubmit: true, date: new Date()})}>
                        <Flex justify={'center'} style={[styles.ii]}>
                            <Text style={styles.word}>提交抄表</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                </Flex>

                {this.state.scan && (
                    <View style={styles.mengceng}>
                        <Flex justify={'center'} align={'center'}
                              style={{flex: 1, padding: 50, backgroundColor: 'rgba(178,178,178,0.5)'}}>
                            <WingBlank size={'lg'}>
                                <Flex direction='column' align={'start'}
                                      style={[styles.card]}>
                                    <Flex justify='between'>
                                        <Text style={styles.title}>{current.meterName}</Text>
                                    </Flex>
                                    <Flex style={styles.line}/>
                                    <Flex align={'start'} direction={'column'}>
                                        <Flex justify='between'
                                              style={{width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20}}>
                                            <Text>编号：{current.meterCode}</Text>
                                            <Text>倍率：{current.meterZoom}</Text>

                                        </Flex>
                                        <WingBlank size={'lg'}>
                                            <WingBlank size={'lg'}>
                                                <Text style={{color: '#666'}}>
                                                    上次度数：{current.lastRead}
                                                </Text>
                                            </WingBlank>
                                        </WingBlank>
                                        <WhiteSpace/>
                                    </Flex>
                                    <WhiteSpace/>
                                    <Flex direction={'column'} style={{width: '100%'}}>
                                        <Flex justify={'around'} style={{marginBottom: 10}}>
                                            <TextInput value={this.state.nowRead}
                                                       onChangeText={nowRead => this.setState({nowRead})}
                                                       style={{fontSize: 20}} placeholder={'请输入本次表度数'}/>
                                        </Flex>
                                        <WhiteSpace/>
                                        <WingBlank size={'lg'}>
                                            <Flex style={{marginBottom: 15}}>
                                                <Button type={'primary'} style={{
                                                    backgroundColor: Macro.work_blue,
                                                    width: 100,
                                                    height: 44,
                                                    borderWidth: 0,
                                                }} onPress={this.tanchuangSubmit}>
                                                    确定
                                                </Button>
                                                <Button activeStyle={{backgroundColor: '#CCCCCC'}} type={'primary'}
                                                        style={{
                                                            marginLeft: 50,
                                                            backgroundColor: '#CCCCCC',
                                                            width: 100,
                                                            height: 44,
                                                            borderWidth: 0,
                                                        }} onPress={() => this.setState({scan: false})}>
                                                    取消
                                                </Button>

                                            </Flex>

                                        </WingBlank>
                                    </Flex>
                                </Flex>
                            </WingBlank>
                        </Flex>

                    </View>

                )}


                {this.state.showSubmit && (
                    <View style={styles.mengceng}>
                        <Flex direction={'column'} justify={'center'} align={'center'}
                              style={{flex: 1, padding: 25, backgroundColor: 'rgba(178,178,178,0.5)'}}>
                            <Flex direction={'column'}
                                  style={{backgroundColor: 'white', borderRadius: 10, padding: 15}}>
                                <Text style={{fontSize: 20}}>说明</Text>
                                <WhiteSpace/>
                                <Text style={{
                                    fontSize: 18,
                                    color: 'red',
                                    lineHeight: 22,
                                    textAlign: 'center',
                                }}>提交结束抄表后本次读数将不允许修改，请确认所有表读数是否全部抄写完成，谨慎操作</Text>
                                <WhiteSpace/>
                                <List style={{height: 50, width: 300, borderWidth: 0}}>
                                    <DatePicker
                                        mode="month"
                                        title="选择年月"
                                        value={this.state.date}
                                        onChange={date => this.setState({date})}
                                        style={{backgroundColor: 'white'}}
                                        format={value => value.getYearAndMonth()}

                                    >
                                        <List.Item arrow="horizontal"
                                                   style={{borderWidth: 0}}><Text>抄表年月：</Text></List.Item>
                                    </DatePicker>
                                </List>
                                <Flex style={{marginTop: 15, marginBottom: 0}}>
                                    <Button onPress={this.submit} type={'primary'}
                                            activeStyle={{backgroundColor: Macro.work_blue}} style={{
                                        width: 110,
                                        backgroundColor: Macro.work_blue,
                                        height: 44,
                                    }}>确认提交</Button>
                                    <Button onPress={() => this.setState({showSubmit: false})} type={'primary'}
                                            activeStyle={{backgroundColor: '#ccc'}} style={{
                                        marginLeft: 30,
                                        width: 110,
                                        backgroundColor: '#ccc',
                                        borderWidth: 0,
                                        height: 44,
                                    }}>取消</Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </View>

                )}


            </View>

        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_sky,
        flex: 1,
    },
    content: {
        backgroundColor: Macro.color_white,
        flex: 1,


    },
    list: {
        backgroundColor: Macro.color_white,
        margin: 15,
    },
    title: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#333',
        fontSize: 16,
        paddingBottom: 10,
        //
        marginLeft: 20,
        marginRight: 20,

        // width: ,
    },
    title2: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#333',
        fontSize: 16,
        paddingBottom: 10,
        //

        marginRight: 20,

        // width: ,
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30 - 15 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1,
    },
    top: {
        paddingTop: 20,
        color: '#000',
        fontSize: 18,
        paddingBottom: 15,
    },
    bottom: {
        color: '#868688',
        fontSize: 18,
        paddingBottom: 20,
    },
    button: {
        color: '#868688',
        fontSize: 16,
        paddingTop: 10,
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
        shadowOffset: {h: 10, w: 10},
        shadowRadius: 5,
        shadowOpacity: 0.8,
    },
    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5,
    },
    orange: {
        borderLeftColor: '#F7A51E',
        borderLeftWidth: 5,
    },
    aaa: {
        paddingRight: 20,
    },
    ii: {
        paddingTop: 12,
        paddingBottom: 12,
        marginLeft: 30,
        marginRight: 30,
        width: (ScreenUtil.deviceWidth() - 120) / 2.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginTop: 30,
    },
    word: {
        color: 'white',
        fontSize: 16,
    },
    mengceng: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
});

const mapStateToProps = ({buildingReducer}) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(ChaoBiaoPage);

