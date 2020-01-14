import React, {Fragment} from 'react';
import BasePage from '../../base/base';
import {Flex, Accordion, List, Icon} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';


export default class XunJianPage extends BasePage {
    static navigationOptions = ({navigation}) => {

        return {
            tabBarVisible: false,
            title: '综合巡检',
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
            activeSections: [2, 0],
        };

    }

    onChange = activeSections => {
        this.setState({activeSections});
    };

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {data} = this.state;
        return (
            <CommonView>
                <Flex direction='column' align={'start'} style={[styles.card]}>
                    <Flex>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            'data': {
                                'type': 0,
                            },
                        })}>
                            <Flex direction='column' style={{width: '25%'}}>
                                <Text style={styles.top}>10</Text>
                                <Text style={styles.bottom}>今日任务</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            'data': {
                                'type': 1,
                            },
                        })}>
                            <Flex direction='column' style={{width: '25%'}}>
                                <Text style={styles.top}>20</Text>
                                <Text style={styles.bottom}>待完成</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            'data': {
                                'type': 2,
                            },
                        })}>
                            <Flex direction='column' style={{width: '25%'}}>
                                <Text style={styles.top}>30</Text>
                                <Text style={styles.bottom}>漏检</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            'data': {
                                'type': 3,

                            },
                        })}>
                            <Flex direction='column' style={{width: '25%'}}>
                                <Text style={styles.top}>40</Text>
                                <Text style={styles.bottom}>已完成</Text>
                            </Flex>
                        </TouchableWithoutFeedback>

                    </Flex>
                </Flex>
                <Flex style={styles.line}/>
                <Text style={styles.location}>当前位置：上海聚音</Text>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Task', {
                    'data': {
                        'type': 'fuwu',
                        overdue: 1,
                        hiddenHeader: true,
                        title: '服务单逾期列表',
                    },
                })}>
                    <Flex style={styles.person}>
                        <Text style={styles.personText}>张三</Text>
                        <LoadImage style={{width: 20, height: 20}}/>
                    </Flex>
                </TouchableWithoutFeedback>
                <View>
                    <Accordion
                        onChange={this.onChange}
                        activeSections={this.state.activeSections}
                    >
                        <Accordion.Panel header="秩序日常巡检">
                            <List>
                                <List.Item>Content 1</List.Item>
                                <List.Item>Content 2</List.Item>
                                <List.Item>Content 3</List.Item>
                            </List>
                        </Accordion.Panel>
                        <Accordion.Panel header="Title 2">
                            this is panel content2 or other
                        </Accordion.Panel>
                        <Accordion.Panel header="Title 3">
                            Text text text text text text text text text text text text text
                            text text
                        </Accordion.Panel>
                    </Accordion>
                </View>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        paddingTop: 14.67,
        textAlign: 'left',
        color: '#3E3E3E',
        fontSize: 17.6,
        paddingBottom: 12.67,
        marginLeft: 20,
        marginRight: 20,

        // width: ,
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30,
        backgroundColor: '#E0E0E0',
        height: 1,
    },
    top: {
        paddingTop: 20,
        color: '#74BAF1',
        fontSize: 14.67,
        paddingBottom: 3,
    },
    bottom: {
        color: '#999999',
        fontSize: 14.67,
        paddingBottom: 20,
    },
    button: {
        color: '#2C2C2C',
        fontSize: 8,
        paddingTop: 4,

    },
    card: {
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        // shadowColor: '#00000033',
        // shadowOffset: {h: 10, w: 10},
        // shadowRadius: 5,
        // shadowOpacity: 0.8,
    },
    blue: {
        borderLeftColor: Macro.color_4d8fcc,
        borderLeftWidth: 8,
        borderStyle: 'solid',
    },
    orange: {
        borderLeftColor: Macro.color_f39d39,
        borderLeftWidth: 8,
        borderStyle: 'solid',

    },
    location: {
        paddingTop: 15,
        paddingBottom: 10,
        textAlign: 'center',
        width: '100%',
    },
    person: {
        marginTop: 10,
        marginRight: 15,
    },
    personText: {
        color: '#666',
        fontSize: 18,
        width: ScreenUtil.deviceWidth() - 40,
        textAlign: 'center',
        paddingBottom: 15,
    },

});
