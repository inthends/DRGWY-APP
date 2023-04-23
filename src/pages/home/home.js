import React from 'react';
import {View,  StyleSheet } from 'react-native';
import BasePage from '../base/base';


export default class HomePage extends BasePage {


    constructor(props) {
        super(props);
        this.state = {
            kinds: [],
            goods: [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}],
        };
        console.log(1)
        // NativeModules.LHNToast.show('22',1000)

    }


     async componentDidMount(): void {
        // HomeService.getKinds().then(kinds => {
        //     console.log('kinds',kinds)
        //     this.setState({
        //         kinds: kinds,
        //     });
        // }).catch(error => {
        //
        // });
    }


    render() {
        const {goods, kinds} = this.state;
        return (
            <View style={styles.content}>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    kindsV: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
    },
    flat: {
        flex: 7,
    },
});
