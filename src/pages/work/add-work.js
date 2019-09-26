import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
} from 'react-native';
import BasePage from '../base/base';
import {Icon} from '@ant-design/react-native';
import {List, WhiteSpace, Flex, TextareaItem, Grid, Button} from '@ant-design/react-native';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import SelectImage from '../../utils/select-image';
import common from '../../utils/common';
import UDRecord from '../../utils/UDRecord';
import api from '../../utils/api';
import UDPlayer from '../../utils/UDPlayer';
import UDToast from '../../utils/UDToast';
import WorkService from './work-service';

export default class AddWorkPage extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '新增',
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
            index: 0,
            data: ['投诉', '报修', '服务'],
            value: '',
            images: [{icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png'}],
            image: '',
            recording: false,
            id: common.getGuid(),
            fileUrl: null,
            playing: false,
            address: null,

        };
    }

    componentDidMount(): void {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (obj.state.params) {
                    let address = obj.state.params.data;
                    console.log('address', address);
                    this.setState({address});
                }


            },
        );

    }

    componentWillUnmount(): void {
        this.viewDidAppear.remove();
    }


    startRecord = () => {
        UDRecord.prepardRecord().then(res => {
            api.uploadFile(res, this.state.id, false).then(res => {
                console.log(res);
                this.setState({fileUrl: res});
            });


        });
        UDRecord.startRecord();
    };
    stopRecord = () => {
        UDRecord.stopRecord();

    };
    play = () => {
        UDPlayer.play(this.state.fileUrl);
    };


    selectImages = () => {
        SelectImage.select(this.state.id,'/api/MobileMethod/MUploadServiceDesk').then(res => {
            console.log(1122, res);
            let images = [...this.state.images];
            images.splice(0, 0, {'icon': res});
            if (images.length > 4) {
                images = images.filter((item, index) => index !== images.length - 1);
            }
            console.log(images);
            this.setState({images});
        });
    };

    submit = () => {
        if (this.canSubmit === false) {
            return;
        }
        this.canSubmit = false;
        const {id, data, index, address, value} = this.state;
        if (!address) {
            const title = '请选择' + data[index] + '地址';
            UDToast.showInfo(title);
            return;
        }
        const params = {
            id,
            keyValue: id,
            Source: '社区APP',
            BillType: data[index],
            RoomId: address.id,
            Address: address.allName,
            Contents: value,
            isAdd: true,
        };
        WorkService.saveForm(params).then(res => {
            UDToast.showInfo('提交成功', true);
            setTimeout(() => {
                this.canSubmit = true;
                this.props.navigation.goBack();
            }, 2000);
        }).catch(res => {
            this.canSubmit = true;
        });


    };

    render() {
        const {data, index, images, fileUrl, address} = this.state;
        const title = data[index];
        const title2 = '输入' + title + '内容';

        const width = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        const height = (ScreenUtil.deviceWidth() - 5 * 20) / 4.0;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'F3F4F2'}}>
                <Flex direction='column'>
                    <Flex justify='between' style={styles.header}>
                        {data.map((item, i) => (
                            <TouchableWithoutFeedback key={i} onPress={() => this.setState({index: i})}>
                                <Flex justify='center' style={[{
                                    marginLeft: 5,
                                    marginRight: 5,
                                    backgroundColor: '#0325FD',
                                    height: 30,
                                    width: (ScreenUtil.deviceWidth() / 3.0 - 20),
                                    borderRadius: 4,
                                }, index === i && {backgroundColor: '#E67942'}]}>
                                    <Text style={{color: 'white', fontSize: 14}}>{item}</Text>
                                </Flex>
                            </TouchableWithoutFeedback>
                        ))}
                    </Flex>
                    <Flex>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.navigation.push('select')}>
                            <Flex justify="between" style={[{
                                paddingTop: 15,
                                paddingBottom: 15,
                                marginLeft: 15,
                                marginRight: 15,
                                width: ScreenUtil.deviceWidth() - 30,
                            }, ScreenUtil.borderBottom()]}>
                                <Text style={[address ? {color: '#333', fontSize: 16} : {
                                    color: '#999',
                                    fontSize: 16,
                                }]}>{address ? address.allName : `请选择${title}地址`}</Text>
                                <LoadImage style={{width: 6, height: 11}}
                                           defaultImg={require('../../static/images/address/right.png')}/>
                            </Flex>
                        </TouchableWithoutFeedback>

                    </Flex>

                    <View style={{marginLeft: -15}}>
                        <TextareaItem
                            rows={4}
                            placeholder={title2}
                            autoHeight
                            style={{paddingTop: 15, minHeight: 100, width: ScreenUtil.deviceWidth() - 30}}
                            onChange={value => this.setState({value})}
                            value={this.state.value}
                        />
                    </View>
                    <Flex align={'start'} justify={'start'} style={{
                        paddingTop: 15,
                        paddingBottom: 15,
                        width: ScreenUtil.deviceWidth() - 30,
                    }}>
                        <TouchableOpacity onPressIn={() => this.startRecord()} onPressOut={() => this.stopRecord()}>
                            <LoadImage style={{width: 20, height: 20}}
                                       defaultImg={require('../../static/images/home/search.png')}/>
                        </TouchableOpacity>
                        {fileUrl && fileUrl.length > 0 ?
                            <TouchableOpacity onPress={() => this.play()}>
                                <LoadImage style={{width: 20, height: 20, marginLeft: 10}}
                                           defaultImg={require('../../static/images/home/search.png')}/>
                            </TouchableOpacity>
                            : null}

                    </Flex>
                    <Flex justify={'start'} align={'start'} style={{width: ScreenUtil.deviceWidth()}}>
                        <Flex wrap={'wrap'}>
                            {images.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => {
                                        if (index === images.length - 1) {
                                            this.selectImages();
                                        }
                                    }}>
                                        <View style={{
                                            paddingLeft: 15,
                                            paddingRight: 5,
                                            paddingBottom: 10,
                                            paddingTop: 10,
                                        }}>
                                            <Image style={{width: width, height: height}} source={{uri: item.icon}}/>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </Flex>
                    </Flex>
                </Flex>
                <Flex justify={'center'} align={'start'} style={{
                    height: 80,
                    backgroundColor: '#eee',
                    width: '100%',
                    marginTop: 20,
                    flex: 1,
                    paddingTop: 40,
                }}>
                    <Button style={{width: '90%'}} type="primary" onPress={() => this.submit()}>确定</Button>
                </Flex>
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

});
