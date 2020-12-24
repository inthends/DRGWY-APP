//车位
import React  from 'react';
import {
    View,
    Text,
    StyleSheet,
    // StatusBar,
    // FlatList,
    // Linking,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import BasePage from '../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
// import { connect } from 'react-redux';
// import ListHeader from '../../components/list-header';
import common from '../../utils/common';
//import LoadImage from '../../components/load-image';
import NavigatorService from './navigator-service';
import CommonView from '../../components/CommonView';
//import WorkService from '../work/work-service';


export default class FeeParkingsPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        // console.log(1, navigation);
        return {
            tabBarVisible: false,
            title: '上门收费',
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


    componentDidMount(): void {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                const { building } = this.state;
                //车库和车位
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
                    <Text style={{ paddingLeft: 15, paddingTop: 15, fontSize: 20 }}>{building.allName}</Text>
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
                                    onPress={() => this.props.navigation.push('feeDetail', { data: room })}>
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
        flex: 1,
    },
    content: {
        backgroundColor: Macro.color_white,
        flex: 1,


    },
    title: {
        color: '#333',
        fontSize: 16,
    },


    top: {

        fontSize: 18,
        paddingBottom: 15,
    },
    bottom: {
        color: '#868688',
        fontSize: 18,
        paddingBottom: 20,
    },
    button: {
        color: '#868688',
        fontSize: 16,
        paddingTop: 10,
    },
    blue: {
        borderLeftColor: Macro.color_4d8fcc,
        borderLeftWidth: 8,
    },

    left: {
        flex: 1,

    },
    right: {
        flex: 3,

        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: 20,
    },
    bb: {
        borderStyle: 'solid',
        borderLeftWidth: 4,
        borderLeftColor: Macro.color_f39d39,
        marginLeft: 15,
        marginTop: 15,
    },
    se: {
        paddingLeft: 10,
        fontSize: 18,
        color: '#666',
    },
    image: {
        height: 90,
        width: 90,
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
        color: '#666',
    },
    name: {
        fontSize: Macro.font_16,
        fontWeight: '600',
        paddingBottom: 15,
    },
    area: {
        color: Macro.color_636470,
        fontSize: Macro.font_14,
    },
    complete: {
        color: Macro.color_80aae2,
        fontSize: Macro.font_14,
        backgroundColor: Macro.color_dae9ff,
        padding: 3,
        paddingLeft: 5,
        borderRadius: 1,
    },
    number: {
        color: Macro.color_9c9ca5,
        fontSize: Macro.font_14,
    },
    desc: {
        color: Macro.color_c2c1c5,
        fontSize: Macro.font_14,
    },
    line: {
        width: 1,
        height: 15,
        backgroundColor: Macro.color_c2c1c5,
        marginLeft: 5,
        marginRight: 5,
    },
    orange: {
        backgroundColor: Macro.color_f39d39,
        color: '#fff',
    },
    blue74BAF1: {
        backgroundColor: '#74BAF1',
        color: '#fff',
    },
});
