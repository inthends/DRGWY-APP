import React, {Fragment} from 'react';
import BasePage from '../../base/base';
import {Flex, Accordion, List, Icon} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View,ScrollView} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import {connect} from 'react-redux';
import memberReducer from '../../../utils/store/reducers/member-reducer';
import common from '../../../utils/common';
import XunJianService from './xunjian-service';


class SelectXunJianPerson extends BasePage {
    static navigationOptions = ({navigation}) => {

        return {
            tabBarVisible: false,
            title: '选择人员',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                    <Icon name='bars' style={{marginRight: 15}} color="black"/>
                </TouchableWithoutFeedback>
            ),
        };
    };


    constructor(props) {
        super(props);
        let lastPageState = common.getValueFromProps(props, 'data');
        this.state = {
            lastPageState,
            persons: [],
        };
        this.initData();
        this.select = this.select.bind(this);


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
        XunJianService.persons().then(persons => {
            this.setState({
                persons,
            });
        });
    }

    select(item) {
        const {lastPageState} = this.state;
        lastPageState.onSelect(item);
        this.props.navigation.goBack();
    }


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        const {persons} = this.state;
        return (
            <CommonView>
                <ScrollView>
                    {persons.map(item => (
                        <TouchableWithoutFeedback key={item.id} onPress={() => this.select(item)}>
                            <Flex key={item.id} justify='between' style={styles.hang}>
                                <Text style={styles.word}>{item.name}</Text>
                                <Text style={styles.word}>{item.orgName}</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    ))}
                </ScrollView>
            </CommonView>
        );
    }
}


const mapStateToProps = ({buildingReducer}) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(SelectXunJianPerson);


const styles = StyleSheet.create({
    hang: {
        paddingTop: 20,
        paddingLeft: 15,
        paddingRight: 15,
    },
    word: {
        color: '#333',
        fontSize: 18,
    },

});
