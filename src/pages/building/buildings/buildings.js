import React
//, {Fragment} 
from 'react';
import {View,  StyleSheet, FlatList, 
    //Text, SafeAreaView, StatusBar,TouchableOpacity, TextInput
} from 'react-native';

import BasePage from '../../base/base';
//import BuildingHeader from '../../../components/building/building-header';
import BuildingCell from '../../../components/building/build-cell';
//import {Button, Flex, Icon, List, WhiteSpace} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import BuildingsService from './buildings-service';
import ScreenUtil from '../../../utils/screen-util';
import {connect} from 'react-redux';
import common from '../../../utils/common';
import BackTitleNavigationBar from '../../../components/back-title-navigation-bar';
import NoDataView from '../../../components/no-data-view';
import CommonView from '../../../components/CommonView';

class BuildingsPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            header: null,
        };
    };

    constructor(props) {
        super(props);
        let item = common.getValueFromProps(this.props);
        this.state = {
            data: [],
            item,
        };
    }

    componentDidMount(): void {
        this.getInitData();
    }

    getInitData = () => {
        BuildingsService.getAsynChildBuildings(this.state.item.id, 2).then(res => {
            this.setState({data: res.data});
        });
    };
    _renderItem = ({item}) => {
        return <BuildingCell nextRouteName='DetailBuilding' {...this.props} item={item}/>;
    };


    render() {
        return (
            <CommonView style={{flex: 1}}>
                <View style={styles.content}>
                    <BackTitleNavigationBar {...this.props} title={this.state.item.name}/>
                    <FlatList
                        data={this.state.data}
                        // ListHeaderComponent={}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item, index) => item.id}
                        ListEmptyComponent={<NoDataView/>}
                        // refreshing={this.state.refreshing}
                        // onRefresh={() => this.onRefresh()}
                        // onEndReached={() => this.loadMore()}
                        // onEndReachedThreshold={0}
                        // onScrollBeginDrag={() => this.canAction = true}
                        // onScrollEndDrag={() => this.canAction = false}
                        // onMomentumScrollBegin={() => this.canAction = true}
                        // onMomentumScrollEnd={() => this.canAction = false}
                    />
                </View>

            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: Macro.color_white,
        flex: 1,
        // height: ScreenUtil.contentHeightWithNoTabbar(),
    },
    list: {
        // marginBottom: ScreenUtil.tabbarHeight()
        height: ScreenUtil.contentHeightWithNoTabbar(),
    },
});
const mapStateToProps = ({buildingReducer}) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};

export default connect(mapStateToProps)(BuildingsPage);
