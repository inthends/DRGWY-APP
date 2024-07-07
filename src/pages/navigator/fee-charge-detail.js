import React  from 'react';
import {
    View,
    Text,
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, NativeModules,
} from 'react-native';
import BasePage from '../base/base';
import {  Flex, Icon, WhiteSpace } from '@ant-design/react-native';
import Macro from '../../utils/macro'; 
import { connect } from 'react-redux'; 
import common from '../../utils/common'; 
import NavigatorService from './navigator-service'; 
import CommonView from '../../components/CommonView';

class FeeChargeDetail extends BasePage {
    static navigationOptions = ({ navigation }) => {  
        return {
            tabBarVisible: false,
            title: '收款单详情',
            headerForceInset:this.headerForceInset,
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
        const {data} = this.state;
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
                            fontSize: 16,
                        }}>{data.allName} {data.createUserName}</Text>
                        <Text style={{
                            paddingLeft: 15,
                            paddingTop: 10,
                            fontSize: 16,
                        }}>单号：{data.billCode}</Text>
                        <Text style={{
                            paddingLeft: 15,
                            paddingTop: 10,
                            fontSize: 16,
                        }}>日期：{data.billDate}</Text>
                        {this.state.items.map((item, index) => (
                            <Flex key={index} style={styles.item}>
                                <Flex align={'start'} direction={'column'} style={{ marginLeft: 3, flex: 1 }}>
                                    <Flex justify={'between'}
                                        style={{ paddingLeft: 10, paddingTop: 5, paddingBottom: 5, width: '100%' }}>
                                        <Text style={{ fontSize: 16 }}>{item.feeName}</Text>
                                        <Flex>
                                            <Text style={{ paddingRight: 10, fontSize: 16 }}>{item.amount}</Text>
                                        </Flex>
                                    </Flex>
                                    {item.beginDate ? <Text style={{
                                        paddingLeft: 10,
                                        paddingTop: 10,
                                    }}> {item.beginDate + '至' + item.endDate}</Text> : null}
                                </Flex>
                            </Flex>
                        ))} 
                        <WhiteSpace />
                        <Flex justify={'center'}>
                            <Text style={{
                                fontSize: 16,
                            }}>抹零：{data.mlAmount}，合计：{data.amount}</Text>
                        </Flex>
                    </ScrollView>
                </CommonView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        color: '#404145',
        fontSize: 16,
    },
    left: {
        flex: 1
    },
  
    item: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'solid',
        paddingLeft: 10,
        paddingRight: 10,
        // width: (ScreenUtil.deviceWidth() - 50) / 3.0-1,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
    },
    name: {
        fontSize: Macro.font_16,
        fontWeight: '600',
        paddingBottom: 10,
    }
});

const mapStateToProps = ({ memberReducer,buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
        userInfo: memberReducer.userInfo
    };
};
export default connect(mapStateToProps)(FeeChargeDetail);
