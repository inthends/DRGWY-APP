//统计里面点击的检查单详情
import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    TextInput,
    Modal,
    Keyboard,
    Alert
} from 'react-native';
import BasePage from '../../base/base';
import { Button, Flex, Icon } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import common from '../../../utils/common';
import WorkService from '../../work/work-service';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import { connect } from 'react-redux';
import LoadImage from '../../../components/load-image';
import LoadImageDelete from '../../../components/load-image-del';
import SelectImage from '../../../utils/select-image';
import UDToast from '../../../utils/UDToast';
import ListImages from '../../../components/list-images';
import ImageViewer from 'react-native-image-zoom-viewer';
import MyPopoverRole from '../../../components/my-popover-role';
import ActionPopover from '../../../components/action-popover';
import MyPopoverRight from '../../../components/my-popover-right';

class EcheckAddPage extends BasePage {

    static navigationOptions = ({ navigation }) => {
        return {
            title: '检查单',
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
        const {
            id,
            checkRole,
            checkRoleId
        } = common.getValueFromProps(this.props) || {};
        this.state = {
            id,
            detailId: '',
            detail: {},
            showAdd: false,
            pageIndex: 1,
            memo: '',
            address: null,
            repairmajor: null,
            selectPerson: null,
            checkMemo: '',
            rectification: '',
            visible: false,
            // images: [{ icon: '' }],
            images: [''],
            lookImageIndex: 0,
            refreshing: false,
            dataInfo: {
                data: []
            },
            checkTypes: [],
            checkType: '',
            roles: [],
            roleIndex: 0,//角色在数组里面的序号
            checkRole: checkRole,//'',//检查的角色
            checkRoleId: checkRoleId,//'',
            isAutoSend: false,//是否自动派单
            operateType: 'add'//明细操作类型，添加还是修改
        };
    }

    //guid
    guid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    componentDidMount() {
        //加载有现场检查权限的角色
        WorkService.getCheckRoles().then(roles => {
            this.setState({
                //roles: [...res.map(item => item.title)]
                //roles: [...res]
                roles
            });
            // if (roles.length > 0) {
            //     this.setState({ checkRole: roles[0].name, checkRoleId: roles[0].id });
            // } 
            //选择的角色id
            // let roleIndex = roles.findIndex(item => item.id == this.state.checkRoleId);
            // this.setState({ roleIndex });//设置角色序号 
        });

        //获取检查类型 
        WorkService.getCommonItems('CheckType').then(res => {
            this.setState({
                checkTypes: [...res.map(item => item.title)],
                checkType: res[0].title
            });
        });

        //获取是否自动派单
        WorkService.getSetting('isAutoSend').then(res => {
            this.setState({ isAutoSend: res });
        });

        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (obj.state.params) {
                    const { address } = obj.state.params.data || {};
                    this.setState({ address });
                }

                if (obj.state.params.repairmajor) {
                    const { repairmajor } = obj.state.params.repairmajor || {};
                    this.setState({ repairmajor });
                }
            }
        );

        const { id } = this.state;
        if (id) {
            this.getData();
            this.onRefresh();
        } else {
            let myid = this.guid();
            const { user } = this.props;
            //初始值
            this.setState({
                id: myid,//主单id
                detail: {
                    billCode: '自动生成单号',
                    statusName: '待评审',
                    checkUserName: user.showName,
                    postName: user.postName
                }
            });
        }
    }

    // componentWillUnmount() {
    //     this.viewDidAppear.remove();
    // }

    getData = () => {
        const { id } = this.state;
        WorkService.checkDetail(id).then(detail => {
            this.setState({
                detail
                // detail: {
                //     ...item.data,
                //     statusName: item.statusName
                // },
            });
        });
    };

    onRefresh = () => {
        this.setState({
            refreshing: true,
            pageIndex: 1
        }, () => {
            this.getList();
        });
    };

    //检查明细
    getList = () => {
        const { id } = this.state;
        WorkService.checkDetailList(this.state.pageIndex, id).then(dataInfo => {
            if (dataInfo.pageIndex > 1) {
                dataInfo = {
                    ...dataInfo,
                    data: [...this.state.dataInfo.data, ...dataInfo.data]
                };
            }
            this.setState({
                dataInfo: dataInfo,
                pageIndex: dataInfo.pageIndex,
                refreshing: false
            }, () => {
            });
        }).catch(err => this.setState({ refreshing: false }));
    };

    loadMore = () => {
        const { data, total, pageIndex } = this.state.dataInfo;
        if (this.canLoadMore && data.length < total) {
            this.canLoadMore = false;
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1
                // canLoadMore: false,
            }, () => {
                this.getList();
            });
        }
    };

    lookImage = (lookImageIndex, files) => {
        this.setState({
            lookImageIndex,
            images: files,//需要缓存是哪个明细的图片
            visible: true
        });
    };

    deleteDetail = (id) => {
        Alert.alert(
            '请确认',
            '是否删除？',
            [
                {
                    text: '取消',
                    onPress: () => {
                    },
                    style: 'cancel',
                },
                {
                    text: '确定',
                    onPress: () => {
                        WorkService.deleteCheckDetail(id).then(res => {
                            this.onRefresh();
                        });
                    },
                },
            ],
            { cancelable: false }
        );
    };

    _renderItem = ({ item, index }) => {
        return (
            <Flex direction='column' align={'start'}
                style={[styles.card, index % 2 == 0 ? styles.blue : styles.orange]}>
                <Flex justify='between' style={{ width: '100%' }}>
                    <Text style={styles.title}>{item.allName}</Text>
                    <ActionPopover
                        textStyle={{ fontSize: 14 }}
                        hiddenImage={true}
                        onChange={(title) => {
                            if (title === '删除') {
                                this.deleteDetail(item.id);
                            } else if (title === '修改') {
                                let myimages = [...this.state.images];
                                myimages.splice(myimages.length - 1, 0);
                                this.setState({
                                    showAdd: true,
                                    operateType: 'modify',
                                    id: item.mainId,
                                    images: myimages,
                                    detailId: item.id,
                                    address: { id: item.unitId, allName: item.allName, organizeId: item.organizeId },//设置默认值
                                    selectPerson: { id: item.dutyUserId, name: item.dutyUserName },
                                    checkMemo: item.memo,
                                    rectification: item.rectification
                                });
                            }
                        }}
                        titles={['修改', '删除']}
                        visible={true} />

                </Flex>
                <Flex style={styles.line} />
                <Flex align={'start'} direction={'column'}>
                    <Flex justify='between'
                        style={{ width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
                        <Text>责任人：{item.dutyUserName} {item.postName}，维修专业：{item.repairMajor}</Text>
                    </Flex>
                    <Text style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: 15,
                        color: '#666'
                    }}>检查情况：{item.memo}</Text>

                    <Text style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: 5,
                        color: '#666'
                    }}>整改要求：{item.rectification}</Text>

                </Flex>
                <ListImages images={item.images}
                    lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, item.images)} />
            </Flex>
        );
    };

    onSelectPerson = ({ selectItem }) => {
        this.setState({
            selectPerson: selectItem
        })
    }

    save = () => {
        const { id, memo, dataInfo } = this.state;
        if (dataInfo.data.length == 0) {
            UDToast.showError('请添加明细');
            return;
        }
        //保存数据
        WorkService.saveCheck(
            id,
            memo
        ).then(res => {
            UDToast.showError('保存成功');
            this.props.navigation.goBack();
        });
    };

    addDetail = () => {
        const { id, detailId, checkRole, checkRoleId, memo, address, selectPerson, checkMemo,
            rectification, operateType, checkType, repairmajor, isAutoSend } = this.state;

        if (!checkRole) {
            UDToast.showError('请选择检查角色');
            return;
        }

        if (!address) {
            UDToast.showError('请选择位置');
            return;
        }

        if (!selectPerson) {
            UDToast.showError('请选择责任人');
            return;
        }

        if (isAutoSend && (repairmajor == null || repairmajor.id == null)) {
            UDToast.showError('请选择维修专业');
            return;
        }

        if (checkType == '') {
            UDToast.showError('请选择检查类型');
            return;
        }


        if (checkMemo == '') {
            UDToast.showError('请输入检查情况');
            return;
        }

        //保存数据
        WorkService.addCheckDetail(
            id,
            checkRole,
            checkRoleId,
            memo,
            detailId,
            address.id,
            address.allName,
            selectPerson.id,
            selectPerson.name,
            repairmajor ? repairmajor.id : null,
            repairmajor ? repairmajor.name : null,
            checkType,
            checkMemo,
            rectification,
            operateType
        ).then(() => {
            if (operateType == 'add')
                UDToast.showError('添加成功');
            else
                UDToast.showError('修改成功');
            this.setState({ showAdd: false });
            this.getData();
            this.onRefresh();
        });
    };


    //上传图片
    selectImages = () => {
        SelectImage.select(this.state.detailId, '', '/api/MobileMethod/MUploadCheckFile').then(url => {
            let images = [...this.state.images];
            images.splice(images.length - 1, 0, url);
            if (images.length > 10) {
                //最多五张
                images = images.filter((item, index) => index !== images.length - 1);
            }
            this.setState({ images });
            this.onRefresh();
        }).catch(error => { });
    };

    //删除附件
    delete = (url) => {
        Alert.alert(
            '请确认',
            '是否删除？',
            [
                {
                    text: '取消',
                    style: 'cancel'
                },
                {
                    text: '确定',
                    onPress: () => {
                        WorkService.deleteCheckFile(url).then(res => {
                            let index = this.state.images.indexOf(url);
                            let myimages = [...this.state.images];
                            myimages.splice(index, 1);
                            this.setState({ images: myimages });
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    }

    cancel = () => {
        this.setState({
            visible: false
        });
    };

    render() {
        const { detail, dataInfo, address, checkTypes,
            selectPerson, repairmajor, roles, checkRoleId,
            images, isAutoSend, showAdd } = this.state;
        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>检查人：{detail.checkUserName} {detail.postName}</Text>
                        <Text>{detail.billDate}</Text>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>检查组：</Text>
                        <MyPopoverRole
                            onChange={(item) => {
                                this.setState({ checkRole: item.name, checkRoleId: item.id });
                            }}
                            roleId={checkRoleId}
                            data={roles}
                            visible={true} />
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>检查类型：</Text>
                        <MyPopoverRight
                            onChange={(value) => {
                                this.setState({ checkType: value });
                            }}
                            titles={checkTypes}
                            visible={true} />
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>检查区域：</Text>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.navigation.navigate('selectArea', {
                                title: '选择检查区域',
                                parentName: 'checkAdd',
                                roleId: this.state.checkRoleId
                            })}>
                            <Flex
                            // style={{
                            //     paddingTop: 5,
                            //     paddingBottom: 5
                            // }}
                            >
                                <Text style={[address && address.allName ? { fontSize: 16, paddingRight: 10 } :
                                    { fontSize: 16, color: '#999', paddingRight: 10 }]}>{address && address.allName ? address.allName : `请选择检查区域`}</Text>
                                <LoadImage style={{ width: 6, height: 12 }} defaultImg={require('../../../static/images/address/right.png')} />
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>

                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <TextInput
                            maxLength={500}
                            placeholder='请输入'
                            multiline
                            style={{ fontSize: 16, textAlignVertical: 'top' }}
                            onChangeText={memo => this.setState({ memo })}
                            value={this.state.memo}
                            numberOfLines={3}>
                        </TextInput>
                    </Flex>
                    <FlatList
                        data={dataInfo.data}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item) => item.id}
                        //必须
                        onEndReachedThreshold={0.1}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}//下拉刷新
                        onEndReached={this.loadMore}//底部往下拉翻页
                        onMomentumScrollBegin={() => this.canLoadMore = true}
                    />
                </ScrollView>

                <Flex justify={'center'}>
                    <Flex justify={'center'}>
                        <Button onPress={this.save} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 110,
                                backgroundColor: Macro.work_blue,
                                height: 40
                            }}>保存</Button>
                    </Flex>
                    <Flex justify={'center'}>
                        <Button onPress={() => {
                            if (address == null || address.id == null) {
                                UDToast.showError('选择检查区域');
                                return;
                            }
                            let mydetailId = this.guid();
                            this.setState({
                                showAdd: true,
                                detailId: mydetailId,
                                images: [''],
                                address: address,//设置默认值
                                selectPerson: null,
                                repairmajor: null,
                                checkMemo: '',
                                rectification: '',
                                operateType: 'add'
                            });
                        }}
                            type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }}
                            style={{
                                width: 110,
                                marginLeft: 60,
                                backgroundColor: Macro.work_blue,
                                height: 40
                            }}>添加明细</Button>
                    </Flex>
                </Flex>

                {showAdd && (
                    <View style={styles.mengceng}>
                        <TouchableWithoutFeedback onPress={() => {
                            Keyboard.dismiss();//隐藏键盘
                        }}>
                            <Flex direction={'column'} justify={'center'} align={'center'}
                                style={{ flex: 1, padding: 25, backgroundColor: 'rgba(178,178,178,0.5)' }}>
                                <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                    <CommonView style={{ height: isAutoSend ? 380 : 350, width: 320 }}>
                                        <TouchableWithoutFeedback
                                            onPress={() => this.props.navigation.navigate('selectAddress',
                                                {
                                                    title: '选择位置',
                                                    parentName: 'checkAdd',
                                                    roleId: this.state.checkRoleId
                                                })}>
                                            <Flex justify="between" style={[{
                                                paddingTop: 15,
                                                paddingBottom: 15,
                                                marginLeft: 10,
                                                marginRight: 10
                                            }, ScreenUtil.borderBottom()]}>
                                                <Text style={[address && address.allName ? { color: '#404145' } :
                                                    { color: '#999' }]}>{address && address.allName ? address.allName : `请选择位置`}</Text>
                                                <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                                            </Flex>
                                        </TouchableWithoutFeedback>

                                        <TouchableWithoutFeedback
                                            onPress={() => this.props.navigation.navigate('selectRolePersonInspect',
                                                {
                                                    organizeId: address.organizeId,
                                                    onSelect: this.onSelectPerson
                                                })}>
                                            <Flex justify='between' style={[{
                                                paddingTop: 15,
                                                paddingBottom: 15,
                                                marginLeft: 10,
                                                marginRight: 10,
                                            }, ScreenUtil.borderBottom()]}>
                                                <Text style={[selectPerson ? { fontSize: 16, color: '#404145' } :
                                                    { color: '#999' }]}>{selectPerson ? selectPerson.name : "请选择责任人"}</Text>
                                                <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                                            </Flex>
                                        </TouchableWithoutFeedback>

                                        {isAutoSend ?
                                            <TouchableWithoutFeedback
                                                onPress={() => this.props.navigation.navigate('selectRepairMajor', { parentName: 'checkAdd' })}>
                                                <Flex justify="between" style={[{
                                                    paddingTop: 15,
                                                    paddingBottom: 15,
                                                    marginLeft: 10,
                                                    marginRight: 10
                                                }, ScreenUtil.borderBottom()]}>
                                                    <Text style={[repairmajor ? { fontSize: 16, color: '#404145' } :
                                                        { fontSize: 16, color: '#999' }]}>{repairmajor ? repairmajor.name : `请选择维修专业`}</Text>
                                                    <LoadImage style={{ width: 6, height: 11 }} defaultImg={require('../../../static/images/address/right.png')} />
                                                </Flex>
                                            </TouchableWithoutFeedback> : null}

                                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                            <TextInput
                                                maxLength={500}
                                                placeholder='请输入检查情况'
                                                multiline
                                                onChangeText={checkMemo => this.setState({ checkMemo })}
                                                value={this.state.checkMemo}
                                                style={{ textAlignVertical: 'top', height: 50 }}
                                                numberOfLines={4}>
                                            </TextInput>
                                        </Flex>

                                        <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                                            <TextInput
                                                maxLength={500}
                                                placeholder='请输入整改要求'
                                                multiline
                                                onChangeText={rectification => this.setState({ rectification })}
                                                value={this.state.rectification}
                                                style={{ textAlignVertical: 'top', height: 50 }}
                                                numberOfLines={4}>
                                            </TextInput>
                                        </Flex>

                                        <ScrollView>
                                            <Flex justify={'start'} align={'start'}
                                            //style={{ width: ScreenUtil.deviceWidth() }}
                                            >
                                                <Flex wrap={'wrap'}>
                                                    {images.map((url, index) => {
                                                        return (
                                                            <TouchableWithoutFeedback key={index} onPress={() => {
                                                                if (index === images.length - 1 && url.length === 0) {
                                                                    this.selectImages();
                                                                }
                                                            }}>
                                                                <View style={{
                                                                    paddingLeft: 15,
                                                                    paddingRight: 5,
                                                                    //paddingBottom: 10,
                                                                    paddingTop: 15
                                                                }}>
                                                                    <LoadImageDelete
                                                                        style={{
                                                                            width: (ScreenUtil.deviceWidth() - 15) / 5.0 - 20,
                                                                            height: (ScreenUtil.deviceWidth() - 15) / 5.0 - 20,
                                                                            borderRadius: 5
                                                                        }}
                                                                        defaultImg={require('../../../static/images/add_pic.png')}
                                                                        img={url}
                                                                        top={10}
                                                                        delete={() => this.delete(url)}
                                                                    />
                                                                </View>
                                                            </TouchableWithoutFeedback>
                                                        );
                                                    })}
                                                </Flex>
                                            </Flex>
                                        </ScrollView>
                                    </CommonView>

                                    <Flex style={{ marginTop: 10 }}>
                                        <Button onPress={this.addDetail} type={'primary'}
                                            activeStyle={{ backgroundColor: Macro.work_blue }}
                                            style={{
                                                width: 110,
                                                backgroundColor: Macro.work_blue,
                                                height: 35
                                            }}>确认</Button>
                                        <Button onPress={() => {
                                            this.setState({ showAdd: false });
                                            this.onRefresh();
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
                        </TouchableWithoutFeedback>
                    </View>
                )}


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
        //fontSize: 16,
        color: '#666',
        marginLeft: 7,
        marginRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },

    left: {
        fontSize: 16,
        color: '#666'
    },
    right: {
        fontSize: 16,
        color: '#666'
    },

    list: {
        backgroundColor: Macro.color_white,
        margin: 15
    },

    card: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#c8c8c8',
        borderBottomColor: '#c8c8c8',
        borderRightColor: '#c8c8c8',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        shadowColor: '#00000033',
        shadowOffset: { h: 10, w: 10 },
        shadowRadius: 5,
        shadowOpacity: 0.8
    },

    blue: {
        borderLeftColor: Macro.work_blue,
        borderLeftWidth: 5,
    },
    orange: {
        borderLeftColor: Macro.work_orange,
        borderLeftWidth: 5,
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30 - 15 * 2,
        marginLeft: 15,
        backgroundColor: '#eee',
        height: 1
    },
    title: {
        paddingTop: 15,
        color: '#404145',
        fontSize: 16,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20
    },
    mengceng: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    }
});


const mapStateToProps = ({ memberReducer }) => {
    return {
        user: {
            ...memberReducer.user,
            id: memberReducer.user.userId
        }
    };
};


export default connect(mapStateToProps)(EcheckAddPage);