import React from 'react';
import BasePage from '../base/base';
import { List, Icon, Flex, Accordion } from '@ant-design/react-native';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
// import CommonView from '../../components/CommonView';
import Macro from '../../utils/macro';
// import WorkService from './work-service';
import { connect } from 'react-redux';
// import LoadImage from '../../components/load-image';
// import common from '../../utils/common';
import api from '../../utils/api';

class SelectPerson extends BasePage {
    //选择接单人员 
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
        //console.log('nextSelectBuilding:' + nextSelectBuilding);

        if (!(selectBuilding
            && nextSelectBuilding
            && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({
                selectBuilding: nextProps.selectBuilding
                // estateId: nextProps.selectBuilding.key,
                //index: 0,
            }, () => {
                this.initData();
            });
        }
    }

    initData() {

        // WorkService.paidanPersons(this.state.selectBuilding.key).then(res => {
        //     this.setState({
        //         items: res
        //     });
        // });

        // let url = '/api/MobileMethod/MGetDepartmentList';
        // let url2 = '/api/MobileMethod/MGetReceiveUserList';

        // api.getData(url, this.state.selectBuilding ? { organizeId: this.state.selectBuilding.key } : {}).then(res => {
        //     Promise.all(
        //         res.map(item => api.getData(url2, { departmentId: item.departmentId }))).
        //         then(ress => {

        //             let data = res.map((item, index) => ({
        //                 ...item,
        //                 children: ress[index]
        //             }));
        //             this.setState({ data });
        //         });
        // });


        //改为获取角色
        let url = '/api/MobileMethod/MGetReceiveRoleList';
        let url2 = '/api/MobileMethod/MGetReceiveByRoleUserList';

        api.getData(url, this.state.selectBuilding ? { organizeId: this.state.selectBuilding.key } : {}).then(res => {
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

    click = (selectItem) => {
        const { navigation } = this.props;
        navigation.state.params.onSelect({ selectItem });
        navigation.goBack();
    };

    // render() {
    //     const { items } = this.state;
    //     return (
    //         <CommonView>
    //             <ScrollView>
    //                 <View >
    //                     {items.map(item => (
    //                         <TouchableWithoutFeedback key={item.id} onPress={() => this.click(item)}>
    //                             <Flex style={styles.content} justify={'between'} align={'center'}>
    //                                 <Flex>
    //                                     <Flex style={styles.square} justify={'center'} align={'center'}>
    //                                         <Text style={styles.number}>{item.count}</Text>
    //                                     </Flex>
    //                                     <Flex direction={'column'} style={{marginLeft: 15}}>
    //                                         <Text style={styles.name}>{item.name}</Text>
    //                                         <Text style={styles.company}>{item.orgName}</Text>
    //                                     </Flex>
    //                                 </Flex>
    //                                 <Flex direction={'column'}>
    //                                     <Text style={styles.identifier}>{item.dutyName}</Text>
    //                                     <Text style={styles.state}>{item.state === 1 ? '在线' : '离线'}</Text>
    //                                 </Flex>
    //                             </Flex>
    //                         </TouchableWithoutFeedback>
    //                     ))}
    //                 </View>
    //             </ScrollView>
    //         </CommonView>
    //     );
    // }

    //2024-03-21 改为通讯录样式
    render() {
        const { data } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.content}>
                        <Accordion
                            onChange={this.onChange}
                            activeSections={this.state.activeSections}
                        >
                            {data.map(item => (
                                <Accordion.Panel
                                    key={item.roleId}
                                    header={item.fullName}
                                >
                                    <List>
                                        {item.children.map(i => (
                                            <TouchableWithoutFeedback key={'Touch' + i.id} onPress={() => this.click(i)}>
                                                <Flex justify={'start'} key={i.id} align={'start'} style={styles.aa} direction={'column'}>
                                                    <Flex style={{ width: '100%' }} justify={'between'}>
                                                        <Flex>
                                                            <Text style={styles.desc}>{i.name}</Text>
                                                        </Flex>
                                                        <Flex><Text>{i.postName}</Text></Flex>
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
        paddingLeft: 15,
        paddingRight: 15
        // height: ScreenUtil.contentHeight(),
        // height: ScreenUtil.contentHeightWithNoTabbar(),
    },
    desc: {
        fontSize: 16,
        color: '#666',//color: '#999',
        //paddingTop: 5,
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
        selectBuilding: buildingReducer.selectBuilding,
    };
};
export default connect(mapStateToProps)(SelectPerson);
