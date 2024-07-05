import React from 'react';
import {
    ScrollView, StyleSheet, Text, TouchableOpacity,
    TouchableWithoutFeedback, View, Alert
} from 'react-native';
import BasePage from '../../base/base';
import { Button, Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import LoadImageDelete from '../../../components/load-image-del';
import CommonView from '../../../components/CommonView';
//import ScrollTitle from '../../../components/scroll-title';
import XunJianComponent from './xunjian-component';
import SelectImage from '../../../utils/select-image';
import XunJianService from './xunjian-service';
import common from '../../../utils/common';
import { connect } from 'react-redux';
import { //saveUser, saveXunJian, 
    saveXunJianAction
} from '../../../utils/store/actions/actions';
import UDToast from '../../../utils/UDToast';

class StartXunJianPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '开始巡检',
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
        this.state = {
            //images: [{ icon: '' }],
            images: [''],
            data: {},
            inspectData: [],
            ...common.getValueFromProps(this.props)//lineId,pointId,person
        };
    }

    componentDidMount() {
        const { id, pointId, item } = this.state;
        if (this.props.hasNetwork) {
            XunJianService.xunjianAddress(pointId).then(address => {
                XunJianService.xunjianDetail(id).then(data => {
                    this.setState({ data, address });
                    XunJianService.xunjianTaskDeletePhoto(data.id);
                });
            });
        } else {
            //离线巡检
            this.setState({
                data: item,
                address: { allName: item.allName, id: item.pointId }
            });
        }

        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (this.needBack === true) {
                    this.props.navigation.goBack();
                }
            }
        );
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
    }

    selectImages = () => {
        SelectImage.select(this.state.id, '', '/api/MobileMethod/MUploadPollingTask', this.props.hasNetwork).then(res => {
            let images = [...this.state.images];
            images.splice(images.length - 1, 0, res);
            if (images.length > 10) {
                images = images.filter((item, index) => index !== images.length - 1);
            }
            if (images.length > 1) {
                if (!!images[0]) {
                    this.setState({ images });
                }
            }
            else {
                this.setState({ images });
            }
        });//.catch(error => { });
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
                        XunJianService.deletePollingFile(url).then(res => {
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

    submit = () => {
        const { id, person, address, item, inspectData } = this.state;
        const { data } = this.state;
        let newInspectData = [];
        if (inspectData.length === 0) {
            try {
                data.contents.map((subItem) => {
                    newInspectData.push({
                        id: subItem.id,
                        taskId: item.id,
                        contentId: subItem.contentId,
                        result: 1,
                        memo: ''
                    })
                })
            } catch (error) { }
        }
        else {
            inspectData.map((subItem) => {
                newInspectData.push({
                    id: subItem.id,
                    taskId: item.id,
                    contentId: subItem.contentId,
                    result: subItem.result,
                    memo: subItem.msg
                })
            })
        }

        if (this.props.hasNetwork) {
            if (this.state.images.length > 1) {
                let arrStr = JSON.stringify(newInspectData);
                XunJianService.xunjianExecute(id, person.id, person.name, arrStr).then(res => {
                    this.props.navigation.goBack();
                });
            }
            else {
                UDToast.showSuccess('请上传图片');
            }

        } else {
            //离线缓存巡检结果
            let images = this.state.images.filter(item => item.icon.fileUri && item.icon.fileUri.length > 0);
            this.props.saveXunJianAction({
                [item.id]: {
                    xunjianParams: {
                        keyvalue: item.id,
                        userId: person.id,
                        userName: person.name,
                        inspectData: newInspectData//巡检任务明细
                    },
                    idForUploadImage: item.id,
                    images,
                    address
                }
            });
            UDToast.showSuccess('已保存，稍后可在我的-设置中上传巡检数据');
            this.props.navigation.goBack();
        }
    }

    _inspecting(newdata) {
        let inspectData = newdata.filter((item) => {
            if (item.result === 1) {
                item.msg = '';
            }
            return item;
        })
        this.setState({ inspectData });
    }

    render() {//: React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { images, data } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollView style={{ height: ScreenUtil.contentHeight() - 160 }}>
                    <Flex direction={'column'} align={'start'} style={styles.content}>
                        <Text style={styles.title}>{data.pName}</Text>
                        <XunJianComponent data={data} _inspecting={this._inspecting.bind(this)} />
                    </Flex>
                    {/* <Flex justify={'start'} align={'start'} style={{ width: ScreenUtil.deviceWidth() }}>
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
                                            paddingTop: 10
                                        }}>
                                            <LoadImageDelete style={{
                                                width: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                                height: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                                borderRadius: 5
                                            }}
                                                defaultImg={require('../../../static/images/add_pic.png')}
                                                img={url}
                                                top={19}
                                                delete={() => this.delete(url)} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </Flex>
                    </Flex>  
                    <Flex style={{
                        minHeight: 40,
                        marginBottom: 30,
                        width: '80%',
                        marginHorizontal: '10%',
                        flex: 1
                    }}>
                        <TouchableWithoutFeedback onPress={this.submit}>
                            <Flex flex={1} justify='center' style={[styles.ii, { backgroundColor: Macro.work_blue }]}>
                                <Text style={styles.word}>完成</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex> */}
                </ScrollView>

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
                                        //paddingBottom: 10,
                                        //paddingTop: 10
                                    }}>
                                        <LoadImageDelete style={{
                                            width: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                            height: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                            borderRadius: 5
                                        }}
                                            defaultImg={require('../../../static/images/add_pic.png')}
                                            img={url}
                                            top={19}
                                            delete={() => this.delete(url)} />
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    </Flex>
                </Flex>

                {/* <TouchableWithoutFeedback onPress={this.submit}>
                    <Flex flex={1} justify='center' style={{
                        width: '70%',
                        marginLeft: '15%',
                        marginRight: '15%',
                        marginBottom: 40,
                        backgroundColor: Macro.work_blue
                    }}>
                        <Text style={styles.word}>完成</Text>
                    </Flex>
                </TouchableWithoutFeedback> */}

                <Flex justify={'center'}>
                    <Button onPress={this.submit} type={'primary'}
                        activeStyle={{ backgroundColor: Macro.work_blue }} style={{
                            width: 220,
                            backgroundColor: Macro.work_blue,
                            marginTop: 20,
                            marginBottom: 20,
                            height: 40
                        }}>完成</Button>
                </Flex>

            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingLeft: 15,
        paddingRight: 15
    },
    title: {
        color: '#404145',
        fontSize: 16,
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10
    },
    // ii: {
    //     paddingTop: 10,
    //     paddingBottom: 10,
    //     backgroundColor: '#999',
    //     borderRadius: 6,
    //     //marginTop: 30
    // },
    word: {
        color: 'white',
        fontSize: 16
    }
});

const mapStateToProps = ({ memberReducer, xunJianReducer }) => {

    return {
        hasNetwork: memberReducer.hasNetwork
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        saveXunJianAction(data) {
            dispatch(saveXunJianAction(data));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(StartXunJianPage);
