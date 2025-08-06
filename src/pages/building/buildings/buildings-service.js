import api from '../../../utils/api';
//import common from '../../../utils/common';
export default {
    getAsynChildBuildings(villageId) {
        return api.postData('/api/MobileMethod/MGetBuildingStatistics', {
            villageId,
            pageIndex: 1,
            index:1,
            pageSize: 1000,
            sidx: 'name'
        });
    }
};
