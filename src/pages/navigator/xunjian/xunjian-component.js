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
        return (
            <Flex>
                <Flex direction={'column'} align={'start'}>
                    <Text style={styles.work}>09:30 查看单元门是否关闭</Text>
                    <Text style={styles.title}>方法</Text>
                    <Text style={styles.desc}>目视，手动推门</Text>
                    <Text style={styles.title}>标准</Text>
                    <Text style={styles.desc}>用力推</Text>
                    <Text style={styles.title}>计划</Text>
                    <Flex style={{width: ScreenUtil.deviceWidth()-30}} justify={'between'}>
                        <Text style={styles.desc}>2019-12-31</Text>
                        <Text style={styles.desc}>秩序1队</Text>
                    </Flex>
                    <Text style={styles.title}>执行</Text>
                    <Flex style={{width: ScreenUtil.deviceWidth()-30}} justify={'between'}>
                        <Text style={styles.desc}>2019-12-31</Text>
                        <Text style={styles.desc}>路人甲</Text>
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
