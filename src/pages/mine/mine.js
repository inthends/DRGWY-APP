import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  ImageBackground,
  StatusBar,
} from 'react-native';
import BasePage from '../base/base';
import { Flex, Icon } from '@ant-design/react-native';
import Macro from '../../utils/macro';
import ScreenUtil from '../../utils/screen-util';
import LoadImage from '../../components/load-image';
import MineService from './mine-service';
import CommonView from '../../components/CommonView';

export default class MinePage extends BasePage {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  componentDidMount(): void {
    MineService.getUserInfo().then((user) => {
      this.setState({ user });
    });
  }

  render() {
    const { user } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.content}>
            <ImageBackground
              source={require('../../static/images/mine_bg.png')}
              style={styles.headerV}
            >
              <TouchableWithoutFeedback>
                <LoadImage
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    marginTop: 56,
                  }}
                  img={user.headImg}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <Flex>
                  <Text style={styles.name}>{user.showName}</Text>
                  <Text style={styles.name2}>{user.departmentName}</Text>
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <Text style={styles.name3}>{user.postName}</Text>
              </TouchableWithoutFeedback>
            </ImageBackground>

            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.push('ModifyPsd')}
            >
              <Flex
                justify="between"
                style={[
                  {
                    marginTop: 45,
                    paddingBottom: 20,
                    paddingLeft: 30,
                    paddingRight: 25,
                  },
                  ScreenUtil.borderBottom(),
                ]}
              >
                <Flex>
                  <LoadImage
                    style={{ width: 18, height: 18 }}
                    defaultImg={require('../../static/images/wdgd.png')}
                  />
                  <Text style={styles.item}>修改密码</Text>
                </Flex>
                <LoadImage
                  style={{ width: 8, height: 15 }}
                  defaultImg={require('../../static/images/address/right.png')}
                />
              </Flex>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.push('jixiao')}
            >
              <Flex
                justify="between"
                style={[
                  {
                    marginTop: 30,
                    paddingBottom: 20,
                    paddingLeft: 30,
                    paddingRight: 25,
                  },
                  ScreenUtil.borderBottom(),
                ]}
              >
                <Flex>
                  <LoadImage
                    style={{ width: 18, height: 18 }}
                    defaultImg={require('../../static/images/img-kong.png')}
                  />
                  <Text style={styles.item}>我的绩效</Text>
                </Flex>
                <LoadImage
                  style={{ width: 8, height: 15 }}
                  defaultImg={require('../../static/images/address/right.png')}
                />
              </Flex>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.push('contact')}
            >
              <Flex
                justify="between"
                style={[
                  {
                    marginTop: 30,
                    paddingBottom: 20,
                    paddingLeft: 30,
                    paddingRight: 25,
                  },
                  ScreenUtil.borderBottom(),
                ]}
              >
                <Flex>
                  <LoadImage
                    style={{ width: 18, height: 18 }}
                    defaultImg={require('../../static/images/paiyipai.png')}
                  />
                  <Text style={styles.item}>通讯录</Text>
                </Flex>
                <LoadImage
                  style={{ width: 8, height: 15 }}
                  defaultImg={require('../../static/images/address/right.png')}
                />
              </Flex>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.push('Setting')}
            >
              <Flex
                justify="between"
                style={[
                  {
                    paddingTop: 30,
                    paddingBottom: 20,
                    paddingLeft: 30,
                    paddingRight: 25,
                  },
                  ScreenUtil.borderBottom(),
                ]}
              >
                <Flex>
                  <LoadImage
                    style={{ width: 18, height: 18 }}
                    defaultImg={require('../../static/images/setting.png')}
                  />
                  <Text style={styles.item}>设置</Text>
                </Flex>
                <LoadImage
                  style={{ width: 8, height: 15 }}
                  defaultImg={require('../../static/images/address/right.png')}
                />
              </Flex>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  all: {
    flex: 1,
  },
  content: {
    flex: 1,

    backgroundColor: Macro.color_white,

    // height: ScreenUtil.contentHeightWithNoTabbar(),
  },
  headerV: {
    height: 245,
    display: 'flex',
    alignItems: 'center',
  },
  header: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  name: {
    paddingTop: 15,
    fontSize: 20,
    color: 'white',
  },
  name2: {
    paddingTop: 30,
    color: '#DCDCDC',
    fontSize: 14,
    paddingLeft: 15,
    paddingBottom: 14,
  },
  name3: {
    fontSize: 14,
    color: '#DCDCDC',
  },
  item: {
    fontSize: 17,
    color: '#3E3E3E',
    paddingLeft: 15,
  },
});
