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
        const { id, address } = common.getValueFromProps(this.props) || {};
        this.state = {
            id,
            detailId: '',
            detail: {},
            showAdd: false,
            pageIndex: 1,
            memo: '',
            address,
            selectPerson: null,
            checkMemo: '',
            rectification: '',
            visible: false,
            // images: [{ icon: '' }],
            images: [''],
            lookImageIndex: 0,
            dataInfo: {
                data: []
            },
            roles: [],
            checkRole: ''//检查的角色
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
        WorkService.getCheckRoles().then(res => {
            this.setState({
                roles: [...res.map(item => item.title)]
            });

            if (res.length > 0) {
                this.setState({ checkRole: res[0].title });
            }
        });

        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (obj.state.params) {
                    const { address } = obj.state.params.data || {};
                    this.setState({ address });
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
                refreshing: false
            }, () => {
            });
        }).catch(err => this.setState({ refreshing: false }));
    };

    loadMore = () => {
        const { data, total, pageIndex } = this.state.dataInfo;
        // if (!this.state.canLoadMore) {
        //     return;
        // }
        if (this.canAction && data.length < total) {
            this.setState({
                refreshing: true,
                pageIndex: pageIndex + 1,
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

    _renderItem = ({ item, index }) => {
        return (
            <Flex direction='column' align={'start'}
                style={[styles.card, index === 0 ? styles.blue : styles.orange]}>
                <Flex justify='between' style={{ width: '100%' }}>
                    <Text style={styles.title}>{item.allName}</Text>
                </Flex>
                <Flex style={styles.line} />
                <Flex align={'start'} direction={'column'}>
                    <Flex justify='between'
                        style={{ width: '100%', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
                        <Text>责任人：{item.dutyUserName} {item.postName}</Text>
                    </Flex>
                    <Text style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: 20,
                        color: '#666'
                    }}>{item.memo}</Text>
                </Flex>
                <ListImages images={item.images} lookImage={(lookImageIndex) => this.lookImage(lookImageIndex, item.images)} />
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
        const { id, detailId, checkRole, memo, address, selectPerson, checkMemo, rectification } = this.state;
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

        if (checkMemo == '') {
            UDToast.showError('请输入检查情况');
            return;
        }

        //保存数据
        WorkService.addCheckDetail(
            id,
            checkRole,
            memo,
            detailId,
            address.id,
            address.allName,
            selectPerson.id,
            selectPerson.name,
            checkMemo,
            rectification
        ).then(() => {
            UDToast.showError('添加成功');
            this.setState({ showAdd: false });
            this.getData();
            this.onRefresh();
        });
    };

    //上传图片
    selectImages = () => {
        SelectImage.select(this.state.detailId, '', '/api/MobileMethod/MUploadCheckDesk').then(url => {
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
                        WorkService.deleteWorkFile(url).then(res => {
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
        const { detail, dataInfo, address, selectPerson, roles, images } = this.state;
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
                        <MyPopoverRight
                            onChange={(title) => {
                                this.setState({ checkRole: title });
                            }}
                            titles={roles}
                            visible={true} />
                    </Flex>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>检查区域：</Text>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.navigation.navigate('selectAddress', { parentName: 'checkAdd' })}>
                            <Flex
                                //justify="between"
                                style={{
                                    paddingTop: 10,
                                    paddingBottom: 10
                                }}
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
                            numberOfLines={4}>
                        </TextInput>
                    </Flex>
                    <FlatList
                        data={dataInfo.data}
                        renderItem={this._renderItem}
                        style={styles.list}
                        keyExtractor={(item) => item.id}
                        onEndReached={() => this.loadMore()}
                        onEndReachedThreshold={0.1}
                        onMomentumScrollBegin={() => this.canAction = true}
                        onMomentumScrollEnd={() => this.canAction = false}
                    />
                </ScrollView>

                <Flex justify={'center'}>
                    <Flex justify={'center'}>
                        <Button onPress={this.save} type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                                width: 130,
                                backgroundColor: Macro.work_blue,
                                height: 40
                            }}>保存</Button>
                    </Flex>
                    <Flex justify={'center'}>
                        <Button onPress={() => {
                            let mydetailId = this.guid();
                            this.setState({
                                showAdd: true,
                                detailId: mydetailId,
                                images: [''],
                                address: address,//设置默认值
                                selectPerson: null,
                                checkMemo: '',
                                rectification: ''
                            });
                        }}
                            type={'primary'}
                            activeStyle={{ backgroundColor: Macro.work_blue }}
                            style={{
                                width: 130,
                                marginLeft: 60,
                                backgroundColor: Macro.work_blue,
                                height: 40
                            }}>添加明细</Button>
                    </Flex>
                </Flex>
                {
                    this.state.showAdd && (
                        <View style={styles.mengceng}>
                            <TouchableWithoutFeedback onPress={() => {
                                Keyboard.dismiss();//隐藏键盘
                            }}>
                                <Flex direction={'column'} justify={'center'} align={'center'}
                                    style={{ flex: 1, padding: 25, backgroundColor: 'rgba(178,178,178,0.5)' }}>
                                    <Flex direction={'column'} style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
                                        <CommonView style={{ height: 350, width: 320 }}>
                                            <TouchableWithoutFeedback
                                                onPress={() => this.props.navigation.navigate('selectAddress', { parentName: 'checkAdd' })}>
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
                                                onPress={() => this.props.navigation.navigate('selectRolePerson', { type: 'dispatch', onSelect: this.onSelectPerson })}>
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

                                            <Flex justify={'start'} align={'start'} style={{ width: ScreenUtil.deviceWidth() }}>
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
                                                                    paddingBottom: 10,
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
                                                                        delete={() => this.delete(url)}
                                                                    />
                                                                </View>
                                                            </TouchableWithoutFeedback>
                                                        );
                                                    })}
                                                </Flex>
                                            </Flex>
                                        </CommonView>
                                        <Flex style={{ marginTop: 15 }}>
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