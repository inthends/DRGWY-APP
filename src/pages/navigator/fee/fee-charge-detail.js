import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView, NativeModules,
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Icon, WhiteSpace } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import { connect } from 'react-redux';
import common from '../../../utils/common';
import NavigatorService from '../navigator-service';
import CommonView from '../../../components/CommonView';

class FeeChargeDetail extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '收款单详情',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity onPress={navigation.state.params.print}>
                    <Text style={{
                        fontSize: 16,
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingTop: 10,
                        paddingBottom: 10,
                    }}>补打小票</Text>
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        let data = common.getValueFromProps(this.props);
        this.state = {
            data,
            items: [],
        };
        this.props.navigation.setParams({
            print: this.print,
        });
    }

    print = () => {
        const { data } = this.state;
        //补打
        NavigatorService.rePrintInfo(data.billId).then(res => {
            NativeModules.LHNToast.printTicket({
                ...res,
                username: res.userName
            });
        });
    }

    componentDidMount() {
        const { data } = this.state;
        NavigatorService.billDetailList(data.billId).then(res => {
            this.setState({
                items: res,
            });
        });
    }

    render() {
        // const { statistics, dataInfo, data } = this.state;
        // const { selectBuilding } = this.props; 
        const { data } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <CommonView style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <Text style={{
                            paddingLeft: 15,
                            paddingTop: 10,
                            fontSize: 15,
                            color: 'green'
                        }}>{data.allName}</Text>
                        <Text style={{
                            paddingLeft: 15,
                            paddingTop: 10,
                            fontSize: 15,
                            color: '#2c2c2c'
                        }}>单号：{data.billCode}，收款人：{data.createUserName}</Text>
                        {/* <Text style={{
                            paddingLeft: 15,
                            paddingTop: 10,
                            fontSize: 15,
                        }}>日期：{data.billDate}</Text> */}

                        {this.state.items.map((item, index) => (
                            <Flex key={index} style={styles.item}>
                                <Flex align={'start'} direction={'column'}
                                    style={{
                                        //marginLeft: 3,
                                        flex: 1
                                    }}
                                >
                                    <Flex justify={'between'}
                                        style={{
                                            //paddingTop: 3,
                                            paddingLeft: 5,
                                            width: '100%'
                                        }}>
                                        <Text style={{ fontSize: 15 }}>{item.feeName}</Text>
                                        {/* <Flex> */}
                                            <Text style={{ fontSize: 15 }}>{item.amount}</Text>
                                        {/* </Flex> */}
                                    </Flex>

                                    {item.beginDate ?
                                        <Text style={{
                                            fontSize: 15,
                                            paddingTop: 10
                                        }}> {item.beginDate + '至' + item.endDate}</Text>
                                        : null}
                                </Flex>
                            </Flex>
                        ))}
                        <Flex justify='between'> 
                            <Text style={{
                                paddingLeft: 15,
                                paddingTop: 10,
                                fontSize: 15,
                                color: '#2c2c2c' 
                            }}>日期：{data.billDate}</Text> 
                            <Text style={{
                                fontSize: 15,
                                paddingTop: 5,
                                paddingRight: 9,
                                color: 'red'
                            }}>抹零：{data.mlAmount}，合计：{data.amount}</Text>
                        </Flex>
                    </ScrollView>
                </CommonView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    item: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'solid',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
    }
});

const mapStateToProps = ({ memberReducer, buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
        userInfo: memberReducer.userInfo
    };
};
export default connect(mapStateToProps)(FeeChargeDetail);
