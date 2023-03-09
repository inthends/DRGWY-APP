import React//, {Fragment}
 from 'react';
import {
    View,
    Text,
    StyleSheet,
    //StatusBar,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    //Linking,
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import {connect} from 'react-redux';
//import ListHeader from '../../../components/list-header';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import ScrollTitle from '../../../components/scroll-title';
import MyPopover from '../../../components/my-popover';
import NavigatorService from '../navigator-service';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';


class EstateWeixiuPage extends BasePage {
    static navigationOptions = ({navigation}) => { 
        //console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '维修单',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                    <Icon name='bars' style={{marginRight: 15}} color="black"/>
                </TouchableWithoutFeedback>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.selectBuilding = {
            key: null,
        };

        this.state = {
            count: 0,
            showTabbar: true,
            pageIndex: 1,
            statistics: {},
            dataInfo: {
                data: [],
            },
            refreshing: false,
            ym: common.getYM('2020-01'),
            billStatus: -1,
            //canLoadMore: true,
            time: common.getCurrentYearAndMonth(),
            selectBuilding: this.props.selectBuilding,
            repairArea: '',
        }; 
    }

    componentDidMount(): void {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.onRefresh();
            },
        );
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        // console.log('selectBuilding', selectBuilding);
        // console.log('nextSelectBuilding', nextSelectBuilding);

        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({selectBuilding: nextProps.selectBuilding}, () => {
                this.onRefresh();
            });
        }
    }


    getList = () => {
        /*
        pageIndex, billStatus, treeType, organizeId, billType, startTime, endTime
         */
        const {billStatus, selectBuilding, time, repairArea} = this.state;
        let treeType;
        let organizeId;
        if (selectBuilding) {
            treeType = selectBuilding.type;
            organizeId = selectBuilding.key;
        }
        let startTime = common.getMonthFirstDay(time);
        let endTime = common.getMonthLastDay(time);

        NavigatorService.weixiuList(this.state.pageIndex, billStatus, treeType, organizeId, startTime, endTime, repairArea).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data],
                };
            }
            this.setState({
                dataInfo: dataInfo,
                refreshing: false,
                //canLoadMore: true,
            }, () => {
                //console.log(this.state.dataInfo.data);
            });
        });
    };


    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1,
        }, () => {
            //console.log('state', this.state);
            this.getList();
        });
    };

    loadMore = () => {
        const {data, total, pageIndex} = this.state.dataInfo;
        //console.log('loadmore', this.state.dataInfo);
        // if (!this.state.canLoadMore) {
        //     return;
        // }
        if (this.canAction && data.length < total) {
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1,
                //canLoadMore: false,
            }, () => {
                this.getList();
            });
        }
    };

    _renderItem = ({item, index}) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.navigation.navigate('weixiuD', {data: item});
            }}>
                <Flex direction='column' align={'start'}
                      style={[styles.card, index === 0 ? styles.blue : styles.orange]}>
                    <Flex justify='between' style={{width: '100%'}}>
                        <Text style={styles.title}>{item.billCode}</Text>
                        <Text style={styles.title2}>{item.statusName}</Text>
                    </Flex>
                    <Flex style={styles.line}/>
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                              style={{width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20}}>
                            <Text>{item.address} {item.contactName}</Text>
                            <TouchableWithoutFeedback onPress={() => common.call(item.contactLink)}>
                                <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{width: 20, height: 20}}/></Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Text style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 40,
                            color: '#666',
                        }}>{item.repairContent}</Text>


                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    statusChange = (title) => {
        let billStatus;
        switch (title) {
            case '待派单': {
                billStatus = 1;
                break;
            }
            case '待接单': {
                billStatus = 2;
                break;
            }
            case '待完成': {
                billStatus = 4;
                break;
            }
            case '待回访': {
                billStatus = 5;
                break;
            }
            default: {
                billStatus = -1;
                break;
            }
        }
        this.setState({
            billStatus,
            pageIndex: 1,
        }, () => {
            this.onRefresh();
        });

    };
    timeChange = (time) => {
        this.setState({
            time,
            pageIndex: 1,
        }, () => {
            this.onRefresh();
        });

    };

    areaChange = (area) => {
        let repairArea = area;
        if (repairArea === '全部') {
            repairArea = '';
        }
        this.setState({
            repairArea,
            pageIndex: 1,
        }, () => {
            this.onRefresh();
        });
    };


    render() {
        const {statistics, dataInfo, ym} = this.state;
        return (

            <View style={{flex: 1}}>
                <CommonView style={{flex: 1}}>
                    <ScrollTitle onChange={this.statusChange} titles={['全部', '待派单', '待接单', '待完成', '待回访']}/>
                    {/*<Tabs tabs={tabs2} initialPage={1} tabBarPosition="top">*/}
                    {/*    {renderContent}*/}
                    {/*</Tabs>*/}
                    <Flex justify={'between'} style={{marginTop: 15, paddingRight: 15, height: 30}}>
                        <MyPopover onChange={this.areaChange} titles={['全部', '客户区域', '公共区域']}
                                   visible={true}/>
                        <MyPopover onChange={this.timeChange} titles={ym} visible={true}/>
                    </Flex>

                    <FlatList
                        data={dataInfo.data}
                        // ListHeaderComponent={}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item, index) => item.id}
                        // refreshing={this.state.refreshing}
                        // onRefresh={() => this.onRefresh()}
                        onEndReached={() => this.loadMore()}
                        onEndReachedThreshold={0.1}
                        // onScrollBeginDrag={() => this.canAction = true}
                        // onScrollEndDrag={() => this.canAction = false}
                        onMomentumScrollBegin={() => this.canAction = true}
                        onMomentumScrollEnd={() => this.canAction = false}
                        ListEmptyComponent={<NoDataView/>}
                    />
                </CommonView>
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
        borderLeftColor: Macro.work_orange,
        borderLeftWidth: 5,
    },
    aaa: {
        paddingRight: 20,
    },

});
const mapStateToProps = ({buildingReducer}) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(EstateWeixiuPage);
