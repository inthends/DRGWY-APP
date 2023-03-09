import { Flex } from '@ant-design/react-native';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ScreenUtil from '../../../utils/screen-util';
import ShowLine from './show-line';
import ShowText from './show-text';
import ShowTitle from './show-title';

const ShowPrices = ({ prices = [] }) => {
  if (prices.length === 0) {
    return <></>;
  }
  return (
    <View>
      <ShowTitle title="单价方案" />
      <Flex style={styles.card} direction="column" align="start">
        {prices.map((item, index) => (
          <View key={index}>
            <Text style={{ paddingBottom: 8 }}>{item.title}</Text>
            <ShowText word="付款周期" title={item.payCycle} />
            <ShowText word="免租" title={item.rebate} />
            <ShowText word="递增" title={item.incre} />
            {index < prices.length - 1 && <ShowLine />}
          </View>
        ))}
      </Flex>
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
});

export default ShowPrices;
