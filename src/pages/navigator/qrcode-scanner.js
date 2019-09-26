import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class ScanScreen extends Component {
    onSuccess = (e) => {
        alert(e.data);
        console.log(e);
        // Linking
        //     .openURL(e.data)
        //     .catch(err => console.error('An error occured', err));
        // this.props.navigation.navigate('Building',{scan:e});
    }

    render() {
        return (
            <QRCodeScanner
                onRead={this.onSuccess}
                flashMode={QRCodeScanner.Constants.FlashMode.torch}
                topContent={
                    <Text style={styles.centerText}>
                        Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
                    </Text>
                }
                bottomContent={
                    <TouchableOpacity style={styles.buttonTouchable}>
                        <Text style={styles.buttonText}>OK. Got it!</Text>
                    </TouchableOpacity>
                }
            />
        );
    }
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: '#456789',
    },
    buttonTouchable: {
        padding: 16,
    },
});
