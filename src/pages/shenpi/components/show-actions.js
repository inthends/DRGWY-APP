import { Flex, TextareaItem } from '@ant-design/react-native';
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import UDToast from '../../../utils/UDToast';
import service from '../service';
import ShowTitle from './show-title';

const ShowActions = ({ state, click, isSpecial = false }) => {
  const [value, setValue] = useState('');
  const { detail = {} } = state;
  const { executeType, taskType } = detail;
  //alert('executeType:' + executeType + ',taskType:' + taskType);

  if (executeType != 0) {
    return <></>;
  }

  const onClick = (type) => {
    const verifyMemo = value;
    const { detail = {} } = state;
    const { id: taskId, instanceId, code, organizeId } = detail;

    if (type === '通过') {
      service
        .approveForm({
          code,
          taskId,
          instanceId,
          organizeId: isSpecial ? organizeId : '',
          projectId: isSpecial ? '' : organizeId,
          verifyMemo
        })
        .then((res) => {
          UDToast.showInfo('通过成功');
          setTimeout(() => {
            setValue('');
            click && click();
          }, 2000);
        });
    } else if (type === '退回') {
      service.rejectForm({
        code,
        taskId,
        instanceId,
        verifyMemo
      }).then((res) => {
        UDToast.showInfo('退回成功');
        setTimeout(() => {
          setValue('');
          click && click();
        }, 2000);
      });
    } else {
      //查阅确定
      service.readForm({ taskId })
        .then((res) => {
          UDToast.showInfo('查阅成功');
          setTimeout(() => {
            setValue('');
            click && click();
          }, 2000);
        });
    }
  };

  return (
    <View>
      <ShowTitle title="审批信息" />
      {taskType == 5 ?//抄送
        null :
        // <View style={styles.textarea} >
        <TextareaItem
          rows={4}
          placeholder="输入审批意见"
          style={{ 
            width: ScreenUtil.deviceWidth() - 45,
            fontSize:14
          }}
          onChange={(val) => setValue(val)}
          value={value}
        />
        // </View>
      }
      <Flex justify="around" style={{ marginTop: 30 }}>
        {taskType == 5 ?//抄送
          <TouchableWithoutFeedback
            onPress={() => {
              onClick('查阅');
            }}
          >
            <Flex
              justify={'center'}
              style={[styles.ii, { backgroundColor: Macro.work_blue }]}
            >
              <Text style={styles.word}>查阅</Text>
            </Flex>
          </TouchableWithoutFeedback> :
          <>
            <TouchableWithoutFeedback
              onPress={() => {
                onClick('退回');
              }}
            >
              <Flex
                justify={'center'}
                style={[styles.ii, {
                  backgroundColor: Macro.work_orange
                }]}
              >
                <Text style={styles.word}>退回</Text>
              </Flex>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                onClick('通过');
              }}
            >
              <Flex
                justify={'center'}
                style={[styles.ii, { backgroundColor: Macro.work_blue }]}
              >
                <Text style={styles.word}>通过</Text>
              </Flex>
            </TouchableWithoutFeedback>
          </>}
      </Flex>
    </View>
  );
};

const styles = StyleSheet.create({
  // textarea: {
  //   marginTop: 5,
  //   borderStyle: 'solid',
  //   borderColor: '#F3F4F2',
  //   borderWidth: 1,
  //   borderRadius: 5
  // },
  ii: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
    backgroundColor: '#999',
    borderRadius: 6,
    marginBottom: 20
  },
  word: {
    color: 'white',
    fontSize: 16
  }
});

export default ShowActions;
