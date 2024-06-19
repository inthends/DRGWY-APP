
import React from 'react';
import { WebView } from 'react-native-webview'; 

const webPage = props => {
  let urlStr = props.navigation.state.params.data;


  if (typeof urlStr !== 'string') {
    urlStr = '';
  }

  if (urlStr.indexOf('pdf') !== -1) {
    //urlStr = 'http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=true&_xdoc=' + urlStr;//有时间限制
 

  }
  else {
    //办公文件
    var officetype = /(doc|docx|xls|xlsx|ppt|pptx)$/;
    var type = urlStr.split('.').pop() || '';
    var mytype = type.toLowerCase();
    if (officetype.test(mytype)) {
      urlStr = 'https://view.officeapps.live.com/op/view.aspx?src=' + urlStr;
    }
    return <WebView source={{ uri: urlStr }} />;
  }
}
export default webPage;
