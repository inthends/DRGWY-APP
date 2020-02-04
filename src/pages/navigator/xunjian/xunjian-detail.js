import React, {Fragment} from 'react';
import BasePage from '../../base/base';
import {Flex, Accordion, List, Icon} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import {ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import ScrollTitle from '../../../components/scroll-title';
import XunJianComponent from './xunjian-component';
import ListImages from '../../../components/list-images';
import common from '../../../utils/common';
import XunJianService from './xunjian-service';

export default class XunJianDetailPage extends BasePage {
    static navigationOptions = ({navigation}) => {


        return {
            tabBarVisible: false,
            title: '任务单详情',
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
            data: {},
        };
        let id = common.getValueFromProps(this.props).id;
        XunJianService.xunjianDetail(id).then(data => {
            this.setState({data});
        });
        XunJianService.xunjianDetailExtraData(id).then(res => {

        });


    }


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {data} = this.state;
        return (
            <CommonView>
                <Flex direction={'column'} align={'start'} style={styles.content}>
                    <Text style={styles.title}>{data.pointName}</Text>
                    <XunJianComponent data={data}/>
                    {/*<ListImages images={images} lookImage={this.lookImage}/>*/}
                </Flex>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    title: {
        color: '#333',
        fontSize: 18,
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,

    },


});
