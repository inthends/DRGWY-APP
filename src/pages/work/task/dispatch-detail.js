import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Keyboard
} from 'react-native';
import BasePage from '../../base/base';
import { Button, Icon, TextareaItem, Flex } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import common from '../../../utils/common';
import UDToast from '../../../utils/UDToast';
import WorkService from '../work-service';
// import Communicates from '../../../components/communicates';
import OperationRecords from '../../../components/operationrecords';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';
// import MyPopover from '../../../components/my-popover';

export default class DispatchDetailPage extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            title: '派单',
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
        let id = common.getValueFromProps(this.props, 'id');
        //let type = common.getValueFromProps(this.props, 'type');
        this.state = {
            id,
            dispatchMemo: '',
            images: [],
            detail: {},
            communicates: [],
            lookImageIndex: 0,
            visible: false,
            selectPerson: null,
            assisPersons: [],
            repairmajor: null,
            emergencyLevel: null,
            importance: null,
            KeyboardShown: false

        };
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
    }

    onMySelect = ({ selectItem }) => {
        this.setState({
            selectPerson: selectItem
        })
    }

    onSelectAssisPerson = ({ selectItems }) => {
        this.setState({
            assisPersons: selectItems
        })
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {

                //选择维修专业
                if (obj.state.params.repairmajor) {
                    const { repairmajor } = obj.state.params.repairmajor || {};
                    this.setState({ repairmajor });
                }

                //选择类型
                if (obj.state.params.emergencyLevel) {
                    const { emergencyLevel } = obj.state.params || null;
                    this.setState({ emergencyLevel });
                }

                if (obj.state.params.importance) {
                    const { importance } = obj.state.params || null;
                    this.setState({ importance });
                }
            }
        );
        this.getData();
    }

    //add new
    componentWillMount() {
        //注册鼠标事件，用于文本框输入的时候往上移动 2024年5月23日
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            this.setState({
                KeyboardShown: true,
            });
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({
                KeyboardShown: false,
            });
        });
    }

    //add new
    componentWillUnmount() {
        //卸载键盘弹出事件监听
        if (this.keyboardDidShowListener != null) {
            this.keyboardDidShowListener.remove();
        }
        //卸载键盘隐藏事件监听
        if (this.keyboardDidHideListener != null) {
            this.keyboardDidHideListener.remove();
        }
    }

    getData = () => {
        const { id } = this.state;
        WorkService.weixiuDetail(id).then(detail => {
            this.setState({
                detail: {
                    ...detail.entity,
                    relationId: detail.relationId,
                    serviceDeskCode: detail.serviceDeskCode,
                    statusName: detail.statusName,
                    assistName: detail.assistName,//协助人 
                    reinforceName: detail.reinforceName//增援人 
                },
                repairmajor: {
                    id: detail.entity.repairMajorId,
                    name: detail.entity.repairMajor,
                    score: detail.entity.score
                },
                emergencyLevel: detail.entity.emergencyLevel,
                importance: detail.entity.importance
            });

            // WorkService.weixiuExtra(id).then(images => { 
            //     this.setState({
            //         images
            //     });
            // });

            //根据不同单据类型获取附件作为维修前图片
            WorkService.workPreFiles(detail.entity.sourceType, detail.relationId).then(images => {
                this.setState({
                    images
                });
            });

            //获取维修单的单据动态
            WorkService.getOperationRecord(id).then(res => {
                this.setState({
                    communicates: res
                });
            });
        });
    };

    click = () => {
        const { id, selectPerson, repairmajor, assisPersons, dispatchMemo, emergencyLevel, importance } = this.state;
        if (selectPerson == null) {
            UDToast.showInfo('请选择接单人');
            return;
        }

        if (repairmajor == null || repairmajor.id == null) {
            UDToast.showInfo('请选择维修专业');
            return;
        }

        let personIds = assisPersons.map(item => item.id);
        let assistId = personIds && personIds.length > 0 ? JSON.stringify(personIds) : '';

        WorkService.paidan(
            id,
            emergencyLevel,
            importance,
            selectPerson.id,
            selectPerson.name,
            repairmajor.id,
            repairmajor.name,
            assistId,
            dispatchMemo
        ).then(res => {
            UDToast.showInfo('操作成功');
            this.props.navigation.goBack();
        })

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
        const { images, detail, communicates, repairmajor, selectPerson,
            assisPersons, emergencyLevel, importance } = this.state;
        //转换name
        let personNames = assisPersons.map(item => item.name);
        let mystrNames = personNames.join('，');

        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView style={{ marginTop: this.state.KeyboardShown ? -200 : 0, height: '100%' }}>
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

                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>转单人：{detail.createUserName}</Text>
                    </Flex>
                    <Flex style={[styles.every2, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>转单时间：{detail.createDate}</Text>
                    </Flex>
                    <TouchableWithoutFeedback>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]}>
                            <Text style={styles.left}>关联单：</Text>
                            <Text onPress={() => {
                                if (detail.sourceType === '服务总台') {
                                    this.props.navigation.navigate('service', { id: detail.relationId });
                                }
                                else if (detail.sourceType === '维修单') {
                                    //检验不通过关联的旧的维修单
                                    this.props.navigation.navigate('weixiuView', { id: detail.relationId });
                                }
                                else {
                                    //检查单
                                    this.props.navigation.navigate('checkDetail', { id: detail.relationId });
                                }
                            }}
                                style={[styles.right, { color: Macro.work_blue }]}>{detail.serviceDeskCode}</Text>
                        </Flex>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('selectType', {
                            parentName: 'paidan',
                            type: 'emergencyLevel',
                            title: '选择紧急程度'
                        })}>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Flex>
                                <Text style={styles.left}>紧急程度：</Text>
                                <Text style={[styles.right, emergencyLevel ? { color: Macro.work_blue } : { color: '#666' }]}>{emergencyLevel ? emergencyLevel : "请选择紧急程度"}</Text>
                            </Flex>
                            <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                        </Flex>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('selectType', {
                            parentName: 'paidan',
                            type: 'importance',
                            title: '选择重要程度'
                        })}>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Flex>
                                <Text style={styles.left}>重要程度：</Text>
                                <Text style={[styles.right, importance ? { color: Macro.work_blue } : { color: '#666' }]}>{importance ? importance : "请选择重要程度"}</Text>
                            </Flex>
                            <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                        </Flex>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('selectRepairMajor', {
                            parentName: 'paidan'
                        })}>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Flex>
                                <Text style={styles.left}>维修专业：</Text>
                                <Text style={[styles.right, repairmajor && repairmajor.name ? { color: Macro.work_blue } : { color: '#666' }]}>{repairmajor && repairmajor.name ? repairmajor.name : "请选择维修专业"}</Text>
                            </Flex>
                            <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                        </Flex>
                    </TouchableWithoutFeedback>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Flex>
                            <Text style={styles.left}>积分：</Text>
                            <Text style={[styles.right, repairmajor && repairmajor.score ? { color: '#404145' } : { color: '#666' }]}>{repairmajor && repairmajor.score ? repairmajor.score : "自动获取"}</Text>
                        </Flex>
                    </Flex>

                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('selectRolePerson',
                            {
                                moduleId: 'Repair',
                                enCode: 'receive',
                                onSelect: this.onMySelect
                            })}>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Flex>
                                <Text style={styles.left}>接单人：</Text>
                                <Text style={[styles.right, selectPerson ? { color: Macro.work_blue } : { color: '#666' }]}>{selectPerson ? selectPerson.name : "请选择接单人"}</Text>
                            </Flex>
                            <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                        </Flex>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('selectRolePersonMulti', {
                            moduleId: 'Repair',
                            enCode: 'receive',
                            onSelect: this.onSelectAssisPerson
                        })}>
                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                            <Flex>
                                <Text style={styles.left}>协助人：</Text>
                                <Text style={[styles.right, mystrNames ? { color: Macro.work_blue } : { color: '#666' }]}>{mystrNames ? mystrNames : "请选择协助人"}</Text>
                            </Flex>
                            <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                        </Flex>
                    </TouchableWithoutFeedback>

                    <View style={{
                        margin: 15,
                        // borderStyle: 'solid',
                        // borderColor: '#F3F4F2',
                        // borderWidth: 1,
                        // borderRadius: 5
                    }}>
                        <TextareaItem
                            rows={4}
                            autoHeight
                            placeholder='请输入'
                            style={{ width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={dispatchMemo => this.setState({ dispatchMemo })}
                            value={this.state.dispatchMemo}
                        />
                    </View>

                    <Flex justify={'center'}>
                        <Button onPress={() => this.click()} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 220,
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
        color: '#404145'
    },
    right: {
        fontSize: 16,
        color: '#404145'
    },
    desc: {
        fontSize: 16,
        padding: 15,
        color: '#404145',
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
