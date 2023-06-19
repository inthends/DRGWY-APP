// import {Component} from 'react';
// import { Platform } from 'react-native'; 
// export default class BasePage extends Component {
//     static headerForceInset = Platform.OS === 'ios' ? {top:20} : undefined
//     constructor(props) {
//         super(props); 
//     } 
// }

import { Component } from "react";
import { Platform } from "react-native";
import ScreenUtil from "../../utils/screen-util";

export default class BasePage extends Component {
  static headerForceInset =
    Platform.OS === "ios" ? { top: ScreenUtil.navigationHeight() } : undefined;
  // { top: ScreenUtil.isIphoneX() ? 44 : 20 } 
  constructor(props) {
    super(props);
  }
}

