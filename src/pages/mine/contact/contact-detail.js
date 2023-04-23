import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import {Icon} from '@ant-design/react-native';
import {List,  Flex,  Accordion} from '@ant-design/react-native'; 
import LoadImage from '../../../components/load-image';
import Macro from '../../../utils/macro'; 
import common from '../../../utils/common'; 
import BasePage from '../../base/base';
import {connect} from 'react-redux';
import api from '../../../utils/api';

class ContactDetail extends BasePage {
    static navigationOptions = ({navigation}) => {
        return {
            title: '通讯录',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{width: 30, marginLeft: 15}}/>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                    <Icon name='bars' style={{marginRight: 15}} color="black"/>
                </TouchableWithoutFeedback>
            ),

        };
    };

    constructor(props) {
        super(props);
        const type = common.getValueFromProps(this.props, 'type');


        this.state = {
            type,
            activeSections: [],
            selectBuilding: this.props.selectBuilding || {},
            data: [],
        };
        this.onChange = activeSections => {
            this.setState({activeSections});
        };

    }

    componentDidMount(): void {
        this.initData();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        const selectBuilding = this.state.selectBuilding;
        const nextSelectBuilding = nextProps.selectBuilding;
        if (!(selectBuilding && nextSelectBuilding && selectBuilding.key === nextSelectBuilding.key)) {
            this.setState({
                selectBuilding: nextProps.selectBuilding,
                estateId: nextProps.selectBuilding.key,
                index: 0,
            }, () => {
                this.initData();
            });
        }
    }

    initData = () => {
        const {type} = this.state;
        let url = '';
        let url2 = '';
        if (type === '1') {
            url = '/api/MobileMethod/MGetDepartmentList';
            url2 = '/api/MobileMethod/MGetWorkerList';
        } else if (type === '2') {
            url = '/api/MobileMethod/MGetVendorType';
            url2 = '/api/MobileMethod/MGetVendorList';
        }

        api.getData(url, this.state.selectBuilding ? {organizeId: this.state.selectBuilding.key} : {}).then(res => {
            Promise.all(res.map(item => api.getData(url2, {departmentId: item.departmentId,vendorTypeId:item.itemDetailId}))).then(ress => {
                let data = res.map((item, index) => ({
                    ...item,
                    children: ress[index],
                }));
                this.setState({data});
            });
        });
    };


    render() {
        const {data,type} = this.state;
        //console.log(111, data);
        return (

            <View style={{flex: 1}}>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.content}> 
                        <Accordion
                            onChange={this.onChange}
                            activeSections={this.state.activeSections}
                        >
                            {data.map(item => (
                                <Accordion.Panel key={item.departmentId || item.itemId} header={item.fullName || item.itemName}>
                                    <List>
                                        {item.children.map(i=>(
                                            <Flex justify={'start'} key={i.id} align={'start'} style={styles.aa} direction={'column'}>
                                                {
                                                    type === '2' && (
                                                        <Flex>
                                                            <Text style={styles.item}>
                                                                {i.fullName}
                                                            </Text>
                                                        </Flex>
                                                    )
                                                }
                                                <Flex style={{width: '100%'}} justify={'between'}>
                                                    <Flex>
                                                        <Text style={styles.desc}>{i.name || i.linkMan}</Text>
                                                        <Text style={styles.desc2}>{i.dutyName}</Text>
                                                    </Flex>
                                                    <TouchableWithoutFeedback onPress={()=>common.call(i.phoneNum || i.linkPhone)}>
                                                        <Flex><LoadImage defaultImg={require('../../../static/images/phone.png')} style={{width: 18, height: 18}}/></Flex>
                                                    </TouchableWithoutFeedback>
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
        color: '#333',

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
        fontSize: 18,
        color: '#333',
    },
    button: {
        backgroundColor: Macro.work_blue,
    },

    aa: {
        width: '100%',
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: ' rgb(244,244,244)',
    },
});

const mapStateToProps = ({buildingReducer}) => {
    return {
        selectBuilding: buildingReducer.selectBuilding,
    };
};

export default connect(mapStateToProps)(ContactDetail);

