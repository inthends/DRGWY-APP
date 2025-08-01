//房间
import React from 'react';
import {
    Text,
    StyleSheet, 
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
// import { connect } from 'react-redux';
// import ListHeader from '../../components/list-header';
import common from '../../../utils/common';
//import LoadImage from '../../components/load-image';
import service from '../statistics-service';
import CommonView from '../../../components/CommonView';
//import WorkService from '../work/work-service';


export default class FeeRoomsPage extends BasePage {
    static navigationOptions = ({ navigation }) => { 
        return {
            tabBarVisible: false,
            title: '上门收费',
            headerForceInset:this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        let building = common.getValueFromProps(this.props);
        this.state = {
            building,
            floors: [],
        };
    }


    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                const { building } = this.state;
                //获取房间
                service.getFloors(building.id).then(floors => {
                    const promises = floors.map(item => {
                        return service.getRooms(item.id).then(rooms => {
                            return {
                                ...item,
                                rooms
                            };
                        });
                    });
                    Promise.all(promises).then(floors => { 
                        this.setState({ floors });
                    });
                });
            },
        );
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    render() {
        const { floors, building } = this.state; 
        return ( 
            <CommonView style={{ flex: 1 }}>
                <ScrollView>
                    <Text style={{ paddingLeft: 15, paddingTop: 15, fontSize: 20, color: '#2c2c2c' }}>{building.allName}</Text>
                    {floors.map(floor => (
                        <Flex key={floor.id} align={'start'} direction={'column'}>
                            <Flex style={styles.bb}>
                                <Text style={styles.se}>{floor.name}</Text>
                            </Flex>
                            <Flex wrap='wrap' style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
                                {floor.rooms.map(room => {
                                    let color = {};
                                    if (room.color === 2) {
                                        color = styles.orange;
                                    } else if (room.color === 3) {
                                        color = styles.blue74BAF1;
                                    }
                                    return (
                                        <TouchableWithoutFeedback key={room.id}
                                            onPress={() => this.props.navigation.push('feeDetail', { data: room })}>
                                            <Flex style={[styles.item, color]} justify={'center'}>
                                                <Text style={[styles.title, color]}>{room.name}</Text>
                                            </Flex>
                                        </TouchableWithoutFeedback>
                                    );
                                },
                                )}
                            </Flex>
                        </Flex>
                    ))}
                </ScrollView>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_sky,
        flex: 1
    },
    title: {
        color: '#404145',
        fontSize: 16
    }, 
    left: {
        flex: 1
    }, 
    bb: {
        borderStyle: 'solid',
        borderLeftWidth: 4,
        borderLeftColor: Macro.color_f39d39,
        marginLeft: 15,
        marginTop: 15
    },
    se: {
        paddingLeft: 10,
        fontSize: 16,
        color: '#666'
    },
    image: {
        height: 90,
        width: 90
    },
    item: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'solid',
        paddingLeft: 5,
        paddingRight: 5,
        width: (ScreenUtil.deviceWidth() - 50) / 3.0 - 1,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginRight: 5,
        marginLeft: 5,
        backgroundColor: '#eee',
        color: '#666'
    },
    name: {
        fontSize: Macro.font_16,
        fontWeight: '600',
        paddingBottom: 15
    }, 
    orange: {
        backgroundColor: Macro.color_f39d39,
        color: '#fff'
    },
    blue74BAF1: {
        backgroundColor: '#74BAF1',
        color: '#fff'
    }
});
