import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon, Button, SearchBar } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
import service from '../statistics-service';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import UDToast from '../../../utils/UDToast';

let screen_width = ScreenUtil.deviceWidth();

class AssetsPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '固定资产',
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
            )
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

            btnText: '搜索', 
            selectBuilding: this.props.selectBuilding,
            estateId: null//机构id
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = (isRefreshing = false) => {
        if (this.state.loading || (!isRefreshing && !this.state.hasMore)) return;
        const currentPage = isRefreshing ? 1 : this.state.pageIndex;
        this.setState({ loading: true });
        const { estateId, keyword, pageSize } = this.state;
        // const queryJson = {
        //     keyword: text,
        //     estateId: estateId
        // };
        service.gdzcList(currentPage, pageSize, estateId, keyword).then(res => {
            if (isRefreshing) {
                this.setState({
                    data: res.data,
                    pageIndex: 2,
                    total: res.total
                });
            }
            else {
                this.setState({
                    data: [...this.state.data, ...res.data],
                    pageIndex: pageIndex + 1,
                    hasMore: pageIndex * pageSize < res.total ? true : false,
                    total: res.total
                });
            }
        }).catch(err => UDToast.showError(err)
        ).finally(() => this.setState({ loading: false, refreshing: false }))
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({
                selectBuilding: nextProps.selectBuilding,
                estateId: nextProps.selectBuilding.key
            }, () => {
                this.onRefresh();
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

    callBack = (pointId) => {
        this.setState({
            pointId
        }, () => {
            this.props.navigation.navigate('gdzcPandian', {
                data: {
                    assetsId: pointId
                }
            });
        });
    };

    start = () => {
        //test
        // this.props.navigation.navigate('gdzcPandian', {
        //     data: {
        //         assetsId: '31e9ee06-8105-4fdd-8925-410226900f09'
        //     }
        // });

        this.props.navigation.push('scanonly', {
            data: {
                callBack: this.callBack,
                //needBack: true
            }
        });
    };

    _renderItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('gdzcDetail', { data: item })}>
                <Flex direction="column" style={styles.content}>
                    <Flex style={{ justifyContent: 'space-between', width: screen_width - 40, marginTop: 10 }}>
                        <Text style={styles.top}>{item.code}</Text>
                        <Text style={styles.top}>{item.status}</Text>
                    </Flex>
                    <Flex style={styles.line} />
                    <Text style={styles.desc}>{item.name}{item.modelNo}</Text>
                    <Text style={styles.desc}>{item.address}</Text>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    search = () => {
        Keyboard.dismiss();
        this.onRefresh();
        this.setState({ btnText: '取消' });
    };

    clear = () => {
        const { btnText } = this.state;
        Keyboard.dismiss();
        if (btnText == '搜索') {
            this.onRefresh();
            this.setState({ btnText: '取消' });
        } else {
            this.setState({
                keyword: ''//必须要设置值，再调用方法，否则数据没有更新
            }, () => {
                this.onRefresh();
                this.setState({ btnText: '搜索' });
            });
        }
    };


    renderFooter = () => {
        if (!this.state.hasMore && this.state.data.length > 0) {
            return <Text>没有更多数据了</Text>;
        }
        return this.state.loading ? <ActivityIndicator /> : null;
    };


    render() {
        const { data, refreshing, total, btnText } = this.state;
        //const { selectBuilding } = this.props; 
        return (
            <View style={{ flex: 1 }}>
                <CommonView style={{ flex: 1 }}>
                    <SearchBar
                        placeholder="请输入"
                        showCancelButton
                        cancelText={btnText}
                        value={this.state.keyword}
                        onChange={keyword => this.setState({ keyword })}
                        onSubmit={() => this.search()}
                        onCancel={() => this.clear()}
                    />

                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={data}
                            // ListHeaderComponent={}
                            renderItem={this._renderItem}
                            keyExtractor={(item) => item.id}
                            // ItemSeparatorComponent={() => <View style={{ backgroundColor: '#eee', height: 1 }} />} 
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

                    {/* <TouchableWithoutFeedback onPress={this.start}>
                        <Flex justify={'center'} style={[styles.ii, {
                            width: '70%',
                            marginLeft: '15%',
                            marginRight: '15%',
                            marginBottom: 10,
                        }, { backgroundColor: Macro.work_blue }]}>
                            <Text style={styles.word}>开始盘点</Text>
                        </Flex>
                    </TouchableWithoutFeedback> */}

                    <Flex justify={'center'}>
                        <Button
                            onPress={this.start}
                            type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }}
                            style={{
                                width: 180,
                                marginBottom: 10,
                                marginTop: 10,
                                backgroundColor: Macro.work_blue,
                                height: 40
                            }}>开始盘点</Button>
                    </Flex>
                </CommonView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        marginTop: 20,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eeeeee',
        width: screen_width - 20,
        height: 110,
        alignItems: 'flex-start'
    },
    line: {
        width: ScreenUtil.deviceWidth() - 40,
        backgroundColor: '#E0E0E0',
        height: 1,
        marginVertical: 10
    },
    top: {
        fontSize: 16,
        color: '#666'
    },
    desc: {
        marginBottom: 10,
        color: '#404145',
        fontSize: 14
    },
    ii: {
        marginTop: 50,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginBottom: 20,
    },
    word: {
        color: 'white',
        fontSize: 16
    }
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding
    };
};

export default connect(mapStateToProps)(AssetsPage);
