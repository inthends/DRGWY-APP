import { Modal, Flex } from '@ant-design/react-native';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import ShowLine from './show-line';
import ShowText from './show-text';

const CompanyDetail = forwardRef(({ customer = {} }, ref) => {
  const [visible, setVisible] = useState(false);

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
          <Text style={[styles.txt, { fontSize: 18 }]}>{customer.name}</Text>
          <ShowLine />
          <ShowText word="联系人" title={customer.linkMan} />
          <ShowText word="联系地址" showInModal title={customer.address} />
          <ShowText word="证件名称" title={customer.certificateType} />
          <ShowText word="证件号码" title={customer.certificateNo} />
        </View>
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

export default CompanyDetail;
