import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    ScrollView
} from 'react-native';
import { List, Icon, Flex, Accordion, SearchBar } from '@ant-design/react-native';
import LoadImage from '../../../components/load-image';
import Macro from '../../../utils/macro';
import common from '../../../utils/common';
import BasePage from '../../base/base';
import { connect } from 'react-redux';
import api from '../../../utils/api';

class VendorDetail extends BasePage {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '通讯录',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                    <Icon name='bars' style={{ marginRight: 15 }} color="black" />
                </TouchableWithoutFeedback>
            )
        };
    };

    constructor(props) {
        super(props);
        const type = common.getValueFromProps(this.props, 'type');
        this.state = {
            type,
            activeSections: [],
            selectBuilding: {},//默认为空，防止别的报表选择了机构，带到当前报表
            data: [],
            btnText: '搜索'
        };
        this.onChange = activeSections => {
            this.setState({ activeSections });
        };
    }

    componentDidMount() {
        this.initData();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({
                selectBuilding: nextProps.selectBuilding
            }, () => {
                this.initData();
            });
        }
    }

    initData = () => {
        const { keyword } = this.state;
        //往来单位获取项目
        let url = '/api/MobileMethod/MGetProjectByOrgId';
        let url2 = '/api/MobileMethod/MGetVendorList';
        api.getData(url, this.state.selectBuilding ? { organizeId: this.state.selectBuilding.key } : {}).then(res => {
            Promise.all(res.map(item => api.getData(url2,
                {
                    projectId: item.id,
                    keyword: keyword
                }))).then(ress => {
                    let data = res.map((item, index) => ({
                        ...item,
                        children: ress[index],
                    }));
                    //过滤空的数据
                    let mydata = data.filter(item => item.children.length > 0);
                    this.setState({ data: mydata });
                });
        });
    };

    search = () => {
        Keyboard.dismiss();
        this.initData();
        this.setState({ btnText: '取消' });
    };

    clear = () => {
        const { btnText } = this.state;
        Keyboard.dismiss();
        if (btnText == '搜索') {
            this.initData();
            this.setState({ btnText: '取消' });
        } else {
            this.setState({
                keyword: ''//必须要设置值，再调用方法，否则数据没有更新
            }, () => {
                this.initData();
                this.setState({ btnText: '搜索' });
            });
        }
    };

    render() {
        const { data, btnText } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <SearchBar
                    placeholder="请输入"
                    showCancelButton
                    cancelText={btnText}
                    value={this.state.keyword}
                    onChange={keyword => this.setState({ keyword })}
                    onSubmit={() => this.search()}
                    onCancel={() => this.clear()}
                />
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.content}>
                        <Accordion
                            onChange={this.onChange}
                            activeSections={this.state.activeSections}
                        >
                            {data.map(item => (
                                <Accordion.Panel key={item.id} header={item.name}>
                                    <List>
                                        {item.children.map(i => (
                                            <Flex justify={'start'} key={i.id} align={'start'} style={styles.aa} direction={'column'}>
                                                <Flex style={{ width: '100%' }} justify={'between'}>
                                                    <Flex>
                                                        <Text style={styles.item}>{i.name}</Text>
                                                    </Flex>
                                                    {i.phoneNum ?
                                                        <TouchableWithoutFeedback onPress={() => common.call(i.phoneNum)}>
                                                            <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{ width: 18, height: 18 }} /></Flex>
                                                        </TouchableWithoutFeedback> : null}
                                                </Flex>
                                            </Flex>
                                        ))}
                                    </List>
                                </Accordion.Panel>
                            ))}
                        </Accordion>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_white,
    },
    content: {
        backgroundColor: Macro.color_white,
        paddingLeft: 15,
        paddingRight: 20,
        // height: ScreenUtil.contentHeight(), 
        // height: ScreenUtil.contentHeightWithNoTabbar(),
    },
    header: {
        paddingTop: 30,
        paddingBottom: 30,
    },
    name: {
        fontSize: 20,
        color: '#404145'
    },
    desc: {
        fontSize: 16,
        color: '#999',
        paddingTop: 5,
        width: 100,
    },
    desc2: {
        fontSize: 16,
        color: '#999',
        paddingTop: 5,
    },
    item: {
        fontSize: 16,
        color: '#404145'
    },
    aa: {
        width: '100%',
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: ' rgb(244,244,244)'
    },
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding
    };
};

export default connect(mapStateToProps)(VendorDetail);

