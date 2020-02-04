import React, {Fragment} from 'react';
import BasePage from '../../base/base';
import {Flex, Accordion, List, Icon} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import {ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import ScrollTitle from '../../../components/scroll-title';
import ListImages from '../../../components/list-images';

export default class XunJianDetailPage extends BasePage {


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {data} = this.props;
        console.log(11112222,data)

        return (
            <Flex>
                <Flex direction={'column'} align={'start'}>
                    <Text style={styles.work}>{data.taskTime} {data.contentName}</Text>
                    <Text style={styles.title}>方法</Text>
                    <Text style={styles.desc}>{data.checkWay}</Text>
                    <Text style={styles.title}>标准</Text>
                    <Text style={styles.desc}>{data.criterion}</Text>
                    <Text style={styles.title}>计划</Text>
                    <Flex style={{width: ScreenUtil.deviceWidth()-30}} justify={'between'}>
                        <Text style={styles.desc}>{data.planTime}</Text>
                        <Text style={styles.desc}>{data.roleName}</Text>
                    </Flex>
                    <Text style={styles.title}>执行</Text>
                    <Flex style={{width: ScreenUtil.deviceWidth()-30}} justify={'between'}>
                        <Text style={styles.desc}>{data.exctuteTime}</Text>
                        <Text style={styles.desc}>{data.excuteUserName}</Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    }
}

const styles = StyleSheet.create({
    work: {
        color: Macro.work_blue,
        fontSize: 14,
    },
    title: {
        color: '#333',
        fontSize: 16,
        paddingTop: 15,

    },
    desc: {
        color: '#999',
        fontSize: 14,
        paddingTop: 10,
    },

});
