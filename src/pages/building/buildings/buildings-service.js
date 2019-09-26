import api from '../../../utils/api';
import common from '../../../utils/common';

export default {
    getAsynChildBuildings(keyValue, type) {
        return api.getData('/api/MobileMethod/MGetPStructs', {keyValue, type});
    },

};
