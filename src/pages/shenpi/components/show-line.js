import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';

const ShowLine = ({ style = {} }) => {
  return <View style={[styles.line, style]} />;
};

const styles = StyleSheet.create({
  line: {
    backgroundColor: '#eee',
    marginBottom: 10,
    height: 1,
    width: ScreenUtil.deviceWidth() - 54,
  },
});

export default ShowLine;
