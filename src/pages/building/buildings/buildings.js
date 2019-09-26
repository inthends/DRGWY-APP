import React, {Fragment} from 'react';
import {View, Text, SafeAreaView, StyleSheet, StatusBar, FlatList, TouchableOpacity, TextInput} from 'react-native';

import BasePage from '../../base/base';
import BuildingHeader from '../../../components/building/building-header';
import BuildingCell from '../../../components/building/build-cell';
import {Button, Flex, Icon, List, WhiteSpace} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import BuildingsService from './buildings-service';
import ScreenUtil from '../../../utils/screen-util';
import {connect} from 'react-redux';
import common from '../../../utils/common';
import BackTitleNavigationBar from '../../../components/back-title-navigation-bar';

class BuildingsPage extends BasePage {
    static navigationOptions = ({navigation}) => {

        console.log(1, navigation);
        return {
            tabBarVisible: false,
            header: null,
        };
    };

    constructor(props) {
        super(props);
        let item = common.getValueFromProps(this.props);
        console.log(item);
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
            this.setState({data: res});
        });
    };
    _renderItem = ({item}) => {
        console.log(item);
        return <BuildingCell nextRouteName='DetailBuilding' {...this.props} item={item}/>;
    };


    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.content}>
                    <BackTitleNavigationBar {...this.props} title={this.state.item.name}/>
                    <FlatList
                        data={this.state.data}
                        // ListHeaderComponent={}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item, index) => item.id}
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

            </SafeAreaView>
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
