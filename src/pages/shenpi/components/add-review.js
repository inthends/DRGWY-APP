import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Icon, Button, Flex, TextareaItem } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import Macro from '../../../utils/macro';
//暂时废弃，没有多选框，无法实现

// const DATA = [
//   {
//     titleId: "1",
//     titleName: "水果",
//     data: [
//       { id: '01', name: '香蕉', selected: false },
//       { id: '02', name: '梨', selected: false },
//       { id: '03', name: '葡萄', selected: false },
//       { id: '04', name: '猕猴桃', selected: false },
//       { id: '05', name: '苹果', selected: false },
//       { id: '06', name: '桃子', selected: false },
//       { id: '07', name: '西瓜', selected: false },
//       { id: '08', name: '橘子', selected: false },
//     ]
//   }]

const DATA = [
  { id: '01', name: '香蕉', selected: false },
  { id: '02', name: '梨', selected: false },
  { id: '03', name: '葡萄', selected: false },
  { id: '04', name: '猕猴桃', selected: false },
  { id: '05', name: '苹果', selected: false },
  { id: '06', name: '桃子', selected: false },
  { id: '07', name: '西瓜', selected: false },
  { id: '08', name: '橘子', selected: false },
]

//添加沟通
export default class AddReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flowUsers: DATA,//流程参与人
      selectedItem: []//选中的项
    }
  };

  render() {
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
        }}>
          <Flex direction={'column'}>
            {/* <SectionList
              sections={this.state.flowUsers}
              keyExtractor={(item) => item.id}
              extraData={this.state}
              stickySectionHeadersEnabled={true}//吸顶效果
              renderItem={this._renderItem}//cell
              renderSectionHeader={({ section: { titleName } }) => (
                <View style={{ height: 40, justifyContent: 'center', backgroundColor: 'rgba(232,240,248,1)' }}>
                  <Text style={{ color: "#0a3989", textAlign: 'center' }}>{titleName}</Text>
                </View>
              )}
              ItemSeparatorComponent={() => {
                return <View style={{ borderWidth: 0.2, borderColor: "#d2d2d2" }} />
              }}
            /> */}


            <Picker
              mode={'dropdown'}
              
              style={{ width: ScreenUtil.deviceWidth() - 150 }}
              //selectedValue={this.state.dropdown}
              //</Flex>onValueChange={(value) => this.onValueChange(2, value)}
              >
              <Picker.Item label="我是下拉菜单1" value="key0" />
              <Picker.Item label="我是下拉菜单2" value="key1" />
              <Picker.Item label="我是下拉菜单3" value="key2" />
              <Picker.Item label="我是下拉菜单4" value="key3" />
            </Picker>
 
            <TextareaItem
              style={{
                width: ScreenUtil.deviceWidth() - 150
              }}
              placeholder={'请输入说明'}
              rows={6}
              onChange={memo => this.setState({ memo })}
              value={this.state.memo}
            />
            <Button
              style={{
                width: '100%',
                marginTop: 10,
                backgroundColor: Macro.work_blue
              }}
              type="primary" >确定</Button>
          </Flex>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  _renderItem = (info) => {
    if (info.item.selected == true) {
      return <TouchableOpacity onPress={this._itemPress.bind(this, info.item, info.index)}>
        <View style={{ height: 45, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
          <Text style={{ marginLeft: 10, alignSelf: 'center', color: "#000000" }}>{info.item.name}</Text>
          <Icon name="ios-checkmark-outline" color='blue' size={25} style={{ alignSelf: 'center', marginRight: 5 }} />
        </View>
      </TouchableOpacity>
    } else {
      return <TouchableOpacity onPress={this._itemPress.bind(this, info.item, info.index)}>
        <View style={{ height: 45, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
          <Text style={{ marginLeft: 10, alignSelf: 'center', color: "#000000" }}>{info.item.name}</Text>
          <Icon name="ios-square-outline" color='#d2d2d2' size={25} style={{ alignSelf: 'center', marginRight: 5 }} />
        </View>
      </TouchableOpacity>
    }
  }

  _itemPress(selectItem, index) {
    var $this = this;
    this.state.flowUsers.forEach(function (item1, lev1Index) {
      item1.data.forEach(function (item2, lev2Index) {
        if (item2.id == selectItem.id) {
          //循环数据是否存在，存在就移除
          var isExist = false;
          $this.state.selectedItem.forEach(function (obj, objIndex) {
            if (obj.id == selectItem.id && obj.titleId == item1.titleId) {
              //找到存在的对象删除掉
              $this.state.selectedItem.splice(objIndex, 1);
              isExist = true;
            }
          })
          if (isExist == false) {
            //不存在就加到集合中去
            $this.state.selectedItem.push({ id: selectItem.id, titleId: item1.titleId });
          }
          $this.state.flowUsers[lev1Index].data[index].selected = !selectItem.selected;
        }
      })
    })
    this.setState({ flowUsers: this.state.flowUsers })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  }
}); 
