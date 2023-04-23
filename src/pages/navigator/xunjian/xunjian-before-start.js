import React, {Fragment} from 'react';
import BasePage from '../../base/base';
import {Flex, Accordion, List, Icon} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import {ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import ScrollTitle from '../../../components/scroll-title';
import XunJianService from './xunjian-service';
import common from '../../../utils/common';
import {connect} from 'react-redux';



class XunjianBeforeStart extends BasePage {
    static navigationOptions = ({navigation}) => {



        return {
            tabBarVisible: false,
            title: '选择任务',
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
            ...(common.getValueFromProps(this.props)),
            items: [],
        };

    }

    componentDidMount(): void {
        const {pointId} = this.state;

        if (this.props.hasNetwork) {
            this.initUI();
        } else {
            const items = this.props.xunJianData.scanLists.filter(item=>item.pointId === pointId);
            console.log(211,items);
            this.setState({items});
        }

        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            () => {
                if (this.props.hasNetwork) {
                    this.initUI(false);
                }else {
                    console.log(11,this.props);
                }
            },
        );
    }

    initUI(showLoading = true) {
        const {pointId} = this.state;
        //console.log(321, this.state);
        XunJianService.xunjianPointTasks(pointId, showLoading).then(items => {
            this.setState({items});
        });
    }

    componentWillUnmount(): void {
        this.viewDidAppear.remove();
    }


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {items, person, pointId} = this.state;

        return (
            <CommonView>
                <ScrollView>
                    <Flex direction={'column'} style={{padding: 15, paddingTop: 30}}>

                        {items.map(item => (
                            <TouchableWithoutFeedback key={item.id}
                                                      onPress={() => this.props.navigation.push('startxunjian', {
                                                          'data': {
                                                              id: item.id,
                                                              person,
                                                              pointId,
                                                              item
                                                          },
                                                      })}>
                                <Flex direction='column' align={'start'}
                                      style={[styles.card, {borderLeftColor: Macro.work_blue, borderLeftWidth: 5}]}>
                                    <Text style={styles.title}>{item.pName}</Text>
                                    <Flex style={styles.line}/>
                                    <Flex>
                                        <Flex style={{width: '100%'}}>
                                            <Text style={styles.top}>{item.planTime} {item.tName}</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </TouchableWithoutFeedback>
                        ))}
                    </Flex>

                </ScrollView>
            </CommonView>
        );
    }
}

const mapStateToProps = ({memberReducer,xunJianReducer}) => {

    return {
        hasNetwork:memberReducer.hasNetwork,
        xunJianData: xunJianReducer.xunJianData,
        xunJianAction:xunJianReducer.xunJianAction,
    };
};
export default connect(mapStateToProps)(XunjianBeforeStart);

const styles = StyleSheet.create({
    title: {
        paddingTop: 14.67,
        textAlign: 'left',
        color: '#3E3E3E',
        fontSize: 17.6,
        paddingBottom: 12.67,
        marginLeft: 20,
        marginRight: 20,

    },
    line: {
        width: ScreenUtil.deviceWidth() - 30,
        backgroundColor: '#E0E0E0',
        height: 1,
    },
    top: {
        paddingTop: 10,
        color: '#74BAF1',
        fontSize: 15,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
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
        borderColor: '#E0E0E0',
        borderWidth: 1,
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
