import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Platform,
    Keyboard, CameraRoll
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
import RNFetchBlob from 'rn-fetch-blob';

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
            assisPersons: [],//协助人
            repairmajor: null,
            emergencyLevel: null,
            importance: null,
            KeyboardShown: false,
            refuseMemo: '',
            showClose: false
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
        //要过滤已经选择了的人员
        const { assisPersons } = this.state;
        //去除原队列已存在数据  
        for (var i = 0; i < assisPersons.length; i++) {
            for (var j = 0; j < selectItems.length; j++) {
                if (selectItems[j].id == assisPersons[i].id) {
                    selectItems.splice(j, 1);//移除
                    j = j - 1;
                }
            }
        }
        let list = [...assisPersons, ...selectItems];//合并数组
        this.setState({
            assisPersons: list
        })
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {

                //获取维修专业弹出界面的返回值
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
                KeyboardShown: true
            });
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({
                KeyboardShown: false
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
            UDToast.showError('请选择接单人');
            return;
        }

        if (repairmajor == null || repairmajor.id == null) {
            UDToast.showError('请选择维修专业');
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

    //驳回
    refuse = () => {
        const { id, refuseMemo } = this.state;
        if (!(refuseMemo && refuseMemo.length > 0)) {
            UDToast.showError('请输入驳回原因');
            return;
        }
        WorkService.serviceHandle('驳回', id, refuseMemo).then(res => {
            UDToast.showInfo('操作成功');
            this.props.navigation.goBack();
        });
    }

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

    savePhoto = (uri) => {
        try {
            if (Platform.OS == 'android') { //远程文件需要先下载 
                // 下载网络图片到本地
                // const response = await RNFetchBlob.config({
                //     fileCache: true,
                //     appendExt: 'png', // 可以根据需要更改文件扩展名
                // }).fetch('GET', uri);
                // const imagePath = response.path();
                // // 将本地图片保存到相册
                // const result = await CameraRoll.saveToCameraRoll(imagePath);
                // if (result) {
                //     UDToast.showInfo('已保存到相册'); 
                // } else {
                //     UDToast.showInfo('保存失败');
                // }

                //上面方法一样可以

                RNFetchBlob.config({
                    // 接收类型，这里是必须的，否则Android会报错
                    fileCache: true,
                    appendExt: 'png' // 给文件添加扩展名，Android需要这个来识别文件类型
                })
                    .fetch('GET', uri) // 使用GET请求下载图片
                    .then((res) => {
                        // 下载完成后的操作，例如保存到本地文件系统
                        // return RNFetchBlob.fs.writeFile(path, res.data, 'base64'); // 将数据写入文件系统
                        CameraRoll.saveToCameraRoll(res.data);
                    })
                    // .then(() => {
                    //     //console.log('Image saved to docs://image.png'); // 或者使用你的路径
                    //     // 在这里你可以做其他事情，比如显示一个提示或者加载图片等 
                    // })
                    .catch((err) => {
                    });

            }
            else {
                //ios
                let promise = CameraRoll.saveToCameraRoll(uri);
                promise.then(function (result) {
                }).catch(function (err) {
                });
            }

        } catch (error) {
        }
    }

    lookImage = (lookImageIndex) => {
        this.setState({
            lookImageIndex,
            visible: true
        });
    };

    render() {
        const { images, detail, communicates, repairmajor, selectPerson, assisPersons, emergencyLevel, importance } = this.state;
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
                                else //if (detail.sourceType === '维修单') 
                                {
                                    //检验不通过关联的旧的维修单
                                    this.props.navigation.navigate('weixiuView', { id: detail.relationId });
                                }
                                // else {
                                //     //检查单
                                //     this.props.navigation.navigate('checkDetail', { id: detail.relationId });
                                // }
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
                                <Text style={[styles.right, repairmajor ? { color: Macro.work_blue } : { color: '#666' }]}>{repairmajor ? repairmajor.name : "请选择维修专业"}</Text>
                            </Flex>
                            <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                        </Flex>
                    </TouchableWithoutFeedback>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Flex>
                            <Text style={styles.left}>积分：</Text>
                            <Text style={[styles.right, repairmajor ? { color: '#404145' } : { color: '#666' }]}>{repairmajor ? repairmajor.score : "自动获取"}</Text>
                        </Flex>
                    </Flex>

                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('selectReceivePerson',
                            {
                                moduleId: 'Repair',
                                enCode: 'receive',
                                organizeId: detail.organizeId,
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
                            organizeId: detail.organizeId,
                            onSelect: this.onSelectAssisPerson,
                            exceptUserId: selectPerson ? selectPerson.id : null//要过滤掉的用户
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
                            placeholder='请输入派单说明'
                            style={{ width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={dispatchMemo => this.setState({ dispatchMemo })}
                            value={this.state.dispatchMemo}
                            maxLength={500}
                        />
                    </View>

                    <Flex justify={'center'}>
                        <Button onPress={() => this.click()} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 110,
                                backgroundColor: Macro.work_blue,
                                marginTop: 20,
                                height: 40
                            }}>派单</Button>

                        <Button onPress={() => {
                            this.setState({
                                refuseMemo: '',
                                showClose: true
                            })
                        }} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_red }} style={{
                                width: 110,
                                backgroundColor: Macro.work_red,
                                marginTop: 20,
                                marginLeft: 50,
                                borderWidth: 0,
                                height: 40
                            }}>驳回</Button>
                    </Flex>
                    <OperationRecords communicateClick={this.communicateClick} communicates={communicates} />
                </ScrollView>

                {this.state.showClose && (
                    //退单
                    <View style={styles.mengceng}>
                        <Flex direction={'column'} justify={'center'} align={'center'}
                            style={{
                                flex: 1, padding: 25,
                                backgroundColor: 'rgba(178,178,178,0.5)'
                            }}>
                            <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                <View style={{ height: 110, width: 300 }}>
                                    <TextareaItem
                                        style={{ height: 100 }}
                                        placeholder='请输入驳回原因'
                                        maxLength={500}
                                        onChange={value => this.setState({ refuseMemo: value })}
                                        value={this.state.refuseMemo}
                                    />
                                </View>
                                <Flex style={{ marginTop: 15 }}>
                                    <Button onPress={() => this.refuse()} type={'primary'}
                                        activeStyle={{ backgroundColor: Macro.work_blue }}
                                        style={{
                                            width: 110,
                                            backgroundColor: Macro.work_blue,
                                            height: 35
                                        }}>确认</Button>
                                    <Button onPress={() => {
                                        this.setState({ showClose: false });
                                    }}
                                        type={'primary'}
                                        activeStyle={{ backgroundColor: Macro.work_blue }}
                                        style={{
                                            marginLeft: 30,
                                            width: 110,
                                            backgroundColor: '#666',
                                            borderWidth: 0,
                                            height: 35
                                        }}>取消</Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </View>
                )}

                <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                    <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                        imageUrls={this.state.images}
                        menuContext={{ "saveToLocal": "保存到相册", "cancel": "取消" }}
                        onSave={(url) => this.savePhoto(url)}
                    />
                </Modal>


            </CommonView>
        );
    }
}

const styles = StyleSheet.create({

    mengceng: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
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
        color: '#404145'
    },
    right: {
        fontSize: 16,
        color: '#404145'
    },
    desc: {
        lineHeight: 20,
        fontSize: 15,
        padding: 15
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
