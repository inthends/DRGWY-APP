import api from '../../../utils/api';

export default {
    persons() {
        return api.getData('/api/MobileMethod/MGetPollingUserList');
    },

    xunjianData(userId) {
        return api.postData('/api/MobileMethod/MGetPollingStatistics', {userId});
    },
    xunjianIndexList(userId) {
        return api.postData('/api/MobileMethod/MGetPollingLinePageList', {pageIndex: 1, pageSize: 100, userId});
    },
    xunjianIndexDetail(lineId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskPoints', {lineId});
    },
    xunjianTaskList(status, userId) {
        return api.postData('/api/MobileMethod/MGetPollingTaskPageList', {
            pageIndex: 1,
            pageSize: 1000,
            status,
            userId,
        });
    },
    xunjianDetailStart(pointId) {
        return api.getData('/api/MobileMethod/MGetPollingEntity', {pointId});
    },
    xunjianDetail(pointId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskEntity', {pointId, taskId: pointId});
    },
    xunjianDetailExtraData(pointId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskFilesData', {pointId, taskId: pointId});
    },

};
