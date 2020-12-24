import React//, { Fragment } 
    from 'react';
import {
    View,
    Text,
    StyleSheet,
    //StatusBar, Linking,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../base/base';
import {
    Flex, Icon
    //Button,  List, WhiteSpace 
} from '@ant-design/react-native';

import Macro from '../../utils/macro';
//import ScreenUtil from '../../utils/screen-util';
import { connect } from 'react-redux';
//import ListHeader from '../../components/list-header';
//import common from '../../utils/common';
import LoadImage from '../../components/load-image';
import NavigatorService from './navigator-service';
import NoDataView from '../../components/no-data-view';
import CommonView from '../../components/CommonView';


class FeeHousePage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        //console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '上门收费',
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
        };

    }

    componentDidMount(): void {
        this.onRefresh();
    }


    getList = () => {
        NavigatorService.getFeeStatistics(this.state.pageIndex, this.state.selectBuilding ? this.state.selectBuilding.key : '').then(dataInfo => {
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
        console.log('selectBuilding', selectBuilding);
        console.log('nextSelectBuilding', nextSelectBuilding);

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

    _renderItem = ({ item, index }) => {
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
                                    <Text>{item.roomcount}户</Text>
                                    <Text style={{ paddingTop: 12 }}>房产总数</Text>
                                </Flex>
                                <Flex direction={'column'}>
                                    <Text>{item.charge}户</Text>
                                    <Text style={{ paddingTop: 12 }}>交清</Text>
                                </Flex>
                                <Flex direction={'column'}>
                                    <Text>{item.notcharge}户</Text>
                                    <Text style={{ paddingTop: 12 }}>未交清</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </View>
            </TouchableWithoutFeedback>
        );
    };


    render() {
        const { statistics, dataInfo } = this.state;
        const { selectBuilding } = this.props;
        // console.log('selet', selectBuilding);
        return (
            <View style={{ flex: 1 }}>
                <CommonView style={{ flex: 1 }}>
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
                            ItemSeparatorComponent={() => <View style={{ backgroundColor: '#eee', height: 1 }} />}
                            onScrollBeginDrag={() => this.canAction = true}
                            onScrollEndDrag={() => this.canAction = false}
                            onMomentumScrollBegin={() => this.canAction = true}
                            onMomentumScrollEnd={() => this.canAction = false}
                            ListEmptyComponent={<NoDataView />}
                        />
                    </View>
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

    top: {

        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 10,
    },
    bottom: {
        color: '#868688',
        fontSize: 18,

    },
    button: {
        color: '#868688',
        fontSize: 16,
        paddingTop: 10,
    },
    blue: {
        borderLeftColor: Macro.color_4d8fcc,
        borderLeftWidth: 8,
    },
    orange: {
        borderLeftColor: Macro.color_f39d39,
        borderLeftWidth: 8,
    },

    left: {
        flex: 1,
        paddingLeft: 15,


    },
    right: {
        flex: 3,


        marginLeft: 20,
    },
    image: {
        height: 90,
        width: 90,
    },
    item: {
        width: '100%',
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        paddingBottom: 15,
    },
    area: {
        color: Macro.color_636470,
        fontSize: Macro.font_14,
    },
    complete: {
        color: Macro.color_80aae2,
        fontSize: Macro.font_14,
        backgroundColor: Macro.color_dae9ff,
        padding: 3,
        paddingLeft: 5,
        borderRadius: 1,
    },
    number: {
        color: Macro.color_9c9ca5,
        fontSize: Macro.font_14,
    },
    desc: {
        color: Macro.color_c2c1c5,
        fontSize: Macro.font_14,
    },
    line: {
        width: 1,
        height: 15,
        backgroundColor: Macro.color_c2c1c5,
        marginLeft: 5,
        marginRight: 5,
    },
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(FeeHousePage);
