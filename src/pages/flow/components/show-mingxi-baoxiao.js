import { Flex } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ShowLine from './show-line';
import ShowTitle from './show-title';

const ShowMingXiBaoXiao = ({ title = '明细', list = [], open = false }) => {
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
        <Flex   direction="column" align="start">
          {list.map((item, index) => (
            <View key={index}
            //style={{ paddingBottom: 8 }} 
            >
              <Flex
                justify="between"
                style={{ paddingBottom: 8, width: '100%' }}
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.memo}</Text>
                <Text style={styles.txt}>{item.amount}</Text>
              </Flex>
              <Flex justify="between" style={{ paddingBottom: 8, width: '100%' }}>
                <Text style={styles.txt}>单价：{item.price}</Text>
                <Text style={[styles.txt]}>数量：{item.quantity}</Text>
              </Flex>
              <Flex justify="between" style={{ width: '100%' }}>
                <Text style={styles.txt}>预算科目：{item.budgetTypeName}</Text>
                <Text style={[styles.txt]}>预算余额：{item.lastAmount}</Text>
              </Flex>
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

export default ShowMingXiBaoXiao;
