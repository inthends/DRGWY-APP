import { Flex } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import ShowLine from './show-line';
import ShowTitle from './show-title';

const ShowMingXi2 = ({ title = '明细', list = [], open = false }) => {
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
            <View key={index} style={{ paddingBottom: 8 }}>
              <Flex justify="between" style={{ width: '100%' }}>
                <Text style={styles.txt}>{item.allName} </Text>
                {!item.feeName && (
                  <Text style={styles.txt}>
                    {item.price}
                    {item.priceUnit}
                  </Text>
                )}
              </Flex>
              {item.feeName && (
                <Flex
                  justify="between"
                  style={{ width: '100%', paddingTop: 8 }}
                >
                  <Text style={styles.txt}>{item.feeName || ''} </Text>
                  <Text style={styles.txt}>
                    {item.price}
                    {item.priceUnit}
                  </Text>
                </Flex>
              )}

              {index < list.length - 1 && (
                <ShowLine style={{ marginTop: 8, marginBottom: 8 }} />
              )}
            </View>
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
    // paddingBottom: 10,
  },
});

export default ShowMingXi2;
