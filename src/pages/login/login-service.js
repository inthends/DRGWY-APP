import api from '../../utils/api';
import common from '../../utils/common'; 

export default {
    login(username, psd, registration_id) {
        let password = common.jiami(psd);
        return api.postData('/api/MobileMethod/MCheckLogin', {username, password, registration_id});
    },
    getServiceUrl(usercode) {
        return api.getData('/api/Mobile/GetServerUrl', {usercode});
    },
};
