import { Modal, Flex } from '@ant-design/react-native';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import ShowLine from './show-line';
import ShowText from './show-text';

const ShouDetail = forwardRef(({ detail }, ref) => {
  const [visible, setVisible] = useState(false);

  const { list = [] } = detail;

  const showModal = () => {
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };
  useImperativeHandle(ref, (props, ref) => {
    return {
      showModal,
      closeModal,
    };
  });

  return (
    <Modal
      maskClosable
      visible={visible}
      onClose={closeModal}
      transparent={true}
      style={{ width: ScreenUtil.deviceWidth() - 40 }}
    >
      <View>
        <View>
          <Text style={styles.txt}>{detail.billCode}</Text>
          <ShowText word="收款日期" title={detail.billDate} />
          <ShowText word="收款人" title={detail.createUserName} />
          <ShowText word="实收金额" title={(detail.detail || '').trim()} />
        </View>
        <ShowLine />
        {list.map((item, index) => (
          <View key={index}>
            <Flex>
              <Text style={[styles.txt, styles.txt2]}>{item.allName}</Text>
              {/* <Text style={[styles.txt, styles.txt2, { paddingLeft: 10 }]}>
                { item.}
              </Text> */}
            </Flex>
            <Flex justify="between" style={{ width: '100%' }}>
              <Text style={styles.txt}>{item.feeName} </Text>
              <Text style={styles.txt}>{item.amount}</Text>
            </Flex>
            <Text style={[styles.txt, { marginTop: -6 }]}>{item.billDate}</Text>
            {index < list.length - 1 && <ShowLine />}
          </View>
        ))}
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  txt: {
    fontSize: 14,
    paddingBottom: 10,
  },
  txt2: {
    color: Macro.work_blue
  }
});

export default ShouDetail;
