import api from '../../../utils/api';

export default {
    records(unitId, pagination = 1) {
        return api.postData('/api/MobileMethod/MGetInOutPageList', {unitId, pagination, pageSize: 100});
    },
    record(keyvalue, flag, numbers, status, memo) {
        return api.postData('/api/MobileMethod/MInOutRegister', {keyvalue, flag, numbers, status, memo});
    },
    detail(keyvalue) {
        return api.getData('/api/MobileMethod/MGetRoomEntity', {keyvalue});
    },
};
