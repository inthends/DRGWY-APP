import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Flex } from '@ant-design/react-native';
import ShowTitle from './show-title';
import ShowLine from './show-title';

//沟通记录
//const ShowReviews = ({ instanceId = '', isCompleted = false, open = false }) => { 
export default class ShowReviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  // if (records.length === 0) {
  //   return <></>;
  // }

  // const[isOpen, setIsopen] = useState(false);
  // const[reviews, setReviews] = useState([]);

  // 打开抽屉时初始化
  // useEffect(() => {
  //   loadReviews(instanceId);
  // }, [instanceId]);

  // const loadReviews = (id) => {
  //   service.getReviews(id).then(res => {
  //     setReviews(res || []);
  //   });
  // }


  render() {
    const { isOpen } = this.state;
    return (
      <View>
        <ShowTitle
          title="沟通记录"
          isOpen={isOpen}
          click={() =>
            this.setState({ isOpen: !isOpen })
          }
        />
        {isOpen && (
          <Flex style={styles.card} direction="column" align="start"> 
            <TouchableWithoutFeedback
              onPress={() => {
                if (this.props.add) {
                  this.props.add();
                }
              }}>
              <View >
                <Text style={styles.txt2}>
                  添加
                </Text>
              </View>
            </TouchableWithoutFeedback>
            
            {this.props.reviews.map((item, index) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => {
                  if (this.props.onClick) {
                    this.props.onClick(item.id);
                  }
                }}>
                <View key={index}>
                  <Text style={styles.txt}>
                    {item.author}， {item.datetime}
                  </Text>
                  <Text style={styles.txt}>
                    {item.content}
                  </Text>
                  <Text style={styles.txt2}>
                    回复：{item.reply}
                  </Text>
                  {index < this.props.reviews.length - 1 && <ShowLine />}
                </View>
              </TouchableWithoutFeedback>
            ))}
          </Flex>
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  txt: {
    fontSize: 14,
    paddingBottom: 10,
  },
  txt2: {
    fontSize: 14,
    paddingBottom: 10,
    color: '#4494f0'
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
    marginBottom: 15
  }
});

//export default ShowReviews;
