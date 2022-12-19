import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

const webPage = (props) => {
  let urlStr = props.navigation.state.params.data;
  if (typeof urlStr !== 'string'){
    urlStr = ''
  }
  return (
    <WebView source={{ uri:  urlStr}}/>
  );
};
export default webPage;