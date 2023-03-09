import { Flex } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import Macro from '../../../utils/macro';
import ScreenUtil from '../../../utils/screen-util';
import ShowLine from './show-line';
import ShowTitle from './show-title';

const ShowMingXiLook = ({ title = '', list = [], click, open = false }) => {
  if (list.length === 0) {
    return <></>;
  }
  const [isOpen, setIsopen] = useState(false);
  useEffect(() => {
    setIsopen(open);
  }, []);
  return (
    <View>
      <ShowTitle
        isOpen={isOpen}
        title={title}
        click={() => setIsopen(!isOpen)}
      />
      {isOpen && (
        <Flex style={styles.card} direction="column" align="start">
          {list.map((item, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => {
                click && click(item);
              }}
            >
              <View>
                <Flex
                  style={{ width: ScreenUtil.deviceWidth() - 54 }}
                  justify="between"
                >
                  <Text style={[styles.txt, styles.txt2]}>{item.word}</Text>
                  <Text style={[styles.txt]}>{item.word2}</Text>
                </Flex>
                <Flex justify="between" style={{ width: '100%' }}>
                  <Text style={styles.txt}>{item.word3}</Text>
                </Flex>
                <Text style={[styles.txt, { marginTop: -6 }]}>
                  {item.word4}
                </Text>
                {index < list.length - 1 && <ShowLine />}
              </View>
            </TouchableWithoutFeedback>
          ))}
        </Flex>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    backgroundColor: '#eee',
    marginBottom: 10,
    height: 1,
    width: ScreenUtil.deviceWidth() - 54,
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
});

export default ShowMingXiLook;
