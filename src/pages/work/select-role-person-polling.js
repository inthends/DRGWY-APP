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
import api from '../../utils/api';

//选择巡检人员
class SelectRolePersonPolling extends BasePage {
    //根据角色分组来选择人员
    static navigationOptions = ({ navigation }) => {
        return {
            title: '选择人员',
            headerForceInset: this.headerForceInset,
            headerLeft: (
                <TouchableOpacity onPress={() => {
                    navigation.state.params.onSelect({});//没有选择，重置值
                    navigation.goBack();
                }}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
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

    initData() {
        let url = '/api/MobileMethod/MGetRoleListPolling'; //获取角色
        let url2 = '/api/MobileMethod/MGetWorkUsersByRoleId';//获取角色人员
        api.getData(url).then(res => {
            Promise.all(
                res.map(item => api.getData(url2, {
                    roleId: item.roleId,
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
                            activeSections={this.state.activeSections}>
                            {data.map(item => (
                                <Accordion.Panel
                                    key={item.roleId}
                                    header={item.fullName}>
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
        paddingRight: 15
    },
    desc: {
        fontSize: 16,
        color: '#666'
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

export default SelectRolePersonPolling;
