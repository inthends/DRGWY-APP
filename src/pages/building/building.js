import React, {Fragment} from 'react';
import {View, Text, SafeAreaView, StyleSheet, StatusBar, FlatList} from 'react-native';

import BasePage from '../base/base';
import BuildingHeader from '../../components/building/building-header';
import BuildingCell from '../../components/building/build-cell';
import {Button, List, WhiteSpace} from '@ant-design/react-native';
import Macro from '../../utils/macro';
import BuildingService from './building_service';
import ScreenUtil from '../../utils/screen-util';
import {connect} from 'react-redux';
import {NativeModules} from 'react-native';
import NoDataView from '../../components/no-data-view';

class BuildingPage extends BasePage {
    static navigationOptions = ({navigation}) => {

        console.log(1, navigation);
        return {
            tabBarVisible: false,
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
            refreshing: true,
        };

    }

    componentDidMount(): void {
        this.getInitData();
        this.onRefresh();
        // NativeModules.LHNToast.login("name","key",
        //     (a,b,c)=>{
        //         alert(a + ' ' + b + ' ' + c)
        //     })
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (obj.state.params) {
                    let address = obj.state.params;
                    alert(address);
                }


            },
        );
    }


    componentWillUnmount(): void {
        this.viewDidAppear.remove();
    }

    getInitData = () => {
        BuildingService.getStatisticsTotal(this.selectBuilding.key).then(res => {
            if (res && res.length > 0) {
                this.setState({statistics: res[0]});
            }
        });
    };

    getList = () => {
        BuildingService.getStatistics(this.state.pageIndex, this.selectBuilding.key).then(dataInfo => {
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
                console.log(this.state.dataInfo.data);
            });
        });
    };


    openDrawer = () => {
        this.drawer && this.drawer.openDrawer();
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
        console.log('loadmore');
        if (this.canAction && data.length < total) {
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1,
            }, () => {
                this.getList();
            });
        }
    };

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        console.log(112233445566, nextProps);
        if (!(this.selectBuilding && nextProps.selectBuilding && (this.selectBuilding.key === nextProps.selectBuilding.key))) {
            this.selectBuilding = nextProps.selectBuilding;
            this.onRefresh();
        }
    }


    render() {
        const {statistics, dataInfo} = this.state;
        return (
            <View style={styles.all}>
                <SafeAreaView style={{flex: 1}}>
                    <View style={styles.content}>
                        <BuildingHeader title={this.selectBuilding.title} statistics={statistics}
                                        openDrawer={this.openDrawer} {...this.props}/>
                        {/*<BuildingCell {...this.props} item={{}}/>*/}
                        <FlatList
                            data={dataInfo.data}
                            // ListHeaderComponent={}
                            renderItem={({item}) => <BuildingCell nextRouteName='Buildings' {...this.props}
                                                                  item={item}/>}
                            style={styles.list}
                            keyExtractor={(item, index) => item.id}
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                            onEndReached={() => this.loadMore()}
                            onEndReachedThreshold={0}
                            onScrollBeginDrag={() => this.canAction = true}
                            onScrollEndDrag={() => this.canAction = false}
                            onMomentumScrollBegin={() => this.canAction = true}
                            onMomentumScrollEnd={() => this.canAction = false}
                            ListEmptyComponent={<NoDataView/>}
                        />
                    </View>

                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_sky_dark,
        flex: 1,
    },
    content: {
        backgroundColor: Macro.color_white,
        flex: 1,


    },
    list: {
        backgroundColor: Macro.color_white,
    },
});
const mapStateToProps = ({buildingReducer}) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};

export default connect(mapStateToProps)(BuildingPage);
