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

export default class StartXunJianPage extends BasePage {
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
            ...common.getValueFromProps(this.props), // pointId,person
        };
        console.log(this.state);


    }

    componentDidMount(): void {

        XunJianService.xunjianDetailStart(this.state.pointId).then(data => {
            this.setState(data);
        });
    }

    selectImages = () => {
        SelectImage.select(this.state.id, '/api/MobileMethod/MUploadPollingTask').then(res => {
            console.log(1122, res);
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
            console.log(1111)
    };
    fail = () => {

    };


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {images, data} = this.state;
        const width = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        const height = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        return (
            <CommonView>
                <Flex direction={'column'} align={'start'} style={styles.content}>
                    <Text style={styles.title}>{data.pointName}</Text>
                    <XunJianComponent data={data}/>
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

                                            paddingBottom: 10,
                                            paddingTop: 10,
                                        }}>
                                            <LoadImage style={{width: width, height: height}}
                                                       defaultImg={require('../../../static/images/add_pic.png')}
                                                       img={item.icon}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </Flex>
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
