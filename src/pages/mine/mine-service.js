import api from '../../utils/api';
import common from '../../utils/common';

export default {
    getUserInfo() {
        return api.getData('/api/MobileMethod/MGetUserInfo');
    },
    changePsd(psd, old) {
        let password = common.jiami(psd);
        let oldPassword = common.jiami(old);
        return api.postData('/api/MobileMethod/ChangePassword', {password, oldPassword});
    },
    logout() {
        return api.postData('/api/MobileMethod/MLogout', {}, false);
    },
    getMyAchievement(begin,end) {
        return api.postData('/api/MobileMethod/MGetMyAchievement', {begin,end});
    }

};
