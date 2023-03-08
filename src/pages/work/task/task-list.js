import React, {Fragment} from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Linking,
} from 'react-native';
import BasePage from '../../base/base';
import {Button, Flex, Icon, List, WhiteSpace} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import {connect} from 'react-redux';
import ListHeader from '../../../components/list-header';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import ScrollTitle from '../../../components/scroll-title';
import WorkService from '../work-service';
import ListJianYanHeader from '../../../components/list-jianyan-header';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';

class TaskListPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        //console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: navigation.getParam('data') ? navigation.getParam('data').title : '',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
            // headerRight: (
            //     <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
            //         <Icon name='bars' style={{ marginRight: 15 }} color="black" />
            //     </TouchableWithoutFeedback>
            // ),
        };
    };

    constructor(props) {
        super(props);
        this.selectBuilding = {
            key: null,
        };
        // let pageParames = common.getValueFromProps(this.props);
        // console.log('pageParames',pageParames)
        const type = common.getValueFromProps(this.props).type;
        const overdue = common.getValueFromProps(this.props).overdue;
        const hiddenHeader = common.getValueFromProps(this.props).hiddenHeader;

        this.state = {
            count: 0,
            showTabbar: true,
            pageIndex: 1,
            statistics: {},
            type,
            dataInfo: {
                data: [],
            },
            overdue,
            hiddenHeader,
            refreshing: false,
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


    componentWillUnmount(): void {
        this.viewDidAppear.remove();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        console.log('selectBuilding', selectBuilding);
        console.log('nextSelectBuilding', nextSelectBuilding);

        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({selectBuilding: nextProps.selectBuilding}, () => {
                this.onRefresh();
            });
        }

    }


    getList = () => {
        const {type, overdue, pageIndex} = this.state;
        WorkService.workList(type, overdue, pageIndex).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data],
                };
            }
            this.setState({
                dataInfo: dataInfo,
                refreshing: false,
            }, () => {
                // console.log(this.state.dataInfo.data);
            });
        });
    };


    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1,
        }, () => {
            this.getList();
        });
    };
    loadMore = () => {
        const {data, total, pageIndex} = this.state.dataInfo;
        //console.log('loadmore');
        if (this.canAction && data.length < total) {
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1,
            }, () => {
                this.getList();
            });
        }
    };

    _renderItem = ({item, index}) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                const {type} = this.state;
                if (type === 'fuwu') {
                    this.props.navigation.navigate('service', {data: item});

                } else {
                    switch (item.statusName) {
                        case '待派单': {
                            this.props.navigation.navigate('paidan', {data: item});
                            break;
                        }
                        case '待接单': {
                            this.props.navigation.navigate('jiedan', {data: item});
                            break;
                        }
                        case '待开工': {
                            this.props.navigation.navigate('kaigong', {data: item});
                            break;
                        }
                        case '待完成': {
                            this.props.navigation.navigate('wancheng', {data: item});
                            break;
                        }
                        case '待检验': {
                            this.props.navigation.navigate('jianyan', {data: item});
                            break;
                        }
                        case '待回访': {
                            this.props.navigation.navigate('huifang', {data: item});
                            break;
                        }
                        default:
                            console.log(item);
                            break;
                    }
                }


            }}>
                <Flex direction='column' align={'start'}
                      style={[styles.card, index === 0 ? styles.blue : styles.orange]}>
                    <Flex justify='between' style={{width: '100%'}}>
                        <Text style={styles.title}>{item.billCode}</Text>
                        <Text style={styles.aaa}>{item.statusName}</Text>
                    </Flex>
                    <Flex style={styles.line}/>
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                              style={{width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20}}>
                            <Text>{item.address} {item.contactName}</Text>
                            <TouchableWithoutFeedback
                                onPress={() => common.call(item.contactLink || item.contactPhone)}>
                                <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{width: 20, height: 20}}/></Flex>
                            </TouchableWithoutFeedback>
                        </Flex>
                        <Text style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 40,
                            color: '#666',
                        }}>{item.repairContent || item.contents}</Text>
                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };


    render() {
        const {statistics, dataInfo, overdue, hiddenHeader, type} = this.state;
        return (


            <CommonView style={{flex: 1}}>
                {
                    hiddenHeader ? null :
                        (
                            type === '6' ?
                                <ListJianYanHeader overdue={overdue}
                                                   onChange={(overdue) => this.setState({overdue}, () => {
                                                       this.onRefresh();
                                                   })}/> :
                                <ListHeader overdue={overdue} onChange={(overdue) => this.setState({overdue}, () => {
                                    this.onRefresh();
                                })}/>
                        )
                }
                <FlatList
                    data={dataInfo.data}
                    // ListHeaderComponent={}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item, index) => item.id}
                    // refreshing={this.state.refreshing}
                    // onRefresh={() => this.onRefresh()}
                    onEndReached={() => this.loadMore()}
                    onEndReachedThreshold={0}
                    onScrollBeginDrag={() => this.canAction = true}
                    onScrollEndDrag={() => this.canAction = false}
                    onMomentumScrollBegin={() => this.canAction = true}
                    onMomentumScrollEnd={() => this.canAction = false}
                    ListEmptyComponent={<NoDataView/>}
                />


            </CommonView>

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
});

const mapStateToProps = ({buildingReducer}) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(TaskListPage);
