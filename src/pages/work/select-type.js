import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import BasePage from '../base/base';
import { List, Icon, Flex, Button } from '@ant-design/react-native';
import UDToast from '../../utils/UDToast';
import CommonView from '../../components/CommonView';
import Macro from '../../utils/macro';
const Item = List.Item;

export default class SelectType extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            //title: '选择类型',
            title: navigation.state.params.title,
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
            selectItem: null,
            refreshing: false
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        //获取父页面的名称
        let parentName = navigation.state.params.parentName;
        let type = navigation.state.params.type;
        this.setState({ parentName, type });
        //this.getData();
    }

    submit = () => {
        const { selectItem, parentName, type } = this.state;
        if (selectItem) {
            if (parentName) {
                if (type == 'emergencyLevel')
                    this.props.navigation.navigate(parentName, { emergencyLevel: selectItem });
                else
                    this.props.navigation.navigate(parentName, { importance: selectItem });
            }
        } else {
            UDToast.showError('请先选择');
        }
    };

    render() {
        const { type, parent, selectItem } = this.state;
        let items = [];
        if (type == 'emergencyLevel') {
            items = ['一般', '紧急', '非常紧急'];//紧急
        } else if (type == 'importance') {
            items = ['一般', '重要', '非常重要'];//重要
        }

        return (
            <CommonView style={{ flex: 1, backgroundColor: '#eee' }}>
                <View style={{ flex: 1 }}>
                    {parent ?
                        <Item arrow="empty">
                            {parent.name}
                        </Item> : null}
                    <ScrollView style={{ flex: 1 }}>
                        <List>
                            {items.map((item, index) => (
                                <Item key={index} arrow={'empty'}>
                                    <Flex>
                                        <TouchableWithoutFeedback onPress={() => this.setState({ selectItem: item })}>
                                            <Image style={{ width: 24, height: 24 }}
                                                source={selectItem === item ? require('../../static/images/select.png') : require('../../static/images/no-select.png')} />
                                        </TouchableWithoutFeedback>
                                        <Text style={{
                                            paddingLeft: 15,
                                            paddingTop: 5,
                                            paddingBottom: 5
                                        }}>{item}</Text>
                                    </Flex>
                                </Item>
                            ))}
                        </List>
                    </ScrollView>

                    <Flex justify={'center'} style={{ height: 80, backgroundColor: '#eee' }}>
                        <Button style={{
                            width: 220,
                            backgroundColor: Macro.work_blue
                        }} type="primary"
                            onPress={() => this.submit()}>确定</Button>
                    </Flex>
                </View>
            </CommonView>
        );
    }
}
