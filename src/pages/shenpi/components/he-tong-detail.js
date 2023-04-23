import { Modal } from '@ant-design/react-native';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import ShowText from './show-text';

const HeTongDetail = forwardRef(({ hetong = {} }, ref) => {
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
          <ShowText word="项目" title={hetong.organizeName} />
          <ShowText word="合同号" title={hetong.no} />
          <ShowText word="租期" title={hetong.date} />
          <ShowText word="付款方式" title={hetong.payType} />
          <ShowText word="签约人" title={hetong.signer} />
          <ShowText word="客户名称" title={hetong.customer} />
          <ShowText word="租赁面积" title={hetong.totalArea} />
          <ShowText word="合同金额" title={hetong.totalAmount} />
          <ShowText word="租赁房产" title={hetong.houseName} />
        </View>
      </View>
    </Modal>
  );
});

export default HeTongDetail;
