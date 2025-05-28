import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard

} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon, SearchBar } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
// import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
import common from '../../../utils/common';
import CommonView from '../../../components/CommonView';
import api from '../../../utils/api';
 
class SheBeiList extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '设备资料',
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
        this.selectBuilding = {
            key: null
        };

        this.state = {
            pageIndex: 1,
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
            btnText: '搜索' 
        };
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillReceiveProps(nextProps, nextContext )  {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;

        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({ selectBuilding: nextProps.selectBuilding }, () => {
                this.onRefresh();
            });
        }
    }

    getList = () => {
        const { text } = this.state;//没有分页
        let params = { keyword: text };
        if (this.state.selectBuilding) {
            params = {
                ...params,
                organizeId: this.state.selectBuilding.key
            }
        }
        api.getData('/api/MobileMethod/MGetDeviceList', params).then(res => {
            this.setState({ data: res });
        })

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
        // if (!this.state.canLoadMore) {
        //     return;
        // }
        if (this.canLoadMore && data.length < total) {
            this.canLoadMore = false;
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1
                // canLoadMore: false,
            }, () => {
                this.getList();
            });
        }
    };

    _renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback key={item.id} onPress={() => {
                this.props.navigation.push('shebeiDetail', { data: item });
            }}>
                <Flex justify='between' style={{ width: '100%' }}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.title2}>{item.code}</Text>
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

    render() {
        const { data = [], btnText } = this.state;
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

                    {
                        data.map((item, index) => {
                            return this._renderItem({ item, index })
                        })
                    }
                </CommonView>
            </View>

        );
    }
}

const styles = StyleSheet.create({

    list: {
        backgroundColor: Macro.color_white,
        margin: 15,
    },
    title: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    title2: {
        paddingTop: 15,
        // textAlign: 'left',
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10,
        marginRight: 20
    }

});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding
    };
};

export default connect(mapStateToProps)(SheBeiList);
