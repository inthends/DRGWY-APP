import {AudioRecorder, AudioUtils} from 'react-native-audio';
import UDToast from './UDToast';
import common from './common';

export default {
    prepardRecord() {
        return new Promise((resolve, reject) => {
            AudioRecorder.requestAuthorization().then((isAuthorised) => {
                if (!isAuthorised) {
                    UDToast.showInfo('录音功能未授权');
                    return;
                }


                let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
                AudioRecorder.prepareRecordingAtPath(audioPath, {
                    SampleRate: 22050,
                    Channels: 1,
                    AudioQuality: 'Low',
                    AudioEncoding: 'aac',
                });

                AudioRecorder.onProgress = (data) => {
                    console.log(Math.floor(data.currentTime));
                    // this.setState({currentTime: Math.floor(data.currentTime)});
                };

                AudioRecorder.onFinished = (data) => {
                    // Android callback comes in the form of a promise instead.
                    // console.log('finish', data);
                    // if (common.isIOS()) {
                    //     resolve(data.audioFileURL);
                    // }
                    resolve(data.audioFileURL);
                };
            });
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
