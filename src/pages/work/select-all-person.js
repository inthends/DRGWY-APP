import React from 'react';
import BasePage from '../base/base';
import { List, Icon, Flex, Accordion, SearchBar } from '@ant-design/react-native';
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
class SelectAllPerson extends BasePage {

    //选择所有人员
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
        let url = '/api/MobileMethod/MGetDepartmentList';
        let url2 = '/api/MobileMethod/MGetAllUserList';
        api.getData(url, this.state.selectBuilding ? { organizeId: this.state.selectBuilding.key } : {}).then(res => {
            Promise.all(res.map(item => api.getData(url2,
                {
                    departmentId: item.departmentId,
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

    click = (selectItem) => {
        const { navigation } = this.props;
        navigation.state.params.onSelect({ selectItem });
        navigation.goBack();
    };

    search = (keyword) => {
        Keyboard.dismiss();
        this.setState({
            keyword//必须要设置值，再调用方法，否则数据没有更新
        }, () => {
            this.initData();
        });
    };

    //2024-03-21 改为通讯录样式
    render() {
        const { data } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <SearchBar
                    placeholder="请输入"
                    showCancelButton
                    value={this.state.keyword}
                    onChange={keyword => this.search(keyword)}
                    onCancel={() => this.search('')}
                />
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.content}>
                        <Accordion
                            onChange={this.onChange}
                            activeSections={this.state.activeSections}
                        >
                            {data.map(item => (
                                <Accordion.Panel key={item.departmentId} header={item.fullName}>
                                    <List>
                                        {item.children.map(i => (
                                            <TouchableWithoutFeedback key={'Touch' + i.id} onPress={() => this.click(i)}>
                                                <Flex justify={'start'} key={i.id} align={'start'} style={styles.aa} direction={'column'}>
                                                    <Flex style={{ width: '100%' }} justify={'between'}>
                                                        <Flex>
                                                            <Text style={styles.desc}>{i.name}</Text>
                                                            {i.postName ? <Text>（{i.postName}）</Text> : null}
                                                        </Flex>
                                                        {/* <Flex><Text>{i.postName}</Text></Flex> */}
                                                    </Flex>
                                                </Flex>
                                            </TouchableWithoutFeedback>
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
        backgroundColor: Macro.color_white
    },
    content: {
        backgroundColor: Macro.color_white,
        //paddingLeft: 15,
        paddingRight: 15
        // height: ScreenUtil.contentHeight(),
        // height: ScreenUtil.contentHeightWithNoTabbar(),
    },

    desc: {
        fontSize: 16,
        color: '#666',//color: '#999', 
        width: 100
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
export default connect(mapStateToProps)(SelectAllPerson);
