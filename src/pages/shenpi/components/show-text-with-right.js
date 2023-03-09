import { Flex } from '@ant-design/react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import screenUtil from '../../../utils/screen-util';
import ShowText from './show-text';

const ShowTextWithRight = ({
  word = '',
  title = '',
  right = '',
  rightDistance = 0,
  fixedWidth = 60,
  wordColor,
  titleColor,
  rightColor,
  onClick,
}) => {
  return (
    <View
      style={{
        width: screenUtil.deviceWidth() - 55,
        position: 'relative',
      }}
      onPress={() => {
        onClick && onClick();
      }}
    >
      <ShowText
        wordColor={wordColor}
        titleColor={titleColor}
        rightColor={rightColor}
        fixedWidth={fixedWidth}
        word={word}
        title={title}
        onClick={onClick}
      />
      <Text
        style={[
          styles.txt,
          { position: 'absolute', right: rightDistance },
          rightColor ? { color: rightColor } : {},
        ]}
      >
        {right}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedWidth: {
    width: 60,
  },
  txt: {
    fontSize: 14,
    paddingBottom: 10,
  },
});

export default ShowTextWithRight;
