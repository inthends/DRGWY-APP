import api from '../../../utils/api';
//import common from '../../../utils/common';

export default {
    getData() {
        return api.getData('/api/MobileMethod/MGetOrgTree', {});
    },
};
