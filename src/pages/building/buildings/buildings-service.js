import api from '../../../utils/api';
//import common from '../../../utils/common';

export default {
    getAsynChildBuildings(villageId, type) {
        return api.postData('/api/MobileMethod/MGetBuildingStatistics', {
            villageId,
            pageIndex: 1,
            index:1,
            pageSize: 100000,
            sidx: 'name',
        });
    },

};
