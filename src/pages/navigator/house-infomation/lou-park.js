//车位
import React from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util'; 
import common from '../../../utils/common';
import NavigatorService from '../navigator-service';
import CommonView from '../../../components/CommonView';

export default class LouPark extends BasePage {
    static navigationOptions = ({ navigation }) => { 
        return {
            tabBarVisible: false,
            title: '车位',
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
            parkings: [],
        };
    }


    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                const { building } = this.state;
                //获取楼层和房间
                // NavigatorService.getFloors(building.id).then(floors => {
                //     const promises = floors.map(item => {
                //         return NavigatorService.getRooms(item.id).then(rooms => {
                //             return {
                //                 ...item,
                //                 rooms,
                //             };
                //         });
                //     });
                //     Promise.all(promises).then(floors => { 
                //         this.setState({ floors });
                //     });
                // });

                //车位
                NavigatorService.getParkings(building.id).then(parkings => {
                    this.setState({ parkings });
                });
            },
        );
    }

    componentWillUnmount(): void {
        this.viewDidAppear.remove();
    }

    render() {
        const { parkings, building } = this.state; 

        return (
 
            <CommonView style={{ flex: 1 }}>
                <ScrollView>
                    <Text style={{ paddingLeft: 15, paddingTop: 15, fontSize: 20, color: '#2c2c2c'  }}>{building.allName}</Text>  
                    <Flex wrap='wrap' style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
                        {parkings.map(room => {
                            let color = {};
                            if (room.color === 2) {
                                color = styles.orange;
                            } else if (room.color === 3) {
                                color = styles.blue74BAF1;
                            }
                            return (
                                <TouchableWithoutFeedback key={room.id}
                                    onPress={() => this.props.navigation.push('louDetail', { data: room })}>
                                    <Flex style={[styles.item, color]} justify={'center'}>
                                        <Text style={[styles.title, color]}>{room.name}</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                            );
                        },
                        )}
                    </Flex>  
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
    },
});
