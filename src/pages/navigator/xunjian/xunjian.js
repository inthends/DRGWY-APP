import React, {Fragment} from 'react';
import BasePage from '../../base/base';
import {Flex, Accordion, List, Icon} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import RNLocation from 'react-native-location';
import {connect} from 'react-redux';
import memberReducer from '../../../utils/store/reducers/member-reducer';
import XunJianService from './xunjian-service';


class XunJianPage extends BasePage {
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

    onSelect = (person) => {
        console.log(111, person);
        this.setState({
            person,
        }, () => {
            this.initUI();
        });
    };


    constructor(props) {
        super(props);
        RNLocation.configure({
            distanceFilter: 5.0,
        });
        RNLocation.requestPermission({
            ios: 'whenInUse',
            android: {
                detail: 'coarse',
            },
        }).then(granted => {
            if (granted) {
                this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
                    console.log(111, locations);
                });
            }
        });

        this.state = {
            activeSections: [2, 0],
            person: null,
            today: '',
            todo: '',
            missed: '',
            finish: '',
            items: [],
        };

    }

    onChange = activeSections => {
        this.setState({activeSections});
    };

    start = () => {
        let person = this.state.person || {};
        this.props.navigation.push('startxunjian',{
            'data':{
                person,
                pointId:322,
            }
        });
    };

    componentDidMount(): void {
        this.initUI();
    }

    initUI() {
        let person = this.state.person || {};
        XunJianService.xunjianData(person.id).then(res => {
            this.setState({
                ...res,
            });

        });
        XunJianService.xunjianIndexList(person.id).then(res => {
            console.log(12, res.data);
            Promise.all(res.data.map(item => XunJianService.xunjianIndexDetail(item.lineId))).then(all => {
                let items = res.data.map((item, index) => {
                    return {
                        ...item,
                        items: all[index],
                    };
                });
                this.setState({items}, () => {
                    console.log(44, this.state);
                });
            });
            // Promise.all()
        });
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {person, today, todo, missed, finish, items} = this.state;
        const {user} = this.props;
        let name;
        let userId;
        if (user) {
            name = user.showName;
        }
        if (person) {
            name = person.fullName;
            userId = person.id;
        }
        return (
            <CommonView>
                <Flex direction='column' align={'start'} style={[styles.card]}>
                    <Flex>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            'data': {
                                'status': '',
                                userId,
                            },
                        })}>
                            <Flex direction='column' style={{width: '25%'}}>
                                <Text style={styles.top}>{today || 0}</Text>
                                <Text style={styles.bottom}>今日任务</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            'data': {
                                'status': '0',
                                userId,
                            },
                        })}>
                            <Flex direction='column' style={{width: '25%'}}>
                                <Text style={styles.top}>{todo || 0}</Text>
                                <Text style={styles.bottom}>待完成</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            'data': {
                                'status': '2',
                                userId,
                            },
                        })}>
                            <Flex direction='column' style={{width: '25%'}}>
                                <Text style={styles.top}>{missed || 0}</Text>
                                <Text style={styles.bottom}>漏检</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            'data': {
                                'status': '1',
                                userId,

                            },
                        })}>
                            <Flex direction='column' style={{width: '25%'}}>
                                <Text style={styles.top}>{finish || 0}</Text>
                                <Text style={styles.bottom}>已完成</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>

                </Flex>
                <Flex style={styles.line}/>
                <Text style={styles.location}>当前位置：上海聚音</Text>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('selectXunjian', {
                    'data': {
                        onSelect: this.onSelect,
                        person,
                    },
                })}>
                    <Flex style={styles.person}>
                        <Text style={styles.personText}>{name}</Text>
                        <LoadImage style={{width: 20, height: 20}}/>
                    </Flex>
                </TouchableWithoutFeedback>
                <View>
                    <Accordion
                        onChange={this.onChange}
                        activeSections={this.state.activeSections}
                    >
                        {items.map(item => (
                            <Accordion.Panel key={item.lineId} header={item.name}>
                                <List>
                                    {item.items.map((it, index) => (
                                        <List.Item key={it.name + index}>{it.name}</List.Item>
                                    ))}
                                </List>
                            </Accordion.Panel>
                        ))}
                    </Accordion>
                </View>
                <TouchableWithoutFeedback onPress={this.start}>
                    <Flex justify={'center'} style={[styles.ii, {
                        width: '80%',
                        marginLeft: '10%',
                        marginRight: '10%',
                        marginBottom: 20,
                    }, {backgroundColor: Macro.color_4d8fcc}]}>
                        <Text style={styles.word}>开始巡检</Text>
                    </Flex>
                </TouchableWithoutFeedback>
            </CommonView>
        );
    }
}


const mapStateToProps = ({memberReducer}) => {
    return {
        user: memberReducer.user,
    };
};

export default connect(mapStateToProps)(XunJianPage);

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
    ii: {
        marginTop: 50,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginBottom: 20,
    },
    word: {
        color: 'white',
        fontSize: 16,
    },

});
