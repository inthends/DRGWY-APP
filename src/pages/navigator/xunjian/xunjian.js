import React from 'react';
import BasePage from '../../base/base';
import { Flex, Accordion, List, Icon, Button } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import { connect } from 'react-redux';
import XunJianService from './xunjian-service';
// import memberReducer from '../../../utils/store/reducers/member-reducer'; 
// import xunJianReducer from '../../../utils/store/reducers/xunjian-reducer';
// import ImagePicker from 'react-native-image-picker';
// import UDToast from '../../../utils/UDToast';

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
            this.loadData();
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            //activeSections: [2, 0],
            activeSections: [],
            person: null,
            today: '',
            todo: '',
            missed: '',
            finish: '',
            lineId: null,//线路id
            items: []
        };
    }

    onChange = activeSections => {
        this.setState({ activeSections });
        if (activeSections) {
            const { items } = this.state;
            var item = items[activeSections];
            if (item) {
                this.setState({ lineId: item.lineId });
            } else {
                this.setState({ lineId: null });
            }
        }
    };

    callBack = (pointId) => {
        if (this.props.hasNetwork) {
            //判断巡检点位状态和点位的顺序 
            // XunJianService.checkPollingState(pointId, this.state.lineId).then(res => {
            //     if (res.flag == false) {
            //         Alert.alert(
            //             '请确认',
            //             res.msg,
            //             [
            //                 {
            //                     text: '确定'
            //                 }
            //             ],
            //             { cancelable: false }
            //         ); 
            //     } else {
            //         this.setState({
            //             pointId
            //         }, () => {
            //             let person = this.state.person || {};
            //             this.props.navigation.navigate('xunjianBeforeStart', {
            //                 data: {
            //                     person,
            //                     pointId,
            //                     lineId: this.state.lineId
            //                 }
            //             });
            //         });
            //     }
            // });


            //会弹出多次提示，只能放到 xunjianBeforeStart页面里去判断
            this.setState({
                pointId
            }, () => {
                let person = this.state.person || {};
                this.props.navigation.navigate('xunjianBeforeStart', {
                    data: {
                        person,
                        pointId,
                        lineId: this.state.lineId
                    }
                });
            });

        } else {
            //离线巡检，不判断点位状态
            this.setState({
                pointId
            }, () => {
                let person = this.state.person || {};
                this.props.navigation.navigate('xunjianBeforeStart', {
                    data: {
                        person,
                        pointId,
                        lineId: this.state.lineId
                    }
                });
            });
        }
    };

    start = () => {

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

        //    UDToast.showError(this.state.lineId);
        //      return;

        //点击手机返回按钮会跳转到扫码页面，需要改为跳转到当前页面 
        this.props.navigation.push('scanonly', {
            data: {
                callBack: this.callBack,
                needBack: true//需要返回当前页面
            }
        });
    };

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            () => {
                // if (this.props.hasNetwork) {
                //     let person = this.state.person || this.props.user; 
                //     XunJianService.xunjianData(person.id, false).then(res => {
                //         this.setState({
                //             ...res
                //         });
                //     });
                // }

                this.loadData();
            }
        );
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    loadData() {
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
                this.setState({ items: [...items] }, () => { });
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

    onSelectPerson = ({ selectItem }) => {
        this.setState({
            person: selectItem
        })
    }

    render() {//: React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
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

                <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('selectRolePersonPolling',
                        {
                            onSelect: this.onSelectPerson
                        })}>
                    <Flex justify='between' style={[{
                        paddingTop: 10,
                        paddingBottom: 10,
                        marginLeft: 20,
                        marginRight: 20
                    }, ScreenUtil.borderBottom()]}>
                        {/* <Text style={[person ? { fontSize: 16, color: '#404145' } :
                            { color: '#999' }]}>{name ? name : "请选择巡检人"}</Text> */}
                        <Text style={{ color: 'black', fontSize: 16 }}>{name}</Text>
                        <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                    </Flex>
                </TouchableWithoutFeedback>

                <ScrollView style={{ height: ScreenUtil.contentHeight() - 160 }}>
                    <Accordion
                        onChange={this.onChange}
                        style={{
                            marginLeft: 14,
                            marginRight: 14
                        }}
                        activeSections={this.state.activeSections}>
                        {items.map(item => (
                            <Accordion.Panel
                                key={item.lineId}
                                header={item.name}
                            >
                                <List>
                                    {item.items.map(it => (
                                        <TouchableWithoutFeedback key={it.sort + it.name}
                                            onPress={() => {
                                                this.props.navigation.push('xunjianPointDetail', {
                                                    data: {
                                                        lineId: item.lineId,
                                                        pointId: it.id
                                                    }
                                                });
                                            }}
                                        >
                                            {/* <WingBlank>  
                                            <List.Item >{it.sort + ' ' + it.name}</List.Item>
                                            </WingBlank> */}
                                            <List.Item>
                                                <Text style={it.counts == 0 ? styles.itemtextfinish : styles.itemtext}>
                                                    {it.sort + ' ' + it.name}
                                                </Text>
                                            </List.Item>

                                        </TouchableWithoutFeedback>
                                    ))}
                                </List>
                            </Accordion.Panel>
                        ))}
                    </Accordion>
                </ScrollView>

                <Flex justify={'center'}>
                    <Button
                        disabled={!this.state.lineId}
                        onPress={this.start} type={'primary'}
                        activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                            width: 220,
                            backgroundColor: Macro.work_blue,
                            marginTop: 10,
                            marginBottom: 15,
                            height: 40
                        }}>开始巡检</Button>
                </Flex>
            </CommonView >
        );
    }
}

const styles = StyleSheet.create({
    itemtext: {
        fontSize: 15,
        color: '#666'
    },

    itemtextfinish: {
        fontSize: 15,
        color: '#10881aff'
    },

    // title: {
    //     paddingTop: 14,
    //     textAlign: 'left',
    //     color: '#3E3E3E',
    //     fontSize: 16,
    //     paddingBottom: 12,
    //     marginLeft: 20,
    //     marginRight: 20
    // },
    line: {
        width: ScreenUtil.deviceWidth() - 30,
        backgroundColor: '#E0E0E0',
        marginLeft: 15,
        height: 1
    },
    top: {
        paddingTop: 15,
        color: '#1890ff',
        fontSize: 16,
        paddingBottom: 3
    },
    bottom: {
        //color: '#999999',
        fontSize: 16,
        color: 'black',
        paddingBottom: 15
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
    // location: {
    //     paddingTop: 15,
    //     paddingBottom: 10,
    //     textAlign: 'center',
    //     width: '100%'
    // },
    // person: {
    //     paddingTop: 15,
    //     marginRight: 15,
    //     paddingBottom: 15
    // },
    // personText: {
    //     color: '#666',
    //     fontSize: 16,
    //     width: ScreenUtil.deviceWidth() - 40,
    //     textAlign: 'center'
    // },
    // ii: {
    //     marginTop:10,
    //     paddingTop: 10,
    //     paddingBottom: 10,
    //     marginLeft: 10,
    //     marginRight: 10,
    //     width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
    //     backgroundColor: '#999',
    //     borderRadius: 6,
    //     marginBottom: 20
    // },
    // word: {
    //     color: 'white',
    //     fontSize: 16
    // }
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

