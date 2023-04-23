
import React from 'react';
import { WebView } from 'react-native-webview';

const webPage = props => {
  let urlStr = props.navigation.state.params.data;
  if (typeof urlStr !== 'string') {
    urlStr = '';
  }
  else if (urlStr.indexOf('doc') !== -1) {
    urlStr = 'https://view.officeapps.live.com/op/view.aspx?src=' + urlStr;
  }
  else if (urlStr.indexOf('pdf') !== -1) {
    urlStr = 'http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=true&_xdoc=' + urlStr;
    // urlStr = 'http://mozilla.github.io/pdf.js/web/viewer.html?file=' + urlStr;
  }
  return <WebView source={{ uri: urlStr }} />;
}

export default webPage;
