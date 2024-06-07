import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl
} from 'react-native';
import BasePage from '../base/base';
import { List, Icon, Flex, Button } from '@ant-design/react-native';
import common from '../../utils/common';
import WorkService from './work-service';
import UDToast from '../../utils/UDToast';
import CommonView from '../../components/CommonView';
import Macro from '../../utils/macro';
const Item = List.Item;

export default class SelectAddressPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            //title: navigation.getParam('title'),
            title: '选择位置',
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
        this.state = {
            parentName: null,
            items: [],
            selectItem: {},
            refreshing: false
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        //获取父页面的名称
        var parentName = navigation.state.params.parentName;
        this.setState({ parentName });
        this.getData();
    }

    // submit = () => {
    //     const { selectItem } = this.state;
    //     if (selectItem && selectItem.id) {
    //         this.props.navigation.navigate('addWork', { data: { address: selectItem } });
    //     } else {
    //         UDToast.showInfo('请先选择');
    //     }
    // };

    submit = () => {
        const { selectItem, parentName } = this.state;
        if (selectItem) {
            // const { navigation } = this.props;
            // navigation.state.params.onSelect({ selectItem });
            // navigation.goBack();
            //第一层可以调用，到楼栋，楼层就无法调用事件
            //this.props.navigation.navigate('addWork', { data: { address: selectItem } }); 
            if (parentName) {
                this.props.navigation.navigate(parentName, { data: { address: selectItem } });
            }

        } else {
            UDToast.showInfo('请先选择');
        }
    };

    next = (item) => {
        if (item.type !== 5) {
            const { parentName } = this.state;
            this.props.navigation.push('selectAddress', {
                'data': {
                    ...item,
                },
                parentName//传递主页面到楼栋、楼层
            });
        }
    };

    getData = () => {
        const parent = common.getValueFromProps(this.props, 'data');
        let params;
        if (parent) {
            params = { keyvalue: parent.id };
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
                title: '选择项目',
            });
            params = { keyvalue: 0, type: 1 };
        }
        this.setState({
            parent,
            refreshing: true,
        });

        WorkService.getPStructs(params).then(items => {
            this.setState({ items, refreshing: false });
        }).catch(err => this.setState({ refreshing: false }));
    };

    render() {
        const { items, parent, selectItem } = this.state;

        return (
            <CommonView style={{ flex: 1, backgroundColor: '#eee' }}>
                <View style={{ flex: 1 }}>
                    {parent ?
                        <Item arrow="empty">
                            {parent.allName}
                            {/* {parent ? parent.allName : '/'} */}
                        </Item> : null}

                    <ScrollView style={{ flex: 1 }} refreshControl={
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
                                        <TouchableWithoutFeedback onPress={() => this.setState({ selectItem: { id: item.id, allName: item.allName } })}>
                                            <Image alt='' style={{ width: 24, height: 24 }}
                                                source={selectItem.id === item.id ? require('../../static/images/select.png') : require('../../static/images/no-select.png')} />
                                        </TouchableWithoutFeedback>
                                        <Text style={{
                                            paddingLeft: 15,
                                            paddingTop: 5,
                                            paddingBottom: 5
                                        }}>{item.name}</Text>
                                    </Flex>
                                </Item>
                            ))}
                        </List>
                    </ScrollView>

                    <Flex justify={'center'} style={{ height: 80, backgroundColor: '#eee' }}>
                        <Button style={{
                            width: '90%',
                            backgroundColor: Macro.work_blue
                        }} type="primary"
                            onPress={() => this.submit()}>确定</Button>
                    </Flex>

                </View>
            </CommonView>
        );
    }
}
