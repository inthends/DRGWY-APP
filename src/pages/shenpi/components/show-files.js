import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import service from '../service';
import ShowTitle from './show-title';

const ShowFiles = (props) => {
  const { files = [] } = props;
  console.log(123,files)
  return (
    <View>
      <View style={{ height: 5 }} />
      <ShowTitle title="附件" />
      {/* <View style={{ height: 50 }} /> */}
      {
        files.map((item) => <View style={styles.file} key={item.id}>
          <Text>{item.fileName }</Text>
        </View>)
      }
      <View style={{ height: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  file: {

    paddingBottom: 15,
 
  },
});

export default ShowFiles;
