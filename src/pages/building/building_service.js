import api from '../../utils/api';
// import common from '../../utils/common';

export default {
    getStatistics(pageIndex, OrganizeId,showLoading=true) {
        return api.postData('/api/MobileMethod/MGetStatistics', {
            pageIndex,
            pageSize: 10,
            sidx: 'name',
            sord: 'asc',
            OrganizeId,
        },showLoading);
    },
    getStatisticsTotal(OrganizeId) {
        return api.postData('/api/MobileMethod/MGetStatisticsTotal', {OrganizeId});
    },

    roomDetail(keyvalue) {
        return api.getData('/api/MobileMethod/MGetRoomEntity', {keyvalue});
    },
    getUserInfo() {
        return api.getData('/api/MobileMethod/MGetUserInfo',{},false);
    },

};
