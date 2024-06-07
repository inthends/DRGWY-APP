import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl,
} from 'react-native';
import BasePage from '../base/base';
import { List, Icon, Flex, Button } from '@ant-design/react-native';
import common from '../../utils/common';
import WorkService from './work-service';
import UDToast from '../../utils/UDToast';
import CommonView from '../../components/CommonView';
import Macro from '../../utils/macro';
const Item = List.Item;

export default class SelectRepairMajor extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            title: '选择维修专业',
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

    submit = () => {
        const { selectItem, parentName } = this.state;
        //console.log('selectItem',selectItem);
        if (selectItem) { 
            if (parentName) {
                this.props.navigation.navigate(parentName, { repairmajor: { repairmajor: selectItem } });
            } 
            //点击第二层的时候，navigation变化了，此方法不能用
            // const { navigation } = this.props;
            // navigation.state.params.onSelect({ selectItem });
            // navigation.goBack();

        } else {
            UDToast.showInfo('请先选择');
        }
    };

    next = (item) => {
        if (item.type !== 2) {
            const { parentName } = this.state;
            this.props.navigation.push('selectRepairMajor', {
                'data': {
                    ...item
                },
                parentName//传递主页面到维修专业
            });
        }
    };

    getData = () => {
        const parent = common.getValueFromProps(this.props, 'data');
        //console.log('parent',parent);
        let params;
        if (parent) {
            let type = -1;
            switch (parent.type) {
                case 1: {
                    type = 2;
                    this.props.navigation.setParams({
                        data: parent,
                        title: '选择专业',
                    });
                    break;
                }
            }
            if (type === -1) {
                UDToast.showInfo('类型错误');
                return;
            }
            params = { keyvalue: parent.id, type };
        } else {
            this.props.navigation.setParams({
                title: '选择分类',
            });
            params = { keyvalue: 0, type: 1 };
        }
        this.setState({
            parent,
            refreshing: true
        });

        WorkService.getRepairMajors(params).then(items => {
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
                            {parent.name}
                        </Item> : null}
                    <ScrollView style={{ flex: 1 }} refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.getData()}
                        />
                    }>
                        <List>
                            {items.map((item, index) => (
                                <Item key={index} arrow={item.type !== 2 ? 'horizontal' : 'empty'}
                                    onPress={() => this.next(item)}>
                                    <Flex>
                                        {item.type == 2 ?
                                            <TouchableWithoutFeedback onPress={() => this.setState({ selectItem: { id: item.id, name: item.name } })}>
                                                <Image alt='' style={{ width: 24, height: 24 }}
                                                    source={selectItem.id === item.id ? require('../../static/images/select.png') : require('../../static/images/no-select.png')} />
                                            </TouchableWithoutFeedback> : null}
                                        <Text style={{
                                            paddingLeft: 15,
                                            paddingTop: 5,
                                            paddingBottom: 5
                                        }}>{item.allName}</Text>
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
