import React, {Component, Fragment} from 'react';
import {View, Text, Image, StyleSheet, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import {Button, Flex, Icon, List, WhiteSpace, SegmentedControl} from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';
import LoadImage from './load-image';




export default class ListImages extends Component {



    render() {

        return (

            <Flex justify={'start'} align={'start'}
                  style={{width: ScreenUtil.deviceWidth() - 15, marginTop: 10}}>
                <Flex wrap={'wrap'}>
                    {this.props.images && this.props.images.map((item, index) => {
                        return (
                            <View key={item.uid} style={{
                                paddingLeft: 15,
                                paddingRight: 5,
                                paddingBottom: 10,
                                paddingTop: 10,
                            }}>
                                <LoadImage style={{
                                    width: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                    height: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,
                                }} img={item.url}/>
                            </View>
                        );
                    })}
                </Flex>
            </Flex>
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
    every: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },
    every2: {
        marginLeft: 15,
        marginRight: 15,

        paddingBottom: 5,
    },
    left: {
        fontSize: 16,
        color: '#333',
    },
    right: {},
    desc: {
        padding: 15,
        paddingBottom: 40,
    },
    ii: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
        backgroundColor: '#333',
        borderRadius: 6,
        marginBottom: 20,
    },
    word: {
        color: 'white',
        fontSize: 16,


    },
    content: {
        color:'#999'
    }

});
