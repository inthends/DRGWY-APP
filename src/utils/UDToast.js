import {
    Toast,
    Portal,
    // Provider,
    // Button, 
    // WhiteSpace,
    // WingBlank,
    // portal,
} from '@ant-design/react-native';
//import UDTool from './UDTool';

const duration = 2;
export default {
    showSuccess(msg, mask = false) {
        this.showInfo(msg, mask);
    },

    showError(msg, mask = false) {
        this.showInfo(msg, mask);
    },

    showInfo(msg, mask = false) {
        Toast.info(msg, duration, null, mask);
    },

    showLoading(msg = '正在加载中...') {
        return Toast.loading(msg, 0);
    },

    hiddenLoading(toast) {
        toast && Portal.remove(toast);
    },
};

