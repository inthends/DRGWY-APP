import React, { Fragment } from 'react';
import BasePage from '../../base/base';
import { Flex, Accordion, List, Icon } from '@ant-design/react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import CommonView from '../../../components/CommonView';
import common from '../../../utils/common';

let screen_width = ScreenUtil.deviceWidth()

export default class OrderlistPage extends BasePage {
    static navigationOptions = ({ navigation }) => {

        return {
            tabBarVisible: false,
            title: navigation.state.params.data.title ?? '订单列表',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            ...(common.getValueFromProps(this.props)),
            data: [],
            indexType:0
        };
        console.log(this.state);
    }

    componentDidMount(): void {

    }

    contentView = () => {
        const { indexType } = this.state
        let data1 = [
            { key: '编号1', value: '666' },
            { key: '编号1', value: '666' },
            { key: '编号1', value: '666' }
        ]
        return (
            <ScrollView>
            <Flex direction="column" style={{...styles.content,height:30 * data1.length}}>
            {
                    data1.map((item) => {
                        return <Flex>
                            <Text style={styles.desc}>{item.key+': '+item.value}</Text>
                        </Flex>
                    })
                }
                
            </Flex>
            </ScrollView>
        );
    }
    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { status} = this.state;

        return (
            <CommonView style={{ flex: 1,justifyContent:'flex-start' }}>
                {this.contentView()}
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eeeeee',
        width: screen_width - 20,
        height: 120,
        alignItems: 'flex-start'
    },
    line: {
        width: ScreenUtil.deviceWidth() - 40,
        backgroundColor: '#E0E0E0',
        height: 1,
        marginVertical: 10
    },
    top: {
        fontSize: 14,
        color: '#666'
    },
    desc: {
        marginVertical: 5,
        color: '#333',
        fontSize: 14
    },

});
