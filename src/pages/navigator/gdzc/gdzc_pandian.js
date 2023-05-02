import React, { Fragment } from 'react';
import BasePage from '../../base/base';
import { Flex, Accordion, Icon } from '@ant-design/react-native';
import Macro from '../../../utils/macro';
import { ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, TextInput } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
import GdzcService from './gdzc-service';
import SelectImage from '../../../utils/select-image'
import common from '../../../utils/common';
import gdzcReducer from '../../../utils/store/reducers/gdzc-reducer';
import gdzcAction from '../../../utils/store/actions/actions'
import {connect} from 'react-redux';

let screen_width = ScreenUtil.deviceWidth()

class GdzcPandianPage extends BasePage {
    static navigationOptions = ({ navigation }) => {

        return {
            tabBarVisible: false,
            title: '固定资产盘点',
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
            ...(common.getValueFromProps(this.props)),
            data: {},
            tfStr:'',
            images: [{icon: ''}]
        };
        console.log(this.state);
    }

    componentDidMount(): void {
        const { assetsId } = this.state
        GdzcService.gdzcBaseInfo(assetsId).then(res => {
            if (!!res){
                this.setState({
                    data: res
                }, () => {
    
                })
            }
        })

    }

    selectImages = () => {
        SelectImage.select(this.state.assetsId, '/api/MobileMethod/MUploadAssetsCheck', this.props.hasNetwork).then(res => {
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
        const {tfStr,data} = this.state;
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
        const { data,tfStr } = this.state

        let data1 = [
            { key: '编号', value: data.code },
            { key: '名称', value: data.name },
            { key: '品牌', value: data.brand },
            { key: '型号规格', value: data.modelNo },
            { key: '数量', value: data.num + data.unit },
            { key: '原值', value: data.price },
            { key: '存放地址', value: data.address },
            { key: '保管人', value: data.custodianName },
            { key: '最近盘点', value: data.latelyCheckDate + '   ' + data.latelyCheckStatus }
        ]
        let data2 = [
            { key: '本次盘点', value:data.description },
            { key: '盘点人', value: data.custodianName },
            { key: '盘点说明', value: data.description ?? '' }
        ]

        
        return (
            <Flex>
                <Flex direction={'column'} align={'start'}>
                    {
                        data1.map((item) => {
                            return <Flex style={{ width: screen_width - 30 }}>
                                <Text style={styles.desc}>{item.key + ': '}</Text>
                                <Text style={styles.desc}> {item.value}</Text>
                            </Flex>
                        })
                    }
                    <Flex style={styles.line} />
                    {
                        data2.map((item) => {
                            return <Flex style={{ width: screen_width - 30 }}>
                                <Text style={styles.desc}>{item.key + ': '}</Text>
                                <Text style={styles.desc}>{item.value}</Text>
                            </Flex>
                        })
                    }
                    <TextInput
                        value={tfStr}
                        onChangeText={(txt) => {
                            this.setState({tfStr:txt})
                         }}
                        style={{ fontSize: 16, borderColor: '#eee', borderRadius: 5, borderWidth: 1, height: 40, width: screen_width - 30, marginVertical: 10 }} placeholder={'输入说明'} />
                </Flex>
            </Flex>
        );
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { data, images } = this.state;

        console.log(22, data);
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
                            <Flex justify={'center'} style={[styles.ii, { backgroundColor: Macro.color_4d8fcc }]}>
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
        paddingTop: 14.67,
        textAlign: 'left',
        color: '#3E3E3E',
        fontSize: 17.6,
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
    top: {
        paddingTop: 10,
        color: '#74BAF1',
        fontSize: 15,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    bottom: {
        color: '#999999',
        fontSize: 14.67,
        paddingBottom: 20,
    },
    button: {
        color: '#2C2C2C',
        fontSize: 8,
        paddingTop: 4,

    },
    card: {
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        // shadowColor: '#00000033',
        // shadowOffset: {h: 10, w: 10},
        // shadowRadius: 5,
        // shadowOpacity: 0.8,
    },
    blue: {
        borderLeftColor: Macro.color_4d8fcc,
        borderLeftWidth: 8,
        borderStyle: 'solid',
    },
    orange: {
        borderLeftColor: Macro.color_f39d39,
        borderLeftWidth: 8,
        borderStyle: 'solid',

    },
    location: {
        paddingTop: 15,
        paddingBottom: 10,
        textAlign: 'center',
        width: '100%',
    },
    person: {
        marginTop: 10,
        marginRight: 15,
    },
    personText: {
        color: '#666',
        fontSize: 18,
        width: ScreenUtil.deviceWidth() - 40,
        textAlign: 'center',
        paddingBottom: 15,
    },


});
const mapStateToProps = ({memberReducer, gdzcReducer}) => {
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
