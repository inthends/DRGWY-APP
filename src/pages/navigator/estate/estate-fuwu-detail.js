
import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import BasePage from '../../base/base';
import { Flex, Button, Icon, Modal, TextareaItem } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
import UDToast from '../../../utils/UDToast';
import WorkService from '../../work/work-service';
import Communicates from '../../../components/communicates';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class EfuwuDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '服务单详情',
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
        let id = common.getValueFromProps(this.props);
        //let type = common.getValueFromProps(this.props, 'type'); 
        this.state = {
            id,
            value: '',
            images: [],
            detail: {},
            communicates: [],
            lookImageIndex: 0,
            visible: false,
            showRepair: false,
            btnList: []//按钮权限
        };
    }

    componentDidMount() {
        //获取按钮权限
        WorkService.getButtonListthen(btnList => {
            this.setState({ btnList });
        });
        this.getData();
    }


    getData = () => {
        const { id } = this.state;
        WorkService.serviceDetail(id).then(item => {
            this.setState({
                detail: {
                    ...item.data,
                    //businessId: item.businessId,
                    statusName: item.statusName
                },
            });
        });
        WorkService.serviceCommunicates(id).then(res => {
            this.setState({
                communicates: res
            });
        });
        WorkService.serviceExtra(id).then(images => {
            this.setState({
                images
            });
        });
    };


    reply = () => {
        const { id, value } = this.state;
        if (!(value && value.length > 0)) {
            UDToast.showInfo('请输入文字');
            return;
        }
        WorkService.serviceHandle('回复', id, value).then(res => {
            this.props.navigation.goBack();
        }).catch(err => {
            UDToast.showError(err);
        });
    };

    doWork = (handle) => {
        Alert.alert(
            '请确认',
            '是否' + handle + '？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
                    const { id, value } = this.state;
                    WorkService.serviceHandle(handle, id, value).then(res => {
                        this.props.navigation.goBack();
                    }).catch(err => {
                        UDToast.showError(err);
                    });
                }
            }
            ], { cancelable: false });
    };


    //转维修
    toRepair = (handle) => {
        Alert.alert(
            '请确认',
            '是否' + handle + '？',
            [{ text: '取消', tyle: 'cancel' },
            {
                text: '确定',
                onPress: () => {
                    const { id, value } = this.state;
                    WorkService.serviceHandle(handle, id, value).then(res => {
                        this.props.navigation.goBack();
                    }).catch(err => {
                        UDToast.showError(err);
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
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.billType}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.address}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>
                    <Text style={[styles.desc]}>{detail.contents}{"\n"}</Text>
                    <ListImages images={images} lookImage={this.lookImage} />
                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>报单人：{detail.contactName} {detail.createDate}</Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.contactPhone)}>
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')}
                                style={{ width: 16, height: 16 }} /></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>

                    {detail.businessCode ? (
                        <TouchableWithoutFeedback>
                            <Flex style={[styles.every, ScreenUtil.borderBottom()]}>
                                <Text style={styles.left}>关联单：</Text>
                                <Text onPress={() => {
                                    if (detail.businessType === 'Repair') {
                                        this.props.navigation.navigate('weixiuD', { data: detail.businessId });
                                    }
                                    else//if (detail.businessType === 'Complaint')
                                    {
                                        this.props.navigation.navigate('tousuD', { data: detail.businessId });
                                    }
                                }} style={[styles.right, { color: Macro.work_blue }]}>{detail.businessCode}</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    ) : null}

                    <View style={{
                        margin: 15,
                        borderStyle: 'solid',
                        borderColor: '#F3F4F2',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}>
                        <TextareaItem
                            rows={4}
                            placeholder='请输入'
                            style={{ paddingTop: 10, width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={value => this.setState({ value })}
                            value={this.state.value}
                        />
                    </View>

                    {/* <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <TextInput
                            maxLength={500}
                            placeholder='请输入'
                            multiline
                            onChangeText={value => this.setState({ value })}
                            value={this.state.value}
                            style={{ fontSize: 16, textAlignVertical: 'top' }}
                            numberOfLines={4}>
                        </TextInput>
                    </Flex> */}

                    {/* <TouchableWithoutFeedback onPress={() => this.click('回复')}>
                        <Flex justify={'center'} style={[styles.ii, {
                            width: '50%',
                            marginLeft: '10%',
                            marginRight: '10%',
                            marginTop: 10, 
                            marginBottom: 10,
                        }, { backgroundColor: Macro.work_blue }]}>
                            <Text style={styles.word}>回复</Text>
                        </Flex>
                    </TouchableWithoutFeedback> */}

                    <Flex justify={'center'}>
                        <Button onPress={() => this.reply()} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 150,
                                backgroundColor: Macro.work_blue,
                                marginTop: 20,
                                marginBottom: 10,
                                height: 40
                            }}>回复</Button>
                    </Flex>

                    {detail.status === 1 &&
                        //需要控制权限
                        <Flex>

                            {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'torepair')) ?
                                <TouchableWithoutFeedback
                                    onPress={() =>
                                        //this.toRepair('转维修')
                                        this.setState({
                                            serviceDeskId: id,
                                            showRepair: true
                                        })
                                    }>
                                    <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_blue }]}>
                                        <Text style={styles.word}>转维修</Text>
                                    </Flex>
                                </TouchableWithoutFeedback> :
                                null}

                            {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'tocomplaint')) ?
                                <TouchableWithoutFeedback onPress={() => this.doWork('转投诉')}>
                                    <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_blue }]}>
                                        <Text style={styles.word}>转投诉</Text>
                                    </Flex>
                                </TouchableWithoutFeedback> :
                                null}

                            {btnList.some(item => (item.moduleId == 'Servicedesk' && item.enCode == 'close')) ?
                                <TouchableWithoutFeedback onPress={() => this.doWork('关闭')}>
                                    <Flex justify={'center'} style={[styles.ii, { backgroundColor: '#666' }]}>
                                        <Text style={styles.word}>关闭</Text>
                                    </Flex>
                                </TouchableWithoutFeedback>
                                :
                                null}
                        </Flex>}

                    <Communicates communicateClick={this.communicateClick} communicates={communicates} />
                </ScrollView>

                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                        imageUrls={this.state.images} />
                </Modal>

                <Modal
                    transparent
                    onClose={() => this.setState({ showRepair: false })}
                    onRequestClose={() => this.setState({ showRepair: false })}
                    maskClosable
                    visible={this.state.showRepair}>
                    <Flex justify={'center'} align={'center'}>
                        {/* <ToRepair onClose={() => {
                            this.setState({ showRepair: false });
                            this.props.navigation.goBack();
                        }} item={this.state.selectItem} /> */}
                    </Flex>
                </Modal>

            </CommonView>
        );
    }
}

const styles = StyleSheet.create({

    every: {
        fontSize: 16,
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    every2: {
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 10
    },
    left: {
        fontSize: 16
    },
    right: {
        fontSize: 16
    },
    desc: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15,
        paddingBottom: 15
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
