import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import { ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
//import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import ScrollTitle from '../../../components/scroll-title';
import XunJianService from './xunjian-service';
import common from '../../../utils/common';

export default class TaskPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '今日任务',
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
            ...(common.getValueFromProps(this.props)),
            res: {
                data: [],
            },
            titles: ['全部', '待完成', '漏检', '已完成']
        };
    }

    componentDidMount() {
        this.initUI();
    }

    onChange = (title) => {
        let status = '';
        switch (title) {
            case '全部': {
                status = '';
                break;
            }
            case '待完成': {
                status = '0';
                break;
            }
            case '漏检': {
                status = '2';
                break;
            }
            case '已完成': {
                status = '1';
                break;
            }
            default: {
            }
        }
        this.setState({ status }, () => {
            this.initUI();
        });
    };

    initUI() {
        const { status, userId } = this.state;
        XunJianService.xunjianTaskList(status, userId).then(res => {
            this.setState({ res });
        });
    }


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { status, res, titles } = this.state;
        let index = 0;
        if (status === '') {
            index = 0;
        } else if (status === '0') {
            index = 1;
        } else if (status === '2') {
            index = 2;
        } else if (status === '1') {
            index = 3;
        }

        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollTitle index={index} onChange={this.onChange} titles={titles} />
                <ScrollView style={{ flex: 1 }} alwaysBounceVertical={true}>
                    <Flex direction={'column'} style={{ padding: 15, flex: 1 }}>
                        {res.data.map(item => (
                            <TouchableWithoutFeedback key={item.id}
                                onPress={() => this.props.navigation.push('xunjianDetail', { id: item.id })}>
                                <Flex direction='column' align={'start'}
                                    style={[styles.card, { borderLeftColor: Macro.work_blue, borderLeftWidth: 5 }]}>
                                    <Text style={styles.title}>{item.pName}</Text>
                                    <Flex style={styles.line} />
                                    <Flex>
                                        <Flex style={{ width: '100%' }}>
                                            <Text style={styles.top}>{item.planTime} {item.tName}</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </TouchableWithoutFeedback>
                        ))}
                    </Flex>
                </ScrollView>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        paddingTop: 14,
        textAlign: 'left',
        color: '#3E3E3E',
        fontSize: 16,
        paddingBottom: 12,
        marginLeft: 20,
        marginRight: 20,

    },
    line: {
        width: ScreenUtil.deviceWidth() - 30,
        backgroundColor: '#E0E0E0',
        height: 1,
    },
    top: {
        paddingTop: 10,
        color: '#1890ff',
        fontSize: 16,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },

    card: {
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        // shadowColor: '#00000033',
        // shadowOffset: {h: 10, w: 10},
        // shadowRadius: 5,
        // shadowOpacity: 0.8,
    }
});
