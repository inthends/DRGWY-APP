import React from 'react';
import {
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
import ListHeader from '../../../components/list-header';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import WorkService from '../work-service';
import ListJianYanHeader from '../../../components/list-jianyan-header';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';

//待完成服务单列表
class ServicedeskListPage extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: navigation.getParam('data') ? navigation.getParam('data').title : '',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
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
            key: null
        };
        const type = common.getValueFromProps(this.props).type;
        //const overdue = common.getValueFromProps(this.props).overdue;
        const hiddenHeader = common.getValueFromProps(this.props).hiddenHeader;
        this.state = {
            showTabbar: true,
            pageIndex: 1,
            statistics: {},
            type,
            dataInfo: {
                data: [],
            },
            overdue: -1,
            hiddenHeader,
            refreshing: false
        };
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.onRefresh();
            }
        );
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({ selectBuilding: nextProps.selectBuilding }, () => {
                this.onRefresh();
            });
        }
    }

    getList = () => {
        const { type, overdue, pageIndex } = this.state;
        WorkService.servicedeskList(type, overdue, pageIndex).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data],
                };
            }
            this.setState({
                dataInfo: dataInfo,
                refreshing: false
            }, () => {
            });
        }).catch(err => this.setState({ refreshing: false }));
    };

    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1
        }, () => {
            this.getList();
        });
    };

    loadMore = () => {
        const { data, total, pageIndex } = this.state.dataInfo;
        if (this.canAction && data.length < total) {
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1
            }, () => {
                this.getList();
            });
        }
    };

    _renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={() => {  
                switch (item.statusName) { 
                    case '待处理': {
                        this.props.navigation.navigate('service', { id: item.id });
                        break;
                    }
                    case '待回访': {
                        this.props.navigation.navigate('huifang', { id: item.id });
                        break;
                    } 
                    default:
                        break;
                }
            }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, index === 0 ? styles.blue : styles.orange]}>
                    <Flex justify='between' style={{ width: '100%' }}>
                        <Text style={styles.title}>{item.billCode}</Text>
                        <Text style={styles.aaa}>{item.statusName}</Text>
                    </Flex>
                    <Flex style={styles.line} />
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                            style={{ width: '100%', paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>{item.address} {item.contactName}</Text>
                            <TouchableWithoutFeedback
                                onPress={() => common.call(item.contactLink || item.contactPhone)}>
                                <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{ width: 15, height: 15 }} /></Flex>
                            </TouchableWithoutFeedback>
                        </Flex>

                        <Flex justify='between'
                            style={{ width: '100%', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>所属区域：{item.repairArea}，是否有偿：{item.isPaid}</Text>
                        </Flex>

                        <Flex justify='between'
                            style={{ width: '100%', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>紧急：{item.emergencyLevel}，重要：{item.importance}</Text>
                        </Flex>
                        
                        <Text style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 20,
                            color: '#666'
                        }}>{item.repairContent || item.contents}</Text>
                        <Flex justify='between'
                            style={{ width: '100%', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                            <Text>{item.billDate}</Text>
                        </Flex>

                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };


    render() {
        const { dataInfo, overdue, hiddenHeader, type } = this.state;

        return (
            <CommonView style={{ flex: 1 }}>

                {
                    hiddenHeader ? null :
                        (
                            type === '6' ?
                                <ListJianYanHeader overdue={overdue}
                                    onChange={(overdue) => this.setState({ overdue }, () => {
                                        this.onRefresh();
                                    })} /> :
                                <ListHeader overdue={overdue} onChange={(overdue) => this.setState({ overdue }, () => {
                                    this.onRefresh();
                                })} />
                        )
                }

                <FlatList
                    data={dataInfo.data}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.id}
                    onEndReached={() => this.loadMore()}
                    onEndReachedThreshold={0}
                    onScrollBeginDrag={() => this.canAction = true}
                    onScrollEndDrag={() => this.canAction = false}
                    onMomentumScrollBegin={() => this.canAction = true}
                    onMomentumScrollEnd={() => this.canAction = false}
                    ListEmptyComponent={<NoDataView />}
                />
                <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {dataInfo.data.length}, 共 {dataInfo.total} 条</Text>
            </CommonView>

        );
    }
}

const styles = StyleSheet.create({

    list: {
        backgroundColor: Macro.color_white,
        //margin: 15
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
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
        borderLeftWidth: 5
    },
    orange: {
        borderLeftColor: '#F7A51E',
        borderLeftWidth: 5
    },
    aaa: {
        paddingRight: 20
    }
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding
    };
};
export default connect(mapStateToProps)(ServicedeskListPage);