import api from '../../../utils/api';
//import common from '../../../utils/common';

export default {
  getOrg() {
    return api.getData('/api/MobileMethod/MGetOrgTree', {});
  },
  // 获取流程类别
  getFlowType() {
    return api.getData('/api/MobileMethod/MGetFlowType');
  },
  // getDep() {
  //   return api.getData('/api/MobileMethod/MGetDepTree', {});
  // }
};
