import React//, { Fragment } 
    from 'react';
import {
    View,
    Text,
    StyleSheet,
    //StatusBar, Linking,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import BasePage from '../base/base';
import {
    Flex, Icon, SearchBar
    //Button,  List, WhiteSpace 
} from '@ant-design/react-native';

import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
import { connect } from 'react-redux';
//import ListHeader from '../../components/list-header';
//import common from '../../utils/common';
import LoadImage from '../../components/load-image';
import NavigatorService from './navigator-service';
import NoDataView from '../../components/no-data-view';
import CommonView from '../../components/CommonView';

let screen_width = ScreenUtil.deviceWidth()
class gdMoneyPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        //console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '固定资产',
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
            count: 0,
            showTabbar: true,
            pageIndex: 1,
            statistics: {},
            dataInfo: {
                data: [],
            },
            refreshing: false,
            selectBuilding: this.props.selectBuilding,
            searchText: ''
        };

    }

    componentDidMount(): void {
        this.onRefresh();
    }

    getList = () => {
        const {text} = this.state
        NavigatorService.gdzcList(this.state.pageIndex, this.state.refreshing,text).then(dataInfo => {
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
                console.log(this.state.dataInfo.data);
            });
        });

    };

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        // console.log('selectBuilding', selectBuilding);
        // console.log('nextSelectBuilding', nextSelectBuilding); 
        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({ selectBuilding: nextProps.selectBuilding }, () => {
                this.onRefresh();
            });
        }

    }

    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1,
        }, () => {
            this.getList();
        });
    };

    loadMore = () => {
        const { data, total, pageIndex } = this.state.dataInfo;
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

    callBack = (pointId) => {
        this.setState({
            pointId,
        }, () => {
            this.props.navigation.navigate('gdzcPandian', {
                data:{
                    assetsId: pointId
                }
            });
        });
    };

    start = () => {
        this.props.navigation.push('scanForWork', {
            data: {
                callBack: this.callBack,
                needBack: '1',
            },
        });
    };

    _renderItem = ({ item, index }) => {
    
        return (
            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('gdzcDetail', { data: item })}>
                <Flex direction="column" style={styles.content}>
                    <Flex style={{ justifyContent: 'space-between',width:screen_width - 40,marginTop:10}}>
                        <Text style={styles.top}>{item.code}</Text>
                        <Text style={styles.top}>{item.status}</Text>
                    </Flex>
                    <Flex style={styles.line}/>
                    <Text style={styles.desc}>{item.name}{item.modelNo}</Text>
                    <Text style={styles.desc}>{item.address}</Text>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    search = () => {
        Keyboard.dismiss();
        this.onRefresh();
    };

    render() {
        const { statistics, dataInfo } = this.state;
        //const { selectBuilding } = this.props;
        //console.log('selet', selectBuilding);
        return (
            <View style={{ flex: 1 }}>
                <CommonView style={{ flex: 1 }}>
                    <SearchBar cancelText='搜索' showCancelButton={true} onCancel={this.search} value={this.state.text} onChange={text => this.setState({ text })} onSubmit={this.search} />
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={dataInfo.data}
                            // ListHeaderComponent={}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => item.id}
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                            onEndReached={() => this.loadMore()}
                            onEndReachedThreshold={0.1}
                            // ItemSeparatorComponent={() => <View style={{ backgroundColor: '#eee', height: 1 }} />}
                            onScrollBeginDrag={() => this.canAction = true}
                            onScrollEndDrag={() => this.canAction = false}
                            onMomentumScrollBegin={() => this.canAction = true}
                            onMomentumScrollEnd={() => this.canAction = false}
                            ListEmptyComponent={<NoDataView />}
                        />
                    </View>
                    <TouchableWithoutFeedback onPress={this.start}>
                    <Flex justify={'center'} style={[styles.ii, {
                        width: '80%',
                        marginLeft: '10%',
                        marginRight: '10%',
                        marginBottom: 20,
                    }, {backgroundColor: Macro.color_4d8fcc}]}>
                        <Text style={styles.word}>开始盘点</Text>
                    </Flex>
                </TouchableWithoutFeedback>
                </CommonView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        marginTop:20,
        marginHorizontal:10,
        paddingHorizontal:10,
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eeeeee',
        width: screen_width - 20,
        height:110,
        alignItems:'flex-start'
    },
    line: {
        width: ScreenUtil.deviceWidth() - 40,
        backgroundColor: '#E0E0E0',
        height: 1,
        marginVertical:10
    },
    top: {
        fontSize: 14,
        color:'#666'
    },
    desc: {
        marginBottom: 10,
        color: '#333',
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
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};

export default connect(mapStateToProps)(gdMoneyPage);
