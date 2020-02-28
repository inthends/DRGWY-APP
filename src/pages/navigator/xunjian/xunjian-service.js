import api from '../../../utils/api';

export default {
    persons() {
        return api.getData('/api/MobileMethod/MGetPollingUserList');
    },

    xunjianData(userId, showLoading = true) {
        return api.postData('/api/MobileMethod/MGetPollingStatistics', {userId}, showLoading);
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
    xunjianDetail(taskId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskEntity', {taskId});
    },
    xunjianDetailExtraData(taskId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskFilesData', {taskId});
    },
    xunjianTaskDeletePhoto(taskId) {
        if (taskId && taskId.length > 0) {
            return api.postData('/api/MobileMethod/MDeleteTaskFiles', {taskId});
        } else {
            Promise.resolve();
        }
    },
    xunjianPointDetail(lineId, pointId) {
        return api.getData('/api/MobileMethod/MGetPollingPointEntity', {lineId, pointId});
    },
    xunjianPointTasks(pointId, showLoading = true) {
        return api.getData('/api/MobileMethod/MGetPollingPointTasks', {pointId}, showLoading);
    },
    xunjianExecute(keyValue, pointStatus, userId, userName) {
        return api.postData('/api/MobileMethod/MExcutePollingTasck', {keyValue, pointStatus, userId, userName});
    },
    xunjianAddress(pointId) {
        return api.getData('/api/MobileMethod/MGetPollingPointDetail', {pointId});
    },

};
