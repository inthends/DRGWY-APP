import api from '../../utils/api';
import common from '../../utils/common';

export default {
    getUserInfo() {
        return api.getData('/api/MobileMethod/MGetUserInfo');
    },
    changePsd(psd, old) {
        let password = common.jiami(psd);
        let oldPassword = common.jiami(old);
        return api.postData('/api/MobileMethod/ChangePassword', { password, oldPassword });
    },
    logout() {
        return api.postData('/api/MobileMethod/MLogout', {}, false);
    },
    getMyAchievement(begin, end) {
        return api.postData('/api/MobileMethod/MGetMyAchievement', { begin, end });
    },

    //获取配置
    getSetting(type) {
        return api.getData('/api/SysSetting/GetSetting', { type });
    },

    //工单积分
    getRepairScore() {
        return api.getData('/api/MobileMethod/MGetRepairScore');
    },

    getRepairScoreList(pageIndex, pageSize) {
        let url = '/api/MobileMethod/MGetRepairScorePageList';
        return api.postData(url, { pageIndex, pageSize });
    },
};
