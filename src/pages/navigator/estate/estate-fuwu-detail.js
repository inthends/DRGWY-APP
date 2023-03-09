//导航里面点击的服务单详情
import React, { Fragment } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    RefreshControl, Modal,
} from 'react-native';
import BasePage from '../../base/base';
import { Icon } from '@ant-design/react-native';
import { List, WhiteSpace, Flex, TextareaItem, Grid, Button } from '@ant-design/react-native';
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
import Communicates from '../../../components/communicates';
import ListImages from '../../../components/list-images';
import Macro from '../../../utils/macro';
import CommonView from '../../../components/CommonView';
import ImageViewer from 'react-native-image-zoom-viewer';


const Item = List.Item;

export default class EfuwuDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '服务单详情',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);
        let fuwu = common.getValueFromProps(this.props);
        let type = common.getValueFromProps(this.props, 'type');
        //console.log(fuwu, type, 11)
        this.state = {
            value: '',
            fuwu,
            type,
            images: [],
            detail: {},
            communicates: [],
            lookImageIndex: 0,
            visible: false,

        };
    }

    componentDidMount(): void {
        this.getData();
    }

    getData = () => {
        const { fuwu, type } = this.state;
        // console.log(fuwu);
        WorkService.serviceDetail(type, fuwu.id).then(item => {
            console.log('detail', item);
            this.setState({
                detail: {
                    ...item.data,
                    businessId: item.businessId,
                    statusName: item.statusName,
                },
            });
        });
        WorkService.serviceCommunicates(fuwu.id).then(res => {
            this.setState({
                communicates: res,
            });
        });
        WorkService.serviceExtra(fuwu.id).then(images => {
            this.setState({
                images,
            });
        });
    };
    click = (handle) => {
        const { fuwu, value } = this.state;
        // console.log(11111,value)
        if (handle === '回复' && !(value && value.length > 0)) {
            UDToast.showInfo('请输入文字');
            return;
        }
        WorkService.serviceHandle(handle, fuwu.id, value).then(res => {
            this.props.navigation.goBack();
        }).catch(err => {
            UDToast.showError(err);
        });
    };

    communicateClick = (i) => {

        let c = this.state.communicates;
        // console.log(c);
        let d = c.map(it => {
            if (it.id === i.id) {
                it.show = i.show !== true;
            }
            return it;
        });
        console.log(d);

        this.setState({
            communicates: d,
        });
    };

    cancel = () => {
        this.setState({
            visible: false,
        });
    };

    lookImage = (lookImageIndex) => {
        this.setState({
            lookImageIndex,
            visible: true,
        });
    };

    render() {
        const { images, detail, communicates } = this.state;

        return (
            <CommonView style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 10 }}>
                <ScrollView>
                    <Flex style={[styles.every, ScreenUtil.borderBottom()]} justify='between'>
                        <Text style={styles.left}>{detail.billCode}</Text>
                        <Text style={styles.right}>{detail.billType}</Text>
                    </Flex>
                    <Flex style={[styles.every]} justify='between'>
                        <Text style={styles.left}>{detail.address}</Text>
                        <Text style={styles.right}>{detail.statusName}</Text>
                    </Flex>
                    <DashLine />
                    <Text style={styles.desc}>{detail.contents}</Text>
                    <DashLine />
                    <ListImages images={images} lookImage={this.lookImage} />
                    <Flex style={[styles.every2]} justify='between'>
                        <Text style={styles.left}>报单人：{detail.contactName} {detail.createDate}</Text>
                        <TouchableWithoutFeedback onPress={() => common.call(detail.contactPhone)}>
                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{ width: 30, height: 30 }} /></Flex>
                        </TouchableWithoutFeedback>
                    </Flex>

                    {detail.businessCode ? (
                        <TouchableWithoutFeedback>
                            <Flex style={[styles.every]}>
                                <Text style={styles.left}>关联单：</Text>
                                <Text onPress={() => {
                                    if (detail.businessType === 'Repair') {
                                        this.props.navigation.navigate('weixiuD', { data: { id: detail.businessId } });
                                    }
                                    else //if (detail.businessType === 'Complaint')
                                    {
                                        this.props.navigation.navigate('tousuD', { data: { id: detail.businessId } });
                                    }
                                }} style={[styles.right, { color: Macro.color_4d8fcc }]}>{detail.businessCode}</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    ) : null}
                    <DashLine />
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
                            style={{ fontSize: 14, paddingTop: 10, height: 100, width: ScreenUtil.deviceWidth() - 32 }}
                            onChange={value => this.setState({ value })}
                            value={this.state.value}
                        />
                    </View>

                    <TouchableWithoutFeedback onPress={() => this.click('回复')}>
                        <Flex justify={'center'} style={[styles.ii, {
                            width: '80%',
                            marginLeft: '10%',
                            marginRight: '10%',
                            marginBottom: 20,
                        }, { backgroundColor: Macro.color_4d8fcc }]}>
                            <Text style={styles.word}>回复</Text>
                        </Flex>
                    </TouchableWithoutFeedback>

                    {detail.status === 1 && <Flex>
                        <TouchableWithoutFeedback onPress={() => this.click('转维修')}>
                            <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.color_f39d39 }]}>
                                <Text style={styles.word}>转维修</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.click('转投诉')}>
                            <Flex justify={'center'} style={styles.ii}>
                                <Text style={styles.word}>转投诉</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.click('关闭')}>
                            <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.color_4d8fcc }]}>
                                <Text style={styles.word}>关闭</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                    </Flex>}
                    <DashLine />
                    <Communicates communicateClick={this.communicateClick} communicates={communicates} />

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
    },
    left: {
        fontSize: 14,
        color: '#666',
    },
    right: {},
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
