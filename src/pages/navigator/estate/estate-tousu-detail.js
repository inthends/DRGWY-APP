import React, {Fragment} from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    ScrollView,
    RefreshControl,
} from 'react-native';
import BasePage from '../../base/base';
import {Icon} from '@ant-design/react-native';
import {List, WhiteSpace, Flex, TextareaItem, Grid, Button} from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import SelectImage from '../../../utils/select-image';
import common from '../../../utils/common';
import UDRecord from '../../../utils/UDRecord';
import api from '../../../utils/api';
import UDPlayer from '../../../utils/UDPlayer';

import UDToast from '../../../utils/UDToast';
import DashLine from '../../../components/dash-line';
import WorkService from '../../work/work-service';


const Item = List.Item;

export default class EtousuDetailPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '投诉单详情',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),

        };
    };

    constructor(props) {
        super(props);
        let fuwu = common.getValueFromProps(this.props);
        let type = common.getValueFromProps(this.props, 'type');
        this.state = {
            value: '',
            fuwu,
            type,
            images: [],
            // images: [{icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png'},
            //     {icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png'},
            //     {icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png'},
            //     {icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png'},
            //     {icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png'},
            // ],
            detail: {},
            communicates: [],
        };
        console.log(this.state);
    }

    componentDidMount(): void {
        this.getData();
    }


    getData = () => {
        const {fuwu, type} = this.state;
        console.log('fuw', fuwu);
        WorkService.tousuDetail(fuwu.id).then(detail => {
            console.log('detail', detail);
            this.setState({
                detail: {
                    ...detail.entity,
                    serviceDeskCode: detail.serviceDeskCode,
                    relationId: detail.relationId,
                    statusName: detail.statusName,
                },
            });
        });
        WorkService.serviceCommunicates(fuwu.id).then(res => {
            this.setState({
                communicates: res,
            });
        });
        WorkService.serviceExtra(fuwu.id).then(images => {
            console.log(11, images);
            this.setState({
                images: images.map(item => {
                    return {icon: item};
                }),
            });
        });
    };
    click = (handle) => {
        const {fuwu, type, value} = this.state;
        WorkService.serviceHandle(handle, fuwu.id, value).then(res => {
            console.log(res);
        });
    };


    render() {
        const {images, detail, communicates} = this.state;
        console.log(1122, detail);


        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff', paddingBottom: 10}}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>

                        <Flex style={[styles.every2]} justify='between'>
                            <Text style={styles.left}>{detail.complaintAddress} {detail.complaintUser}</Text>
                            <TouchableWithoutFeedback onPress={() => common.call(detail.complaintLink)}>
                            <Flex><LoadImage style={{width: 30, height: 30}}/></Flex>
                            </TouchableWithoutFeedback>
                        </Flex>

                    <DashLine/>
                    <Text style={styles.desc}>{detail.contents}</Text>
                    <DashLine/>
                    <Flex justify={'start'} align={'start'}
                          style={{width: ScreenUtil.deviceWidth() - 15, marginTop: 10}}>
                        <Flex wrap={'wrap'}>
                            {images.map((item, index) => {
                                return (
                                    <View style={{
                                        paddingLeft: 15,
                                        paddingRight: 5,
                                        paddingBottom: 10,
                                        paddingTop: 10,
                                    }}>
                                        <Image style={{
                                            width: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                            height: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                        }} source={{uri: item.icon}}/>
                                    </View>
                                );
                            })}
                        </Flex>
                    </Flex>
                    <Flex style={[styles.every2]} justify='between'>
                        <Text style={styles.left}>转单人：{detail.createUserName} {detail.createDate}</Text>
                    </Flex>

                    <TouchableWithoutFeedback>
                        <Flex style={[styles.every]}>
                            <Text style={styles.left}>关联单：</Text>
                            <Text onPress={()=>this.props.navigation.push('fuwuD', {data: {id:detail.relationId}})} style={[styles.right, {color: 'blue'}]}>{detail.serviceDeskCode}</Text>
                        </Flex>
                    </TouchableWithoutFeedback>


                    <DashLine/>
                    <Flex style={[styles.every]} justify='between'>
                        <Text style={styles.left}>单据动态</Text>
                    </Flex>
                    {communicates.map((i, index) => (
                        <Fragment key={i.id}>
                            <TouchableWithoutFeedback onPress={() => {
                                let c = this.state.communicates;
                                let d = c.map(it => {
                                    if (it.id === i.id) {
                                        it.show = i.show !== true;
                                    }
                                    return it;
                                });
                                this.setState({
                                    communicates: d,
                                });
                            }}>
                                <Flex style={[styles.every]} justify='between'>
                                    <LoadImage img={i.avatar} style={{width: 30, height: 30}}/>
                                    <Text style={styles.left}>{i.author} {i.datetime} 跟进</Text>
                                    <LoadImage style={{width: 30, height: 30}}/>
                                </Flex>
                            </TouchableWithoutFeedback>
                            {i.show === true ? <View style={{
                                margin: 15,
                                marginTop: 0,
                                borderStyle: 'solid',
                                borderColor: '#F3F4F2',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingTop: 15,
                                paddingBottom: 15,
                                paddingRight: 10,
                                paddingLeft: 10,
                            }}>
                                <Text>{i.content}</Text>
                            </View> : null}
                            {/*<Flex wrap={'wrap'}>*/}
                            {/*    {images.map((item, index) => {*/}
                            {/*        return (*/}
                            {/*            <View style={{*/}
                            {/*                paddingLeft: 15,*/}
                            {/*                paddingRight: 5,*/}
                            {/*                paddingBottom: 10,*/}
                            {/*                paddingTop: 10,*/}
                            {/*            }}>*/}
                            {/*                <Image style={{*/}
                            {/*                    width: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,*/}
                            {/*                    height: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,*/}
                            {/*                }} source={{uri: item.icon}}/>*/}
                            {/*            </View>*/}
                            {/*        );*/}
                            {/*    })}*/}
                            {/*</Flex>*/}
                        </Fragment>
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F3F4F2',

    },
    every: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
    },
    every2: {
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 10,
        paddingTop: 10,
    },
    left: {
        fontSize: 14,
        color: '#666',
    },
    right: {
        fontSize: 14,
        color: '#666',
    },
    desc: {
        padding: 15,
        paddingBottom: 40,
    },
    ii: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
        backgroundColor: '#999',
        borderRadius: 6,
        marginBottom: 20,
    },
    word: {
        color: 'white',
        fontSize: 16,


    },

});
