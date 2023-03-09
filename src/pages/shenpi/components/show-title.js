import { Flex } from '@ant-design/react-native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import LoadImage from '../../../components/load-image';
import UpImage from '../../../static/images/address/up.png';
import DownImage from '../../../static/images/address/down.png';

const ShowTitle = ({ title = '', isOpen, click }) => {
  return (
    <Flex
      justify="between"
      style={{ paddingBottom: 8 }}
      onPress={() => {
        click && click();
      }}
    >
      <Text style={styles.word}>{title}</Text>
      {click && (
        <LoadImage
          style={{ width: 15, height: 8 }}
          defaultImg={isOpen ? UpImage : DownImage}
        />
      )}
    </Flex>
  );
};

const styles = StyleSheet.create({
  word: {
    color: '#666',
    fontSize: 14,
  },
});

export default ShowTitle;
