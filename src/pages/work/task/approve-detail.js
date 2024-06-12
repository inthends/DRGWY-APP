import React from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Alert
} from 'react-native';
import BasePage from '../../base/base';
import { Button, Icon, Flex } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
import UDToast from '../../../utils/UDToast';
import WorkService from '../work-service';
import OperationRecords from '../../../components/operationrecords';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class ApproveDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '维修单审核',
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
        let id = common.getValueFromProps(this.props,'id');
        this.state = {
            id,
            value: '',
            result: 1,
            images: [],
            detail: {},
            communicates: [],
            lookImageIndex: 0,
            visible: false
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { id } = this.state;
        WorkService.weixiuDetail(id).then(detail => {
            this.setState({
                detail: {
                    ...detail.entity,
                    serviceDeskCode: detail.serviceDeskCode,
                    emergencyLevel: detail.emergencyLevel,
                    importance: detail.importance,
                    relationId: detail.relationId,
                    statusName: detail.statusName
                }
            });
            //获取维修单的单据动态
            WorkService.getOperationRecord(id).then(res => {
                this.setState({
                    communicates: res
                });
            });
        });

        WorkService.weixiuExtra(id).then(images => {
            this.setState({
                images
            });
        });
    };

    click = () => {
        Alert.alert(
            '请确认',
            '是否审核？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
                    const { id } = this.state;
                    WorkService.approve(id).then(res => {
                        UDToast.showInfo('审核完成');
                        this.props.navigation.goBack();
                    });
                }
            }
            ], { cancelable: false });
    };

    communicateClick = (i) => {
        let c = this.state.communicates;
        let d = c.map(it => {
            if (it.id === i.id) {
                it.show = i.show !== true;
            }
            return it;
        });
        this.setState({
            communicates: d
        });
    };

    cancel = () => {
        this.setState({
            visible: false
        });
    };

    lookImage = (lookImageIndex) => {
        this.setState({
            lookImageIndex,
            visible: true
        });
    };

    render() {
        const { images, detail, communicates } = this.state;
        // const selectImg = require('../../../static/images/select.png');
        // const noselectImg = require('../../../static/images/no-select.png');
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView style={{ height: '100%' }}>
                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>
                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.address} {detail.contactName}</Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.contactLink)}>
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')}
                                style={{ width: 16, height: 16 }} /></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                    <Text style={styles.desc}>{detail.repairContent}</Text>
                    <ListImages images={images} lookImage={this.lookImage} />

                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>紧急：{detail.emergencyLevel}，重要：{detail.importance}</Text>
                    </Flex>
                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>转单人：{detail.createUserName}，转单时间：{detail.createDate}</Text>
                    </Flex>
                    <TouchableWithoutFeedback>
                        <Flex style={[styles.every2, ScreenUtil.borderBottom()]}>
                            <Text style={styles.left}>关联单：</Text>
                            <Text
                                onPress={() => {
                                    if (detail.sourceType === '服务总台') {
                                        this.props.navigation.navigate('service', { id: detail.relationId });
                                    }
                                    else {
                                        //检查单
                                        this.props.navigation.navigate('checkDetail', { id: detail.relationId });
                                    }
                                }}
                                style={[styles.right, { color: Macro.work_blue }]}>{detail.serviceDeskCode}</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>维修专业：{detail.repairMajor}，积分：{detail.score}</Text>
                    </Flex>

                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>协助人：{detail.assistName}</Text>
                    </Flex>

                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>增援人：{detail.reinforceName}</Text>
                    </Flex>

                    {detail.testDate ?//进行了检验
                        <>
                            <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验人：{detail.testerName}，检验时间：{detail.testDate}</Text>
                            </Flex>

                            {/* <Flex justify={'between'} style={{ margin: 15 }}>
                                <Flex>
                                    <LoadImage img={detail.testResult === 1 ? selectImg : noselectImg}
                                        style={{ width: 15, height: 15 }} />
                                    <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15 }}>合格</Text>
                                </Flex>
                                <Flex>
                                    <LoadImage img={detail.testResult === 0 ? selectImg : noselectImg}
                                        style={{ width: 15, height: 15 }} />
                                    <Text style={{ color: '#666', fontSize: 16, paddingLeft: 15 }}>不合格</Text>
                                </Flex>
                            </Flex> */}

                            <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                                <Text style={styles.left}>检验结果：{detail.testResult === 1?'合格':'不合格'}</Text> 
                            </Flex>

                            <Text style={styles.desc}>{detail.testRemark}</Text>
                        </> : null}

                    <Flex justify={'center'}>
                        <Button onPress={() => this.click()} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 130,
                                backgroundColor: Macro.work_blue,
                                marginTop: 20,
                                height: 40
                            }}>审核</Button>
                    </Flex> 
                    <OperationRecords communicateClick={this.communicateClick} communicates={communicates} />
                    
                </ScrollView>
                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                        imageUrls={this.state.images} />
                </Modal>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    // every: {
    //     marginLeft: 15,
    //     marginRight: 15,
    //     paddingTop: 15,
    //     paddingBottom: 15
    // },
    every2: {
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 10,
        paddingTop: 10
    },
    left: {
        fontSize: 14,
        color: '#404145'
    },
    right: {
        fontSize: 14,
        color: '#404145'
    },
    desc: {
        padding: 15,
        paddingBottom: 40
    },
    ii: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginBottom: 20
    },
    word: {
        color: 'white',
        fontSize: 16
    }
});
