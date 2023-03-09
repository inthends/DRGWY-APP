import React, {Component, Fragment} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Flex} from '@ant-design/react-native';
import ScreenUtil from '../utils/screen-util';
import LoadImage from './load-image';

export default class OperationRecords extends Component {

    render() {

        return (
            <Fragment>
                <Flex style={{
                    marginLeft: 15,
                    marginRight: 15,
                    marginBottom: 15,
                    paddingTop: 15,
                }} justify='between'>
                    <Text style={styles.left}>单据动态</Text>
                </Flex>
                {this.props.communicates.map((i, index) => (
                    <Fragment key={index}>
                        <TouchableWithoutFeedback onPress={() => {
                            if (this.props.communicateClick) {
                                this.props.communicateClick(i);
                            }
                        }}>
                            <Flex style={[styles.every]} justify='between'>
                                <LoadImage img={i.avatar} style={{width: 30, height: 30}}/>
                                <Text style={styles.left}>{i.author} {i.datetime}</Text>
                                <LoadImage style={{width: 30, height: 30}}/>
                            </Flex>
                        </TouchableWithoutFeedback>
                        {i.show === true ? <View style={{
                            margin: 15,
                            marginTop: 0,
                            // borderStyle: 'solid',
                            // borderColor: '#F3F4F2',
                            // borderWidth: 1,
                            // borderRadius: 5,
                            paddingTop: 15,
                            paddingBottom: 15,
                            paddingRight: 10,
                            paddingLeft: 10,
                        }}>
                            <Text style={styles.content}>{i.content}</Text>
                        </View> : null}
                        {/*<Flex wrap={'wrap'}>*/}
                        {/*    {images.map((item, index) => {*/}
                        {/*        return (*/}
                        {/*            <View style={{*/}
                        {/*                paddingLeft: 15,*/}
                        {/*                paddingRight: 5,*/}
                        {/*                paddingBottom: 10,*/}
                        {/*                paddingTop: 10,*/}
                        {/*            }}>*/}
                        {/*                <Image style={{*/}
                        {/*                    width: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,*/}
                        {/*                    height: (ScreenUtil.deviceWidth() - 15) / 4.0 - 20,*/}
                        {/*                }} source={{uri: item.icon}}/>*/}
                        {/*            </View>*/}
                        {/*        );*/}
                        {/*    })}*/}
                        {/*</Flex>*/}
                    </Fragment>
                ))}
            </Fragment>
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
