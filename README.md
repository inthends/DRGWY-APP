
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
