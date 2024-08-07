import { Flex } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Macro from '../../../utils/macro';
import ShowLine from './show-line';
import ShowText from './show-text-small';
import ShowTitle from './show-title';

const ShowMingXiCaiGou = ({ title = '明细', list = [], open = false }) => {
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
              <Flex
                justify="between"
                style={{ width: '100%', paddingBottom: 8 }}
              >
                <Text style={{ fontWeight: 'bold' }}>
                  {item.name}
                </Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {item.code}
                </Text>
              </Flex>
              <ShowText word="规格型号" title={item.modelNo} />
              <ShowText word="单价" title={item.price} />
              <ShowText word="数量" title={item.quantity} />
              <ShowText word="金额" title={item.amount} />
              <ShowText word="供应商" title={item.vendorName} />
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
    marginBottom: 15
  }
});

export default ShowMingXiCaiGou;
