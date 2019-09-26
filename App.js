/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import AppContainer from './src/pages/tabbar/tabbar';
import {Provider} from '@ant-design/react-native';
import {Provider as Pro} from 'react-redux';
import store from './src/utils/store/store';
import AppRouter from './router';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {persistor} from './src/utils/store/store';


type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Pro store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Provider>
              <AppRouter/>
            </Provider>
          </PersistGate>
        </Pro>
    );
  }
}
