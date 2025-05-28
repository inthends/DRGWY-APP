import React//, {Fragment} 
    from 'react';
import {
    Text, View, StyleSheet, FlatList, TouchableOpacity
} from 'react-native';
import BasePage from '../../base/base';
import Macro from '../../../utils/macro';
import BuildingsService from './buildings-service';
import ScreenUtil from '../../../utils/screen-util';
import { connect } from 'react-redux';
import { Icon } from '@ant-design/react-native';
import common from '../../../utils/common';
// import BackTitleNavigationBar from '../../../components/back-title-navigation-bar';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';
import BuildingCell from '../../../components/building/build-cell';

class BuildingsPage extends BasePage {

    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         tabBarVisible: false,
    //         header: null
    //     };
    // };

    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '楼栋列表',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        let item = common.getValueFromProps(this.props);
        this.state = {
            data: [],
            item
        };
    }

    componentDidMount() {
        this.getInitData();
    }

    getInitData = () => {
        //获取楼栋和车库
        BuildingsService.getAsynChildBuildings(this.state.item.id).then(res => {
            this.setState({ data: res.data });
        });
    };

    _renderItem = ({ item }) => {
        if (item.type == 2) { 
            //楼栋详情
            return <BuildingCell nextRouteName='DetailBuilding' {...this.props} item={item} />; 
        }
        else
            //车库详情
            return <BuildingCell nextRouteName='DetailParking' {...this.props} item={item} />;
    };

    render() {
        const { data } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <View style={styles.content}>
                    {/* <BackTitleNavigationBar {...this.props} title={this.state.item.name} /> */}
                    <Text style={{ paddingLeft: 20, paddingTop: 15, fontSize: 20, color: '#2c2c2c' }}>{this.state.item.name}</Text>
                    <FlatList
                        data={data}
                        // ListHeaderComponent={}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={<NoDataView />}
                    />
                </View>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: Macro.color_white,
        flex: 1
        // height: ScreenUtil.contentHeightWithNoTabbar(),
    },
    list: {
        // marginBottom: ScreenUtil.tabbarHeight()
        height: ScreenUtil.contentHeightWithNoTabbar()
    }
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding
    };
};

export default connect(mapStateToProps)(BuildingsPage);
