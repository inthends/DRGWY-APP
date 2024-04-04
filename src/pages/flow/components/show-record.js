import { Flex } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native'; 
import ShowLine from './show-line';
import ShowText from './show-text-small';
import ShowTextWithRight from './show-text-with-right-small';
import ShowTitle from './show-title';

const ShowRecord = ({ records = [], open = false }) => {
  
  if (records.length === 0) {
    return <></>;
  }
  const [isOpen, setIsopen] = useState(false);
  useEffect(() => {
    setIsopen(open);
  }, []);

  return (
    <View>
      <ShowTitle
        title="审批记录"
        isOpen={isOpen}
        click={() => setIsopen(!isOpen)}
      />
      {isOpen && (
        <Flex style={styles.card} direction="column" align="start">
          {records.map((item, index) => (
            <View key={index}>
              <ShowText word="步骤" title={item.stepname} />
              <ShowTextWithRight
                word="办理人"
                title={item.receivename}
                right={item.datetime}
              />
              <ShowText word="办理结果" title={item.status} />
              <ShowText word="意见" title={(item.content || '').trim()} />
              {index < records.length - 1 && <ShowLine />}
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

export default ShowRecord;
