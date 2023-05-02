import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import { ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
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
            headerForceInset:this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            images: [{ icon: '' }],
            data: {},
            inspectData: [],
            ...common.getValueFromProps(this.props), // lineId,pointId,person
        };
        //console.log(this.state);
    }

    componentDidMount(): void {
        const { id, pointId, item } = this.state;

        if (this.props.hasNetwork) {
            XunJianService.xunjianAddress(pointId).then(address => {
                XunJianService.xunjianDetail(id).then(data => {
                    this.setState({ data, address });
                    XunJianService.xunjianTaskDeletePhoto(data.id);
                });
            });
        } else {
            this.setState({ data: item, address: { allName: item.allName, id: item.pointId } });
        }

        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (this.needBack === true) {
                    this.props.navigation.goBack();
                }
            },
        );
    }

    componentWillUnmount(): void {
        this.viewDidAppear.remove();
    }

    selectImages = () => {
        SelectImage.select(this.state.id, '/api/MobileMethod/MUploadPollingTask', this.props.hasNetwork).then(res => {
            //console.log(1122, res);
            let images = [...this.state.images];
            images.splice(images.length - 1, 0, { 'icon': res });
            if (images.length > 4) {
                images = images.filter((item, index) => index !== images.length - 1);
            }
            //console.log(images);
            if (images.length > 1) {
                if (!!images[0]) {
                    this.setState({ images });
                }
            }
            else {
                this.setState({ images });
            }

        }).catch(error => {
            //console.log(error);
        });
    };
    submit = () => {
        const { id, person, address, item, inspectData } = this.state;
        const { data } = this.state;
        let newInspectData = [];
        // id,taskId,contentId,result,memo
        if (inspectData.length === 0) {
            try {
                data.contents.map((subItem) => {
                    newInspectData.push({ id: subItem.id, taskId: item.id, contentId: subItem.contentId, result: 1, memo: '' })
                })
            } catch (error) {
                console.log(error)
            }
        }
        else {
            inspectData.map((subItem) => {
                newInspectData.push({ id: subItem.id, taskId: item.id, contentId: subItem.contentId, result: subItem.result, memo: subItem.msg })
            })
        }
        if (this.props.hasNetwork) {
            if (this.state.images.length > 1) {
                let arrStr = JSON.stringify(newInspectData)
                XunJianService.xunjianExecute(id, person.id, person.name, arrStr).then(res => {
                    this.props.navigation.goBack();
                });
            }
            else {
                UDToast.showSuccess('请上传图片');
            }
        } else {
            let images = this.state.images.filter(item => item.icon.fileUri && item.icon.fileUri.length > 0);
            this.props.saveXunJianAction({
                [item.taskId]: {
                    xunjianParams: {
                        keyvalue: item.taskId,
                        userId: person.id,
                        userName: person.name,
                    },
                    idForUploadImage: item.taskId,
                    images,
                    address,
                },
            });
            UDToast.showSuccess('已保存，稍后可在我的-设置中同步巡检数据');
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
        //console.log('888888888' + this.state);
    }
    
    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { images, data } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollView>
                    <Flex direction={'column'} align={'start'} style={styles.content}>
                        <Text style={styles.title}>{data.pointName}</Text>
                        <XunJianComponent data={data} _inspecting={this._inspecting.bind(this)} />
                    </Flex>
                    <Flex justify={'start'} align={'start'} style={{ width: ScreenUtil.deviceWidth() }}>
                        <Flex wrap={'wrap'}>
                            {images.map((item, index) => {
                                return (
                                    <TouchableWithoutFeedback key={index} onPress={() => {
                                        if (index === images.length - 1 && item.icon.length === 0) {
                                            this.selectImages();
                                        }
                                    }}>
                                        <View style={{
                                            paddingLeft: 15,
                                            paddingRight: 5,
                                            paddingBottom: 10,
                                            paddingTop: 10,
                                        }}>
                                            <LoadImage style={{
                                                width: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                                height: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                                borderRadius: 5,
                                            }}
                                                defaultImg={require('../../../static/images/add_pic.png')}
                                                img={item.icon} />
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
                            <Flex flex={1} justify='center' style={[styles.ii, { backgroundColor: Macro.color_4d8fcc }]}>
                                <Text style={styles.word}>完成</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>
                </ScrollView>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    title: {
        color: '#333',
        fontSize: 18,
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,

    },
    ii: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#999',
        borderRadius: 6,
        marginTop: 30,
    },
    word: {
        color: 'white',
        fontSize: 16,
    },


});

const mapStateToProps = ({ memberReducer, xunJianReducer }) => {

    return {
        hasNetwork: memberReducer.hasNetwork,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        saveXunJianAction(data) {
            dispatch(saveXunJianAction(data));
        },

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(StartXunJianPage);
