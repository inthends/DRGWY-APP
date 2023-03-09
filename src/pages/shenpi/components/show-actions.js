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
  const { executeType } = detail;
  if (executeType != 0) {
    return <></>;
  }

  const onClick = (type) => {
    const verifyMemo = value;
    const { item = {}, detail = {} } = state;
    const { id: taskId, instanceId, code } = item;
    const { organizeId } = detail;

    if (type === '同意') {
      service
        .approveForm({
          code,
          taskId,
          instanceId,
          organizeId: isSpecial ? organizeId : '',
          projectId: isSpecial ? '' : organizeId,
          verifyMemo,
        })
        .then((res) => {
          UDToast.showInfo('同意成功');
          setTimeout(() => {
            setValue('');
            click && click();
          }, 2000);
        });
    } else {
      service
        .rejectForm({
          code,
          taskId,
          instanceId,
          verifyMemo,
        })
        .then((res) => {
          UDToast.showInfo('退回成功');
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
      <View style={styles.textarea}>
        <TextareaItem
          rows={4}
          placeholder="输入审批意见"
          style={{
            fontSize: 14,
            height: 100,
            width: ScreenUtil.deviceWidth() - 45,
          }}
          onChange={(val) => setValue(val.trim())}
          value={value}
        />
      </View>
      <Flex justify="around" style={{ marginTop: 30 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            onClick('退回');
          }}
        >
          <Flex
            justify={'center'}
            style={[styles.ii, { backgroundColor: Macro.work_orange }]}
          >
            <Text style={styles.word}>退回</Text>
          </Flex>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            onClick('同意');
          }}
        >
          <Flex
            justify={'center'}
            style={[styles.ii, { backgroundColor: Macro.work_green }]}
          >
            <Text style={styles.word}>同意</Text>
          </Flex>
        </TouchableWithoutFeedback>
      </Flex>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    borderColor: '#eee',
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 5,
    marginBottom: 15,
  },
  textarea: {
    marginTop: 5,
    borderStyle: 'solid',
    borderColor: '#F3F4F2',
    borderWidth: 1,
    borderRadius: 5,
  },
  ii: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    width: (ScreenUtil.deviceWidth() - 15 * 2 - 20 * 2) / 3.0,
    backgroundColor: '#999',
    borderRadius: 6,
    marginBottom: 20,
  },
  word: {
    color: 'white',
    fontSize: 16,
  },
});

export default ShowActions;
