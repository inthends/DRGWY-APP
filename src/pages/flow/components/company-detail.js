import { Modal } from '@ant-design/react-native';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
          <Text style={styles.txt}>{customer.name}</Text>
          <ShowLine />
          <ShowText word="联系人" title={customer.linkMan} />
          <ShowText word="联系电话" title={customer.linkPhoneNum} />
          <ShowText word="联系地址" showInModal title={customer.address} />
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  txt: {
    color: '#404145',
    fontSize: 16,
    paddingBottom: 10
  }
});

export default CompanyDetail;
