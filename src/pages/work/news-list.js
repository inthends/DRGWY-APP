import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';
import BasePage from '../base/base';
import Macro from '../../utils/macro';
import WorkService from './work-service';
import NoDataView from '../../components/no-data-view';
import { Flex, Icon } from '@ant-design/react-native';


class NewsList extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '未读消息',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);
        // this.selectBuilding = {
        //     key: null,
        // };
        this.state = {
            count: 0,
            showTabbar: true,
            pageIndex: 1,
            dataInfo: {
                data: [],
            },
            refreshing: true
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

    getList = (showLoading = true) => {
        WorkService.unreadList(this.state.pageIndex, showLoading).then(dataInfo => {
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
            });
        });
    };

    onRefresh = () => {
        this.setState({
            refreshing: false,
            pageIndex: 1,
        }, () => {
            this.getList();
        });
    };

    loadMore = () => {
        const { data, total, pageIndex } = this.state.dataInfo;
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

    _renderItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback key={item.id}
                onPress={() => {
                    //WorkService.readNews(item.id);
                    const { appUrlName, linkId } = item;
                    // const d = {
                    //     ...item,
                    //     id: item.linkId
                    // }; 
                    // switch (type) {
                    //     case 1:
                    //     case 2: {
                    //         this.props.navigation.navigate('service', { data: d });
                    //         break;
                    //     }
                    //     case 3: {
                    //         this.props.navigation.navigate('paidan', { data: d });
                    //         break;
                    //     }
                    //     case 4: {
                    //         this.props.navigation.navigate('jiedan', { data: d });
                    //         break;
                    //     }
                    //     case 5: {
                    //         this.props.navigation.navigate('huifang', { data: d });
                    //         break;
                    //     }
                    //     case 6: {
                    //         //检验
                    //         this.props.navigation.navigate('jianyan', { data: d });
                    //         break;
                    //     } 
                    //     case 98: //评审回复
                    //     case 99: //催办消息
                    //         {
                    //             //跳转到待审批
                    //             this.props.navigation.navigate('shenpi');
                    //             break;
                    //         }
                    // }

                    //根据url跳转
                    this.props.navigation.navigate(appUrlName, { id: linkId });
                }}>
                <Flex direction='column' align={'start'}
                    style={[styles.card, styles.blue]}>
                    <Flex justify='between' style={{ width: '100%' }}>
                        <Text style={styles.title}>{item.title}</Text>
                        {/* <Text style={item.isRead === 0 ? styles.unread : styles.read}>{item.isRead ? '已读' : '未读'}</Text> */}
                        <Text style={styles.read}>{item.sendUserName}，{item.sdtime}</Text>
                    </Flex>
                    <Flex style={styles.line} />
                    <Flex align={'start'} direction={'column'}>
                        <Flex justify='between'
                            style={{
                                width: '100%',
                                paddingTop: 10//, paddingLeft: 20, paddingRight: 20
                            }}
                        >
                            <Text style={{
                                color: '#666',
                                fontSize: 15,
                            }}>{item.contents}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </TouchableWithoutFeedback>
        );
    };

    render() {
        const { dataInfo } = this.state;
        return (
            <View style={styles.content}>
                <FlatList
                    data={dataInfo.data}
                    // ListHeaderComponent={}
                    renderItem={this._renderItem}
                    style={styles.list}
                    keyExtractor={(item) => item.id + 'cell'}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.onRefresh()}
                    onEndReached={() => this.loadMore()}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => this.canAction = false}
                    ListEmptyComponent={<NoDataView />}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_sky_dark,
        flex: 1
    },
    content: {
        backgroundColor: Macro.color_white,
        flex: 1
    },
    list: {
        backgroundColor: Macro.color_white,
        margin: 15
    },
    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5
    },
    title: {
        color: '#333',
        fontSize: 18
    },
    unread: {
        color: Macro.color_FA3951,
        fontSize: 16
    },
    read: {
        color: '#666',
        fontSize: 16
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
        shadowOpacity: 0.8,
        padding: 15
    }
});
export default NewsList;
