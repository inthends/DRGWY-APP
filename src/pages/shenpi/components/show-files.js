import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import service from '../service';
import ShowTitle from './show-title';
/*
this.props.navigation.navigate('wancheng');
*/

const ShowFiles = (props) => {
  const { files = [] } = props; 
  return (
    <View>
      <View style={{ height: 5 }} />
      <ShowTitle title="附件" />
      {/* <View style={{ height: 50 }} /> */}
      {
        files.map((item) => <View style={styles.file} key={item.id}>
          <TouchableOpacity onPress={()=>{
            if (!!item.filePath){
              props.onPress ? props.onPress(item.filePath) :undefined
            }
            
          }}>
          <View style={{justifyContent:'space-between',flexDirection:'row'}}>
          <Text style={{color:'blue',borderBottomColor:'blue',borderBottomWidth:1}}>{item.fileName }</Text>
          <Text> . </Text>
          </View>
          </TouchableOpacity>
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
