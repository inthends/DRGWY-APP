import React from 'react';
import BasePage from '../base/base';
import { List, Icon, Flex, Accordion, Checkbox, Button, SearchBar } from '@ant-design/react-native';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Keyboard
} from 'react-native';
import Macro from '../../utils/macro';
import { connect } from 'react-redux';
import api from '../../utils/api';

class SelectRolePersonMulti extends BasePage {

    //选择所有人员，多选
    static navigationOptions = ({ navigation }) => {
        return {
            title: '选择人员',
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
        this.state = {
            //selectBuilding: this.props.selectBuilding || {},
            selectBuilding: {},//默认为空，防止别的报表选择了机构，带到当前报表
            data: [],
            selectItems: [],
            activeSections: [],
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
        if (!(selectBuilding
            && nextSelectBuilding
            && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({
                selectBuilding: nextProps.selectBuilding
                //estateId: nextProps.selectBuilding.key,
                //index: 0,
            }, () => {
                this.initData();
            });
        }
    }

    initData() {
        const { navigation } = this.props;
        let moduleId = navigation.state.params.moduleId;
        let enCode = navigation.state.params.enCode;
        const myorganizeId = navigation.state.params.organizeId;
        let exceptUserId = navigation.state.params.exceptUserId;
        let url = '/api/MobileMethod/MGetWorkRoleList'; //获取角色
        let url2 = '/api/MobileMethod/MGetReceiveUsersByRoleId';//获取角色人员
        let organizeId = this.state.selectBuilding && this.state.selectBuilding.key ? this.state.selectBuilding.key : myorganizeId;
        api.getData(url, {
            moduleId,
            enCode,
            organizeId
        }).then(res => {
            Promise.all(
                res.map(item => api.getData(url2, {
                    enCode: enCode,
                    roleId: item.roleId,
                    exceptUserId,
                    keyword: this.state.keyword
                }))).then(ress => {
                    let data = res.map((item, index) => ({
                        ...item,
                        children: ress[index]
                    }));
                    //过滤空的数据
                    let mydata = data.filter(item => item.children.length > 0);
                    this.setState({ data: mydata });
                });
        });
    }

    // click = (selectItem) => {
    //     const { navigation } = this.props;
    //     navigation.state.params.onSelect({ selectItem });
    //     navigation.goBack();
    // };

    //设置选中
    changeItem = myitem => {
        let data = this.state.data;
        let selectItems = this.state.selectItems;
        //let selectItems = [];
        data = data.map(item => {
            item.children.map(it => {
                if (it.id === myitem.id) {
                    it.select = it.select !== true;
                    //缓存选中的值
                    if (it.select) {
                        selectItems.push({ id: it.id, name: it.name });
                    } else {
                        //移除
                        const index = selectItems.findIndex(item => item.id === it.id);
                        selectItems.splice(index, 1);
                    }
                }
                return it;
            });
            return item;//必须
        });
        this.setState({ data, selectItems });
    }

    submit = () => {
        const { selectItems } = this.state;
        const { navigation } = this.props;
        navigation.state.params.onSelect({ selectItems });
        navigation.goBack();
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
        const { data,btnText } = this.state;
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
                            expandMultiple={true}
                        >
                            {data.map(item => (
                                <Accordion.Panel
                                    key={item.roleId}
                                    header={item.fullName}
                                >
                                    <List>
                                        {item.children.map(i => (
                                            <Flex justify={'start'} key={i.id} align={'start'} style={styles.aa} direction={'column'}>
                                                <Flex style={{ width: '100%' }} justify={'between'}>
                                                    <Flex>
                                                        <Text style={styles.desc}>{i.name}</Text>
                                                        {i.postName ? <Text>（{i.postName}）</Text> : null}
                                                        <Text> (工单 : {i.counts})</Text>
                                                    </Flex>
                                                    <Flex style={{ paddingRight: 21 }}>
                                                        <Checkbox
                                                            checked={i.select === true}
                                                            onChange={event => {
                                                                this.changeItem(i);
                                                            }}
                                                        />
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        ))}
                                    </List>
                                </Accordion.Panel>
                            ))}

                        </Accordion>
                    </View>
                </ScrollView>

                <Flex justify={'center'} style={{ height: 80, backgroundColor: '#eee' }}>
                    <Button style={{
                        width: 220,
                        backgroundColor: Macro.work_blue
                    }} type="primary"
                        onPress={() => this.submit()}>确定</Button>
                </Flex>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    all: {
        backgroundColor: Macro.color_white
    },
    content: {
        backgroundColor: Macro.color_white,
        paddingLeft: 15,
        paddingRight: 15
        // height: ScreenUtil.contentHeight(),
        // height: ScreenUtil.contentHeightWithNoTabbar(),
    },

    desc: {
        fontSize: 16,
        color: '#666',//color: '#999', 
        //width: 100
    },
    aa: {
        width: '100%',
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 5,
        paddingBottom: 10,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: ' rgb(244,244,244)'
    }
});

const mapStateToProps = ({ buildingReducer }) => {
    return {
        selectBuilding: buildingReducer.selectBuilding
    };
};
export default connect(mapStateToProps)(SelectRolePersonMulti);
