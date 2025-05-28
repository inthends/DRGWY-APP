import api from '../../../utils/api';
//import common from '../../../utils/common';

export default {
    getPStructs(keyvalue, type) {
        return api.getData('/api/MobileMethod/MGetPStructs', { keyvalue, type });
    },
    getBuildingDetail(keyvalue, keyword) {
        return api.getData('/api/MobileMethod/MGetBuildingEntity', { keyvalue, keyword });
    },
    getPropertyStatus() {
        return api.getData('/api/MobileMethod/GetPropertyStatus');
    }
};
