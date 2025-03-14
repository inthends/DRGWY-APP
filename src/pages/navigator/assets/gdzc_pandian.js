import React from 'react';
import BasePage from '../../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import { ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, TextInput } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import GdzcService from './gdzc-service';
import SelectImage from '../../../utils/select-image'
import common from '../../../utils/common';
//import gdzcReducer from '../../../utils/store/reducers/gdzc-reducer';
import gdzcAction from '../../../utils/store/actions/actions'
import { connect } from 'react-redux';
let screen_width = ScreenUtil.deviceWidth()

class GdzcPandianPage extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: false,
            title: '固定资产盘点',
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
            ...(common.getValueFromProps(this.props)),
            data: {},
            tfStr: '',
            images: [{ icon: '' }]
        };
    }

    componentDidMount() {
        const { assetsId } = this.state
        GdzcService.gdzcBaseInfo(assetsId).then(res => {
            if (!!res) {
                this.setState({
                    data: res
                }, () => {
                })
            }
        })
    }

    selectImages = () => {
        SelectImage.select(this.state.assetsId, '', '/api/MobileMethod/MUploadAssetsCheck', this.props.hasNetwork).then(res => {
            let images = [...this.state.images];
            images.splice(images.length - 1, 0, { 'icon': res });
            if (images.length > 10) {
                images = images.filter((item, index) => index !== images.length - 1);
            }
            this.setState({ images });
        }).catch(error => {

        });
    };

    success = () => {
        this.submit(1);
    };

    //异常
    fail = () => { 
        const { data } = this.state;
        var value = data.name + '，' + data.code + '，' + data.brand + '，' + (data.modelNo ? data.modelNo : '');
        var selectItem = { id: data.pStructId, allName: data.address };
        this.props.navigation.navigate('addRepair', { data: { address: selectItem, value: value } });//传参到维修单页面
    };

    submit(status) {
        const { tfStr, data } = this.state;
        if (this.props.hasNetwork) {
            GdzcService.gdzcAssetsCheck(data.id, status, tfStr).then(res => {
                this.props.navigation.goBack();
                // if (status === 1) {
                //     this.props.navigation.goBack();
                // } else {
                //     this.needBack = true;
                //     this.props.navigation.push('addTaskWork', {
                //         data: {
                //             address,
                //         },
                //     });
                // }
            });
        }
    }

    contentView = () => {
        const { data, tfStr } = this.state
        let statusText = data.latelyCheckStatus == 1 ? '正常' : '异常';
        let data1 = [
            { key: '编号', value: data.code },
            { key: '名称', value: data.name },
            { key: '品牌', value: data.brand },
            { key: '型号规格', value: data.modelNo },
            { key: '数量', value: data.num + data.unit },
            { key: '原值', value: data.price },
            { key: '存放地址', value: data.address },
            { key: '保管人', value: data.custodianName },
            { key: '最近盘点', value: data.latelyCheckDate + '   ' + statusText }
        ];

        let data2 = [
            { key: '本次盘点', value: data.thisCheckDate },
            { key: '盘点人', value: data.thisCheckUser }
            //{ key: '盘点说明', value: data.description ?? '' }
        ];

        return (
            <Flex>
                <Flex direction={'column'} align={'start'}>
                    {
                        data1.map((item) => {
                            return <Flex style={{ width: screen_width - 30 }}>
                                <Text style={styles.desc}>{item.key + '：'}</Text>
                                <Text style={styles.desc}> {item.value}</Text>
                            </Flex>
                        })
                    }
                    <Flex style={styles.line} />
                    {
                        data2.map((item) => {
                            return <Flex style={{ width: screen_width - 30 }}>
                                <Text style={styles.desc}>{item.key + '：'}</Text>
                                <Text style={styles.desc}>{item.value}</Text>
                            </Flex>
                        })
                    }

                    <Flex style={{ width: screen_width - 30 }}>
                        <Text style={styles.desc}>盘点说明</Text>
                    </Flex>

                    <TextInput
                        value={tfStr}
                        onChangeText={(txt) => {
                            this.setState({ tfStr: txt })
                        }}
                        style={{
                            fontSize: 16, borderColor: '#eee', borderRadius: 5, borderWidth: 1,
                            height: 40, width: screen_width - 30, marginVertical: 10
                        }} placeholder='请输入' />
                </Flex>
            </Flex>
        );
    }

    render() {//: React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { images } = this.state;
        return (
            <CommonView style={{ flex: 1 }}>
                <Text style={styles.title}>基本资料</Text>
                <ScrollView>
                    <Flex direction={'column'} align={'start'} style={styles.content}>
                        {this.contentView()}
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

                    <Flex style={{ minHeight: 40, marginBottom: 30, width: screen_width }}>
                        <TouchableWithoutFeedback onPress={this.success}>
                            <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_blue }]}>
                                <Text style={styles.word}>正常</Text>
                            </Flex>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.fail}>
                            <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.work_red }]}>
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
        paddingTop: 14.67,
        textAlign: 'left',
        color: '#3E3E3E',
        fontSize: 16,
        paddingBottom: 12.67,
        marginLeft: 20,
        marginRight: 20,

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
    desc: {
        fontSize: 16,
        paddingTop: 10,
    },
    line: {
        width: ScreenUtil.deviceWidth() - 30,
        backgroundColor: '#E0E0E0',
        height: 1,
        marginVertical: 15
    },
    word: {
        color: 'white',
        fontSize: 16,
    }
});
const mapStateToProps = ({ memberReducer, gdzcReducer }) => {
    return {
        hasNetwork: memberReducer.hasNetwork,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        gdzcAction(data) {
            dispatch(gdzcAction(data));
        },

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(GdzcPandianPage)
