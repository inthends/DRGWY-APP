import React, {Fragment} from 'react';
import BasePage from '../../base/base';
import {Flex, Accordion, List, Icon} from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import {ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import ScrollTitle from '../../../components/scroll-title';
import XunJianComponent from './xunjian-component';
import SelectImage from '../../../utils/select-image';
import XunJianService from './xunjian-service';
import common from '../../../utils/common';
import {connect} from 'react-redux';
import {saveUser, saveXunJian, saveXunJianAction} from '../../../utils/store/actions/actions';
import UDToast from '../../../utils/UDToast';

class StartXunJianPage extends BasePage {
    static navigationOptions = ({navigation}) => {


        return {
            tabBarVisible: false,
            title: '开始巡检',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            images: [{icon: ''}],
            data: {},
            ...common.getValueFromProps(this.props), // lineId,pointId,person
        };
        console.log(this.state);


    }

    componentDidMount(): void {
        const {id, pointId, item} = this.state;

        if (this.props.hasNetwork) {
            XunJianService.xunjianAddress(pointId).then(address => {
                XunJianService.xunjianDetail(id).then(data => {
                    this.setState({data, address});
                    XunJianService.xunjianTaskDeletePhoto(data.id);
                });
            });
        } else {
            this.setState({data: item, address: {allName: item.allName, id: item.pointId}});
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
            images.splice(images.length - 1, 0, {'icon': res});
            if (images.length > 4) {
                images = images.filter((item, index) => index !== images.length - 1);
            }
            console.log(images);
            this.setState({images});
        }).catch(error => {

        });
    };

    success = () => {
        this.submit(1);
    };
    fail = () => {
        this.submit(0);
    };

    submit(status) {
        const {id, person, address, item} = this.state;
        if (this.props.hasNetwork) {
            XunJianService.xunjianExecute(id, status, person.id, person.name).then(res => {
                if (status === 1) {
                    this.props.navigation.goBack();
                } else {
                    this.needBack = true;
                    this.props.navigation.push('addTaskWork', {
                        data: {
                            address,
                        },
                    });
                }
            });
        } else {
            let images = this.state.images.filter(item => item.icon.fileUri && item.icon.fileUri.length > 0);
            this.props.saveXunJianAction({
                [item.taskId]: {
                    xunjianParams: {
                        keyvalue: item.taskId,
                        pointStatus: status,
                        userId: person.id,
                        userName: person.name,
                    },
                    idForUploadImage: item.taskId,
                    status,
                    images,
                    address,
                },
            });
            if (status === 1) {
                UDToast.showSuccess('已保存，稍后可在我的-设置中同步巡检数据');
                this.props.navigation.goBack();
            } else {
                this.needBack = true;
                this.props.navigation.push('addTaskWork', {
                    data: {
                        taskId: item.taskId,
                        address,
                    },
                });
            }
        }

    }


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {images, data} = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <ScrollView>
                    <Flex direction={'column'} align={'start'} style={styles.content}>
                        <Text style={styles.title}>{data.pointName}</Text>
                        <XunJianComponent data={data}/>
                    </Flex>
                <Flex justify={'start'} align={'start'} style={{width: ScreenUtil.deviceWidth()}}>
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
                                                   img={item.icon}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    </Flex>
                </Flex>

                <Flex style={{minHeight: 40, marginBottom: 30}}>
                    <TouchableWithoutFeedback onPress={this.success}>
                        <Flex justify={'center'} style={[styles.ii, {backgroundColor: Macro.color_4d8fcc}]}>
                            <Text style={styles.word}>正常</Text>
                        </Flex>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.fail}>
                        <Flex justify={'center'} style={[styles.ii]}>
                            <Text style={styles.word}>异常</Text>
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
        marginLeft: 30,
        marginRight: 30,
        width: (ScreenUtil.deviceWidth() - 120) / 2.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginTop: 30,
    },
    word: {
        color: 'white',
        fontSize: 16,


    },


});

const mapStateToProps = ({memberReducer, xunJianReducer}) => {

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
