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
  header: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#F3F4F2',
  },
  every: {
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  every2: {
    marginLeft: 15,
    marginRight: 15,

    paddingBottom: 10,
  },
  left: {
    fontSize: 14,
    color: '#666',
  },
  right: {},
  desc: {
    padding: 15,
    paddingBottom: 40,
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
  txt: {
    fontSize: 14,
    paddingBottom: 10,
  },
  txt2: {
    color: Macro.work_blue,
  },
  textarea: {
    marginTop: 5,
    borderStyle: 'solid',
    borderColor: '#F3F4F2',
    borderWidth: 1,
    borderRadius: 5,
  },

  fixedWidth: {
    width: 60,
  },
});

export default ShouDetail;
