import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Flex } from '@ant-design/react-native';
// import ScreenUtil from '../utils/screen-util';
import LoadImage from './load-image';
import UpImage from '../static/images/address/up.png';
import DownImage from '../static/images/address/down.png';

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
                            <Flex style={[styles.every]}
                                justify='between'
                            >
                                <Flex>
                                    <LoadImage img={i.avatar} style={{ width: 30, height: 30 }} />
                                    <Text style={styles.left}>{i.author} {i.datetime} {i.operationType}</Text>
                                </Flex>
                                <LoadImage style={{ width: 15, height: 8 }}
                                    img={i.show ? UpImage : DownImage}
                                />
                            </Flex>
                        </TouchableWithoutFeedback>

                        {i.show === true ?
                            <View style={{
                                //margin: 10,
                                //marginTop: 0,
                                borderStyle: 'solid',
                                borderColor: '#F3F4F2',
                                borderWidth: 1,
                                borderRadius: 4,
                                paddingTop: 5,
                                paddingBottom: 10,
                                paddingRight: 10,
                                paddingLeft: 10,
                                marginBottom: 15,
                                marginRight: 5,
                                marginLeft: 5

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
    every: {
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 5,
        paddingBottom: 5
    },
    left: {
        paddingLeft: 10,
        fontSize: 14,
        color: '#666'
    },
    content: {
        fontSize: 13,
        color: '#999'
    }
});
