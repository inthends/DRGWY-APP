'use strict';
import React from 'react';
import {View,Text} from 'react-native';
import SrceenUtil from '../utils/screen-util';

/**
 * 虚线组件
 * @param {String} color 线条颜色
 * @param {String} backgroundColor 背景颜色
 * @param {Number} lineWidth 线条粗细
 * @param {Object} style 组件样式
 * @returns {Component}
 */
export default ({color = '#F3F4F2', backgroundColor = 'white', lineWidth = 1, style = {marginLeft: 15, marginRight:15}}) => {
    // let wrapperStyle = {
    //     height: lineWidth,
    //     overflow: 'hidden'
    // };
    // let lineStyle = {
    //     height: 0,
    //     borderColor: color,
    //     borderWidth: lineWidth,
    //     borderStyle: 'dashed'
    // };
    // let lineMask = {
    //     marginTop: -lineWidth,
    //     height: lineWidth,
    //     backgroundColor: backgroundColor
    // };
    //
    // return (
    //     <View style={[wrapperStyle, style]}>
    //         <View style={lineStyle} />
    //         <View style={lineMask} />
    //     </View>
    // );
    const width = SrceenUtil.deviceWidth() / 2;
    const dottes = [];
    for (let i = 0; i < width; i++) {
        dottes.push(i);
    }
    return (
        <View style={[{ flexDirection: 'row', width: SrceenUtil.deviceWidth() - 30, justifyContent: 'center', overflow: 'hidden' },style]}>
            {
                dottes.map((item) => {
                    return <Text key={item} style={{ color: color, fontSize: 30 }}>-</Text>;
                })
            }
        </View>
    );

};
