import React from 'react';
import {
    //View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView, Modal,
} from 'react-native';
import BasePage from '../../base/base';
import { Button, Icon, Flex } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
import UDToast from '../../../utils/UDToast';
import DashLine from '../../../components/dash-line';
import WorkService from '../work-service';
// import Communicates from '../../../components/communicates';
import OperationRecords from '../../../components/operationrecords';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';


export default class PaiDanListDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '派单',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),

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
            selectPerson: null
        };
    }

    onSelect = ({ selectItem }) => {
        this.setState({
            selectPerson: selectItem
        })
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
                    relationId: detail.relationId,
                    statusName: detail.statusName
                }
            });

            //获取维修单的单据动态
            WorkService.getOperationRecord(id).then(res => {
                this.setState({
                    communicates: res,
                });
            });
        });

        WorkService.weixiuExtra(id).then(images => {
            this.setState({
                images,
            });
        });
    };

    click = () => {
        const { id, selectPerson } = this.state;
        if (selectPerson) {
            WorkService.paidan(id, selectPerson.name, selectPerson.id).then(res => {
                UDToast.showInfo('操作成功');
                this.props.navigation.goBack();
            })
        } else {
            UDToast.showInfo('请选择接单人');
        }
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
        const { images, detail, communicates, selectPerson } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
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

                    <Text style={[styles.desc]}>{detail.repairContent}</Text>
 
                    <ListImages images={images} lookImage={this.lookImage} />

                    <Flex style={[styles.every2]} justify='between'>
                        <Text style={styles.left}>转单人：{detail.createUserName} {detail.createDate}</Text>
                    </Flex>

                    <TouchableWithoutFeedback>
                        <Flex style={[styles.every]}>
                            <Text style={styles.left}>关联单：</Text>
                            <Text
                                onPress={() => this.props.navigation.navigate('service', { data: { id: detail.relationId } })}
                                style={[styles.right, { color: Macro.work_blue }]}>{detail.serviceDeskCode}</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('SelectPerson', { onSelect: this.onSelect })}>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Flex>
                                <Text style={styles.left}>接单人：</Text>
                                <Text
                                    style={[styles.right, selectPerson ? { color: Macro.work_blue } :
                                        { color: '#666' }]}>{selectPerson ? selectPerson.name : "请选择接单人"}</Text>
                            </Flex>
                            <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                        </Flex>
                    </TouchableWithoutFeedback>
                    {/* <DashLine />
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
                    </View> */}


                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <TextInput
                            maxLength={500}
                            placeholder='请输入'
                            multiline
                            onChangeText={value => this.setState({ value })}
                            value={this.state.value}
                            style={{ fontSize: 16, textAlignVertical: 'top' }}
                            numberOfLines={4}>
                        </TextInput>
                    </Flex>

                    {/* <TouchableWithoutFeedback onPress={() => this.click('派单')}>
                        <Flex justify={'center'} style={[styles.ii, {
                            width: '60%',
                            marginLeft: '10%',
                            marginRight: '10%',
                            marginTop: 10,
                            marginBottom: 5

                        }, { backgroundColor: Macro.work_blue }]}>
                            <Text style={styles.word}>派单</Text>
                        </Flex>
                    </TouchableWithoutFeedback> */}

                    <Flex justify={'center'}>
                        <Button onPress={() => this.click()} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 300,
                                backgroundColor: Macro.work_blue,
                                marginTop: 20,
                                height: 40
                            }}>派单</Button>
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
    header: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F3F4F2'
    },
    every: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    every2: {
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 10,
        paddingTop: 10
    },
    left: {
        fontSize: 16,
        color: '#333'
    },
    right: {
        fontSize: 16,
        color: '#333'
    },
    desc: {
        fontSize: 16,
        padding: 15,
        color: '#333',
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
