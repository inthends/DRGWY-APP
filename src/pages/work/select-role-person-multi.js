import React from 'react';
import BasePage from '../base/base';
import { List, Icon, Flex, Accordion, Checkbox, Button } from '@ant-design/react-native';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView
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
            activeSections: []
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
        const type = navigation.state.params.type;
        let url = '/api/MobileMethod/MGetRoleList'; //获取角色
        let url2 = '/api/MobileMethod/MGetReceiveByRoleUserList';//获取角色人员 
        api.getData(url, this.state.selectBuilding ? { type: type, organizeId: this.state.selectBuilding.key } : {}).then(res => {
            Promise.all(
                res.map(item => api.getData(url2, { roleId: item.roleId }))).
                then(ress => {

                    let data = res.map((item, index) => ({
                        ...item,
                        children: ress[index]
                    }));
                    this.setState({ data });
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
        //console.log('selectItems',selectItems);
        navigation.state.params.onSelect({ selectItems });
        navigation.goBack();
    };

    render() {
        const { data } = this.state;
        return (
            <View style={{ flex: 1 }}>
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
                        width: '90%',
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
