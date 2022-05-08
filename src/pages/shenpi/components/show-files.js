import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import ShowTitle from './show-title';

const ShowFiles = () => {
  return (
    <View>
      <View style={{ height: 5 }} />
      <ShowTitle title="附件" />
      <View style={{ height: 50 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    backgroundColor: '#eee',
    marginBottom: 10,
    height: 1,
    width: ScreenUtil.deviceWidth() - 54,
  },
});

export default ShowFiles;
