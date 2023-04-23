import React, { Fragment } from 'react';
import BasePage from '../../base/base';
import { Button, Flex, Icon, List, WhiteSpace } from '@ant-design/react-native';
import { TouchableWithoutFeedback, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CommonView from '../../../components/CommonView';
import Macro from '../../../utils/macro';
import WorkService from '../work-service';
import { connect } from 'react-redux';


class SelectPaiDanPerson extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '选择接单人',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                    <Icon name='bars' style={{ marginRight: 15 }} color="black" />
                </TouchableWithoutFeedback>
            ),

        };
    };

    constructor(props) {
        super(props);
        this.state = {
            selectBuilding: this.props.selectBuilding || {},
            items: [],
        };
    }

    componentDidMount() {
        // console.log(111, this.props);
        this.initData();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({
                selectBuilding: nextProps.selectBuilding,
                estateId: nextProps.selectBuilding.key,
                index: 0,
            }, () => {
                this.initData();
            });
        }
    }

    initData() {
        WorkService.paidanPersons(this.state.selectBuilding.key).then(res => {
            this.setState({
                items: res,
            });
        });
    }

    click = (selectPerson) => {
        const { navigation } = this.props;
        navigation.state.params.onSelect({ selectPerson });
        navigation.goBack();
    };


    render() {
        const { items } = this.state;
        return (
            <CommonView>
                <ScrollView>
                    <View >
                        {items.map(item => (
                            <TouchableWithoutFeedback key={item.id} onPress={() => this.click(item)}>
                                <Flex style={styles.content} justify={'between'} align={'center'}>
                                    <Flex>
                                        <Flex style={styles.square} justify={'center'} align={'center'}>
                                            <Text style={styles.number}>{item.count}</Text>
                                        </Flex>
                                        <Flex direction={'column'} style={{marginLeft: 15}}>
                                            <Text style={styles.name}>{item.name}</Text>
                                            <Text style={styles.company}>{item.orgName}</Text>
                                        </Flex>
                                    </Flex>
                                    <Flex direction={'column'}>
                                        <Text style={styles.identifier}>{item.dutyName}</Text>
                                        <Text style={styles.state}>{item.state === 1 ? '在线' : '离线'}</Text>
                                    </Flex>

                                </Flex>

                            </TouchableWithoutFeedback>
                        ))}
                    </View>
                </ScrollView>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingLeft: 20,
        paddingBottom: 15,
        paddingTop: 15,
        paddingRight: 20,
    },
    square: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: Macro.work_blue,
    },
    number: {
        fontSize: 16,
        color: '#333',
    },
    name: {
        fontSize: 16,
        color: '#333',
        paddingBottom: 5,

    },
    company: {
        fontSize: 16,
        color: '#999',
    },
    identifier: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 30,
    },
    state: {
        fontSize: 16,
        color: Macro.work_blue,
        paddingLeft: 15,
    },
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(SelectPaiDanPerson);
