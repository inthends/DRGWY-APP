# 注意点

## 1.如果执行了 npm install 操作 需要修改文件：node_modules/native-echarts/src/components/Echarts/index.js

```

render() {
    const source = (Platform.OS == 'ios') ? require('./tpl.html') : {'uri':'file:///android_asset/tpl.html'};
    return (
      <View style={{flex: 1, height: this.props.height || 400,}}>
        <WebView
          ref="chart"
          scrollEnabled = {false}
          injectedJavaScript = {renderChart(this.props)}
          style={{
            height: this.props.height || 400,
            backgroundColor: this.props.backgroundColor || 'transparent'
          }}
          scalesPageToFit={Platform.OS !== 'ios'}
          originWhitelist={['*']}
          source={source}
          onMessage={event => this.props.onPress ? this.props.onPress(JSON.parse(event.nativeEvent.data)) : null}
        />
      </View>
    );
  }
```

## 2

```
node_modules/react-native/React/Base/RCTModuleMethod.mm


static BOOL RCTParseUnused(const char **input)
{
  return RCTReadString(input, "__unused") ||
  RCTReadString(input, "__attribute__((__unused__))") ||
  RCTReadString(input, "__attribute__((unused))");
}



```

```
首先要打开react native debugger，

找到项目的以下路径node_modules/react-native/Libraries\Core\setUpXHR.js；

找到polyfillGlobal('XMLHttpRequest', () => require('../Network/XMLHttpRequest'));将此句注释；
————————————————
版权声明：本文为CSDN博主「L_jin_c」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/L_jin_c/article/details/122867043
```
