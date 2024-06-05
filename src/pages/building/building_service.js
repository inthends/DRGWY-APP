import api from '../../utils/api';
// import common from '../../utils/common';
export default {
    getStatistics(pageIndex, organizeId, showLoading = true) {
        return api.postData('/api/MobileMethod/MGetStatistics', {
            pageIndex,
            pageSize: 10,
            sidx: 'name',
            sord: 'asc',
            organizeId,
        }, showLoading);
    },
    getStatisticsTotal(organizeId) {
        return api.postData('/api/MobileMethod/MGetStatisticsTotal', { organizeId });
    },
    roomDetail(keyvalue) {
        return api.getData('/api/MobileMethod/MGetRoomEntity', { keyvalue });
    },
    getUserInfo() {
        return api.getData('/api/MobileMethod/MGetUserInfo', {}, false);
    },
    //获取合同
    getContractList(keyvalue) {
        return api.getData('/api/MobileMethod/MGetContractList', { keyvalue });
    },
    //获取客户
    getCustomerList(keyvalue, isShow) {
        return api.getData('/api/MobileMethod/MGetCustomerList', { keyvalue, isShow });
    },

    //获取服务单
    getServerDeskList(unitId) {
        return api.getData('/api/MobileMethod/MGetRoomServerDeskList', { unitId });
    },

    //获取费用
    getRoomNotChargeList(unitId) {
        return api.getData('/api/MobileMethod/MGetRoomNotChargeList', { unitId });
    },

    //获取费用
    getRoomChargeList(unitId) {
        return api.getData('/api/MobileMethod/MGetRoomChargeList', { unitId });
    }
};
