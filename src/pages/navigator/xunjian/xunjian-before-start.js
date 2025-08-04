import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import { ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import CommonView from '../../../components/CommonView';
import XunJianService from './xunjian-service';
import common from '../../../utils/common';
import { connect } from 'react-redux';
//import UDToast from '../../../utils/UDToast';

class XunjianBeforeStart extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '选择任务',
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
            items: []
        };
    }

    // initUI(showLoading = true) {
    //     const { pointId } = this.state;
    //     XunJianService.xunjianPointTasks(pointId, showLoading).then(items => {
    //         this.setState({ items });
    //     });
    // }

    onRefresh = () => {
        const { lineId, pointId } = this.state;//点位 
        if (this.props.hasNetwork) {
            XunJianService.xunjianPointTasks(lineId, pointId).then(res => {
                if (res.flag == false) {
                    //UDToast.showError(res.data);
                    Alert.alert(
                        '请确认',
                        res.data,
                        [
                            {
                                text: '确定',
                                onPress: () => {
                                    this.props.navigation.goBack(); 
                                }
                            }
                        ],
                        { cancelable: false }
                    ); 
                } else {
                    this.setState({ items: res.data });
                }
            });
        }
        else {
            //const items = this.props.xunJianData.scanLists.filter(item => item.pointId === pointId);
            const { xunJianData, xunJianAction } = this.props;
            //过滤已经完成的，任务id存在巡检结果里面的数据属于完成的 
            if (Object.keys(xunJianAction).length === 0) {//{}
                const items = xunJianData.scanLists.filter(item =>
                    item.pointId === pointId
                );
                this.setState({ items });
            } else {
                const items = xunJianData.scanLists.filter(item =>
                    item.pointId === pointId && !xunJianAction.hasOwnProperty(item.id)
                );
                this.setState({ items });
            }
        }
    };

    //必须，刷新数据
    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            () => {
                this.onRefresh();
            }
        );
    }

    //必须
    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    render() {//: React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        const { items, person, pointId } = this.state;
        return (
            <CommonView>
                <ScrollView>
                    <Flex direction={'column'} style={{ padding: 15, paddingTop: 30 }}>
                        {items.map(item => (
                            <TouchableWithoutFeedback key={item.id}
                                onPress={() => {
                                    if (item.status == 0) {
                                        this.props.navigation.push('startxunjian', {
                                            data: {
                                                id: item.id,
                                                person,
                                                pointId,
                                                item
                                            }
                                        });
                                    }
                                    else {
                                        //查看
                                        this.props.navigation.push('xunjianDetail', { id: item.id });
                                    }
                                }}>
                                <Flex direction='column'
                                    align='start'
                                    style={[styles.card, { borderLeftColor: Macro.work_blue, borderLeftWidth: 5 }]}>
                                    <Flex>
                                        <Text style={styles.title}>{item.pName}</Text>
                                        <Text style={item.status == 0 ? styles.redtitle : styles.greentitle}>{item.statusName}</Text>
                                    </Flex>
                                    <Flex style={styles.line} />
                                    <Flex>
                                        <Flex style={{ width: '100%' }}>
                                            <Text style={styles.top}>{item.projectName} {item.planTime}</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </TouchableWithoutFeedback>
                        ))}
                    </Flex>
                </ScrollView>
            </CommonView >
        );
    }
}

const mapStateToProps = ({ memberReducer, xunJianReducer }) => {
    return {
        hasNetwork: memberReducer.hasNetwork,
        xunJianData: xunJianReducer.xunJianData,
        xunJianAction: xunJianReducer.xunJianAction
    };
};

export default connect(mapStateToProps)(XunjianBeforeStart);

const styles = StyleSheet.create({
    redtitle: {
        paddingTop: 14,
        textAlign: 'left',
        color: 'red',
        fontSize: 16,
        paddingBottom: 12,
        marginLeft: 20,
        marginRight: 20
    },

    greentitle: {
        paddingTop: 14,
        textAlign: 'left',
        color: 'green',
        fontSize: 16,
        paddingBottom: 12,
        marginLeft: 20,
        marginRight: 20
    },

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
        height: 1
    },
    top: {
        paddingTop: 10,
        color: Macro.work_blue,//'#74BAF1',
        fontSize: 16,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
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
