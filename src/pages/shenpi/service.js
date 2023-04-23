import api from '../../utils/api';

export default {
  // 获取待办任务列表
  getFlowTask(params) {
    // pagination, queryJson
    const url = params.isCompleted
      ? '/api/MobileMethod/MGetFlowCompletedPageList'
      : '/api/MobileMethod/MGetFlowTaskPageList';
    return api.postData(url, params);
  },
  // 获取流程详情
  getFlowData(taskId) {
    return api.getData('/api/MobileMethod/MGetFlowData', { taskId });
  },

  // 通过
  approveForm(params) {
    return api.postData('/api/MobileMethod/MApproveForm', params);
  },

  // 退回
  rejectForm(params) {
    return api.postData('/api/MobileMethod/MRejectForm', params);
  },

  getApproveLog(keyvalue) {
    return api.getData('/api/MobileMethod/MGetApproveLog', { keyvalue });
  },

  getReceiveEntity(keyvalue) {
    return api.getData('/api/MobileMethod/MGetReceiveEntity', { keyvalue });
  },

  getOffsetEntity(keyvalue) {
    return api.getData('/api/MobileMethod/MGetOffsetEntity', { keyvalue });
  },

  getCustomerEntity(keyvalue) {
    return api.getData('/api/MobileMethod/MGetCustomerEntity', { keyvalue });
  },

  getContractEntity(keyvalue) {
    return api.getData('/api/MobileMethod/MGetContractEntity', { keyvalue });
  },
  geFiles(keyvalue) {
    return api.getData('/api/MobileMethod/MGetServiceDeskFiles', { keyvalue });
  },
};
