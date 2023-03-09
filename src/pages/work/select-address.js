import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    RefreshControl,
} from 'react-native';
import BasePage from '../base/base';
import {Icon} from '@ant-design/react-native';
import {List, Flex, Button} from '@ant-design/react-native';
import common from '../../utils/common';
import WorkService from './work-service';
import UDToast from '../../utils/UDToast';
import CommonView from '../../components/CommonView';

const Item = List.Item;

export default class SelectAddressPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('title'),
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),

        };
    };

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            selectItem: {},
            refreshing: false,
        };
    }

    componentDidMount(): void {
        this.getData();
    }

    submit = () => {
        const {selectItem} = this.state;
        if (selectItem && selectItem.id) {
            this.props.navigation.navigate('AddWork', {data: {address: selectItem}});
        } else {
            UDToast.showInfo('请先选择');
        }


    };

    getData = () => {
        const parent = common.getValueFromProps(this.props, 'data');
        let params;
        if (parent) {
            params = {keyvalue: parent.id};
            let type = -1;
            switch (parent.type) {
                case 1: {
                    type = 2;
                    this.props.navigation.setParams({
                        data: parent,
                        title: '选择楼栋',
                    });
                    break;
                }
                case 2: {
                    type = 4;
                    this.props.navigation.setParams({
                        data: parent,
                        title: '选择楼层',
                    });
                    break;
                }
                case 4: {
                    type = 5;
                    this.props.navigation.setParams({
                        data: parent,
                        title: '选择房屋',
                    });
                    break;
                }
            }
            if (type === -1) {
                UDToast.showInfo('类型错误');
                return;
            }
            params = {
                ...params,
                type,
            };
        } else {
            this.props.navigation.setParams({
                title: '选择楼盘',
            });
            params = {keyvalue: 0, type: 1};
        }
        this.setState({
            parent,
            refreshing: true,
        });
        WorkService.getPStructs(params).then(items => {
            this.setState({items, refreshing: false});
        });
    };
    next = (item) => {
        //console.log(item);
        if (item.type !== 5) {
            this.props.navigation.push('select', {
                'data': {
                    ...item,
                },

            });
        }
    };


    render() {
        const {items, parent, selectItem} = this.state;
        return (
            <CommonView style={{flex: 1, backgroundColor: '#eee'}}>
                <View style={{flex: 1}}>

                    <Item arrow="empty">
                        {parent ? parent.allName : '/'}
                    </Item>
                    <ScrollView style={{flex: 1}} refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.getData()}
                        />
                    }>
                        <List>
                            {items.map((item, index) => (
                                <Item key={index} arrow={item.type !== 5 ? 'horizontal' : 'empty'}
                                      onPress={() => this.next(item)}>
                                    <Flex>
                                        <TouchableWithoutFeedback onPress={() => this.setState({selectItem: item})}>
                                            <Image alt='' style={{width: 24, height: 24}}
                                                   source={selectItem.id === item.id ? require('../../static/images/select.png') : require('../../static/images/no-select.png')}/>
                                        </TouchableWithoutFeedback>
                                        <Text style={{
                                            paddingLeft: 15,
                                            paddingTop: 5,
                                            paddingBottom: 5,
                                        }}>{item.name}</Text>
                                    </Flex>
                                </Item>
                            ))}
                        </List>
                    </ScrollView>
                    <Flex justify={'center'} style={{height: 80, backgroundColor: '#eee'}}>
                        <Button style={{width: '90%'}} type="primary" onPress={() => this.submit()}>确定</Button>
                    </Flex>

                </View>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F3F4F2',

    },

});
