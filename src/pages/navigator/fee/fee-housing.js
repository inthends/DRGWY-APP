import React//, { Fragment } 
    from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import BasePage from '../../base/base';
import {
    Flex, Icon
    //Button,  List, WhiteSpace 
} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
//import ScreenUtil from '../../utils/screen-util';
import { connect } from 'react-redux';
//import ListHeader from '../../components/list-header';
//import common from '../../utils/common';
import LoadImage from '../../../components/load-image';
import service from '../statistics-service';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import UDToast from '../../../utils/UDToast';

class FeeHousePage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '上门收费',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                    <Icon name='bars' style={{ marginRight: 15 }} color="black" />
                </TouchableWithoutFeedback>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            data: [],
            refreshing: false,//刷新
            loading: false,//加载完成 
            hasMore: true,//更多
            selectBuilding: this.props.selectBuilding,
        };
    }

    componentDidMount() {
        this.loadData();
    }


    loadData = (isRefreshing = false) => {
        if (this.state.loading || (!isRefreshing && !this.state.hasMore)) return;
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const {data, pageIndex, pageSize } = this.state;
        service.getFeeStatistics(
            currentPage,
            pageSize,
            this.state.selectBuilding ? this.state.selectBuilding.key : '').then(res => {
                if (isRefreshing) {
                    this.setState({
                        data: res.data,
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
    };

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({ selectBuilding: nextProps.selectBuilding }, () => {
                this.loadData();
            });
        }
    }

    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1
        }, () => {
            this.loadData(true);
        });
    };

    //加载更多
    loadMore = () => {
        const { pageIndex } = this.state;
        this.setState({
            pageIndex: pageIndex + 1
        }, () => {
            this.loadData();
        });
    };

    _renderItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('feeBuildings', { data: item })}>
                <View style={styles.content}>
                    <Flex direction="row" style={styles.top}>
                        <Flex justify={'center'} style={styles.left}>
                            <LoadImage img={item.mainpic} style={styles.image} />
                        </Flex>
                        <Flex direction="column" style={styles.right}>
                            <Flex style={styles.item}>
                                <Text style={styles.name}>{item.name}</Text>
                            </Flex>
                            <Flex justify={'between'} style={{ width: '100%', paddingRight: 20 }}>
                                <Flex direction={'column'}>
                                    <Text style={styles.number}>{item.roomcount}套</Text>
                                    <Text style={styles.desc}>房产总数</Text>
                                </Flex>
                                <Flex direction={'column'}>
                                    <Text style={styles.number}>{item.charge}套</Text>
                                    <Text style={styles.desc}>缴清</Text>
                                </Flex>
                                <Flex direction={'column'}>
                                    <Text style={styles.number}>{item.notcharge}套</Text>
                                    <Text style={styles.desc}>未缴清</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    renderFooter = () => {
        if (!this.state.hasMore && this.state.data.length > 0) {
            return <Text style={{ fontSize: 14, alignSelf: 'center' }}>没有更多数据了</Text>;
        }

        return this.state.loading ? <ActivityIndicator /> : null;
    };

    render() {
        const { data, refreshing, total } = this.state;
        //const { selectBuilding } = this.props; 
        return (
            <View style={{ flex: 1 }}>
                <CommonView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={data}
                            // ListHeaderComponent={}
                            renderItem={this._renderItem}
                            keyExtractor={(item) => item.id}
                            ItemSeparatorComponent={() => <View style={{ backgroundColor: '#eee', height: 1 }} />}
                            //必须
                            onEndReachedThreshold={0.1}
                            refreshing={refreshing}
                            onRefresh={this.onRefresh}//下拉刷新
                            onEndReached={this.loadMore}//底部往下拉翻页
                            //onMomentumScrollBegin={() => this.canLoadMore = true}
                            ListFooterComponent={this.renderFooter}
                            ListEmptyComponent={<NoDataView />}
                        />
                        <Text style={{ fontSize: 14, alignSelf: 'center' }}>当前 1 - {data.length}, 共 {total} 条</Text>

                    </View>
                </CommonView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    content: {
        backgroundColor: Macro.color_white,
        flex: 1
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

    number: {
        color: '#666',
        fontSize: Macro.font_14
    },
    desc: {
        paddingTop: 12,
        color: '#999999',
        fontSize: Macro.font_14
    },
    top: {
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10
    },



    left: {
        flex: 1,
        paddingLeft: 15
    },
    right: {
        flex: 3,
        marginLeft: 10
    },
    image: {
        height: 90,
        width: 90,
        borderRadius: 5
    },
    item: {
        width: '100%'
    },
    name: {
        fontSize: 16,
        color: '#2c2c2c',
        paddingBottom: 15
    }

});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(FeeHousePage);
