import React from 'react';
import BasePage from '../../base/base';
import { Flex, Accordion, List, Icon, WingBlank } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import { connect } from 'react-redux';
import XunJianService from './xunjian-service';
// import memberReducer from '../../../utils/store/reducers/member-reducer'; 
// import xunJianReducer from '../../../utils/store/reducers/xunjian-reducer';
// import ImagePicker from 'react-native-image-picker';


class XunJianPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '综合巡检',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            )
        };
    };

    onSelect = (person) => {
        this.setState({
            person
        }, () => {
            this.initUI();
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            activeSections: [2, 0],
            person: null,
            today: '',
            todo: '',
            missed: '',
            finish: '',
            items: []
        };
    }

    onChange = activeSections => {
        this.setState({ activeSections });
    };

    callBack = (pointId) => {
        this.setState({
            pointId,
        }, () => {
            let person = this.state.person || {};
            this.props.navigation.navigate('xunjianBeforeStart', {
                data: {
                    person,
                    pointId
                }
            });
        });
    };

    start = () => {
        // test
        // let person = this.state.person || {};
        // this.props.navigation.navigate('xunjianBeforeStart', {
        //     'data': {
        //         person,
        //         pointId:'7681da78-e5da-4bbe-8d1e-15c78237be97',
        //     },
        // });
        // return;

        this.props.navigation.push('scanForWork', {
            data: {
                callBack: this.callBack,
                needBack: '1'
            }
        });

        //2023-10-06 由于不能放大，废弃
        // ImagePicker.launchCamera(
        //     {
        //         mediaType: 'photo',
        //         includeBase64: false,
        //         maxHeight: 200,
        //         maxWidth: 200,
        //     },
        //     (response) => {
        //         //读码
        //         let person = this.state.person || {};
        //         this.props.navigation.navigate('xunjianBeforeStart', {
        //             'data': {
        //                 person,
        //                 pointId
        //             }
        //         });
        //     },
        // )
    };

    componentDidMount() {
        this.initUI();
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            () => {
                if (this.props.hasNetwork) {
                    let person = this.state.person || this.props.user;
                    XunJianService.xunjianData(person.id, false).then(res => {
                        this.setState({
                            ...res,
                        });
                    });
                }
            }
        );
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    initUI() {
        if (this.props.hasNetwork) {
            this.hasNetwork();
        } else {
            this.noNetwork();
        }
    }

    hasNetwork() {
        let person = this.state.person || this.props.user;
        XunJianService.xunjianData(person.id).then(res => {
            this.setState({
                ...res
            });
        });

        //获取巡检路线和任务
        XunJianService.xunjianIndexList(person.id).then(res => {
            Promise.all(res.data.map(item => XunJianService.xunjianIndexDetail(item.lineId))).then(all => {
                let items = res.data.map((item, index) => {
                    return {
                        ...item,
                        items: all[index]
                    };
                });
                this.setState({ items: [...items] }, () => {
                });
            });
        });
    }

    noNetwork() {
        const xunJianData = this.props.xunJianData;
        const params = {
            ...xunJianData.allData,
            items: xunJianData.lists
        };
        this.setState({
            ...params
        });
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { person, today, todo, missed, finish, items } = this.state;
        const { user } = this.props;
        let name;
        let userId;
        if (person) {
            name = person.name;
            userId = person.id;
        } else {
            name = user.showName;
            userId = user.userId;
        }

        return (
            <CommonView>
                <Flex direction='column' align={'start'} style={[styles.card]}>
                    <Flex>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            data: {
                                status: '',
                                userId
                            }
                        })}>
                            <Flex direction='column' style={{ width: '25%' }}>
                                <Text style={styles.top}>{today || 0}</Text>
                                <Text style={styles.bottom}>今日任务</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            data: {
                                status: '0',
                                userId
                            }
                        })}>
                            <Flex direction='column' style={{ width: '25%' }}>
                                <Text style={styles.top}>{todo || 0}</Text>
                                <Text style={styles.bottom}>待完成</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            data: {
                                status: '2',
                                userId
                            }
                        })}>
                            <Flex direction='column' style={{ width: '25%' }}>
                                <Text style={styles.top}>{missed || 0}</Text>
                                <Text style={styles.bottom}>漏检</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.push('xunjiantask', {
                            data: {
                                status: '1',
                                userId
                            }
                        })}>
                            <Flex direction='column' style={{ width: '25%' }}>
                                <Text style={styles.top}>{finish || 0}</Text>
                                <Text style={styles.bottom}>已完成</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                </Flex>

                <Flex style={styles.line} />
                {/*<Text style={styles.location}>当前位置：xxxx</Text>*/}
                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('selectXunjian', {
                    data: {
                        onSelect: this.onSelect,
                        person
                    }
                })}>
                    <Flex style={styles.person} align={'center'} justify={'center'}>
                        <Text style={styles.personText}>{name}</Text>
                        <LoadImage style={{ width: 6, height: 12 }} defaultImg={require('../../../static/images/address/right.png')} />
                    </Flex>
                </TouchableWithoutFeedback>

                <ScrollView style={{ height: ScreenUtil.contentHeight() - 220 }}>
                    <Accordion
                        onChange={this.onChange}
                        activeSections={this.state.activeSections}
                    >
                        {items.map(item => (
                            <Accordion.Panel key={item.lineId} header={item.name}>
                                <List>
                                    {item.items.map((it, index) => (
                                        <TouchableWithoutFeedback key={it.name + index}
                                            onPress={() => this.props.navigation.push('xunjianPointDetail', {
                                                data: {
                                                    lineId: item.lineId,
                                                    pointId: it.id
                                                }
                                            })}>
                                            <WingBlank>
                                                <List.Item>{it.name}</List.Item>
                                            </WingBlank>
                                        </TouchableWithoutFeedback>
                                    ))}
                                </List>
                            </Accordion.Panel>
                        ))}
                    </Accordion>
                </ScrollView>
                <TouchableWithoutFeedback onPress={this.start}>
                    <Flex justify={'center'} style={[styles.ii,
                    {
                        width: '70%',
                        marginLeft: '15%',
                        marginRight: '15%',
                        marginBottom: 40,
                        backgroundColor: Macro.work_blue
                    }]}>
                        <Text style={styles.word}>开始巡检</Text>
                    </Flex>
                </TouchableWithoutFeedback>
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
        marginRight: 20
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30,
        backgroundColor: '#E0E0E0',
        marginLeft: 15,
        height: 1
    },
    top: {
        paddingTop: 20,
        color: '#74BAF1',
        fontSize: 16,
        paddingBottom: 3
    },
    bottom: {
        color: '#999999',
        fontSize: 16,
        paddingBottom: 20
    },
    card: {
        borderRadius: 5,
        // marginBottom: 15,
        backgroundColor: 'white',
        // shadowColor: '#00000033',
        // shadowOffset: {h: 10, w: 10},
        // shadowRadius: 5,
        // shadowOpacity: 0.8,
    },
    location: {
        paddingTop: 15,
        paddingBottom: 10,
        textAlign: 'center',
        width: '100%'
    },
    person: {
        paddingTop: 15,
        marginRight: 15,
        paddingBottom: 15
    },
    personText: {
        color: '#666',
        fontSize: 16,
        width: ScreenUtil.deviceWidth() - 40,
        textAlign: 'center'
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
        marginBottom: 20
    },
    word: {
        color: 'white',
        fontSize: 16
    }
});

const mapStateToProps = ({ memberReducer, xunJianReducer }) => {
    return {
        user: {
            ...memberReducer.user,
            id: memberReducer.user.userId
        },
        hasNetwork: memberReducer.hasNetwork,
        xunJianData: xunJianReducer.xunJianData
    };
};
export default connect(mapStateToProps)(XunJianPage);

