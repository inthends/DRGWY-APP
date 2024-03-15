import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Flex, TextareaItem } from '@ant-design/react-native';
import ScreenUtil from '../../../utils/screen-util';
import Macro from '../../../utils/macro';
import MyPopoverNew from '../../../components/my-popovernew';
import service from '../service';
import UDToast from '../../../utils/UDToast';

//添加沟通
export default class AddReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskId: this.props.taskId,
      userId: this.props.users[0].id,
      memo: '',
      users: this.props.users//流程参与人 
    }
  };

  save = () => {
    const { taskId, userId, memo } = this.state;

    if (!userId) {
      UDToast.showError('请选择人员');
      return;
    }

    if (!memo) {
      UDToast.showError('请输入内容');
      return;
    }

    //save
    let params = {
      taskId: taskId,
      userId: userId,
      memo: memo
    };

    service.addReview(params).then(res => {
      UDToast.showInfo('添加成功');
      //刷新评审记录
      this.props.onClose();
    });
  };

  render() {
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
        }}>
          <Flex direction={'column'} >
            <Flex align={'center'} style={{ width: '100%' }} >
              <Text style={styles.text}>接收人</Text>
              <MyPopoverNew
                style={styles.input}
                onChange={item => this.setState({ userId: item.id })}
                data={this.state.users}
                visible={true} />
            </Flex>

            <Flex align={'center'} style={{ width: '100%' }} >
              <TextareaItem
                maxLength={500}
                style={{
                  width: ScreenUtil.deviceWidth() - 150,
                  fontSize: 14
                }}
                placeholder={'请输入'}
                rows={6}
                onChange={memo => this.setState({ memo })}
                value={this.state.memo}
              />
            </Flex>
            <Button
              style={{
                width: '100%',
                marginTop: 10,
                backgroundColor: Macro.work_blue
              }}
              type="primary"
              onPress={this.save} >确定</Button>
          </Flex>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16
  },
  input: {
    fontSize: 16,
    marginLeft: 10
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  }
}); 
