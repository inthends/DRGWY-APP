import api from '../../utils/api';
// import common from '../../utils/common';

export default {
    getStatistics(pageIndex, organizeId,showLoading=true) {
        return api.postData('/api/MobileMethod/MGetStatistics', {
            pageIndex,
            pageSize: 10,
            sidx: 'name',
            sord: 'asc',
            organizeId,
        },showLoading);
    },
    getStatisticsTotal(organizeId) {
        return api.postData('/api/MobileMethod/MGetStatisticsTotal', {organizeId});
    },

    roomDetail(keyvalue) {
        return api.getData('/api/MobileMethod/MGetRoomEntity', {keyvalue});
    },
    getUserInfo() {
        return api.getData('/api/MobileMethod/MGetUserInfo',{},false);
    },

};
