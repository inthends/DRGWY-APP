import api from '../../../utils/api';
//import common from '../../../utils/common';

export default {
    getPStructs(keyValue, type) {
        return api.getData('/api/MobileMethod/MGetPStructs', {keyValue, type});
    },
    getBuildingDetail(keyValue) {
        return api.getData('/api/MobileMethod/MGetBuildingEntity', {keyValue});
    },

};
