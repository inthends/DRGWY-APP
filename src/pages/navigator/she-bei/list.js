import React, {Fragment} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Keyboard

} from 'react-native';
import BasePage from '../../base/base';
import {Button, Flex, Icon, List, WhiteSpace, SearchBar} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import {connect} from 'react-redux';
import common from '../../../utils/common';
import LoadImage from '../../../components/load-image';
import ScrollTitle from '../../../components/scroll-title';
import MyPopover from '../../../components/my-popover';
import NavigatorService from '../navigator-service';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import api from '../../../utils/api';


class SheBeiList extends BasePage {
    static navigationOptions = ({navigation}) => {
        //console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '设备资料',
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
            billType: '全部',
            billStatus: -1,
            //canLoadMore: true,
            time: common.getCurrentYearAndMonth(),
            selectBuilding: this.props.selectBuilding,
        };

    }

    componentDidMount() {

        this.onRefresh();
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
        const {text} = this.state;
        let params = {keyword: text};
        if (this.state.selectBuilding) {
            params = {
                ...params,
                organizeId: this.state.selectBuilding.key
            }
        }

        api.getData('/api/MobileMethod/MGetDeviceList',params).then(res=>{
            this.setState({data:res});
        })

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
        // console.log('loadmore', this.state.dataInfo);
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

    _renderItem = ({item, index}) => {
        return (
            <TouchableWithoutFeedback key={item.id} onPress={() => {
                this.props.navigation.push('shebeiDetail', {data: item});
            }}>
                <Flex justify='between' style={{width: '100%'}}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.title2}>{item.code}</Text>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    search = () => {
        Keyboard.dismiss();
        this.onRefresh();
    };


    render() {
        const {data = []} = this.state;
        return (


            <View style={{flex: 1}}>
                <CommonView style={{flex: 1}}>


                        <SearchBar cancelText='搜索' showCancelButton={true} onCancel={this.search} value={this.state.text} onChange={text=>this.setState({text})} onSubmit={this.search}/>


                    {
                        data.map((item,index)=>{
                            return this._renderItem({item,index})
                        })
                    }

                    {/*<FlatList*/}
                    {/*    data={dataInfo.data}*/}
                    {/*    // ListHeaderComponent={}*/}
                    {/*    renderItem={this._renderItem}*/}
                    {/*    style={styles.list}*/}
                    {/*    keyExtractor={(item, index) => item.id}*/}
                    {/*    //refreshing={this.state.refreshing}*/}
                    {/*    //onRefresh={() => this.onRefresh()}*/}
                    {/*    onEndReached={() => this.loadMore()}*/}
                    {/*    onEndReachedThreshold={0.1}*/}
                    {/*    // onScrollBeginDrag={() => this.canAction = true}*/}
                    {/*    // onScrollEndDrag={() => this.canAction = false}*/}
                    {/*    onMomentumScrollBegin={() => this.canAction = true}*/}
                    {/*    onMomentumScrollEnd={() => this.canAction = false}*/}
                    {/*    ListEmptyComponent={<NoDataView/>}*/}
                    {/*/>*/}
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

});
const mapStateToProps = ({buildingReducer}) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(SheBeiList);
