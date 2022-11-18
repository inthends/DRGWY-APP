import {AudioRecorder } from 'react-native-audio';
// import UDToast from './UDToast';
// import common from './common';

export default {
    prepardRecord() {
        return new Promise((resolve, reject) => {

        });
    },
    async startRecord() {
        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    },
    async stopRecord() {
        try {
            let filePath = await AudioRecorder.stopRecording();
            console.log(filePath);
            // if (!common.isIOS()) {
            //     this._finishRecording(true, filePath);
            // }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    },
};
