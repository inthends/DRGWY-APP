import {Modal} from '@ant-design/react-native';

export default {
    showAlert(title, message, actions) {
        return Modal.alert(title, message, actions, () => {
            return true;
        });
    },
};

