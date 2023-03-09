import { Flex } from '@ant-design/react-native';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Macro from '../../../utils/macro';
import screenUtil from '../../../utils/screen-util';

const ShowText = ({
  fixedWidth = 60,
  word = '',
  title = '',
  onClick,
  showInModal,
  wordColor,
  titleColor = Macro.work_blue,
  pointColor,
}) => {
  const words = word.split('');
  return (
    <Flex
      align="start"
      style={{ width: screenUtil.deviceWidth() - (showInModal ? 140 : 120) }}
    >
      <Flex style={{ width: fixedWidth }} justify="between">
        {words.map((item, index) => (
          <Text
            key={`${item}${index}`}
            onPress={() => {
              if (wordColor === Macro.work_orange) {
                onClick && onClick();
              }
            }}
            style={[styles.txt, wordColor ? { color: wordColor } : {}]}
          >
            {item}
          </Text>
        ))}
      </Flex>
      <Text style={pointColor ? { color: pointColor } : {}}>：</Text>
      <Text
        style={[styles.txt, onClick ? { color: titleColor } : {}]}
        onPress={() => {
          onClick && onClick();
        }}
      >
        {title}
      </Text>
    </Flex>
  );
};

const styles = StyleSheet.create({
  txt: {
    fontSize: 14,
    paddingBottom: 10,
  },
});

export default ShowText;
