import Sound from 'react-native-sound';
import UDToast from './UDToast';

export default {
    play(url) {
        Sound.setCategory('Playback');
        const whoosh = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                UDToast.showInfo('播放失败');
                return;
            }
            // loaded successfully
            //console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
            whoosh.setVolume(1);
            // Play the sound with an onEnd callback
            whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
                whoosh.release();
            });
        });
    },
};
