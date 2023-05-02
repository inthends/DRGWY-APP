import {Component} from 'react';
import { Platform } from 'react-native';


export default class BasePage extends Component {
    static headerForceInset = Platform.OS === 'ios' ? {top:20} : undefined
    constructor(props) {
        super(props);

    }

}
