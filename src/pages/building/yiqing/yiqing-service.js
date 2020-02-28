import api from '../../../utils/api';

export default {
    records(unitId, pagination = 1) {
        return api.postData('/api/MobileMethod/MGetInOutPageList', {unitId, pagination, pageSize: 100});
    },
    record(keyValue, flag, numbers, status, memo) {
        return api.postData('/api/MobileMethod/MInOutRegister', {keyValue, flag, numbers, status, memo});
    },
    detail(keyValue) {
        return api.getData('/api/MobileMethod/MGetRoomEntity', {keyValue});
    },
};
