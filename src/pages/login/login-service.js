import api from '../../utils/api';
import common from '../../utils/common';
import forge from 'node-forge';

export default {
    login(username, psd) {
        let password = common.jiami(psd);
        return api.postData('/api/MobileMethod/MCheckLogin', {username, password});
    },
    getServiceUrl(usercode) {
        return api.getData('/api/Mobile/GetServerUrl',{usercode});
    }
};
